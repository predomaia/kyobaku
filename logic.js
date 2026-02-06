// logic.js
let selectedTraits = new Set();
let allTraits = new Set();
db.archetypes.forEach(a => a.traits.forEach(t => allTraits.add(t)));

// Objeto global para guardar os pontos sorteados do NPC
let npcStats = {
    attributes: {},
    spiritual: {},
    skills: {},
    knowledge: {},
    anchors: 5
};

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- NOVAS FUNÇÕES DE MECÂNICA ---

// Função para transformar número em bolinhas ●●●○○
const renderDots = (value) => {
    const max = 5;
    return "●".repeat(value) + "○".repeat(max - value);
};

// Função Mestre de Distribuição (Poder 1)
function distributeStats() {
    // 1. Atributos Mundanos (7/5/3)
    const priorities = [7, 5, 3].sort(() => Math.random() - 0.5);
    const cats = Object.keys(db.mundaneAttributes); // ["Físicos", "Sociais", "Mentais"]
    
    cats.forEach((cat, index) => {
        let points = priorities[index];
        const attrs = db.mundaneAttributes[cat];
        npcStats.attributes[cat] = {};
        
        // Inicializa com 0
        attrs.forEach(a => npcStats.attributes[cat][a] = 0);
        
        // Distribui pontos aleatoriamente na categoria até acabar
        while(points > 0) {
            let a = rnd(attrs);
            if(npcStats.attributes[cat][a] < 5) {
                npcStats.attributes[cat][a]++;
                points--;
            }
        }
    });

    // 2. Atributos Espirituais (3 pontos)
    db.spiritualAttributes.forEach(a => npcStats.spiritual[a] = 0);
    let spiritualPoints = 3;
    while(spiritualPoints > 0) {
        let a = rnd(db.spiritualAttributes);
        if(npcStats.spiritual[a] < 5) { npcStats.spiritual[a]++; spiritualPoints--; }
    }

    // 3. Perícias (10 pontos)
    db.skills.forEach(s => npcStats.skills[s] = 0);
    let skillPoints = 10;
    while(skillPoints > 0) {
        let s = rnd(db.skills);
        if(npcStats.skills[s] < 5) { npcStats.skills[s]++; skillPoints--; }
    }

    // 4. Conhecimentos (6 pontos)
    db.knowledge.forEach(k => npcStats.knowledge[k] = 0);
    let knowledgePoints = 6;
    while(knowledgePoints > 0) {
        let k = rnd(db.knowledge);
        if(npcStats.knowledge[k] < 5) { npcStats.knowledge[k]++; knowledgePoints--; }
    }
    
    npcStats.anchors = 5; // Valor fixo para Poder 1
}

// --- FUNÇÕES DE IDENTIFICAÇÃO ---

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

// --- FUNÇÕES DE FÍSICO ---

function randomizeHairStyle() { document.getElementById('hairStyle').value = rnd(db.hairStyles); }
function randomizeHairColor() { document.getElementById('hairColor').value = rnd(db.hairColors); }
function randomizeEyes() { document.getElementById('eyes').value = rnd(db.eyes); }
function randomizeFace() { document.getElementById('face').value = rnd(db.face); }
function randomizeBody() { document.getElementById('body').value = rnd(db.body); }
function randomizeUnique() { document.getElementById('unique').value = rnd(db.unique); }

// --- FUNÇÕES DE EQUIPAMENTO ---

function randomizeClothing() { document.getElementById('clothing').value = rnd(db.clothing); }
function randomizeWeapon() { document.getElementById('weapon').value = rnd(db.weapons); }
function randomizeAccessory() { document.getElementById('accessories').value = rnd(db.accessories); }

// --- INTERFACE E EXPORTAÇÃO ---

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
    // 0. Gera a distribuição de pontos interna antes de exportar
    distributeStats();

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

    // 1. Construção Visual da Ficha com Bolinhas
    let statsSection = "\n[ATRIBUTOS MUNDANOS]\n";
    for (let cat in npcStats.attributes) {
        statsSection += `${cat.toUpperCase()}:\n`;
        for (let attr in npcStats.attributes[cat]) {
            statsSection += `  ${attr.padEnd(12)} ${renderDots(npcStats.attributes[cat][attr])}\n`;
        }
    }

    statsSection += "\n[ATRIBUTOS ESPIRITUAIS]\n";
    for (let attr in npcStats.spiritual) {
        statsSection += `  ${attr.padEnd(12)} ${renderDots(npcStats.spiritual[attr])}\n`;
    }

    statsSection += "\n[PERÍCIAS & CONHECIMENTOS]\n";
    const allSkills = {...npcStats.skills, ...npcStats.knowledge};
    // Mostra apenas o que tem pelo menos 1 ponto para não poluir a ficha
    Object.keys(allSkills).sort().forEach(s => {
        if(allSkills[s] > 0) {
            statsSection += `  ${s.padEnd(15)} ${renderDots(allSkills[s])}\n`;
        }
    });

    const sheet = `
KYOMU BAKUFU - REGISTRO DE PERSONAGEM
------------------------------------
NOME: ${d.name} | ARQUÉTIPO: ${d.arch}
ÂNCORAS: ${renderDots(npcStats.anchors)}
${statsSection}
------------------------------------
[DESCRIÇÃO FÍSICA]
Porte: ${d.build}
Cabelo: ${d.hairStyle} (${d.hairColor})
Olhos: ${d.eyes} | Rosto: ${d.face}
Corpo: ${d.body} | Marca: ${d.unique}

[EQUIPAMENTO]
Vestes: ${d.clothes}
Arma: ${d.weapon}
Acessório: ${d.acc}

[PERFIL PSICOLÓGICO]
Alinhamento: ${d.align}
Natureza: ${d.nat} | Comportamento: ${d.dem}
    `.trim();

    document.getElementById('char-sheet').textContent = sheet;

    // 2. Prompt para IA (Nano Banana)
    const mood = d.align.includes("Mau") ? "menacing expression, dark aura, intimidating" : "serene, calm look, heroic posture";
    const prompt = `(masterpiece:1.2, best quality), anime style, dark fantasy spiritual, (feudal japan 1230:1.1), ${d.gender === "Feminino" ? "japanese woman" : "japanese man"}, ${d.age} years old, ${d.origin}, physical build: ${d.build}, facial features: ${d.face}, hairstyle: ${d.hairStyle}, hair color: ${d.hairColor}, eyes: ${d.eyes}, body detail: ${d.body}, unique mark: ${d.unique}, wearing ${d.clothes}, holding ${d.weapon}, ${d.acc}, ${mood}, cinematic lighting, high contrast, (ink wash splashes:0.7), (jujutsu kaisen aesthetic:0.9), volumetric fog.`;

    document.getElementById('ai-prompt').textContent = prompt;
}

// --- SISTEMA DE CÓPIA ---

function copyToClipboard(elementId, btn) {
    const text = document.getElementById(elementId).innerText;

    const showSuccess = (b) => {
        if (!b) {
            alert("✅ Copiado!");
            return;
        }
        const originalText = b.innerText;
        b.innerText = "✅ Copiado!";
        b.style.color = "#2ecc71";
        setTimeout(() => {
            b.innerText = originalText;
            b.style.color = "var(--accent)";
        }, 2000);
    };

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999); 

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
