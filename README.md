# Compose ton image — atelier IAgora

Petit site statique qui aide à écrire, en français, le prompt d'une image générée par IA.

Pour chaque catégorie (premier plan, arrière-plan, style, type de plan, place du sujet, objectif,
angle, format, couleurs, moment de la journée), on choisit **une vignette**. Le texte
correspondant remplit un champ modifiable, et tous les champs sont assemblés en bas de page
dans un prompt prêt à copier (options `--ar` et `--no` pour Midjourney), avec une section d'astuces Midjourney.

## Lancer en local

Aucune dépendance ni étape de build :

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Déploiement : n'importe quel hébergement statique (Vercel, GitHub Pages…), racine du dépôt.

## Fichiers

| Chemin | Contenu |
| --- | --- |
| `index.html` | Structure de la page |
| `styles.css` | Styles, d'après le design system IAgora (Anton + Heebo, bleu `#3045D1`, rose `#FF50BE`) |
| `app.js` | Catégories, vignettes, textes de prompt et logique (tout se modifie dans `CATEGORIES`) |
| `images/` | Vignettes extraites du livret « Cubes Photos – Aide à la création d'images » |
| `assets/logo-iagora.png` | Logo IAgora |

Pour ajouter une vignette : déposer `images/<id>.jpg` et ajouter `{ id, label, prompt }`
dans la catégorie voulue de `app.js`. Les passages entre `[crochets]` sont signalés à
l'utilisateur comme « à compléter ».
