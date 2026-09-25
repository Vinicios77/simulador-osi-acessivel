const logContainer = document.getElementById('terminal-log');
const btnNext = document.getElementById('btn-next');
const btnReset = document.getElementById('btn-reset');
const btnSound = document.getElementById('btn-sound');

let soundEnabled = true;

// Função para emitir um beep simples via Web Audio API (ajuda na imersão)
function playBeep(frequency = 440) {
    if (!soundEnabled) return;
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            audioCtx.close();
        }, 150);
    } catch (e) {
        console.log("Áudio não suportado ou bloqueado.");
    }
}

const passosOSI = [
    // ENCAPSULAMENTO (Cliente enviando a requisição)
    { fase: "CLIENTE", camada: "7 - Aplicação", proto: "HTTP", equip: "Navegador", texto: "Requisição GET /index.html iniciada. Gerando os dados da requisição." },
    { fase: "CLIENTE", camada: "6 - Apresentação", proto: "TLS", equip: "Sistema Operacional", texto: "Formatando dados para padrão UTF-8 e criptografando payload para segurança." },
    { fase: "CLIENTE", camada: "5 - Sessão", proto: "Sockets", equip: "SO / API", texto: "Abrindo e mantendo a sessão de comunicação entre o cliente e o servidor." },
    { fase: "CLIENTE", camada: "4 - Transporte", proto: "TCP", equip: "Pilha de Rede", texto: "Segmentação dos dados. Inserindo Cabeçalho TCP: Porta Origem 49152, Porta Destino 80. Criando pacote SYN." },
    { fase: "CLIENTE", camada: "3 - Rede", proto: "IP", equip: "Roteador", texto: "Criando Pacote IP. Inserindo IP de Origem e IP de Destino para roteamento na internet." },
    { fase: "CLIENTE", camada: "2 - Enlace", proto: "Ethernet", equip: "Switch e Placa de Rede", texto: "Criando Quadro Ethernet. Adicionando MAC Address de Origem, MAC do Gateway e verificação de erro FCS." },
    { fase: "CLIENTE", camada: "1 - Física", proto: "Sinal Elétrico/Luz", equip: "Cabo UTP", texto: "Convertendo o Quadro Ethernet em sequência de bits (zeros e uns) e transmitindo como pulsos elétricos." },
    
    // A VIAGEM PELA INTERNET
    { fase: "REDE", camada: "Infraestrutura", proto: "Roteamento IP", equip: "Backbone da Internet", texto: "Os pulsos viajam por cabos de fibra óptica e roteadores de operadoras até alcançar o provedor do servidor." },
    
    // DESENCAPSULAMENTO (Servidor recebendo e processando)
    { fase: "SERVIDOR", camada: "1 - Física", proto: "Sinal Elétrico", equip: "Placa de Rede", texto: "Pulsos recebidos e reconvertidos de volta para bits (zeros e uns)." },
    { fase: "SERVIDOR", camada: "2 - Enlace", proto: "Ethernet", equip: "Switch Interno", texto: "Quadro Ethernet remontado. Verificação de erros FCS validada com sucesso. Removendo cabeçalho MAC." },
    { fase: "SERVIDOR", camada: "3 - Rede", proto: "IP", equip: "Roteador Servidor", texto: "Pacote IP analisado. IP de destino confirmado como o próprio servidor. Removendo cabeçalho IP." },
    { fase: "SERVIDOR", camada: "4 - Transporte", proto: "TCP", equip: "Pilha de Rede", texto: "Segmento recebido na Porta 80. Sequência validada. Removendo cabeçalho TCP e enviando confirmação ACK." },
    { fase: "SERVIDOR", camada: "5 - Sessão", proto: "Sockets", equip: "SO Servidor", texto: "Sessão identificada e vinculada ao processo do servidor web em execução." },
    { fase: "SERVIDOR", camada: "6 - Apresentação", proto: "TLS", equip: "Sistema Operacional", texto: "Descriptografando o payload e traduzindo os dados recebidos de volta para texto puro." },
    { fase: "SERVIDOR", camada: "7 - Aplicação", proto: "HTTP", equip: "Apache/Nginx", texto: "Requisição HTTP GET processada com sucesso! O servidor devolverá a página HTML 200 OK para o cliente." }
];

let passoAtual = 0;

function avancarPasso() {
    if (passoAtual < passosOSI.length) {
        const passo = passosOSI[passoAtual];
        
        const p = document.createElement('p');
        // Usamos tags HTML normais; o leitor de tela lê esse texto perfeitamente de forma linear
        p.innerHTML = `[${passo.fase}] <strong>Camada ${passo.camada}</strong><br>
                       <span class="highlight-protocol">Protocolo:</span> ${passo.proto} | <span class="highlight-protocol">Equipamento:</span> ${passo.equip}<br>
                       > ${passo.texto}`;
        
        logContainer.appendChild(p);
        logContainer.scrollTop = logContainer.scrollHeight; // Rola a tela para baixo automaticamente
        
        // Frequência do beep sobe levemente a cada camada para dar sensação de progresso
        playBeep(300 + (passoAtual * 30));
        
        passoAtual++;
    } else if (passoAtual === passosOSI.length) {
        const p = document.createElement('p');
        p.className = "system-msg";
        p.textContent = ">>> Simulação Concluída. Fim da Transmissão.";
        logContainer.appendChild(p);
        logContainer.scrollTop = logContainer.scrollHeight;
        playBeep(800);
        passoAtual++;
    }
}

function reiniciarSimulacao() {
    logContainer.innerHTML = '<p class="system-msg">>>> Sistema Reiniciado. Aguardando comando de transmissão...</p>';
    passoAtual = 0;
    playBeep(200);
}

// Vinculando botões às funções
btnNext.addEventListener('click', avancarPasso);
btnReset.addEventListener('click', reiniciarSimulacao);

btnSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSound.textContent = `Som: ${soundEnabled ? 'Ligado' : 'Desligado'}`;
});

// Adicionando suporte ao teclado para navegação acessível
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Evita rolar a página sem querer
        avancarPasso();
    }
    if (e.key.toLowerCase() === 'r') {
        reiniciarSimulacao();
    }
});