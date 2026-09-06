# Développement — conventions et anatomie du code

Le site est en **HTML, CSS et JavaScript natifs**. Aucune dépendance, aucun
build, aucun gestionnaire de paquets. Un fichier modifié est un fichier en
ligne : il n'y a rien à compiler.

---

## 1. Anatomie d'une page

Les 27 pages partagent exactement la même ossature. Seul le contenu de `<main>`
change d'une page à l'autre.

**Où vivent-elles.** 25 pages dans `pages/`, plus `index.html` et `404.html` qui
doivent rester à la racine (voir [`PAGES.md`](PAGES.md)). La seule différence
entre les deux emplacements tient aux chemins :

| Depuis | Vers les assets | Vers l'accueil | Vers une autre page |
|---|---|---|---|
| `index.html` (racine) | `assets/…` | — | `pages/services.html` |
| `pages/*.html` | `../assets/…` | `../index.html` | `services.html` |

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">                     <!-- toujours en premier -->
  <meta name="viewport" …>

  <!-- BLOC DE DOCUMENTATION : rôle de la page, plan, liens -->

  <title>…</title>                           <!-- unique à la page -->
  <meta name="description" …>                <!-- unique à la page -->
  <link rel="canonical" …>                   <!-- unique à la page -->

  <!-- Open Graph + Twitter Card -->
  <!-- Icônes + manifeste -->
  <!-- style.css puis signature.css -->
  <!-- main.js puis signature.js, tous deux en `defer` -->
  <!-- JSON-LD : données structurées propres à la page -->
</head>

<body>
  <div class="boot" data-boot>…</div>        <!-- rideau d'ouverture (décoratif) -->
  <div class="grain"></div>                  <!-- grain d'impression (décoratif) -->
  <a class="skip-link" href="#contenu">…</a> <!-- lien d'évitement -->
  <div class="scroll-progress" data-progress></div>

  <header class="header" data-header>…</header>
  <div class="mobile-nav" id="menu-mobile" data-mobile-nav>…</div>

  <main id="contenu">
    <!-- fil d'Ariane (sauf accueil) -->
    <!-- LE CONTENU PROPRE À LA PAGE -->
  </main>

  <footer class="footer footer--compact">…</footer>
</body>
</html>
```

**Conséquence pratique :** pour créer une page, on part d'une page existante du
même type, on remplace le `<main>`, le `<title>`, la `description`, le
`canonical`, le JSON-LD et le bloc de documentation. Rien d'autre.

### Le bloc de documentation en tête de page

Chaque page porte, juste après le `viewport` et avant le `<title>`, un bloc de
commentaire normalisé :

```html
<!-- ==================================================================
     PAGE 05/27 — Nom de la page
     Fichier : pages/nom-du-fichier.html
     URL     : /pages/nom-du-fichier.html
     Gabarit : le type de page — voir ../docs/PAGES.md
     ------------------------------------------------------------------
     Rôle : à quoi sert cette page dans le parcours du visiteur.

     Plan du <main> :
       1. …
       2. …

     Entrées : d'où l'on arrive sur cette page.
     Sorties : où la page envoie le visiteur.
     ================================================================== -->
```

Il est placé **après** `<meta charset>` — jamais avant, pour que la déclaration
d'encodage reste dans les premiers octets du document.

À l'intérieur du `<body>`, les grands blocs sont eux aussi encadrés par des
commentaires en bandeau. Ils expliquent l'intention, pas la syntaxe.

---

## 2. Conventions de nommage

| Objet | Convention | Exemple |
|---|---|---|
| Fichier de page | minuscules, tirets, sans accent, dans `pages/` | `pages/conseil-syndical.html` |
| Article de ressource | préfixe `ressources-` | `pages/ressources-contrat-syndic.html` |
| Classe CSS | BEM allégé : `bloc__element--modificateur` | `.noeud__titre`, `.btn--lg` |
| Crochet JavaScript | attribut `data-*`, **jamais une classe** | `data-header`, `data-reveal` |
| Ancre de section | `#nom-court` sur la section, `#t-nom` sur son titre | `#audit`, `#t-audit` |

> **Règle importante :** le JavaScript ne s'accroche jamais à une classe de
> style. Renommer une classe CSS ne peut donc pas casser un comportement, et
> inversement.

---

## 3. Le JavaScript

Deux fichiers, chargés en `defer`, sans dépendance.

### `assets/js/main.js` — le comportement (≈ 660 lignes)

| Module | Rôle |
|---|---|
| `initHeader` | État « collé » du header au scroll (rAF, listener passif) |
| `initMobileNav` | Menu mobile : ARIA, verrou du scroll, fermeture à `Échap` |
| `initReveals` | Apparitions au scroll via `IntersectionObserver` |
| `initStagger` | Décalage automatique en cascade des enfants |
| `initFaq` | Accordéon accessible, ouverture par ancre `#id` |
| `initParallax` | Parallaxe douce, désactivée sous 940 px |
| `initForm` | Validation, états, envoi, anti-spam |
| `initScrollProgress` | Barre de progression de lecture en haut de page |
| `initMedia` | Photos : chargement progressif + voile de révélation |
| `initSplitText` | Découpe les titres en mots pour une révélation en cascade |
| `initSteps` | Surlignage de l'étape traversée dans la méthodologie |
| `initCheckLists` | Listes à puces en cascade |
| `initSectionCount` | Repère de section flottant (accueil, bureau) |
| `initYear` | Année courante dans les pieds de page |

### `assets/js/signature.js` — la direction artistique (≈ 660 lignes)

| Module | Rôle |
|---|---|
| `initBoot` | Rideau d'ouverture, une fois par session |
| `initDrawings` | Mesure les tracés SVG et les dessine à l'entrée dans le champ |
| `initReleve` | Calque d'analyse du hero : cotations, balayage, annotations |
| `initDossier` | Pile de pièces, déployée en éventail |
| `initTraceMethode` | Rail vertical qui se remplit le long des cinq étapes |
| `initTilt` | Relief au pointeur sur les cartes |
| `initSpotlight` | Halo qui suit le curseur sur les sections sombres |
| `initMagnet` | Boutons magnétiques |
| `initTally` | Compteurs animés |
| `initFrise` | Bandeau défilant |
| `initProfilUrl` | Pré-remplit le formulaire de contact selon la page profil d'origine |
| `initStickyCta` / `initCtaFlottant` | Appels à l'action collants, un seul à la fois |

### Deux garanties tenues

**Sans JavaScript**, le site reste lisible et navigable : seules les animations
et l'accordéon FAQ perdent leur interactivité. Aucun contenu n'est masqué.

**`prefers-reduced-motion: reduce`** neutralise l'intégralité des effets — sans
jamais masquer de contenu : les tracés sont posés complets, l'éventail déployé,
les compteurs affichent la valeur juste.

> **Le découpage des titres ne modifie pas le texte.** Chaque mot est enveloppé
> dans `<span class="w"><span class="w-i">`, les éléments inline existants
> (`.serif-em`, liens) sont préservés, et le texte restitué est identique au
> texte source.

---

## 4. Les animations au scroll

Sept effets, tous en `transform` / `opacity` uniquement, tous pilotés par
`IntersectionObserver` ou `requestAnimationFrame` avec des écouteurs passifs :

1. **Barre de progression** — filet dégradé de 2 px en haut de page
2. **Titres mot à mot** — chaque mot monte derrière un masque, en cascade
3. **Voile de révélation des photos** — un rideau se retire verticalement
4. **Chargement progressif** — miniature floutée puis fondu de la photo nette
5. **Parallaxe** — hero et bandeau photo, désactivée sous 940 px
6. **Étape active** — le numéro se colore et une barre se déploie au passage
7. **Repère de section** — pastille flottante « 04 / 07 · Pourquoi nous »

Les attributs qui les déclenchent, dans le HTML :

| Attribut | Effet |
|---|---|
| `data-reveal` | L'élément apparaît à l'entrée dans le champ |
| `data-reveal="fade"` / `"scale"` | Variante de l'apparition |
| `style="--d:N"` | Retard de l'apparition (ordre dans la cascade) |
| `data-stagger` | Les enfants apparaissent l'un après l'autre |
| `data-split` | Le titre est découpé en mots |
| `data-parallax="0.05"` | Amplitude de la parallaxe |

---

## 5. Le cache des fichiers statiques

CSS et JS sont appelés avec un paramètre de version :

```html
<link rel="stylesheet" href="assets/css/style.css?v=20260830">
```

**Après toute modification de `style.css`, `signature.css`, `main.js` ou
`signature.js`, il faut incrémenter cette date sur toutes les pages**, sinon les
visiteurs déjà venus continueront de voir l'ancienne version.

```bash
# Remplacer la version sur les 27 pages en une commande
sed -i 's/v=20260830/v=20260915/g' *.html pages/*.html
```

Les images, elles, sont servies avec un cache d'un an (`vercel.json`) : pour en
remplacer une, changer son nom de fichier plutôt que son contenu.

---

## 6. Ajouter une page

### Un nouvel article de ressource

1. **Copier** un article existant **dans `pages/`**, par exemple
   `pages/ressources-contrat-syndic.html`, sous un nom en `ressources-*.html`.
   Rester dans `pages/` évite d'avoir à retoucher un seul chemin.
2. Mettre à jour, dans le `<head>` : le bloc de documentation, `<title>`,
   `description`, `canonical` (`…fr/pages/le-nouveau-fichier.html`), Open Graph,
   Twitter, et le JSON-LD (`BreadcrumbList`, et `FAQPage` si l'article porte des
   questions).
3. Écrire le contenu dans `<main>`.
4. **Déclarer l'article dans trois endroits** — c'est l'étape qu'on oublie :
   - `pages/ressources.html` — la carte dans la liste des articles
   - `pages/plan-du-site.html` — la colonne « Ressources »
   - `sitemap.xml` — une entrée `<url>` en `/pages/…`
5. Vérifier que le compte d'articles annoncé dans la `description` et le
   chapô de `pages/ressources.html` est toujours juste.

### Une page d'un autre type

Mêmes étapes, en partant de la page du gabarit le plus proche (voir
[`PAGES.md`](PAGES.md)), et en ajoutant le lien à la navigation du header et du
footer si la page doit être atteignable depuis toutes les pages.

> **Une page créée à la racine plutôt que dans `pages/` fonctionnera quand
> même**, mais ses chemins d'assets devront être en `assets/…` et non
> `../assets/…`. Mieux vaut rester dans `pages/`.

---

## 7. Vérifications avant de livrer une modification

Une seule commande, depuis la racine du projet :

```bash
python docs/verifier-le-site.py
```

Elle ne modifie rien. Elle contrôle les 27 pages et signale :

| # | Contrôle |
|---|---|
| 1 | Chaque lien, image, feuille de style et script pointe vers un fichier qui existe — les chemins sont résolus depuis la page qui les cite, donc `../assets/…` depuis `pages/` est bien vérifié |
| 2 | Un `<title>`, une `description` et un seul `<h1>` par page |
| 3 | Le `canonical` correspond à l'emplacement réel du fichier |
| 4 | Chaque page indexable est dans `sitemap.xml`, et le sitemap ne cite pas de page disparue |
| 5 | UTF-8 sans BOM, `<meta charset>` dans les 1024 premiers octets |

Elle sort en code 0 si tout va bien, 1 sinon — utilisable telle quelle dans une
intégration continue.

**C'est le contrôle à lancer systématiquement après avoir déplacé, renommé ou
ajouté une page** : c'est là que les liens et les `canonical` se cassent.

Puis, dans le navigateur : la page à 320 px de large, la navigation au clavier
seul (`Tab`, `Entrée`, `Échap`), et la console sans erreur.
