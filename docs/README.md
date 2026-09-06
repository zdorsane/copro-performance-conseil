# Documentation

Toute la documentation du projet est ici. Le [`README.md`](../README.md) à la
racine reste le point de départ : il présente le site, son organisation et les
gestes courants. Les documents ci-dessous entrent dans le détail.

---

## Par où commencer

| Vous voulez… | Lire |
|---|---|
| Comprendre le site et le prendre en main | [`../README.md`](../README.md) |
| **Vérifier que rien n'est cassé après une modification** | `python docs/verifier-le-site.py` |
| **Savoir ce qui reste à valider avant la mise en ligne** | [`CONTENU-A-VALIDER.md`](CONTENU-A-VALIDER.md) ⚠️ |
| Savoir où se trouve telle page et à quoi elle sert | [`PAGES.md`](PAGES.md) |
| Modifier une couleur, une police, un composant | [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) |
| Ajouter une page, comprendre le code | [`DEVELOPPEMENT.md`](DEVELOPPEMENT.md) |
| Mettre en ligne, brancher le domaine ou le formulaire | [`DEPLOIEMENT.md`](DEPLOIEMENT.md) |
| Connaître l'état technique du site, mesuré | [`AUDIT-SITE.md`](AUDIT-SITE.md) |
| Remplacer une photo | [`IMAGE-BRIEFS.md`](IMAGE-BRIEFS.md) · [`CREDITS-PHOTOS.md`](CREDITS-PHOTOS.md) |
| Comprendre pourquoi tel choix a été fait | [`HISTORIQUE.md`](HISTORIQUE.md) |

---

## Les documents

### Exploitation

| Fichier | Contenu |
|---|---|
| [`PAGES.md`](PAGES.md) | Inventaire des 27 pages : rang dans le parcours, rôle, gabarit, plan, maillage |
| [`DEPLOIEMENT.md`](DEPLOIEMENT.md) | Vercel, domaine, formulaire de contact, autres hébergeurs, en-têtes |
| [`CONTENU-A-VALIDER.md`](CONTENU-A-VALIDER.md) | **À lire en premier.** Chaque affirmation du site qui demande une confirmation du cabinet |

### Technique

| Fichier | Contenu |
|---|---|
| [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) | Jetons CSS, typographie, composants, calque « Le Relevé », illustrations |
| [`DEVELOPPEMENT.md`](DEVELOPPEMENT.md) | Anatomie d'une page, conventions, modules JavaScript, ajouter une page, vérifications |
| [`verifier-le-site.py`](verifier-le-site.py) | Contrôle automatique : liens, titres, canonical, sitemap, encodage. `python docs/verifier-le-site.py` |
| [`AUDIT-SITE.md`](AUDIT-SITE.md) | Audit technique du 30 août 2026 : 216 mesures de mise en page, 54 de contraste |

### Contenu et image

| Fichier | Contenu |
|---|---|
| [`IMAGE-BRIEFS.md`](IMAGE-BRIEFS.md) | Direction artistique, briefs photo, procédure de remplacement |
| [`CREDITS-PHOTOS.md`](CREDITS-PHOTOS.md) | Sources et licences des photographies (toutes CC0) |

### Mémoire du projet

| Fichier | Contenu |
|---|---|
| [`HISTORIQUE.md`](HISTORIQUE.md) | Retours reçus, modifications apportées, arbitrages — et les points restés ouverts |

---

## Les dossiers

| Dossier | Contenu |
|---|---|
| [`captures/`](captures/) | Captures d'écran utilisées par le `README.md` |
| [`exports/`](exports/) | Exports de contenu livrés au client — dont `accueil.json`, le contenu éditorial de la page d'accueil au format JSON |

---

> **Ce dossier n'est pas publié sur le site.** `.vercelignore` exclut `docs/`
> et tous les fichiers `.md` sauf le `README.md` racine : la documentation vit
> dans le dépôt, pas sur `coproperformanceconseil.fr`.
