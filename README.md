# Copro Performance Conseil — site web

Site vitrine du cabinet **Copro Performance Conseil**, conseil indépendant en
copropriété. 27 pages en HTML, CSS et JavaScript natifs — **aucune dépendance,
aucun build, aucune base de données**.

| | |
|---|---|
| **Site en ligne (préproduction)** | <https://copro-performance-conseil.vercel.app> |
| **Dépôt** | <https://github.com/zdorsane/copro-performance-conseil> |
| **Domaine cible** | `coproperformanceconseil.fr` — *pas encore branché* |
| **Publication** | automatique : un `git push` sur `main` met le site à jour |
| **État** | ⚠️ **Prêt techniquement, pas prêt à publier** — voir § 5 |

---

## Sommaire

1. [Aperçu](#1-aperçu)
2. [Démarrer](#2-démarrer)
3. [Organisation du projet](#3-organisation-du-projet)
4. [Les 27 pages, dans l'ordre](#4-les-27-pages-dans-lordre)
5. [Avant la mise en ligne ⚠️](#5-avant-la-mise-en-ligne)
6. [Modifier le site](#6-modifier-le-site)
7. [Déploiement](#7-déploiement)
8. [Qualité : accessibilité, SEO, performance](#8-qualité--accessibilité-seo-performance)
9. [Documentation](#9-documentation)
10. [Choix techniques assumés](#10-choix-techniques-assumés)

---

## 1. Aperçu

<p align="center">
  <img src="docs/captures/selecteur.webp" alt="Sélecteur de profil en tête de la page d'accueil" width="100%">
</p>

**L'accueil aiguille, il n'expose pas.** Le choix du profil est posé comme un
**schéma** : un nœud racine « Vous êtes… » qui se ramifie vers ses destinations.
Le visiteur se situe d'un coup d'œil, sans lire. Ce sont de vrais liens, pas des
boutons JavaScript : crawlables, ouvrables dans un nouvel onglet, utilisables au
clavier.

| | |
|:--|:--|
| <img src="docs/captures/accueil-hero.webp" alt="Le hero et son calque de relevé, sous le sélecteur" width="100%"> | <img src="docs/captures/page-profil.webp" alt="Une page profil : conseil syndical" width="100%"> |
| **Le hero, sous le sélecteur.** Le calque d'architecte se dessine sur la photo — cotation en laiton, niveaux, annotations, balayage. | **Une page profil.** Problème vécu, bénéfices, prestations retenues, FAQ ciblée. Le bouton final pré-remplit le formulaire de contact. |
| <img src="docs/captures/ressources.webp" alt="La page Ressources" width="100%"> | <img src="docs/captures/mobile.webp" alt="Le site sur mobile" width="100%"> |
| **Les ressources.** Treize articles de fond : le levier de référencement sur les requêtes précises. | **Sur mobile.** Échelle typographique fluide de 320 px à 2560 px, sans point de rupture visible. |

---

## 2. Démarrer

Le site est statique : **ouvrir `index.html` dans un navigateur suffit** pour
regarder.

Pour un aperçu dans les conditions réelles (chemins absolus, `sitemap.xml`,
`robots.txt`), lancer un serveur local :

```bash
npx serve .          # ou
python -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

> **Note Windows.** Le dossier du projet contient un `&` dans son nom. Si un
> outil en ligne de commande s'en étrangle, encadrer le chemin de guillemets, ou
> utiliser `-LiteralPath` en PowerShell.

---

## 3. Organisation du projet

```
copro-performance-conseil/
│
├── index.html                  ← LA PAGE D'ACCUEIL, servie sur le domaine :
│                                  coproperformanceconseil.fr/
├── 404.html                    ← LA PAGE D'ERREUR. L'hébergeur la cherche à
│                                  la racine : elle ne peut pas être déplacée.
│
├── pages/                      ← LES 25 AUTRES PAGES DU SITE
│   ├── syndic-professionnel.html      Le nom du fichier EST l'adresse :
│   ├── conseil-syndical.html          pages/services.html se lit sur
│   ├── coproprietaire.html            …fr/pages/services.html
│   ├── services.html
│   ├── approche.html                  Les articles sont regroupés par leur
│   ├── a-propos.html                  PRÉFIXE de nom (ressources-*), pour
│   ├── ressources.html                rester triés à côté de leur sommaire.
│   ├── ressources-*.html  (×13)
│   ├── faq.html                       → détail dans docs/PAGES.md
│   ├── contact.html
│   ├── plan-du-site.html
│   ├── mentions-legales.html
│   └── politique-confidentialite.html
│
├── assets/                     ← TOUT CE QUE LES PAGES CHARGENT
│   ├── css/
│   │   ├── style.css              Design system — 17 sections numérotées
│   │   └── signature.css          Calque « Le Relevé » — 14 sections
│   ├── js/
│   │   ├── main.js                Comportement — 14 modules
│   │   └── signature.js           Direction artistique — 12 modules
│   └── img/                       Photos (webp + jpg + miniature), SVG, icônes
│
├── docs/                       ← DOCUMENTATION — non publiée sur le site
│   ├── README.md                  Index de la documentation
│   ├── PAGES.md                   Inventaire des 27 pages
│   ├── DESIGN-SYSTEM.md           Couleurs, typographie, composants
│   ├── DEVELOPPEMENT.md           Conventions de code, ajouter une page
│   ├── verifier-le-site.py        Contrôle automatique avant livraison
│   ├── DEPLOIEMENT.md             Vercel, domaine, formulaire
│   ├── CONTENU-A-VALIDER.md       ⚠️ À LIRE EN PREMIER
│   ├── AUDIT-SITE.md              Audit technique mesuré
│   ├── IMAGE-BRIEFS.md            Direction artistique des images
│   ├── CREDITS-PHOTOS.md          Sources et licences des photos
│   ├── HISTORIQUE.md              Décisions et arbitrages du projet
│   ├── captures/                  Captures d'écran de ce README
│   └── exports/                   Livrables — dont accueil.json
│
├── sitemap.xml                 ← RÉFÉRENCEMENT ET CONFIGURATION
├── robots.txt
├── site.webmanifest
├── vercel.json                    En-têtes, cache, et le noindex à retirer
├── .vercelignore                  Exclut docs/ et les .md du déploiement
├── .gitignore
└── README.md                      Ce fichier
```

**Quatre règles qui expliquent ce rangement :**

1. **Les pages sont dans `pages/`.** Leur nom de fichier est leur adresse :
   `pages/services.html` se lit sur `…fr/pages/services.html`. Déplacer ou
   renommer un fichier change donc son URL — il faut alors reprendre les liens
   internes, le `canonical` de la page et le `sitemap.xml`.
2. **Deux pages restent à la racine, et ne peuvent pas bouger.** `index.html`
   est la page servie sur le domaine lui-même ; `404.html` est cherchée à la
   racine par l'hébergeur pour les adresses inexistantes.
3. **Tout ce que le navigateur charge est dans `assets/`.** Rien d'autre. Les
   pages y accèdent en `../assets/…`, l'accueil en `assets/…`.
4. **Tout ce qui documente est dans `docs/`.** Ce dossier n'est pas déployé.

---

## 4. Les 27 pages, dans l'ordre

L'ordre est celui du **parcours du visiteur**, pas l'ordre alphabétique.

> Sauf mention contraire, tous les fichiers listés ci-dessous se trouvent dans
> **`pages/`**. Seuls `index.html` et `404.html` sont à la racine.

### Entrée

| # | Fichier | Rôle |
|---|---|---|
| 1 | `index.html` *(racine)* | Aiguiller vers la page profil. Trois écrans, pas plus |

### Pages profil — trois portes d'entrée

| # | Fichier | Pour qui |
|---|---|---|
| 2 | `syndic-professionnel.html` | Le syndic qui externalise l'analyse technique — **cible prioritaire** |
| 3 | `conseil-syndical.html` | Le conseiller syndical qui veut contrôler sans y passer ses soirées |
| 4 | `coproprietaire.html` | Le copropriétaire qui veut comprendre ses charges |

### Le cabinet

| # | Fichier | Contenu |
|---|---|---|
| 5 | `services.html` | Les 5 prestations, chacune en Problème → Intervention → Bénéfice |
| 6 | `approche.html` | La méthode en 5 étapes |
| 7 | `a-propos.html` | Vision, convictions, indépendance |

### Ressources — le levier de référencement

| # | Fichier | Contenu |
|---|---|---|
| 8 | `ressources.html` | Le sommaire des 13 articles |
| 9 | `ressources-droits-conseil-syndical.html` | Que peut demander le conseil syndical au syndic ? |
| 10 | `ressources-lire-ses-charges.html` | Comment lire les charges de sa copropriété |
| 11 | `ressources-assemblee-generale.html` | Préparer une assemblée générale |
| 12 | `ressources-contrat-syndic.html` | Le contrat de syndic : ce qu'il faut regarder |
| 13 | `ressources-renovation-energetique.html` | Rénovation énergétique : par où commencer |
| 14 | `ressources-registre-national.html` | Le registre national des copropriétés |
| 15 | `ressources-mise-en-concurrence-article-21.html` | Mise en concurrence : ce que dit l'article 21 |
| 16 | `ressources-forfait-syndic-prestations-particulieres.html` | Forfait et prestations particulières |
| 17 | `ressources-reconduction-tacite-contrats-entretien.html` | Reconduction tacite : le calendrier |
| 18 | `ressources-comparer-devis-perimetre-commun.html` | Comparer des devis : le périmètre commun |
| 19 | `ressources-contrat-chauffage-p1-p2-p3.html` | Contrat de chauffage : P1, P2, P3 |
| 20 | `ressources-preparer-budget-previsionnel.html` | Le budget prévisionnel, poste par poste |
| 21 | `ressources-reprendre-copropriete-pieces-a-rassembler.html` | Reprendre une copropriété |

> Cet ordre est le même dans `ressources.html`, `plan-du-site.html` et
> `sitemap.xml`. **Le conserver** lors d'un ajout.

### Conversion

| # | Fichier | Contenu |
|---|---|---|
| 22 | `faq.html` | 4 thèmes : comprendre · déroulement · pratique · confiance |
| 23 | `contact.html` | Formulaire + coordonnées ⚠️ *non branché* |

### Service et mentions légales

| # | Fichier | Contenu |
|---|---|---|
| 24 | `plan-du-site.html` | Toutes les pages, classées en quatre colonnes |
| 25 | `mentions-legales.html` | ⚠️ Trame à compléter — obligation légale |
| 26 | `politique-confidentialite.html` | ⚠️ Trame à compléter |
| 27 | `404.html` *(racine)* | Page d'erreur (hors sitemap, volontairement) |

Le détail de chaque page — plan, gabarit, liens entrants et sortants — est dans
**[`docs/PAGES.md`](docs/PAGES.md)**.

---

## 5. Avant la mise en ligne

Le site est techniquement sain : aucun défilement horizontal quelle que soit la
largeur d'écran, aucune erreur JavaScript, aucun lien interne mort (mesuré, voir
[`docs/AUDIT-SITE.md`](docs/AUDIT-SITE.md)).

**Il n'est pourtant pas publiable en l'état, pour trois raisons.** Aucune ne
demande de développement.

| # | Point bloquant | Ce qu'il faut faire | Qui |
|---|---|---|---|
| 1 | Le site demande aux moteurs de **ne pas l'indexer** | Retirer `X-Robots-Tag: noindex` de `vercel.json`, une fois le domaine réel branché | Technique |
| 2 | Le **formulaire de contact n'envoie rien** | Renseigner son `action` — 5 minutes, voir [`DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) § 4 | Technique |
| 3 | Les **deux pages légales sont des trames** | Fournir SIREN, siège, directeur de publication, hébergeur | **Cabinet** |

Le point 3 est une obligation légale (LCEN art. 6-III et RGPD) : en l'état, le
site est en infraction.

**S'y ajoute une relecture éditoriale** : quelques affirmations du site —
notamment le cas pratique chiffré de l'accueil et le cadre commercial de la page
syndic professionnel — proviennent du brief et n'ont pas pu être vérifiées.
Elles sont listées une à une dans
**[`docs/CONTENU-A-VALIDER.md`](docs/CONTENU-A-VALIDER.md)**, à lire avant
publication.

---

## 6. Modifier le site

### Changer un texte

Ouvrir la page concernée, chercher le texte, le remplacer. C'est du HTML lisible
et commenté : chaque page porte en tête un bloc qui décrit son rôle et son plan,
et chaque grande section est encadrée par un commentaire.

### Changer une coordonnée

Le téléphone et l'e-mail apparaissent à plusieurs endroits (contenu, `tel:`,
`mailto:`, données structurées JSON-LD). Les remplacer partout :

```bash
grep -rl "0617470857\|contact@coproperformanceconseil.fr" *.html pages/*.html
```

### Changer les couleurs ou la typographie

Tout est piloté par des variables CSS dans `assets/css/style.css` § 01. Changer
l'identité visuelle ne demande de toucher à rien d'autre — voir
[`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md).

### Après avoir modifié un CSS ou un JS

Incrémenter le numéro de version sur toutes les pages, sinon les visiteurs déjà
venus verront l'ancienne version :

```bash
sed -i 's/v=20260830/v=20260915/g' *.html pages/*.html
```

### Ajouter un article de ressource

Copier un article existant **dans `pages/`**, puis le déclarer à **trois**
endroits : `pages/ressources.html`, `pages/plan-du-site.html` et `sitemap.xml`.
La procédure complète est dans
[`docs/DEVELOPPEMENT.md`](docs/DEVELOPPEMENT.md) § 6.

### Vérifier qu'on n'a rien cassé

```bash
python docs/verifier-le-site.py
```

Contrôle les 27 pages : liens et images qui pointent dans le vide, titres
manquants ou dupliqués, `canonical` incohérent, page absente du `sitemap.xml`,
problème d'encodage. Ne modifie rien. **À lancer après tout déplacement, ajout
ou renommage de page.**

### Faire évoluer le site plus tard

Le contenu a été conçu pour tenir **sans preuves chiffrées**. Quand le cabinet
disposera de matière réelle, ces ajouts s'intègrent sans refonte :

| Ajout | Où |
|---|---|
| Témoignages clients (avec accord écrit) | Accueil, section « Un interlocuteur à votre écoute » |
| Chiffres réels (missions, ancienneté) | Accueil et `a-propos.html` |
| Études de cas anonymisées | Nouvelle page `realisations.html` |
| Grille tarifaire | `services.html`, après chaque bloc de prestation |
| Portrait du fondateur | `a-propos.html`, section « Qui est derrière… » |

---

## 7. Déploiement

Le dépôt GitHub est connecté au projet Vercel. Publier se résume à :

```bash
git add -A
git commit -m "Description du changement"
git push
```

Vercel reconstruit et publie dans la foulée.

Brancher le domaine réel, changer d'hébergeur, brancher le formulaire, retirer
le `noindex` : tout est détaillé dans
**[`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md)**.

---

## 8. Qualité : accessibilité, SEO, performance

### Accessibilité — visée WCAG 2.1 niveau AA

- Structure sémantique (`header`, `nav`, `main`, `section`, `article`, `footer`)
- Lien d'évitement, `aria-current`, `aria-expanded`, `aria-controls`, `role="region"`
- Navigation clavier complète, `:focus-visible` visible sur fond clair et sombre
- Contrastes vérifiés sur les deux fonds (54 mesures)
- `prefers-reduced-motion` respecté : toutes les animations sont neutralisées,
  sans jamais masquer de contenu
- `alt` sur chaque image porteuse de sens, `alt=""` sur le décoratif
- Zones tactiles ≥ 44 px, formulaire entièrement étiqueté

### Référencement

- `<title>` et `<meta name="description">` uniques par page
- `<link rel="canonical">` sur chaque page
- Open Graph + Twitter Card complets, image 1200 × 630 fournie
- JSON-LD : `ProfessionalService`, `FAQPage`, `HowTo`, `BreadcrumbList`, `ContactPage`
- `sitemap.xml` complet (26 pages) et `robots.txt`
- Fil d'Ariane sur toutes les pages intérieures
- Un seul `<h1>` par page, hiérarchie de titres continue
- 13 articles de fond visant les requêtes longue traîne

### Performance

- Aucune dépendance externe : **zéro requête tierce**
- Photos en WebP avec repli JPEG, toutes sous 170 Ko, miniature floutée pendant
  le chargement
- `width`/`height` sur toutes les images → décalage de mise en page nul
- `fetchpriority="high"` sur le seul visuel du hero, `loading="lazy"` ailleurs
- Animations en `transform` et `opacity` uniquement, écouteurs de défilement
  passifs et lissés en `requestAnimationFrame`
- CSS et JS livrés **non minifiés**, volontairement : ils sont faits pour être
  relus et modifiés. La minification se fait à la mise en production.

### Images

Trois photographies **CC0** (domaine public, usage commercial libre) issues de
Wikimedia Commons. Les illustrations sont **dessinées en SVG pour ce site** :
aucune licence à surveiller, aucune banque d'images. **Aucune photographie de
personne** n'est utilisée, et aucune ne doit l'être sans accord écrit.

Sources dans [`docs/CREDITS-PHOTOS.md`](docs/CREDITS-PHOTOS.md), procédure de
remplacement dans [`docs/IMAGE-BRIEFS.md`](docs/IMAGE-BRIEFS.md).

---

## 9. Documentation

| Document | Ce qu'on y trouve |
|---|---|
| [`docs/CONTENU-A-VALIDER.md`](docs/CONTENU-A-VALIDER.md) | ⚠️ **À lire en premier** — ce qui demande une confirmation du cabinet |
| [`docs/PAGES.md`](docs/PAGES.md) | Les 27 pages : rôle, gabarit, plan, maillage |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | Couleurs, typographie, composants, calque « Le Relevé » |
| [`docs/DEVELOPPEMENT.md`](docs/DEVELOPPEMENT.md) | Anatomie d'une page, conventions, modules JS, ajouter une page |
| [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) | Vercel, domaine, formulaire, autres hébergeurs |
| [`docs/AUDIT-SITE.md`](docs/AUDIT-SITE.md) | Audit technique mesuré : 216 mesures de mise en page, 54 de contraste |
| [`docs/IMAGE-BRIEFS.md`](docs/IMAGE-BRIEFS.md) · [`docs/CREDITS-PHOTOS.md`](docs/CREDITS-PHOTOS.md) | Images : direction artistique, sources, licences |
| [`docs/HISTORIQUE.md`](docs/HISTORIQUE.md) | Retours reçus, modifications apportées, arbitrages |

Index complet : [`docs/README.md`](docs/README.md).

---

## 10. Choix techniques assumés

**Pourquoi du HTML statique plutôt que Next.js ou WordPress ?**
Un site vitrine n'a pas besoin d'un framework. Ce choix apporte : zéro
dépendance à mettre à jour, zéro faille applicative, un chargement quasi
instantané, un hébergement à coût nul ou négligeable, et un contrôle total du
balisage. Le contenu est structuré pour être repris tel quel dans un CMS si le
besoin se présente — un export du contenu de l'accueil est d'ailleurs fourni
dans [`docs/exports/accueil.json`](docs/exports/accueil.json).

**Pourquoi `index.html` et `404.html` ne sont-ils pas dans `pages/` ?**
Parce qu'ils ne peuvent pas y être. `index.html` est le fichier servi quand on
demande le domaine lui-même : le déplacer laisserait la page d'accueil sans
adresse. `404.html` est cherchée à la racine par l'hébergeur pour répondre aux
adresses inexistantes ; ailleurs, elle ne serait jamais servie. Les 25 autres
pages n'ont pas cette contrainte et vivent dans `pages/`.

**Le déplacement dans `pages/` a-t-il coûté du référencement ?**
Non, parce qu'il a été fait avant la mise en ligne. Le site n'a jamais été
indexé — le `noindex` de `vercel.json` est actif et le domaine réel n'est pas
branché — donc aucune adresse `…fr/services.html` ne circule. **Après la mise
en production, ce ne serait plus vrai** : déplacer une page demanderait alors de
poser une redirection 301 depuis son ancienne adresse.

**Pourquoi pas de Google Fonts ?**
Leur usage en CDN a été jugé problématique au regard du RGPD par plusieurs
autorités européennes, et coûterait une requête bloquante. Le site utilise une
pile de polices système ; une police de marque peut être auto-hébergée.

**Pourquoi pas de bandeau cookies ?**
Parce que le site n'en dépose aucun. Ajouter un bandeau alors qu'il n'y a rien à
consentir dégraderait l'expérience sans bénéfice juridique. Si un outil de
statistiques est ajouté plus tard, la question se reposera — la politique de
confidentialité le documente déjà (§ 7).

**Pourquoi le code n'est-il pas minifié ?**
Parce qu'il est fait pour être relu et repris. La minification est une étape de
mise en production, pas une manière d'écrire.
