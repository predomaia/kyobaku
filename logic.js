// logic.js
let selectedTraits = new Set();
let allTraits = new Set();

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

const renderDots = (value) => {
    const max = 5;
    return "●".repeat(value) + "○".repeat(max - value);
};

function distributeStats() {
    if (typeof db === 'undefined') return;

    const priorities = [7, 5, 3].sort(() => Math.random() - 0.5);
    const cats = Object.keys(db.mundaneAttributes); 
    
    cats.forEach((cat, index) => {
        let points = priorities[index];
        const attrs = db.mundaneAttributes[cat];
        npcStats.attributes[cat] = {};
        attrs.forEach(a => npcStats.attributes[cat][a] = 0);
        while(points > 0) {
            let a = rnd(attrs);
            if(npcStats.attributes[cat][a] < 5) {
                npcStats.attributes[cat][a]++;
                points--;
            }
        }
    });

    db.spiritualAttributes.forEach(a => npcStats.spiritual[a] = 0);
    let spiritualPoints = 3;
    while(spiritualPoints > 0) {
        let a = rnd(db.spiritualAttributes);
        if(npcStats.spiritual[a] < 5) { npcStats.spiritual[a]++; spiritualPoints--; }
    }

    db.skills.forEach(s => npcStats.skills[s] = 0);
    let skillPoints = 10;
    while(skillPoints > 0) {
        let s = rnd(db.skills);
        if(npcStats.skills[s] < 5) { npcStats.skills[s]++; skillPoints--; }
    }

    db.knowledge.forEach(k => npcStats.knowledge[k] = 0);
    let knowledgePoints = 6;
    while(knowledgePoints > 0) {
        let k = rnd(db.knowledge);
        if(npcStats.knowledge[k] < 5) { npcStats.knowledge[k]++; knowledgePoints--; }
    }
}

// --- FUNÇÕES DE IDENTIFICAÇÃO E FÍSICO (RESUMIDAS PARA SEGURANÇA) ---
function generateName() {
    if (typeof db === 'undefined') return;
    const gen = document.getElementById('gender').value;
    const clan = rnd(db.clans);
    const name = (gen === "Feminino") ? rnd(db.namesF) : rnd(db.namesM);
    document.getElementById('fullname').value = `${clan} ${name}`;
}
function randomizeAge() { document.getElementById('age').value = Math.floor(Math.random() * 50) + 16; }
function randomizeOrigin() { if(typeof db !== 'undefined') document.getElementById('origin').value = rnd(db.origins); }
function randomizeSelect(id) { const s = document.getElementById(id); if(s) s.selectedIndex = Math.floor(Math.random() * s.options.length); }
function generateNature() { if(typeof db === 'undefined') return; const c = rnd(db.natures); document.getElementById('nature').value = c.n; document.getElementById('demeanor').value = c.d; }
function randomizeHairStyle() { if(typeof db !== 'undefined') document.getElementById('hairStyle').value = rnd(db.hairStyles); }
function randomizeHairColor() { if(typeof db !== 'undefined') document.getElementById('hairColor').value = rnd(db.hairColors); }
function randomizeEyes() { if(typeof db !== 'undefined') document.getElementById('eyes').value = rnd(db.eyes); }
function randomizeFace() { if(typeof db !== 'undefined') document.getElementById('face').value = rnd(db.face); }
function randomizeBody() { if(typeof db !== 'undefined') document.getElementById('body').value = rnd(db.body); }
function randomizeUnique() { if(typeof db !== 'undefined') document.getElementById('unique').value = rnd(db.unique); }
function randomizeClothing() { if(typeof db !== 'undefined') document.getElementById('clothing').value = rnd(db.clothing); }
function randomizeWeapon() { if(typeof db !== 'undefined') document.getElementById('weapon').value = rnd(db.weapons); }
function randomizeAccessory() { if(typeof db !== 'undefined') document.getElementById('accessories').value = rnd(db.accessories); }

function renderTraits() {
    if (typeof db === 'undefined') return;
    const pool = document.getElementById('trait-pool');
    if (!pool) return;
    if (allTraits.size === 0 && db.archetypes) {
        db.archetypes.forEach(a => a.traits.forEach(t => allTraits.add(t)));
    }
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
    if (typeof db === 'undefined') return;
    let best = { name: "Errante", score: -1 };
    db.archetypes.forEach(a => {
        let score = 0; a.traits.forEach(t => { if(selectedTraits.has(t)) score++; });
        if(score > best.score) best = { name: a.name, score };
    });
    document.getElementById('archetype-display').innerText = `Arquétipo Sugerido: ${best.name} (${Array.from(selectedTraits).join(", ")})`;
    document.getElementById('final-archetype').value = best.name;
}

function generateFinalExport() {
    distributeStats();
    const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : "Não definido";
    const d = {
        name: document.getElementById('fullname').value.toUpperCase(),
        age: getVal('age'), gender: getVal('gender'), origin: getVal('origin'), align: getVal('alignment'),
        nat: getVal('nature'), dem: getVal('demeanor'), build: getVal('build'), hairStyle: getVal('hairStyle'),
        hairColor: getVal('hairColor'), eyes: getVal('eyes'), face: getVal('face'), body: getVal('body'),
        unique: getVal('unique'), clothes: getVal('clothing'), weapon: getVal('weapon'), acc: getVal('accessories'),
        arch: getVal('final-archetype')
    };

    let statsSection = "\n[ATRIBUTOS MUNDANOS]\n";
    for (let cat in npcStats.attributes) {
        statsSection += `${cat.toUpperCase()}:\n`;
        for (let attr in npcStats.attributes[cat]) {
            statsSection += `  ${attr.padEnd(15)} ${renderDots(npcStats.attributes[cat][attr])}\n`;
        }
    }

    statsSection += "\n[ATRIBUTOS ESPIRITUAIS]\n";
    for (let attr in npcStats.spiritual) {
        statsSection += `  ${attr.padEnd(15)} ${renderDots(npcStats.spiritual[attr])}\n`;
    }

    const sheet = `KYOMU BAKUFU - REGISTRO DE PERSONAGEM\n------------------------------------\nNOME: ${d.name} | ARQUÉTIPO: ${d.arch}\nÂNCORAS: ${renderDots(npcStats.anchors)}\n${statsSection}\n------------------------------------\n[DESCRIÇÃO FÍSICA]\nPorte: ${d.build} | Cabelo: ${d.hairStyle} (${d.hairColor})\nOlhos: ${d.eyes} | Rosto: ${d.face}\nCorpo: ${d.body} | Marca: ${d.unique}\n\n[EQUIPAMENTO]\nVestes: ${d.clothes} | Arma: ${d.weapon}\nAcessório: ${d.acc}\n\n[PERFIL PSICOLÓGICO]\nAlinhamento: ${d.align}\nNatureza: ${d.nat} | Comportamento: ${d.dem}`.trim();
    document.getElementById('char-sheet').textContent = sheet;

    const mood = d.align.includes("Mau") ? "menacing expression, dark aura, intimidating" : "serene, calm look, heroic posture";
    const prompt = `(masterpiece:1.2, best quality), anime style, dark fantasy spiritual, (feudal japan 1230:1.1), ${d.gender === "Feminino" ? "japanese woman" : "japanese man"}, ${d.age} years old, ${d.origin}, physical build: ${d.build}, facial features: ${d.face}, hairstyle: ${d.hairStyle}, hair color: ${d.hairColor}, eyes: ${d.eyes}, body detail: ${d.body}, unique mark: ${d.unique}, wearing ${d.clothes}, holding ${d.weapon}, ${d.acc}, ${mood}, cinematic lighting, high contrast, (ink wash splashes:0.7), (jujutsu kaisen aesthetic:0.9), volumetric fog.`;
    document.getElementById('ai-prompt').textContent = prompt;
}

// Inicialização segura
window.addEventListener('load', () => { if(typeof renderTraits === 'function') renderTraits(); });
