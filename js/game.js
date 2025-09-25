/* =====================
* Dados do conteúdo
* ===================== */
const PERGUNTAS = [
    {
        id: 1,
        pergunta: "A miopia é uma das queixas mais comuns dos clientes. O que você sabe sobre ela?",
        blocos: [
            { texto: "Quem tem miopia enxerga mal de perto.", correta: false },
            { texto: "A dificuldade principal da miopia é para enxergar de longe.", correta: true },
            { texto: "É causada pelo alongamento do globo ocular ou maior curvatura da córnea.", correta: true },
            { texto: "Óculos com lentes divergentes (negativas) corrigem a miopia.", correta: true },
            { texto: "A miopia só aparece em idosos.", correta: false }
        ]
    },
    {
        id: 2,
        pergunta: "A hipermetropia também aparece bastante. O que lembrar dela?",
        blocos: [
            { texto: "Quem tem hipermetropia enxerga melhor de longe que de perto.", correta: true },
            { texto: "É causada pelo olho ser mais curto que o normal.", correta: true },
            { texto: "Lentes positivas (convergentes) corrigem a hipermetropia.", correta: true },
            { texto: "A hipermetropia nunca causa dor de cabeça.", correta: false },
            { texto: "Crianças também podem apresentar hipermetropia.", correta: true }
        ]
    },
    {
        id: 3,
        pergunta: "E o astigmatismo, como funciona?",
        blocos: [
            { texto: "É provocado por irregularidade na curvatura da córnea.", correta: true },
            { texto: "Quem tem astigmatismo pode ver imagens distorcidas e embaçadas.", correta: true },
            { texto: "O astigmatismo só afeta visão de longe.", correta: false },
            { texto: "Pode ser corrigido com lentes cilíndricas.", correta: true },
            { texto: "O astigmatismo desaparece sozinho com o tempo.", correta: false }
        ]
    },
    {
        id: 4,
        pergunta: "A presbiopia é muito citada no balcão. O que destacar?",
        blocos: [
            { texto: "É chamada de ‘vista cansada’.", correta: true },
            { texto: "Acontece normalmente a partir dos 40 anos.", correta: true },
            { texto: "É causada pelo endurecimento do cristalino.", correta: true },
            { texto: "Quem tem presbiopia nunca precisa de óculos.", correta: false },
            { texto: "As lentes multifocais são uma das soluções.", correta: true }
        ]
    },
    {
        id: 5,
        pergunta: "E a catarata, como orientar o cliente?",
        blocos: [
            { texto: "É a opacificação do cristalino.", correta: true },
            { texto: "Provoca visão turva e embaçada.", correta: true },
            { texto: "Pode ser corrigida apenas com óculos.", correta: false },
            { texto: "O tratamento definitivo é cirúrgico.", correta: true },
            { texto: "A catarata aparece apenas em pessoas acima de 80 anos.", correta: false }
        ]
    },
    {
        id: 6,
        pergunta: "O glaucoma também é muito comentado. O que lembrar?",
        blocos: [
            { texto: "É caracterizado pelo aumento da pressão intraocular.", correta: true },
            { texto: "Pode causar danos irreversíveis ao nervo óptico.", correta: true },
            { texto: "Sempre causa dor intensa nos olhos.", correta: false },
            { texto: "O diagnóstico precoce é essencial para evitar perda de visão.", correta: true },
            { texto: "O tratamento é apenas com óculos.", correta: false }
        ]
    },
    {
        id: 7,
        pergunta: "O ceratocone também pode aparecer. O que é importante saber?",
        blocos: [
            { texto: "É uma doença progressiva da córnea.", correta: true },
            { texto: "Deforma a visão devido ao afinamento e saliência da córnea.", correta: true },
            { texto: "Lentes rígidas podem ajudar a corrigir a visão.", correta: true },
            { texto: "O ceratocone some sozinho com o tempo.", correta: false },
            { texto: "Em casos avançados pode precisar de transplante de córnea.", correta: true }
        ]
    },
    {
        id: 8,
        pergunta: "Sobre a degeneração macular relacionada à idade (DMRI):",
        blocos: [
            { texto: "Afeta a região central da retina (mácula).", correta: true },
            { texto: "É a principal causa de perda visual em idosos.", correta: true },
            { texto: "Não existe nenhum fator de risco associado.", correta: false },
            { texto: "Pode causar manchas escuras no centro da visão.", correta: true },
            { texto: "É sempre corrigida apenas com óculos de grau.", correta: false }
        ]
    },]

/* =====================
*  Estado do jogo
* ===================== */
const state = {
    iPergunta: 0,
    iBloco: 0,
    pontos: 0,
    combo: 1,
    acertos: 0,
    total: 0,
    caindo: null,        // referência ao elemento do bloco atual
    velocidade: 50,     // px/seg (ajuste fino aqui)
    targetX: null,       // -1 esquerda, 0 centro, 1 direita
    animId: null,
    toque: { ativo: false, startX: 0, deslocX: 0 },
    pausado: false,
    lastTime: 0   // 👈 novo: guarda o timestamp do último frame usado
};
/* =====================
/* =====================
* Utilidades DOM
* ===================== */
const el = sel => document.querySelector(sel);
const hudPergunta = el('#hudPergunta');
const hudBloco = el('#hudBloco');
const hudPontos = el('#hudPontos');
const hudCombo = el('#hudCombo');
const jogo = el('#jogo');
const textoPerg = el('#textoPergunta');


const modalComo = el('#modalComo');
const modalRanking = el('#modalRanking');
const modalFim = el('#modalFim');
const listaRanking = el('#listaRanking');
const fimPontos = el('#fimPontos');
const fimAcertos = el('#fimAcertos');
const fimTotal = el('#fimTotal');


// Botões nav
el('#btnComo').addEventListener('click', () => modalComo.showModal());
el('#btnRanking').addEventListener('click', () => {
    renderRanking();
    modalRanking.showModal();
});


el('#btnJogarNovamente')?.addEventListener('click', () => {
    modalFim.close();
    iniciarJogo();
});


// Ranking (localStorage)
function getRanking() {
    try { return JSON.parse(localStorage.getItem('ranking_optica')) || []; }
    catch { return []; }
}
function setRanking(arr) {
    localStorage.setItem('ranking_optica', JSON.stringify(arr.slice(0, 30)));
}
function addRanking(nome, pontos) {
    const arr = getRanking();
    arr.push({ nome, pontos, data: new Date().toISOString() });
    arr.sort((a, b) => b.pontos - a.pontos || (b.data.localeCompare(a.data)));
    setRanking(arr);
}
function renderRanking() {
    const arr = getRanking();
    listaRanking.innerHTML = '';
    arr.slice(0, 10).forEach((it, idx) => {
        const li = document.createElement('li');
        const d = new Date(it.data).toLocaleDateString('pt-BR');
        li.textContent = `${idx + 1}. ${it.nome} — ${it.pontos} pts (${d})`;
        listaRanking.appendChild(li);

    });
}

/* =====================
* Loop & lógica
* ===================== */
function iniciarJogo() {
    // reset
    state.iPergunta = 0;
    state.iBloco = 0;
    state.pontos = 0;
    state.combo = 1;
    state.acertos = 0;
    state.total = PERGUNTAS.reduce((acc, p) => acc + p.blocos.length, 0);
    atualizarHUD();


    // foco para teclado
    jogo.focus();
    proximaPergunta();
}


function atualizarHUD() {
    hudPergunta.textContent = `${state.iPergunta + 1}/${PERGUNTAS.length}`;
    const atual = PERGUNTAS[state.iPergunta];
    const totalBlocos = atual?.blocos.length || 5;
    hudBloco.textContent = `${state.iBloco + 1}/${totalBlocos}`;
    hudPontos.textContent = state.pontos;
    hudCombo.textContent = `x${state.combo}`;
}


function proximaPergunta() {
    if (state.iPergunta >= PERGUNTAS.length) {
        return fimDeJogo();
    }
    const atual = PERGUNTAS[state.iPergunta];
    textoPerg.textContent = atual.pergunta;
    state.iBloco = 0;
    gerarBloco();
}


function gerarBloco() {
    // limpar bloco anterior se existir
    if (state.caindo) { state.caindo.remove(); state.caindo = null; }


    const atual = PERGUNTAS[state.iPergunta];
    const item = atual.blocos[state.iBloco];
    if (!item) {
        // acabou os blocos desta pergunta
        state.iPergunta++;
        return proximaPergunta();
    }


    const bloco = document.createElement('div');
    bloco.className = 'bloco';
    bloco.textContent = item.texto;
    bloco.setAttribute('data-correta', item.correta ? '1' : '0');


    jogo.appendChild(bloco);
    state.caindo = bloco;
    state.targetX = 0; // centro


    // posicionamento inicial
    const w = jogo.clientWidth;
    const xCentro = w / 2; // translateX(-50%) já centraliza
    bloco.style.left = xCentro + 'px';
    bloco.style.top = '-72px';

    // Iniciar queda
    startAnim();
}


function startAnim() {
    state.lastTime = performance.now();           // referência única
    cancelAnimationFrame(state.animId);

    const step = (now) => {
        // se pausado, atualiza o relógio e não avança o jogo
        if (state.pausado) {
            state.lastTime = now;                     // CONGELA o delta
            state.animId = requestAnimationFrame(step);
            return;
        }

        const dt = Math.min((now - state.lastTime) / 1000, 0.05); // clamp opcional
        state.lastTime = now;

        if (!state.caindo) {
            state.animId = requestAnimationFrame(step);
            return;
        }

        // mover vertical
        const curTop = parseFloat(state.caindo.style.top);
        const novoTop = curTop + state.velocidade * dt;
        state.caindo.style.top = novoTop + 'px';

        // mover horizontal em direção ao target (snap suave, se usar easing faça aqui)
        const base = -50; // já definido no CSS (translateX)
        const percent = base + (state.targetX * 50); // -100, -50, 0
        state.caindo.style.transform = `translateX(${percent}%)`;

        // chão
        const limite = jogo.clientHeight - 64;
        if (novoTop >= limite) {
            validarBloco();
            // NÃO chama step aqui; gerarBloco() chamará nova animação
            return;
        }

        state.animId = requestAnimationFrame(step);
    };

    state.animId = requestAnimationFrame(step);
}

function validarBloco() {
    if (!state.caindo) return;
    const correta = state.caindo.getAttribute('data-correta') === '1';
    const lado = state.targetX; // -1 esq (Falso) / 1 dir (Verdadeiro) / 0 centro
    let acertou = false;


    if (lado === -1) acertou = !correta; // esquerda = Falso
    else if (lado === 1) acertou = !!correta; // direita = Verdadeiro
    else acertou = false; // deixou cair no centro: considera erro


    if (acertou) {
        state.caindo.classList.add('acerto');
        state.acertos++;
        // pontuação com combo
        const ganho = 10 * state.combo;
        state.pontos += ganho;
        state.combo = Math.min(state.combo + 1, 5); // limite combo x5
    } else {
        state.caindo.classList.add('erro');
        state.combo = 1; // quebra o combo
    }


    atualizarHUD();


    // preparar próximo bloco
    const atual = PERGUNTAS[state.iPergunta];
    state.iBloco++;
    // atraso curto para feedback visual
    setTimeout(gerarBloco, 240);
}
/* =====================
* Controles
* ===================== */
function decidir(lado) {
    if (!state.caindo) return;
    if (lado < 0) {
        state.targetX = -1; // Falso
        state.caindo.classList.add('decisao-esq');
        state.caindo.classList.remove('decisao-dir');
    } else if (lado > 0) {
        state.targetX = 1; // Verdadeiro
        state.caindo.classList.add('decisao-dir');
        state.caindo.classList.remove('decisao-esq');
    }
}


// Teclado
jogo.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') {
        decidir(-1);
    } else if (ev.key === 'ArrowRight') {
        decidir(1);
    }
});


// Toque/arrasto mobile
jogo.addEventListener('touchstart', (e) => {
    if (!state.caindo) return;
    const t = e.touches[0];
    state.toque.ativo = true;
    state.toque.startX = t.clientX;
    state.toque.deslocX = 0;
});


jogo.addEventListener('touchmove', (e) => {
    if (!state.toque.ativo || !state.caindo) return;
    const t = e.touches[0];
    state.toque.deslocX = t.clientX - state.toque.startX;
    const limiar = Math.max(24, jogo.clientWidth * 0.08);
    if (state.toque.deslocX <= -limiar) { decidir(-1); }
    else if (state.toque.deslocX >= limiar) { decidir(1); }
});


jogo.addEventListener('touchend', () => {
    state.toque.ativo = false;
});

const btnPause = document.getElementById("btnPause");
btnPause.addEventListener("click", () => {
    state.pausado = !state.pausado;
    btnPause.textContent = state.pausado ? "Continuar" : "Pausar";
    state.lastTime = performance.now(); // evita dt gigante ao retomar
});

/* =====================
* Fim de jogo
* ===================== */
function fimDeJogo() {
    cancelAnimationFrame(state.animId);
    if (state.caindo) { state.caindo.remove(); state.caindo = null; }
    fimPontos.textContent = state.pontos;
    fimAcertos.textContent = state.acertos;
    fimTotal.textContent = state.total;
    modalFim.showModal();
}


// salvar ranking
const formSalvar = document.getElementById('formSalvar');
formSalvar.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = (document.getElementById('nomeJogador').value || '').trim();
    if (!nome) return;
    addRanking(nome, state.pontos);
    modalFim.close();
    renderRanking();
    modalRanking.showModal();
});


// Boot
window.addEventListener('load', iniciarJogo);
