// logic.js
let selectedTraits = new Set();
let allTraits = new Set();
db.archetypes.forEach(a => a.traits.forEach(t => allTraits.add(t)));

const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

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
    const d = {
        name: document.getElementById('fullname').value || "Desconhecido",
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        origin: document.getElementById('origin').value || "Sem Origem",
        align: document.getElementById('alignment').value,
        nat: document.getElementById('nature').value,
        dem: document.getElementById('demeanor').value,
        build: document.getElementById('build').value,
        hair: `${document.getElementById('hairStyle').value} (${document.getElementById('hairColor').value})`,
        eyes: document.getElementById('eyes').value,
        face: document.getElementById('face').value,
        body: document.getElementById('body').value,
        unique: document.getElementById('unique').value,
        clothes: document.getElementById('clothing').value,
        weapon: document.getElementById('weapon').value,
        acc: document.getElementById('accessories').value,
        arch: document.getElementById('final-archetype').value || "Errante"
    };

    // Ficha 
    const sheet = `KYOMU BAKUFU - REGISTRO\nNOME: ${d.name.toUpperCase()}\nORIGEM: ${d.origin}\nARQUÉTIPO: ${d.arch}\n\nFÍSICO: ${d.build}, Cabelo ${d.hair}, Olhos ${d.eyes}.\nROSTO: ${d.face}\nCORPO: ${d.body}\nMARCA: ${d.unique}\n\nEQUIPAMENTO: ${d.clothes}, ${d.weapon}, ${d.acc}.`;
    document.getElementById('char-sheet').textContent = sheet;

    // Prompt IA
    const prompt = `(masterpiece, anime style:1.2), ${d.gender === "Feminino" ? "woman" : "man"}, ${d.age}yo, ${d.origin}, ${d.build} build, face: ${d.face}, hair: ${d.hair}, eyes: ${d.eyes}, body: ${d.body}, unique mark: ${d.unique}, wearing ${d.clothes}, holding ${d.weapon}, ${d.acc}, jujutsu kaisen aesthetic, cinematic lighting.`;
    document.getElementById('ai-prompt').textContent = prompt;
}

// Inicialização

document.addEventListener('DOMContentLoaded', renderTraits);
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.innerText;
        
        btn.innerText = "✅ Copiado!";
        btn.style.borderColor = "#2ecc71";
        btn.style.color = "#2ecc71";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.borderColor = "var(--accent)";
            btn.style.color = "var(--accent)";
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}

// ESTA DEVE SER A ÚLTIMA LINHA DO ARQUIVO
renderTraits();

