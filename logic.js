// logic.js
let selectedTraits = new Set();
let allTraits = new Set();
db.archetypes.forEach(a => a.traits.forEach(t => allTraits.add(t)));

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Funções de Identificação
function generateName() {
    const gen = document.getElementById('gender').value;
    const clan = rnd(db.clans);
    const name = (gen === "Feminino") ? rnd(db.namesF) : rnd(db.namesM);
    document.getElementById('fullname').value = `${clan} ${name}`;
}

function randomizeAge() { document.getElementById('age').value = Math.floor(Math.random() * 50) + 16; }
function randomizeOrigin() { document.getElementById('origin').value = rnd(db.origins); }
function randomizeSelect(id) { const s = document.getElementById(id); s.selectedIndex = Math.floor(Math.random() * s.options.length); }
function generateNature() { 
    const c = rnd(db.natures); 
    document.getElementById('nature').value = c.n; 
    document.getElementById('demeanor').value = c.d; 
}

// Funções de Físico
function randomizeHairStyle() { document.getElementById('hairStyle').value = rnd(db.hairStyles); }
function randomizeHairColor() { document.getElementById('hairColor').value = rnd(db.hairColors); }
function randomizeEyes() { document.getElementById('eyes').value = rnd(db.eyes); }
function randomizeFace() { document.getElementById('face').value = rnd(db.face); }
function randomizeBody() { document.getElementById('body').value = rnd(db.body); }
function randomizeUnique() { document.getElementById('unique').value = rnd(db.unique); }

// Funções de Equipamento
function randomizeClothing() { document.getElementById('clothing').value = rnd(db.clothing); }
function randomizeWeapon() { document.getElementById('weapon').value = rnd(db.weapons); }
function randomizeAccessory() { document.getElementById('accessories').value = rnd(db.accessories); }

function renderTraits() {
    const pool = document.getElementById('trait-pool');
    if (!pool) return;
    pool.innerHTML = '';
    Array.from(allTraits).sort().forEach(t => {
        const tag = document.createElement('span');
        tag.className = `trait-tag ${selectedTraits.has(t) ? 'selected' : ''}`;
        tag.textContent = t;
        tag.onclick = () => {
            if(selectedTraits.has(t)) selectedTraits.delete(t);
            else if(selectedTraits.size < 4) selectedTraits.add(t);
            renderTraits();
            calcArchetype();
        };
        pool.appendChild(tag);
    });
}

function calcArchetype() {
    let best = { name: "Errante", score: -1 };
    db.archetypes.forEach(a => {
        let score = 0; a.traits.forEach(t => { if(selectedTraits.has(t)) score++; });
        if(score > best.score) best = { name: a.name, score };
    });
    document.getElementById('archetype-display').innerText = `Arquétipo Sugerido: ${best.name} (${Array.from(selectedTraits).join(", ")})`;
    document.getElementById('final-archetype').value = best.name;
}

function generateFinalExport() {
    // Captura segura de dados (se o campo estiver vazio, usa um fallback)
    const getVal = (id) => document.getElementById(id).value || "Não definido";

    const d = {
        name: document.getElementById('fullname').value.toUpperCase() || "DESCONHECIDO",
        age: getVal('age'),
        gender: getVal('gender'),
        origin: getVal('origin'),
        align: getVal('alignment'),
        nat: getVal('nature'),
        dem: getVal('demeanor'),
        build: getVal('build'),
        hairStyle: getVal('hairStyle'),
        hairColor: getVal('hairColor'),
        eyes: getVal('eyes'),
        face: getVal('face'),
        body: getVal('body'),
        unique: getVal('unique'),
        clothes: getVal('clothing'),
        weapon: getVal('weapon'),
        acc: getVal('accessories'),
        arch: document.getElementById('final-archetype').value || "Errante"
    };

    // 1. Ficha Narrativa Detalhada
    const sheet = `
KYOMU BAKUFU - REGISTRO DE PERSONAGEM
------------------------------------
NOME: ${d.name}
IDADE: ${d.age} anos | GÊNERO: ${d.gender}
ORIGEM: ${d.origin}
ARQUÉTIPO: ${d.arch}

[PERFIL PSICOLÓGICO]
Alinhamento: ${d.align}
Natureza: ${d.nat} | Comportamento: ${d.dem}

[DESCRIÇÃO FÍSICA]
Porte: ${d.build}
Cabelo: ${d.hairStyle} na cor ${d.hairColor}
Olhos: ${d.eyes}
Feições: ${d.face}
Corpo: ${d.body}
Marca Única: ${d.unique}

[EQUIPAMENTO]
Vestes: ${d.clothes}
Arma: ${d.weapon}
Acessório: ${d.acc}
    `.trim();

    document.getElementById('char-sheet').textContent = sheet;

    // 2. Prompt Otimizado para Nano Banana
    // Definimos o humor visual baseado no alinhamento
    const mood = d.align.includes("Mau") ? "menacing expression, dark aura, intimidating" : "serene, calm look, heroic posture";
    
    const prompt = `(masterpiece:1.2, best quality), anime style, dark fantasy spiritual, (feudal japan 1230:1.1), ${d.gender === "Feminino" ? "japanese woman" : "japanese man"}, ${d.age} years old, ${d.origin}, physical build: ${d.build}, facial features: ${d.face}, hairstyle: ${d.hairStyle}, hair color: ${d.hairColor}, eyes: ${d.eyes}, body detail: ${d.body}, unique mark: ${d.unique}, wearing ${d.clothes}, holding ${d.weapon}, ${d.acc}, ${mood}, cinematic lighting, high contrast, (ink wash splashes:0.7), (jujutsu kaisen aesthetic:0.9), volumetric fog.`;

    document.getElementById('ai-prompt').textContent = prompt;
}

function copyToClipboard(elementId, btn) {
    const text = document.getElementById(elementId).innerText;

    // Função para mostrar sucesso
    const showSuccess = (b) => {
        const originalText = b.innerText;
        b.innerText = "✅ Copiado!";
        b.style.color = "#2ecc71";
        setTimeout(() => {
            b.innerText = originalText;
            b.style.color = "var(--accent)";
        }, 2000);
    };

    // Método Robusto (Funciona em Local e Iframe)
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) showSuccess(btn);
    } catch (err) {
        console.error('Erro ao copiar:', err);
    }
    document.body.removeChild(textArea);
}

// Inicialização
document.addEventListener('DOMContentLoaded', renderTraits);
renderTraits();


