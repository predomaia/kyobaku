// database.js
const db = {
    clans: ["Minamoto", "Taira", "Hojo", "Fujiwara", "Takeda", "Uesugi", "Date", "Sanada", "Hattori", "Ashikaga", "Shimazu", "Mori", "Chosokabe", "Imagawa", "Otomo", "Abe", "Kusanagi", "Tsukino", "Kurosawa", "Yagyu", "Fuma", "Koga", "Iga", "Hyuuga", "Uchiha", "Kaguya", "Ryuzoji", "Amago", "Hatakeyama", "Satake", "Mogami"],
    
    namesM: ["Yoshitsune", "Yoritomo", "Benkei", "Hanzo", "Nobunaga", "Hideyoshi", "Musashi", "Kojiro", "Ryu", "Kenji", "Takeshi", "Jiro", "Genji", "Katsuie", "Tadakatsu", "Shingen", "Mitsuhide", "Munenori", "Kojuro", "Masamune", "Yukimura", "Keiji", "Kiyomori", "Nagahide", "Kiyomasa", "Mitsunari", "Ieyasu", "Hidetada", "Muneshige", "Yoshihiro", "Seijuro", "Jin", "Mugen", "Hyakkimaru", "Ginko", "Thors", "Sakon", "Ukon", "Kaname", "Jyuuzou", "Raizen", "Souma", "Kyujuro", "Tanjiro", "Giyu", "Zenzaemon", "Hajime", "Saito", "Shinpachi", "Sanosuke"],
    
    namesF: ["Masako", "Tomoe", "Himiko", "Sakura", "Kaori", "Yuki", "Hana", "Rin", "Akane", "Mai", "Suki", "Ayame", "Chiyo", "Komachi", "Oichi", "Nohime", "Shizuka", "Katsushiro", "Inahime", "Tsuru", "Sen", "Ginchiyo", "Okuni", "Yodo", "Nene", "Matsu", "Ume", "Kiku", "Taki", "Satsu", "Kagura", "Kikyo", "Sango", "Mikasa", "Motoko", "Reiko", "Izumi", "Misaki", "Kohaku", "Shiori", "Nanami", "Hotaru", "Suzu", "Mitsuha", "Hiyori", "Kanao", "Shinobu", "Tamayo", "Setsuna", "Towa"],
    
    origins: [
        "Veterano de cerco traumatizado", "Desertor de guerra sangrenta", "Ronin em busca de mestre", 
        "Guarda de fronteira esquecido", "Instrutor de esgrima caído", "Lanceiro de infantaria camponesa", 
        "Arqueiro de elite cegado", "Mercenário de poucas palavras", "Sobrevivente de massacre covarde",
        "Sentinela de posto avançado", "Estrategista militar aposentado", "Portador de estandarte honrado",
        "Duelista de honra manchada", "Treinador de falcões caçadores", "Fabricante de armaduras rústicas",
        "Sentinela de muralhas antigas", "Escudeiro de herói falecido", "Batedor de pântanos fétidos",
        "Guerreiro em busca de redenção", "Vigilante de estradas desertas", "Exorcista de templos arruinados",
        "Monge errante em penitência", "Asceta das montanhas geladas", "Oráculo de divindades esquecidas",
        "Zelador de santuário amaldiçoado", "Caçador de sombras rituais", "Adivinho de sinais fúnebres",
        "Médium de espíritos vingativos", "Ervanário de cura proibida", "Estudioso de textos proibidos",
        "Necromante de linhagem oculta", "Curandeiro de vilas pobres", "Monge que quebrou silêncio",
        "Sacerdote de ritos agrários", "Peregrino de mil milhas", "Limpador de estátuas sagradas",
        "Vidente de sonhos lúcidos", "Tradutor de pergaminhos antigos", "Ajudante de monge bêbado",
        "Protetor de relíquia falsa", "Boticário de venenos sutis", "Ex-membro de seita solar",
        "Contemplador de jardins zen", "Guardião de cemitério florestal", "Pajé de tribo isolada",
        "Ferreiro de lâminas quebradas", "Escritor de contos fúnebres", "Artesão de máscaras teatrais",
        "Pescador de águas profundas", "Coveiro de valas comuns", "Artista de rua andarilho",
        "Mensageiro de notícias sombrias", "Cozinheiro de banquetes malditos", "Mineiro de cavernas profundas",
        "Tecelão de seda branca", "Carpinteiro de templos flutuantes", "Mercador de especiarias raras",
        "Pintor de biombos assombrados", "Oleiro de cinzas ancestrais", "Criador de cavalos imperiais",
        "Tutor de caligrafia clássica", "Poeta de haicais melancólicos", "Mestre de cerimônia de chá",
        "Joalheiro de amuletos protetores", "Domador de feras selvagens", "Coletor de impostos arrependido",
        "Vendedor de mapas imprecisos", "Dono de estalagem remota", "Fabricante de fogos artifício",
        "Curtidor de peles místicas", "Lenhador de florestas sussurrantes", "Garimpeiro de rios secos",
        "Contador de histórias cego", "Alfaiate de quimonos cerimoniais", "Relojoeiro de engrenagens estranhas",
        "Escravo fugitivo de nobres", "Nobre exilado sem posses", "Herdeiro de clã dizimado",
        "Assassino de aluguel implacável", "Espião de cortes decadentes", "Ladrão de relíquias sagradas",
        "Falsificador de selos imperiais", "Contrabandista de itens espirituais", "Executor de baixa casta",
        "Batedor de caminhos perigosos", "Vigilante de vilas pobres", "Órfão criado por templos",
        "Dançarino de cortes flutuantes", "Jogador viciado em dívidas", "Criança prodígio em Go",
        "Sobrevivente de naufrágio misterioso", "Pirata de rios interiores", "Carcereiro de prisões políticas",
        "Escriba de editais imperiais", "Testemunha de crime real", "Mendigo de sabedoria oculta",
        "Viajante de terras além-mar", "Acompanhante de nobre rebelde", "Sabotador de castelos inimigos",
        "Último membro de linhagem"
    ],

    natures: [
        {n: "Sobrevivente", d: "Pragmático"}, {n: "Rebelde", d: "Impulsivo"}, 
        {n: "Tradicionalista", d: "Rígido"}, {n: "Arquiteto", d: "Calculista"}, 
        {n: "Mártir", d: "Abnegado"}, {n: "Bárbaro", d: "Selvagem"}
    ],

    hairStyles: ["Coque Samurai (Chonmage) desleixado", "Longo e liso até a cintura", "Raspado nas laterais com topo espetado", "Cabelo curto e bagunçado", "Tranças longas com fitas", "Selvagem e volumoso", "Curto e geométrico", "Careca polida"],
    hairColors: ["Preto profundo", "Branco neve", "Cinza cinzento", "Vermelho carmesim", "Preto com pontas descoloridas", "Branco com mechas roxas", "Bicolor (Metade branco, metade preto)"],
    eyes: ["Dourados como gato", "Azul gélido", "Vermelho sangue", "Violeta místico", "Heterocromia (Azul e Amarelo)", "Pupilas em fenda", "Pretos com íris branca"],
    face: ["Mandíbula quadrada e cicatriz", "Feições andróginas", "Olheiras de cansaço constante", "Olhar de predador", "Serenidade inexpressiva"],
    body: ["Postura curvada e mãos calejadas", "Corpo coberto de bandagens", "Mão artificial de madeira", "Cicatrizes de batalha", "Musculatura definida e magra"],
    unique: ["Tatuagem rúnica que brilha", "Terceiro olho fechado", "Aura de fumaça negra", "Chifres pequenos ocultos", "Sombra independente"],
    clothing: ["Quimono esfarrapado", "Armadura O-Yoroi incompleta", "Vestes de seda branca", "Traje shinobi", "Hakama manchado de sangue"],
    weapons: ["Katana amaldiçoada", "Naginata negra", "Kanabo de ferro", "Yumi de osso", "Pergaminhos de invocação"],
    accessories: ["Máscara Hannya", "Rosário gigante", "Chapéu de palha cônico", "Cabaça de sake", "Talismãs Shinto"],
    
    archetypes: [
        { name: "O Ronin Honrado", traits: ["leal", "sincero", "tradicional", "disciplinado"] },
        { name: "O Estrategista", traits: ["metódico", "intelectual", "frio", "calculista"] },
        { name: "O Berserker", traits: ["volátil", "agressivo", "dominante", "forte"] },
        { name: "O Trapaceiro", traits: ["esperto", "imprevisível", "flexível", "mentiroso"] },
        { name: "O Místico", traits: ["misterioso", "observador", "intuitivo", "calmo"] }
    ],

    mundaneAttributes: {
        Físicos: ["Força", "Destreza", "Vigor"],
        Sociais: ["Carisma", "Manipulação", "Presença"],
        Mentais: ["Percepção", "Raciocínio", "Inteligência"]
    },

    spiritualAttributes: ["TEN (Céu)", "TAI (Corpo)", "CHI (Mente)", "REI (Alma)"],

    skills: [
        "Acrobacia", "Atletismo", "Diplomacia", "Decifrar", "Empatia", "Escalar", 
        "Escutar", "Furtividade", "Intimidação", "Lábia", "Liderança", "Manha", 
        "Manuseio", "Meditação", "Montaria", "Observar", "Performance", 
        "Presciência", "Prontidão", "Reparos", "Rastreio", "Segurança"
    ],

    knowledge: [
        "Ocultismo", "Arsenal", "Artes", "Cartografia", "Ciências Biológicas", 
        "Ciências Naturais", "Ciências Humanas", "Investigação", "Linguística", 
        "Medicina", "Religião"
    ],

    anchorScaling: [
        { maxPoder: 4, anchors: 5 },
        { maxPoder: 10, anchors: 6 },
        { maxPoder: 15, anchors: 7 },
        { maxPoder: 20, anchors: 8 },
        { maxPoder: 25, anchors: 9 },
        { maxPoder: 30, anchors: 10 }
    ]
};
