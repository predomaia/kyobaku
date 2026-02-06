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
    // Captura segura de dados
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
        hair: `${getVal('hairStyle')} (${getVal('hairColor')})`,
        eyes: getVal('eyes'),
        face: getVal('face'),
        body: getVal('body'),
        unique: getVal('unique'),
        clothes: getVal('clothing'),
        weapon: getVal('weapon'),
        acc: getVal('accessories'),
        arch: document.getElementById('final-archetype').value || "Errante"
    };

    // Ficha Detalhada
    const sheet = `KYOMU BAKUFU - REGISTRO OFICIAL\n------------------------------\nNOME: ${d.name}\nORIGEM: ${d.origin}\nARQUÉTIPO: ${d.arch}\n\nPSICOLOGIA:\n- Alinhamento: ${d.align}\n- Natureza: ${d.nat} / Comportamento: ${d.dem}\n\nFÍSICO:\n- Porte: ${d.build}\n- Cabelo: ${d.hair}\n- Olhos: ${d.eyes}\n- Rosto: ${d.face}\n- Corpo: ${d.body}\n- Marca Única: ${d.unique}\n\nEQUIPAMENTO:\n- Vestes: ${d.clothes}\n- Arma: ${d.weapon}\n- Acessório: ${d.acc}`;
    document.getElementById('char-sheet').textContent = sheet;

    // Prompt IA (Otimizado para Nano Banana)
    const mood = d.align.includes("Mau") ? "menacing, dark aura, sharp eyes" : "serene, dignified posture, calm gaze";
    
    const prompt = `(masterpiece:1.2, best quality), anime style, dark fantasy, (feudal japan:1.1), ${d.gender === "Feminino" ? "woman" : "man"}, ${d.age}yo, ${d.origin}, ${d.build} build, face: ${d.face}, hair: ${d.hair}, eyes: ${d.eyes}, body: ${d.body}, unique mark: ${d.unique}, wearing ${d.clothes}, holding ${d.weapon}, ${d.acc}, ${mood}, cinematic lighting, high contrast, (jujutsu kaisen aesthetic:0.8), (ink splashes:0.5).`;
    
    document.getElementById('ai-prompt').textContent = prompt;
}

// Sistema de Cópia Robusto para Google Sites
function copyToClipboard(elementId, btn) {
    const element = document.getElementById(elementId);
    const text = element.innerText || element.textContent;

    const showSuccess = (b) => {
        if (b) {
            const originalText = b.innerText;
            b.innerText = "✅ Copiado!";
            b.style.color = "#2ecc71";
            setTimeout(() => { b.innerText = originalText; b.style.color = "var(--accent)"; }, 2000);
        } else {
            alert("Copiado com sucesso!");
        }
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => showSuccess(btn)).catch(() => fallbackCopy(text, btn));
    } else {
        fallbackCopy(text, btn);
    }

    function fallbackCopy(textToCopy, b) {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showSuccess(b);
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
        document.body.removeChild(textArea);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', renderTraits);
renderTraits();
