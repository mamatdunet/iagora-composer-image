/* Compose ton image — atelier IAgora
   Une vignette par catégorie remplit un champ texte modifiable ;
   le prompt global concatène tous les champs, dans l'ordre des catégories. */

const CATEGORIES = [
  {
    id: 'premier-plan',
    title: 'Premier plan',
    intro: "Ce qui se trouve tout devant, au plus près de l'objectif : c'est souvent le sujet principal de ton image.",
    items: [
      { id: 'pp-personnage', label: 'Un personnage, un animal…', prompt: "Au premier plan, [décris le personnage ou l'animal, ex. : un écureuil roux assis dans la mousse]" },
      { id: 'pp-objet', label: 'Un objet', prompt: "Au premier plan, [décris l'objet, ex. : une balle de tennis posée sur la mousse]" },
      { id: 'pp-rien', label: 'Rien du tout', prompt: "Rien au premier plan, le regard part directement vers le décor" },
    ],
  },
  {
    id: 'arriere-plan',
    title: 'Arrière-plan',
    intro: "Le décor, derrière le sujet. Il installe l'ambiance et raconte où se passe la scène.",
    items: [
      { id: 'ap-personnage', label: 'Un personnage, un animal…', prompt: "À l'arrière-plan, [décris les personnages ou animaux, ex. : des sangliers dans une forêt de pins]" },
      { id: 'ap-paysage', label: 'Un paysage', prompt: "En arrière-plan, [décris le paysage, ex. : des montagnes enneigées derrière une forêt]" },
      { id: 'ap-objet', label: 'Un objet, une construction…', prompt: "En arrière-plan, [décris l'objet ou le bâtiment, ex. : un château médiéval au bout de la forêt]" },
      { id: 'ap-flou', label: 'Un arrière-plan flou', prompt: "Arrière-plan flou avec un joli bokeh, faible profondeur de champ" },
      { id: 'ap-uni', label: 'Un arrière-plan uni et coloré', prompt: "Arrière-plan uni et coloré, [choisis la couleur, ex. : jaune moutarde]" },
      { id: 'ap-rien', label: 'Rien du tout', prompt: "Sans décor, sujet isolé sur un fond blanc uni" },
    ],
  },
  {
    id: 'style',
    title: 'Rendu ou style souhaité',
    intro: "Photo, dessin, peinture… ou « à la manière de » un artiste. C'est souvent le choix qui change le plus le résultat.",
    items: [
      { id: 'st-photo', label: 'Photoréaliste', prompt: "Rendu photoréaliste, très détaillé, comme une vraie photographie" },
      { id: 'st-illustration', label: 'Illustration', prompt: "Style illustration numérique, aplats de couleurs et contours nets" },
      { id: 'st-croquis', label: 'Croquis', prompt: "Style croquis au crayon, traits esquissés sur papier" },
      { id: 'st-huile', label: "Peinture à l'huile", prompt: "Peinture à l'huile sur toile, touches de pinceau visibles" },
      { id: 'st-aquarelle', label: 'Aquarelle', prompt: "Aquarelle, couleurs transparentes qui se diffusent sur un papier texturé" },
      { id: 'st-analogique', label: 'Photo analogique', prompt: "Photo argentique, grain de pellicule visible, couleurs légèrement passées" },
      { id: 'st-dali', label: 'Style de Salvador Dalí', prompt: "Dans le style surréaliste de Salvador Dalí" },
      { id: 'st-picasso', label: 'Style de Picasso', prompt: "Dans le style cubiste de Pablo Picasso" },
      { id: 'st-nikidesaintphalle', label: 'Style de Niki de Saint Phalle', prompt: "Dans le style de Niki de Saint Phalle, formes rondes et couleurs vives" },
    ],
  },
  {
    id: 'plan',
    title: 'Type de plan',
    intro: "Le vocabulaire du cinéma : le plan dit quelle place le sujet occupe dans le cadre, du plus large au plus serré.",
    help: {
      summary: 'Comment lire les types de plan ?',
      html: "<p>On part du décor entier et on se rapproche du sujet&nbsp;: <strong>plan d'ensemble</strong> (le paysage domine), <strong>plan général</strong> (la scène et ses personnages), <strong>plan moyen</strong> (le personnage en pied, de la tête aux pieds), <strong>plan américain</strong> (coupé à mi-cuisses, comme dans les westerns pour voir le revolver), <strong>plan rapproché</strong> (taille ou poitrine), <strong>gros plan</strong> (le visage) et <strong>très gros plan</strong> (un détail, un œil).</p><p>Les termes anglais entre parenthèses aident les outils d'IA, entraînés surtout en anglais.</p>",
      image: { src: 'images/aide-plans.jpg', alt: "Schéma des sept types de plan, du plan d'ensemble au très gros plan", caption: 'Source : pedagogie.ac-montpellier.fr' },
    },
    items: [
      { id: 'pl-ensemble', label: "Plan d'ensemble", detail: 'Le décor domine, le sujet est minuscule.', prompt: "Plan d'ensemble (extreme wide shot) : le décor occupe toute l'image, le sujet est tout petit dans le paysage" },
      { id: 'pl-general', label: 'Plan général', detail: 'Toute la scène et ses personnages.', prompt: "Plan général (wide shot) : on voit toute la scène et ses personnages en entier" },
      { id: 'pl-moyen', label: 'Plan moyen', detail: 'Le personnage en pied.', prompt: "Plan moyen (full shot) : le personnage cadré en pied, de la tête aux pieds" },
      { id: 'pl-americain', label: 'Plan américain', detail: 'Coupé à mi-cuisses.', prompt: "Plan américain (cowboy shot) : le personnage cadré à mi-cuisses" },
      { id: 'pl-rapproche', label: 'Plan rapproché', detail: 'Coupé à la taille ou à la poitrine.', prompt: "Plan rapproché (medium close-up) : le personnage cadré à la poitrine" },
      { id: 'pl-gros', label: 'Gros plan', detail: 'Le visage remplit le cadre.', prompt: "Gros plan (close-up) : le visage remplit le cadre" },
      { id: 'pl-tresgros', label: 'Très gros plan', detail: 'Un détail : un œil, une main.', prompt: "Très gros plan (extreme close-up) sur un détail, [lequel ? ex. : un œil]" },
    ],
  },
  {
    id: 'position',
    title: 'Un objet, un personnage… sur une partie de l’image',
    intro: "Où placer ton sujet dans le cadre ?",
    help: {
      summary: "C'est quoi, la règle des tiers ?",
      html: "<p>Imagine deux lignes verticales et deux horizontales qui découpent l'image en neuf cases égales. Placer le sujet sur l'une de ces lignes (le <strong>tiers gauche</strong> ou le <strong>tiers droit</strong>) donne une image plus vivante qu'un sujet bien au centre, et laisse de la place au décor. Le <strong>centre</strong> marche bien pour une image symétrique ou un face-à-face avec le sujet.</p>",
    },
    items: [
      { id: 'po-haut', label: 'En haut', prompt: "Le sujet est placé en haut de l'image" },
      { id: 'po-bas', label: 'En bas', prompt: "Le sujet est placé en bas de l'image" },
      { id: 'po-gauche', label: 'Sur le tiers gauche', prompt: "Le sujet est placé sur le tiers gauche de l'image (règle des tiers)" },
      { id: 'po-droite', label: 'Sur le tiers droit', prompt: "Le sujet est placé sur le tiers droit de l'image (règle des tiers)" },
      { id: 'po-centre', label: 'Au centre', prompt: "Le sujet est au centre de l'image, composition symétrique" },
    ],
  },
  {
    id: 'objectif',
    title: "Type d'objectif utilisé",
    intro: "L'objectif, c'est le « zoom » de l'appareil photo. Il change ce que l'on voit… et la façon dont on le voit.",
    help: {
      summary: "Focale, grand-angle, téléobjectif : c'est quoi ?",
      html: "<p>La <strong>focale</strong>, en millimètres, dit à quel point l'objectif « zoome ».</p><ul><li><strong>Courte focale, ou grand-angle</strong> (moins de 35&nbsp;mm)&nbsp;: on voit large, les perspectives sont exagérées. En portrait, le nez grossit et les oreilles disparaissent.</li><li><strong>50&nbsp;mm</strong>&nbsp;: proche de la vision humaine, rien n'est déformé.</li><li><strong>Longue focale, ou téléobjectif</strong> (100&nbsp;mm et plus)&nbsp;: on voit serré, de loin. Le fond paraît plus proche et plus gros derrière le sujet&nbsp;: c'est l'effet d'«&nbsp;écrasement&nbsp;» des plans. À 600 ou 1200&nbsp;mm, la lune devient immense derrière un promeneur.</li></ul><p>Trois objectifs à part&nbsp;: le <strong>fish-eye</strong> (ultra grand-angle qui courbe tout, effet bulle), l'<strong>objectif à bascule</strong> (tilt-shift, qui ne garde qu'une bande nette et donne un effet maquette) et l'<strong>objectif macro</strong> (pour photographier de tout près ce qui est minuscule).</p>",
      image: { src: 'images/aide-focales.jpg', alt: 'Le même visage photographié de 20 mm à 200 mm : plus la focale est longue, plus le visage est fin et le fond rapproché', caption: 'Le même visage de 20 à 200 mm. Source : danvojtech.cz' },
    },
    items: [
      { id: 'ob-20', label: 'Grand-angle 20 mm', detail: 'Champ très large, perspectives accentuées.', prompt: "Photographié au grand-angle 20 mm, champ très large et perspectives accentuées" },
      { id: 'ob-50', label: 'Standard 50 mm', detail: "Proche de l'œil humain, sans déformation.", prompt: "Photographié avec un objectif 50 mm, perspective naturelle" },
      { id: 'ob-200', label: 'Téléobjectif 200 mm', detail: 'Portrait flatteur, fond resserré et flou.', prompt: "Photographié au téléobjectif 200 mm, arrière-plan rapproché et flou" },
      { id: 'ob-fisheye', label: 'Fish-eye', detail: 'Image bombée, les lignes droites se courbent.', prompt: "Objectif fish-eye, image très bombée, les lignes droites se courbent" },
      { id: 'ob-basculement', label: 'Objectif à bascule, décentrement', detail: 'Tilt-shift : effet maquette miniature.', prompt: "Effet tilt-shift (objectif à bascule et décentrement) : une seule bande nette, la scène ressemble à une maquette miniature" },
      { id: 'ob-macro', label: 'Macro', detail: 'Le minuscule vu de tout près.', prompt: "Photo macro, sujet minuscule vu de très près avec un niveau de détail extrême" },
      { id: 'ob-600', label: '600 mm', detail: 'Pris de très loin, le fond devient immense.', prompt: "Super-téléobjectif 600 mm, pris de très loin : l'arrière-plan lointain paraît immense derrière le sujet" },
      { id: 'ob-1200', label: '1200 mm', detail: "L'écrasement des plans poussé à l'extrême.", prompt: "Téléobjectif extrême 1200 mm, compression maximale des plans : l'arrière-plan paraît gigantesque derrière le sujet" },
    ],
  },
  {
    id: 'angle',
    title: 'Angle de prise de vue',
    intro: "D'où regarde-t-on le sujet ? La hauteur de l'appareil change beaucoup l'impression qu'il donne.",
    help: {
      summary: 'Plongée ou contre-plongée ?',
      html: "<p>Pense à un plongeur sur son plongeoir&nbsp;: en <strong>plongée</strong>, l'appareil est au-dessus du sujet et regarde vers le bas. Le sujet paraît plus petit, écrasé. La <strong>vue drone</strong> est une plongée vue du ciel, à la verticale. En <strong>contre-plongée</strong>, c'est l'inverse&nbsp;: l'appareil est en dessous et regarde vers le haut, le sujet paraît immense et imposant.</p><p>La <strong>vue frontale</strong> est prise de face, à hauteur du sujet, et la <strong>vue latérale</strong> de profil.</p>",
    },
    items: [
      { id: 'an-frontale', label: 'Vue frontale', detail: 'De face, à hauteur du sujet.', prompt: "Vue de face, appareil à hauteur du sujet" },
      { id: 'an-contreplongee', label: 'Contre-plongée', detail: "Vu d'en bas : le sujet paraît immense.", prompt: "Vue en contre-plongée, depuis le sol vers le haut : le sujet paraît immense et imposant" },
      { id: 'an-drone', label: 'Plongée / Drone', detail: "Vu d'en haut, comme depuis le ciel.", prompt: "Vue en plongée depuis un drone, vue aérienne du dessus" },
      { id: 'an-laterale', label: 'Vue latérale', detail: 'De profil, sur le côté.', prompt: "Vue de profil, sur le côté du sujet" },
    ],
  },
  {
    id: 'format',
    title: "Format de l'image",
    intro: "La forme du cadre : plus haut que large, carré ou plus large que haut.",
    help: {
      summary: 'Que veulent dire 9:16, 3:2 ou 16:9 ?',
      html: "<p>Le format se note <strong>largeur&nbsp;:&nbsp;hauteur</strong>. En 16:9, l'image fait 16 parts de large pour 9 parts de haut, comme un écran de télévision.</p><ul><li><strong>Portrait</strong>, plus haut que large&nbsp;: écran de téléphone, story, affiche.</li><li><strong>Carré</strong> (1:1)&nbsp;: publication sur les réseaux sociaux.</li><li><strong>Paysage</strong>, plus large que haut&nbsp;: photo classique, écran, cinéma, bannière.</li></ul><p>Beaucoup d'outils ont un réglage de format à part. Dans Midjourney, il s'écrit <kbd>--ar 16:9</kbd> à la fin du prompt&nbsp;: coche la case en bas de page pour l'ajouter automatiquement.</p>",
    },
    items: [
      { id: 'fo-1-2', ratio: '1:2', label: 'Portrait 1:2', detail: 'Très vertical, bannière.', prompt: "Format portrait très vertical, ratio 1:2" },
      { id: 'fo-9-16', ratio: '9:16', label: 'Portrait 9:16', detail: 'Écran de téléphone, story.', prompt: "Format portrait 9:16, comme un écran de téléphone" },
      { id: 'fo-2-3', ratio: '2:3', label: 'Portrait 2:3', detail: 'Photo verticale, affiche.', prompt: "Format portrait 2:3" },
      { id: 'fo-3-4', ratio: '3:4', label: 'Portrait 3:4', detail: 'Photo de téléphone verticale.', prompt: "Format portrait 3:4" },
      { id: 'fo-5-6', ratio: '5:6', label: 'Portrait 5:6', detail: 'Presque carré.', prompt: "Format portrait 5:6, presque carré" },
      { id: 'fo-1-1', ratio: '1:1', label: 'Carré 1:1', detail: 'Réseaux sociaux.', prompt: "Format carré 1:1" },
      { id: 'fo-6-5', ratio: '6:5', label: 'Paysage 6:5', detail: 'Presque carré.', prompt: "Format paysage 6:5, presque carré" },
      { id: 'fo-4-3', ratio: '4:3', label: 'Paysage 4:3', detail: 'Tablette, appareil compact.', prompt: "Format paysage 4:3" },
      { id: 'fo-3-2', ratio: '3:2', label: 'Paysage 3:2', detail: 'Photo classique 24×36.', prompt: "Format paysage 3:2, comme une photo classique" },
      { id: 'fo-16-9', ratio: '16:9', label: 'Paysage 16:9', detail: 'Écran de télévision, vidéo.', prompt: "Format paysage 16:9, comme un écran de télévision" },
      { id: 'fo-2-1', ratio: '2:1', label: 'Paysage 2:1', detail: 'Panoramique, bannière.', prompt: "Format panoramique 2:1" },
    ],
  },
  {
    id: 'couleurs',
    title: 'Couleurs',
    intro: "La palette générale de l'image.",
    items: [
      { id: 'co-chaud', label: 'Chaud', prompt: "Palette de couleurs chaudes : orangés, rouges et jaunes dorés" },
      { id: 'co-froid', label: 'Froid', prompt: "Palette de couleurs froides : bleus, verts et violets" },
      { id: 'co-nb', label: 'Noir & blanc', prompt: "En noir et blanc, avec des contrastes marqués" },
    ],
  },
  {
    id: 'moment',
    title: 'Moment de la journée',
    intro: "L'heure change la lumière : sa couleur, sa direction et la longueur des ombres.",
    items: [
      { id: 'mo-soleil', label: 'Lever ou coucher du soleil', prompt: "Au lever ou au coucher du soleil, lumière dorée et rasante" },
      { id: 'mo-midi', label: 'Midi', prompt: "En plein midi, lumière vive du soleil au zénith, ombres courtes" },
      { id: 'mo-minuit', label: 'Minuit', prompt: "En pleine nuit, vers minuit, sous la lumière de la lune" },
    ],
  },
];

const STORAGE_KEY = 'iagora-compose-image-v1';
const PLACEHOLDER = /\[[^\]]*\]/g;

const state = { selected: {}, texts: {}, ar: false, no: '' };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) Object.assign(state, saved);
  } catch (e) { /* stockage indisponible : on repart de zéro */ }
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignoré */ }
}

const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c) node.append(c);
  return node;
};

function renderCategory(cat, index) {
  const section = el('section', { class: 'card category', id: cat.id, 'aria-labelledby': `${cat.id}-title` });
  section.append(
    el('div', { class: 'num', html: `Catégorie <b>${index + 1}</b>` }),
    el('h2', { id: `${cat.id}-title`, text: cat.title }),
    el('p', { class: 'intro', text: cat.intro }),
  );

  if (cat.help) {
    const body = el('div', { class: 'help-body', html: cat.help.html });
    if (cat.help.image) {
      body.append(el('figure', { class: 'help-figure' }, [
        el('img', { src: cat.help.image.src, alt: cat.help.image.alt, loading: 'lazy' }),
        el('figcaption', { text: cat.help.image.caption }),
      ]));
    }
    section.append(el('details', { class: 'help' }, [el('summary', { text: cat.help.summary }), body]));
  }

  const grid = el('div', { class: 'thumbs' + (cat.id === 'format' ? ' thumbs-format' : ''), role: 'radiogroup', 'aria-labelledby': `${cat.id}-title` });
  for (const item of cat.items) {
    const input = el('input', { type: 'radio', name: cat.id, value: item.id, id: `opt-${item.id}`, class: 'sr-only' });
    if (state.selected[cat.id] === item.id) input.checked = true;
    input.addEventListener('change', () => select(cat, item));
    const pic = el('span', { class: 'thumb-pic' }, [
      el('img', { src: `images/${item.id}.jpg`, alt: '', loading: 'lazy' }),
    ]);
    if (item.ratio) pic.append(el('span', { class: 'ratio-badge', text: item.ratio }));
    grid.append(el('label', { class: 'thumb', for: `opt-${item.id}` }, [
      input,
      pic,
      el('span', { class: 'thumb-label', text: item.label }),
      item.detail ? el('span', { class: 'thumb-detail', text: item.detail }) : null,
    ]));
  }
  section.append(grid);

  const fieldId = `text-${cat.id}`;
  const textarea = el('textarea', { id: fieldId, rows: '2', placeholder: 'Choisis une vignette, ou écris directement ton texte ici.' });
  textarea.value = state.texts[cat.id] || '';
  textarea.addEventListener('input', () => {
    state.texts[cat.id] = textarea.value;
    update();
  });
  const clear = el('button', { type: 'button', class: 'link-btn', text: 'Effacer' });
  clear.addEventListener('click', () => {
    delete state.selected[cat.id];
    delete state.texts[cat.id];
    textarea.value = '';
    section.querySelectorAll('input[type=radio]').forEach((r) => { r.checked = false; });
    update();
  });
  section.append(el('div', { class: 'field' }, [
    el('div', { class: 'field-head' }, [
      el('label', { for: fieldId, text: 'Texte pour le prompt' }),
      clear,
    ]),
    textarea,
  ]));
  return section;
}

function select(cat, item) {
  state.selected[cat.id] = item.id;
  state.texts[cat.id] = item.prompt;
  const textarea = document.getElementById(`text-${cat.id}`);
  textarea.value = item.prompt;
  update();
}

function selectedRatio() {
  const fmt = CATEGORIES.find((c) => c.id === 'format');
  const item = fmt.items.find((i) => i.id === state.selected.format);
  return item ? item.ratio : null;
}

function buildPrompt() {
  const parts = CATEGORIES
    .map((c) => (state.texts[c.id] || '').trim().replace(/[\s.;,]+$/, ''))
    .filter(Boolean);
  let prompt = parts.length ? parts.join('. ') + '.' : '';
  const ratio = selectedRatio();
  if (state.ar && ratio && prompt) prompt += ` --ar ${ratio}`;
  const no = (state.no || '').trim().replace(/^--no\s*/, '');
  if (no && prompt) prompt += ` --no ${no}`;
  return prompt;
}

function update() {
  const filled = CATEGORIES.filter((c) => (state.texts[c.id] || '').trim()).length;
  const total = CATEGORIES.length;
  const prompt = buildPrompt();

  for (const c of CATEGORIES) {
    document.getElementById(c.id).classList.toggle('is-done', Boolean((state.texts[c.id] || '').trim()));
  }

  const out = document.getElementById('prompt-output');
  out.replaceChildren();
  if (!prompt) {
    out.classList.add('is-empty');
    out.textContent = 'Ton prompt apparaîtra ici dès ta première vignette choisie.';
  } else {
    out.classList.remove('is-empty');
    let last = 0;
    for (const m of prompt.matchAll(PLACEHOLDER)) {
      out.append(prompt.slice(last, m.index), el('mark', { text: m[0] }));
      last = m.index + m[0].length;
    }
    out.append(prompt.slice(last));
  }

  const todo = (prompt.match(PLACEHOLDER) || []).length;
  const todoEl = document.getElementById('prompt-todo');
  todoEl.hidden = todo === 0;
  todoEl.textContent = todo === 1
    ? '1 passage entre crochets reste à compléter avec ta propre idée.'
    : `${todo} passages entre crochets restent à compléter avec ta propre idée.`;

  const progress = filled === total ? 'Toutes les catégories sont remplies.' : `${filled} catégorie${filled > 1 ? 's' : ''} sur ${total} remplie${filled > 1 ? 's' : ''}.`;
  document.getElementById('progress').textContent = progress;
  document.getElementById('dock-count').innerHTML = `<b>${filled}</b>/${total} catégories`;

  const ratio = selectedRatio();
  const arToggle = document.getElementById('ar-toggle');
  arToggle.checked = state.ar;
  document.getElementById('ar-preview').textContent = ratio ? `--ar ${ratio}` : '--ar';

  ['copy', 'dock-copy'].forEach((id) => { document.getElementById(id).disabled = !prompt; });
  save();
}

async function copyPrompt(button) {
  const prompt = buildPrompt();
  if (!prompt) return;
  const label = button.textContent;
  try {
    await navigator.clipboard.writeText(prompt);
    button.textContent = 'Copié !';
  } catch (e) {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById('prompt-output'));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    button.textContent = 'Texte sélectionné : Ctrl+C';
  }
  button.classList.add('copied');
  setTimeout(() => { button.textContent = label; button.classList.remove('copied'); }, 2200);
}

function init() {
  load();
  const root = document.getElementById('categories');
  CATEGORIES.forEach((cat, i) => root.append(renderCategory(cat, i)));

  document.getElementById('copy').addEventListener('click', (e) => copyPrompt(e.currentTarget));
  document.getElementById('dock-copy').addEventListener('click', (e) => copyPrompt(e.currentTarget));
  document.getElementById('ar-toggle').addEventListener('change', (e) => { state.ar = e.target.checked; update(); });
  const noInput = document.getElementById('no-input');
  noInput.value = state.no || '';
  noInput.addEventListener('input', () => { state.no = noInput.value; update(); });

  const reset = document.getElementById('reset');
  reset.addEventListener('click', () => {
    if (reset.dataset.confirm !== 'yes') {
      reset.dataset.confirm = 'yes';
      reset.textContent = 'Sûr ? Clique encore';
      setTimeout(() => { reset.dataset.confirm = ''; reset.textContent = 'Tout recommencer'; }, 3000);
      return;
    }
    reset.dataset.confirm = '';
    reset.textContent = 'Tout recommencer';
    state.selected = {};
    state.texts = {};
    state.no = '';
    document.getElementById('no-input').value = '';
    document.querySelectorAll('.category input[type=radio]').forEach((r) => { r.checked = false; });
    document.querySelectorAll('.category textarea').forEach((t) => { t.value = ''; });
    update();
    document.getElementById('premier-plan').scrollIntoView({ behavior: 'smooth' });
  });

  // Le bandeau du bas se cache quand le prompt complet est à l'écran.
  const dock = document.getElementById('dock');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => dock.classList.toggle('is-hidden', entry.isIntersecting))
      .observe(document.getElementById('prompt'));
  }

  update();
}

init();
