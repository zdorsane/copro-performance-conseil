# Copro Performance Conseil — site web

Site vitrine pour un cabinet de **conseil indépendant en copropriété**.
HTML / CSS / JavaScript natifs, **aucune dépendance, aucun build**.

---

## Dépôt et mise en ligne

| | |
|---|---|
| **Site en ligne** | <https://copro-site.vercel.app> |
| **Dépôt** | <https://github.com/zdorsane/copro-performance-conseil> |
| **Projet Vercel** | `dorsanes-projects/copro-site` |
| **Déploiement** | automatique — un `git push` sur `main` met le site à jour |

Le dépôt GitHub est **connecté au projet Vercel**. Le cycle de travail se
résume donc à :

    git add -A
    git commit -m "Description du changement"
    git push

Vercel reconstruit et publie dans la foulée. Aucune commande de déploiement
à lancer à la main.

---


## Aperçu

<p align="center">
  <img src="docs/captures/accueil-hero.webp" alt="Page d'accueil : le calque de relevé se dessine sur la photo de façade" width="100%">
</p>

L'accueil. Un calque d'architecte se dessine sur la photo — équerres de
cadrage, cotation en laiton, niveaux, points de relevé, annotations — pendant
qu'une ligne de balayage remonte la façade. C'est la promesse du cabinet,
jouée littéralement : lire un immeuble comme un architecte lit un plan.

| | |
|:--|:--|
| <img src="docs/captures/illustrations.webp" alt="Cartes de prestation avec leurs illustrations au trait" width="100%"> | <img src="docs/captures/pieces.webp" alt="Les cinq pièces d'une mission déployées en éventail" width="100%"> |
| **Cinq illustrations dessinées pour le site.** Aucune banque d'images : elles sont écrites en SVG dans le HTML, ce qui permet de les tracer trait par trait à l'entrée dans le champ. | **Les pièces d'une mission.** Le dossier s'ouvre en éventail. Chaque feuille nomme un document réellement examiné, repris de la liste transmise après le premier échange. |
| <img src="docs/captures/offres.webp" alt="Section des offres : pré-diagnostic gratuit puis grille tarifaire" width="100%"> | <img src="docs/captures/methode.webp" alt="Les cinq étapes de la méthode reliées par un rail qui se remplit" width="100%"> |
| **Les offres, annoncées d'emblée.** Le pré-diagnostic gratuit, puis la grille : audit à partir de 400 €, suivi mensuel à partir de 80 €/mois. Pas de plaquette à demander. | **La méthode en cinq étapes.** Un rail vertical se remplit au fil du défilement, avec un repère qui progresse : les étapes se lisent comme un parcours, pas comme une liste. |

| | |
|:--|:--|
| <img src="docs/captures/page-prestation.webp" alt="Page prestation : illustration en colonne collante" width="100%"> | <img src="docs/captures/mobile.webp" alt="Le site sur mobile" width="300"> |
| **Une page prestation.** L'illustration reste en colonne collante : elle accompagne toute la lecture du bloc, du problème jusqu'à l'étape suivante. | **Sur mobile.** Le relevé et ses annotations tiennent dans le cadre ; l'éventail de pièces bascule en grille à plat pour rester lisible. |

> Captures prises sur <https://copro-site.vercel.app>. Toutes les animations
> s'effacent si le visiteur a demandé moins de mouvement
> (`prefers-reduced-motion`) : l'état final s'affiche alors directement, sans
> qu'aucun contenu ne soit masqué.

---


## Démarrer

Le site est statique : il suffit d'ouvrir `index.html` dans un navigateur.

Pour un aperçu dans les conditions réelles (chemins absolus, `sitemap.xml`,
`robots.txt`), lancer un serveur local :

```bash
npx serve .          # ou
python -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

> Le dossier du projet contient un `&` dans son nom. Sous Windows, si un outil en
> ligne de commande s'en étrangle, encadrer le chemin de guillemets ou utiliser
> `-LiteralPath` en PowerShell.

---

## Structure

```
.
├── index.html                      Accueil (11 sections)
├── services.html                   Prestations — Problème / Intervention / Bénéfice / CTA
├── approche.html                   Méthode en 5 étapes
├── a-propos.html                   Vision, mission, indépendance
├── faq.html                        FAQ complète, 4 thèmes, 21 questions
├── contact.html                    Formulaire + coordonnées
├── mentions-legales.html           ⚠️ à compléter
├── politique-confidentialite.html  ⚠️ à compléter
├── plan-du-site.html
├── 404.html
│
├── assets/
│   ├── css/style.css               Design system complet, 17 sections commentées
│   ├── css/signature.css           Calque « Le Relevé » — 14 sections commentées
│   ├── js/main.js                  ~330 lignes, vanilla, sans dépendance
│   ├── js/signature.js             ~370 lignes, vanilla, sans dépendance
│   └── img/                        SVG + og-image.jpg + icônes
│
├── robots.txt
├── sitemap.xml
├── site.webmanifest
│
├── docs/captures/                  Captures d'écran du README (hors déploiement)
│
├── CONTENU-A-VALIDER.md            ⚠️ À LIRE EN PREMIER
├── IMAGE-BRIEFS.md                 Direction artistique et briefs photo
└── README.md
```

---

## ⚠️ Avant toute mise en production

Le dossier de départ était vide. Tout le **contenu marketing** a été rédigé de
zéro ; **aucun fait n'a été inventé**.

Les données factuelles ont ensuite été alignées sur le site existant du cabinet
(`coproperformanceconseil.fr`) : domaine, e-mail, téléphone, zone d'intervention,
noms des prestations et tarifs réels.

### Déjà réglé

- ✅ Domaine réel appliqué partout (canonical, Open Graph, JSON-LD, sitemap, robots)
- ✅ Coordonnées réelles : `contact@coproperformanceconseil.fr` · `06 17 47 08 57`
- ✅ Tarifs réels : gratuit / à partir de 400 € / à partir de 80 €/mois
- ✅ Indépendance confirmée par le site du cabinet — pastilles levées

### Reste bloquant

1. **Compléter les deux pages légales.** Elles sont **obligatoires**
   (art. 6-III de la LCEN) et incomplètes : SIRET, forme juridique, directeur
   de publication, hébergeur. Le site actuel du cabinet ne les publie pas non
   plus — c'est un risque à traiter, pas à reconduire.
2. **Brancher le formulaire de contact** (voir plus bas) : il n'envoie rien.
3. **Lire `CONTENU-A-VALIDER.md`** pour les points restants.

Les éléments à confirmer sont visibles dans le site sous forme de pastilles
`À valider`. Pour les masquer pendant une démonstration :

```html
<body class="hide-flags">
```

---

## Brancher le formulaire

Le formulaire de `contact.html` **n'envoie rien** en l'état : son attribut
`action` vaut `#`. Un message d'erreur explicite s'affiche si on le soumet,
plutôt qu'un faux message de succès.

Le JavaScript gère déjà la validation, l'état de chargement, les messages de
retour, le piège à robots et le consentement RGPD. Il ne reste qu'à fournir une
destination.

### Option A — service tiers, sans serveur (le plus simple)

Créer un formulaire chez [Formspree](https://formspree.io),
[Web3Forms](https://web3forms.com) ou [Formcarry](https://formcarry.com), puis :

```html
<form class="form" data-contact-form action="https://formspree.io/f/VOTRE_ID" method="post" novalidate>
```

C'est tout : `main.js` détecte l'`action` et envoie en `fetch` + `FormData`,
en attendant une réponse HTTP 2xx.

> Vérifier que le prestataire retenu héberge dans l'UE, ou documenter le
> transfert dans la politique de confidentialité (§ 6).

### Option B — endpoint maison (PHP, Node…)

Même principe : renseigner `action` avec l'URL de l'endpoint. Celui-ci doit
accepter un `POST` multipart et répondre avec un code 2xx.

Champs envoyés : `prenom`, `nom`, `email`, `telephone`, `qualite`, `sujet`,
`lots`, `message`, `consentement`, plus `_gotcha` (champ piège — si rempli,
la requête vient d'un robot et doit être ignorée côté serveur également).

### Option C — lien e-mail uniquement

Si aucun back-end n'est souhaité dans l'immédiat, supprimer le formulaire et ne
conserver que le panneau de coordonnées, déjà présent à droite.

---

## Design system

Tout est piloté par des variables CSS dans `assets/css/style.css` (§ 01).
Changer l'identité visuelle ne demande pas de toucher au reste.

```css
:root {
  --ink-900: #071320;   /* fonds sombres          */
  --paper:   #FBFAF7;   /* fond général           */
  --accent:  #17614F;   /* vert conseil           */
  --brass:   #B9924F;   /* micro-accent premium   */
  --container: 1200px;
  --header-h: 76px;
}
```

**Typographie** — pile système (`Inter` si installée, sinon `system-ui`).
Choix délibéré : pas de Google Fonts en CDN, dont l'usage a été jugé
problématique au regard du RGPD par plusieurs autorités européennes, et qui
coûterait une requête bloquante.

Pour utiliser une police de marque, l'auto-héberger :

```css
@font-face {
  font-family: "Inter";
  src: url("../fonts/inter-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
```

Puis déposer le fichier dans `assets/fonts/`. La variable `--font-sans` la prend
en compte automatiquement.

**Échelle typographique** — entièrement fluide via `clamp()`. Aucun texte n'a de
taille fixe : la mise en page s'adapte de 320 px à 2560 px sans point de rupture
visible.

---

## JavaScript

`assets/js/main.js`, chargé en `defer`, sans dépendance. Quatorze modules :

| Module | Rôle |
|---|---|
| `initHeader` | État « collé » du header au scroll (rAF, listener passif) |
| `initMobileNav` | Menu mobile : ARIA, verrou du scroll, fermeture à `Échap` |
| `initStagger` | Décalage automatique en cascade des enfants |
| `initSplitText` | Découpe les titres en mots pour une révélation en cascade |
| `initReveals` | Apparitions au scroll via `IntersectionObserver` |
| `initMedia` | Photos : chargement progressif + voile de révélation |
| `initCheckLists` | Listes à puces en cascade |
| `initSteps` | Surlignage de l'étape traversée dans la méthodologie |
| `initFaq` | Accordéon accessible, ouverture par ancre `#id` |
| `initParallax` | Parallaxe douce, désactivée sous 940 px |
| `initScrollProgress` | Barre de progression de lecture en haut de page |
| `initSectionCount` | Repère de section flottant (accueil, desktop) |
| `initForm` | Validation, états, envoi, anti-spam |
| `initYear` | Année courante dans les pieds de page |

**Sans JavaScript**, le site reste lisible et navigable : seules les animations
et l'accordéon FAQ perdent leur interactivité.

### Animations au scroll

Sept effets, tous en `transform`/`opacity` uniquement, tous pilotés par
`IntersectionObserver` ou `requestAnimationFrame` avec des écouteurs passifs :

1. **Barre de progression** — filet dégradé de 2 px en haut de page
2. **Titres mot à mot** — chaque mot monte derrière un masque, en cascade
3. **Voile de révélation des photos** — un rideau se retire verticalement
4. **Chargement progressif** — miniature floutée puis fondu de la photo nette
5. **Parallaxe** — hero et bandeau photo, désactivée sous 940 px
6. **Étape active** — le numéro se colore et une barre se déploie au passage
7. **Repère de section** — pastille flottante « 04 / 07 · Pourquoi nous »

`prefers-reduced-motion: reduce` neutralise l'intégralité de ces effets sans
jamais masquer de contenu — vérifié page par page (voir « Vérifications »).

> **Le découpage des titres ne modifie pas le texte.** Chaque mot est enveloppé
> dans `<span class="w"><span class="w-i">`, les éléments inline existants
> (`.serif-em`, liens) sont préservés, et le texte restitué est identique au
> texte source. C'est contrôlé automatiquement sur les 27 titres concernés.

---

## Le calque « Le Relevé »

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
| **Trame technique** | Plusieurs sections | Papier millimétré très pâle, en fond |
| **Grain** | Toutes les pages | Voile de bruit à 3 % — sensation papier plutôt qu'écran |
| **Rideau d'ouverture** | Toutes les pages | La marque se trace, **une seule fois par session** |
| **Relief au pointeur** | Cartes | Inclinaison de 3° et lueur qui suit le curseur |
| **Projecteur** | Sections sombres | Halo qui suit le curseur |
| **Boutons magnétiques** | CTA principaux | Décalage de 6 px maximum vers le curseur |
| **Compteurs** | Accueil | Chiffres animés — valeurs écrites en clair dans le HTML |

### Principes tenus

- **Aucune dépendance ajoutée.** Toujours zéro build, zéro bibliothèque.
- **Aucune règle de `style.css` modifiée.** Le calque n'ajoute que des règles
  nouvelles. Supprimer les deux lignes qui l'appellent dans le `<head>` rend le
  site à son état antérieur, intact.
- **Aucun fait inventé.** Les libellés des pièces sont ceux de la FAQ ; les
  quatre compteurs (5 prestations, 5 étapes, 1 interlocuteur, 0 commission)
  reprennent des affirmations déjà présentes sur le site.
- **Tout le décor est `aria-hidden`.** Aucune information n'est portée
  exclusivement par un élément décoratif.
- **`prefers-reduced-motion: reduce` pose l'état final**, sans rien masquer :
  pas de rideau, tracés complets, éventail déployé, chiffres justes.

### Illustrations : aucune banque d'images

Les cinq illustrations sont **dessinées à la main en SVG**, directement dans le
HTML — ce qui permet de les animer trait par trait. Elles partagent une grammaire
commune : `viewBox` de 300 × 168, trait de 1,7 px, vert de marque, laiton pour
le point relevé, trame technique en fond.

| Prestation | Ce que l'illustration montre |
|---|---|
| Audit complet | L'immeuble mis sous cotation, puis examiné à la loupe |
| Analyse des charges | La même dépense suivie d'exercice en exercice |
| Renégociation des contrats | Les pièces relues, la clause repérée, l'échéance |
| Optimisation | Les leviers classés par gain et par effort |
| Accompagnement | La table du conseil syndical, vue d'en haut |

Pour en modifier une, chercher `class="illu"` dans `index.html` ou
`services.html`. Les attributs pilotent l'animation :

- `data-draw` — le trait se dessine ; sa longueur est mesurée en JS
- `data-pop` — l'élément plein apparaît après le trait
- `data-live` — le groupe s'anime au survol de la carte
- `style="--i:N"` — l'ordre dans lequel les traits se posent

**Aucune licence à surveiller** : ces dessins n'existent nulle part ailleurs.

---

## Accessibilité

Conçu en visant WCAG 2.1 niveau AA :

- Structure sémantique (`header`, `nav`, `main`, `section`, `article`, `footer`)
- Lien d'évitement, `aria-current`, `aria-expanded`, `aria-controls`, `role="region"`
- Navigation clavier complète, `:focus-visible` visible sur fond clair et sombre
- Contrastes vérifiés sur les deux fonds
- `prefers-reduced-motion` respecté : toutes les animations sont neutralisées
- `alt` sur chaque image porteuse de sens, `alt=""` sur le décoratif
- Zones tactiles ≥ 44 px, formulaire entièrement étiqueté

---

## SEO

- `<title>` et `<meta name="description">` uniques par page
- `<link rel="canonical">` sur chaque page
- Open Graph + Twitter Card complets, image 1200 × 630 fournie
- JSON-LD : `ProfessionalService`, `FAQPage` (×2), `HowTo`, `BreadcrumbList`, `ContactPage`
- `sitemap.xml` et `robots.txt`
- Fil d'Ariane sur les pages intérieures
- Un seul `<h1>` par page, hiérarchie de titres continue
- Maillage interne entre accueil, services, approche et FAQ

**Intentions de recherche visées** : conseil copropriété · audit copropriété ·
analyse charges copropriété · conseil syndical · optimisation charges copropriété ·
accompagnement conseil syndical · analyse contrats copropriété.

Ces expressions sont intégrées naturellement dans les titres, les questions de
FAQ et le corps de texte — sans bourrage.

---

## Photographies

Trois photographies **CC0** (domaine public, usage commercial libre) issues de
Wikimedia Commons, sélectionnées après examen visuel de quatorze candidates.
Onze ont été écartées : architecture non française, personne identifiable,
bâtiment dégradé, colorimétrie incompatible.

Chacune est déclinée en `.webp` (servi en priorité), `.jpg` (repli) et
`-tiny.jpg` (miniature floutée pendant le chargement). Toutes sous 170 Ko.

Sources tracées dans [`CREDITS-PHOTOS.md`](CREDITS-PHOTOS.md), procédure de
remplacement dans [`IMAGE-BRIEFS.md`](IMAGE-BRIEFS.md).

**Aucune photographie de personne** n'est utilisée, et aucune ne doit l'être
sans accord écrit de la personne concernée.

---

## Performance

- Aucune dépendance externe : zéro requête tierce
- CSS ~46 Ko, JS ~19 Ko, non minifiés (lisibles pour la maintenance)
- Photos en WebP avec repli JPEG, toutes sous 170 Ko
- `width`/`height` sur toutes les images → CLS proche de zéro
- `fetchpriority="high"` sur le seul visuel du hero, `loading="lazy"` ailleurs
- Animations en `transform` et `opacity` uniquement, listeners de scroll passifs et throttlés en `requestAnimationFrame`

**Avant mise en production** : minifier CSS et JS, activer gzip/brotli côté
serveur, servir en HTTP/2, et poser des en-têtes de cache longs sur `/assets/`.

---

## Déploiement en cours

Le site est en ligne sur Vercel, en accès public.

### Lien à transmettre au client

**https://copro-site.vercel.app**

C'est l'URL stable du projet : elle pointe toujours vers le dernier déploiement
de production. À privilégier sur les URL longues à identifiant
(`copro-site-xxxxxxx-dorsanes-projects.vercel.app`), qui sont figées sur un
déploiement précis et deviennent obsolètes à la mise à jour suivante.

| Élément | Valeur |
|---|---|
| Projet Vercel | `dorsanes-projects/copro-site` |
| URL stable | `https://copro-site.vercel.app` |
| Cible | production |
| Protection SSO | désactivée (sinon le client tombe sur une page de connexion) |
| Indexation | **bloquée** via `X-Robots-Tag: noindex, nofollow` |

### Deux points avant de brancher le vrai domaine

**1. Retirer le `noindex`.** Il se trouve dans `vercel.json`, bloc
`"source": "/(.*)"`. Il évite que l'URL `.vercel.app` soit indexée en doublon de
`coproperformanceconseil.fr`, ce qui pénaliserait le référencement. Une fois le
domaine réel branché, supprimer cette entrée et redéployer — sinon **le site ne
sera jamais référencé**.

**2. `coproperformanceconseil.fr` sert déjà un autre site.** Brancher le domaine
sur Vercel le remplacera. À ne faire qu'une fois les mentions légales complétées.

### Brancher le domaine réel

    vercel domains add coproperformanceconseil.fr
    vercel alias set copro-site.vercel.app coproperformanceconseil.fr

Puis chez le registrar :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

### Redéployer après modification

Deux voies, selon que le dépôt Git est branché sur Vercel ou non.

**Voie 1 — automatique (recommandée).** Si le dépôt GitHub est connecté au
projet Vercel, un `git push` sur `main` déclenche seul un déploiement de
production. Rien d'autre à faire.

**Voie 2 — manuelle, via le CLI.** Le déploiement se fait depuis une **copie**
du dossier : le `&` de `client&` fait échouer le CLI Vercel sans message
d'erreur explicite.

    DEPLOY=C:/Users/DELL/AppData/Local/Temp/copro-deploy
    rm -rf "$DEPLOY" && mkdir -p "$DEPLOY"
    cp -r *.html *.txt *.xml *.webmanifest vercel.json .vercelignore assets README.md "$DEPLOY/"
    cd "$DEPLOY"
    vercel link --yes --project copro-site
    vercel deploy --prod --yes

Vérifier ensuite que la mise à jour est bien en ligne :

    curl -s https://copro-site.vercel.app | grep -c signature.css

---

## Déploiement — autres hébergeurs

Un hébergement statique suffit — aucun PHP, aucun Node côté serveur.

| Plateforme | Marche à suivre |
|---|---|
| **Netlify** | Glisser-déposer le dossier, ou connecter un dépôt Git |
| **Vercel** | `vercel --prod` à la racine |
| **GitHub Pages** | Pousser sur une branche, activer Pages dans les réglages |
| **OVH / Infomaniak / o2switch** | Envoyer le contenu du dossier en FTP dans `www/` |

Points à ne pas oublier :

1. Activer **HTTPS** (Let's Encrypt est gratuit chez tous ces hébergeurs)
2. Rediriger `http://` → `https://` et forcer une seule version du domaine (avec ou sans `www`)
3. Configurer la page d'erreur 404 vers `404.html`
4. Renseigner l'hébergeur dans les mentions légales — c'est une obligation légale
5. Soumettre `sitemap.xml` dans la Google Search Console

---

## Faire évoluer le site

Le contenu a été volontairement conçu pour tenir **sans preuves chiffrées**.
Quand le cabinet disposera de matière réelle, ces ajouts s'intègrent sans refonte :

| Ajout | Où |
|---|---|
| Témoignages clients (avec accord écrit) | Nouvelle section entre « Engagements » et « FAQ » sur l'accueil |
| Chiffres réels (missions, ancienneté) | Section « Engagements » de l'accueil, en remplacement ou complément |
| Études de cas anonymisées | Nouvelle page `realisations.html`, à ajouter au menu et au sitemap |
| Blog / ressources | Dossier `/ressources/` — excellent levier SEO sur les requêtes longue traîne |
| Grille tarifaire | Page `services.html`, après chaque bloc de prestation |
| Portrait du fondateur | `a-propos.html`, section actuellement en attente |

---

## Choix techniques assumés

**Pourquoi du HTML statique plutôt que Next.js ou WordPress ?**
Un site vitrine de neuf pages n'a pas besoin d'un framework. Ce choix apporte :
zéro dépendance à mettre à jour, zéro faille applicative, un chargement
quasi instantané, un hébergement à coût nul ou négligeable, et un contrôle total
du balisage SEO. Le contenu est structuré pour être repris tel quel dans un CMS
si le besoin se présente.

**Pourquoi des pastilles « À valider » visibles dans le site ?**
Pour qu'aucune affirmation non vérifiée ne parte en production par inadvertance.
Elles se retirent en une ligne (voir plus haut).

**Pourquoi pas de bandeau cookies ?**
Parce que le site n'en dépose aucun. Ajouter un bandeau alors qu'il n'y a rien à
consentir dégraderait l'expérience sans bénéfice juridique. Si un outil de
statistiques est ajouté plus tard, la question se reposera — la politique de
confidentialité le documente déjà (§ 7).
