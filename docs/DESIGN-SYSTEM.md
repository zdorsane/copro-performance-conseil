# Design system

Tout l'habillage du site tient dans deux feuilles de style, et rien d'autre :

| Fichier | Rôle | Taille |
|---|---|---|
| `assets/css/style.css` | Le design system : jetons, composants, mise en page, responsive, impression. **17 sections numérotées.** | ~4 880 lignes |
| `assets/css/signature.css` | Le calque « Le Relevé » : direction artistique, tracés, animations. **14 sections numérotées.** | ~1 900 lignes |

`signature.css` **ne modifie aucune règle** de `style.css` : il n'ajoute que des
règles nouvelles. Supprimer les deux lignes qui l'appellent dans le `<head>`
d'une page rend cette page à son état antérieur, intacte.

---

## 1. Les jetons (`style.css` § 01)

Toute l'identité visuelle est pilotée par des variables CSS déclarées dans un
seul bloc `:root`. **Changer les couleurs de la marque ne demande de toucher à
rien d'autre.**

### Couleurs

```css
/* Encre — les fonds sombres et le texte */
--ink-900: #071320;   --ink-800: #0B1C2C;   --ink-700: #12293D;
--ink-600: #1D3B53;   --ink-400: #415769;   --ink-300: #6B8497;
--ink-200: #B4C4CF;

/* Papier — les fonds clairs */
--paper: #FBFAF7;   --paper-2: #F4F0E9;   --paper-3: #EAE4DA;

/* Vert « conseil » — sérieux, rassurant, associé à la performance */
--accent: #17614F;   --accent-hover: #0F4A3B;
--accent-soft: #E7F0EC;   --accent-border: #C3DAD1;

/* Laiton — micro-accent premium, usage parcimonieux */
--brass: #B9924F;   --brass-soft: #F5EEE1;

/* Alerte */
--danger: #A63A2B;   --danger-soft: #FBEDEA;
```

Au-dessus de ces couleurs brutes, une couche **sémantique** que les composants
sont seuls à utiliser : `--bg`, `--bg-alt`, `--surface`, `--text`,
`--text-muted`, `--text-invert`, `--border`, `--border-strong`.

> **Pour changer l'identité visuelle**, modifier les couleurs de marque.
> Ne pas modifier la couche sémantique : c'est elle qui garantit que tout
> reste cohérent.

### Typographie

Pile **système** : `Inter` si elle est installée sur la machine du visiteur,
sinon `system-ui`, puis les polices natives de chaque plateforme.

Choix délibéré : pas de Google Fonts en CDN, dont l'usage a été jugé
problématique au regard du RGPD par plusieurs autorités européennes, et qui
coûterait une requête bloquante au chargement.

Pour utiliser une police de marque, il faut **l'auto-héberger** :

```css
@font-face {
  font-family: "Inter";
  src: url("../fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
```

Déposer le fichier dans `assets/fonts/` ; la variable `--font-sans` le prend en
compte automatiquement.

### Échelle typographique

Entièrement **fluide** via `clamp()`. Aucun texte n'a de taille fixe : la mise
en page s'adapte de 320 px à 2560 px sans point de rupture visible.

| Jeton | Mobile | Bureau | Usage |
|---|---|---|---|
| `--fs-display` | 2,2 rem | 3,4 rem | Chiffre de mise en avant |
| `--fs-h1` | 1,9 rem | 2,9 rem | Titre de page (un seul par page) |
| `--fs-h2` | 1,5 rem | 2,1 rem | Titre de section |
| `--fs-h3` | 1,2 rem | 1,5 rem | Titre de carte |
| `--fs-base` | 0,97 rem | 1 rem | Corps de texte |
| `--fs-sm` | 0,845 rem | — | Mentions, légendes |
| `--fs-xs` | 0,75 rem | — | Surtitres, étiquettes |

L'échelle a été **resserrée d'environ 20 % dans le haut** après relecture : le
premier jeu montait à 59 px pour un `h1`, une échelle d'affiche. Un cabinet de
conseil se lit à une densité plus proche du document que du poster. Les valeurs
basses n'ont presque pas bougé — sur mobile, la taille était déjà juste.

### Espacement, formes, mouvement

```css
--sp-1 … --sp-9          /* 0,25 rem → 6 rem */
--section-y              /* respiration verticale d'une section, fluide */
--r-sm … --r-pill        /* rayons d'arrondi */
--shadow-xs … --shadow-lg
--container: 1200px;     --container-narrow: 780px;
--header-h: 76px;
--t-fast / --t-base / --t-slow   /* 160 / 280 / 620 ms */
```

---

## 2. Les sections de `style.css`

| § | Contenu |
|---|---|
| 01 | Tokens |
| 02 | Reset & bases |
| 03 | Typographie |
| 04 | Layout & container (`.container`, `.grid`, `.grid--2/3/4`) |
| 05 | Boutons & liens (`.btn`, `.btn--lg`, `.btn--block`, `.link-underline`) |
| 06 | Header / navigation (dont menu mobile) |
| 07 | Hero |
| 08 | Sections & composants (`.section`, `.section-head`, `.eyebrow`, `.flag`) |
| 09 | Cartes (`.value-card`, `.card`, `.noeud`) |
| 10 | Méthodologie (les cinq étapes) |
| 11 | FAQ (accordéon) |
| 12 | Formulaires |
| 13 | Footer |
| 14 | Animations & motion |
| 15 | Utilitaires (`.mt-4`, `.hide-flags`…) |
| 16 | Responsive |
| 17 | Impression |

---

## 3. Le calque « Le Relevé »

`assets/css/signature.css` + `assets/js/signature.js`.

### L'idée

Le cabinet lit un immeuble comme un architecte lit un plan. Toute la direction
artistique découle de cette phrase : tracés techniques, cotations, calques
d'analyse qui se dessinent, grain d'impression. C'est ce qui distingue le site
d'un modèle de cabinet de conseil — la mise en scène **est** la promesse
commerciale, jouée littéralement.

### Ce que le calque ajoute

| Élément | Où | Ce que c'est |
|---|---|---|
| **Relevé du hero** | Accueil | Un calque d'architecte se dessine sur la photo : équerres de cadrage, cotation en laiton, niveaux, points de relevé, annotations, balayage d'analyse |
| **Jeu d'illustrations** | Accueil + Services | Cinq dessins au trait créés pour le site, un par prestation, qui se tracent à l'entrée dans le champ |
| **Pile de pièces** | Accueil | Les cinq documents d'une mission, empilés puis déployés en éventail |
| **Frise défilante** | Accueil | Les pièces examinées, en bandeau continu |
| **Rail de méthode** | Accueil | Un fil vertical qui se remplit au défilement le long des cinq étapes |
| **Trame technique** | Plusieurs sections | Papier millimétré très pâle, en fond (`.blueprint`) |
| **Grain** | Toutes les pages | Voile de bruit à 3 % — sensation papier plutôt qu'écran |
| **Rideau d'ouverture** | Toutes les pages | La marque se trace, **une seule fois par session** |
| **Relief au pointeur** | Cartes | Inclinaison de 3° et lueur qui suit le curseur (`.tilt`) |
| **Projecteur** | Sections sombres | Halo qui suit le curseur |
| **Boutons magnétiques** | CTA principaux | Décalage de 6 px maximum vers le curseur (`.magnet`) |
| **Compteurs** | Accueil | Chiffres animés — valeurs écrites en clair dans le HTML |

### Les sections de `signature.css`

| § | Contenu | | § | Contenu |
|---|---|---|---|---|
| S1 | Jetons du calque | | S8 | Bandeau défilant |
| S2 | Grain & texture d'impression | | S9 | Tracé de méthode |
| S3 | Séquence d'ouverture | | S10 | Cartes : relief au pointeur |
| S4 | Calque d'analyse du hero | | S11 | Projecteur curseur |
| S5 | Fond calque technique | | S12 | Compteurs & chiffres |
| S6 | Illustrations au trait | | S13 | Boutons magnétiques |
| S7 | Pile de documents | | S14 | Responsive & mouvement réduit |

### Principes tenus

- **Aucune dépendance ajoutée.** Toujours zéro build, zéro bibliothèque.
- **Aucune règle de `style.css` modifiée.** Le calque n'ajoute que des règles
  nouvelles.
- **Aucun fait inventé.** Les libellés des pièces sont ceux de la FAQ ; les
  compteurs reprennent des affirmations déjà présentes sur le site.
- **Tout le décor est `aria-hidden`.** Aucune information n'est portée
  exclusivement par un élément décoratif.
- **`prefers-reduced-motion: reduce` pose l'état final**, sans rien masquer :
  pas de rideau, tracés complets, éventail déployé, chiffres justes.

---

## 4. Les illustrations : aucune banque d'images

Les cinq illustrations de prestation sont **dessinées à la main en SVG**,
directement dans le HTML — ce qui permet de les animer trait par trait. Elles
partagent une grammaire commune : `viewBox` de 300 × 168, trait de 1,7 px, vert
de marque, laiton pour le point relevé, trame technique en fond.

| Prestation | Ce que l'illustration montre |
|---|---|
| Audit complet | L'immeuble mis sous cotation, puis examiné à la loupe |
| Analyse des charges | La même dépense suivie d'exercice en exercice |
| Renégociation des contrats | Les pièces relues, la clause repérée, l'échéance |
| Optimisation | Les leviers classés par gain et par effort |
| Accompagnement | La table du conseil syndical, vue d'en haut |

Pour en modifier une, chercher `class="illu"` dans `index.html` ou
`services.html`. Les attributs pilotent l'animation :

| Attribut | Effet |
|---|---|
| `data-draw` | Le trait se dessine ; sa longueur est mesurée en JS |
| `data-pop` | L'élément plein apparaît après le trait |
| `data-live` | Le groupe s'anime au survol de la carte |
| `style="--i:N"` | L'ordre dans lequel les traits se posent |

**Aucune licence à surveiller** : ces dessins n'existent nulle part ailleurs.

Pour les photographies, voir [`CREDITS-PHOTOS.md`](CREDITS-PHOTOS.md) (sources
et licences) et [`IMAGE-BRIEFS.md`](IMAGE-BRIEFS.md) (direction artistique et
procédure de remplacement).
