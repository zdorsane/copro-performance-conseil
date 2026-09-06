# Audit technique — Copro Performance Conseil

**Date de l'audit :** 30 août 2026
**Périmètre :** 27 pages HTML, 2 feuilles de style, 2 fichiers JavaScript, 25 fichiers image.
**Méthode :** analyse du code source, puis mesure des pages réellement affichées dans un navigateur (Chrome), aux largeurs 320, 375, 414, 768, 1024, 1280, 1440 et 1920 pixels. Au total 216 mesures de mise en page et 54 mesures de contraste.

---

> **Note de relecture — septembre 2026.** Depuis la rédaction de ce document,
> les pages ont été regroupées dans `pages/` (sauf `index.html` et `404.html`,
> restés à la racine). Les noms de fichiers cités ci-dessous sont inchangés,
> seul leur chemin a bougé. Voir [`PAGES.md`](PAGES.md).

## 1. Synthèse

Le site est techniquement sain. Sur les points qui provoquent habituellement le plus de dégâts — mise en page qui déborde sur mobile, erreurs de programmation, liens cassés, structure des titres — les mesures ne relèvent **aucun défaut** : aucune des 27 pages ne provoque de défilement horizontal, quelle que soit la largeur d'écran ; aucune erreur JavaScript ; aucun lien interne mort ; aucune ancre orpheline. Le travail d'accessibilité déjà engagé est visible et de bonne qualité.

Les problèmes se situent ailleurs : **le site n'est pas prêt à être publié**, pour trois raisons indépendantes de sa qualité technique.

**Les trois points les plus urgents :**

1. **Le site demande aux moteurs de recherche de ne pas l'indexer.** Le fichier de configuration d'hébergement envoie une instruction `noindex, nofollow` sur toutes les pages. Tant qu'elle n'est pas retirée, le site ne remontera jamais dans Google, quel que soit le travail de référencement effectué par ailleurs.
2. **Le formulaire de contact n'envoie rien.** Il n'est relié à aucune boîte de réception. Un visiteur qui remplit ses coordonnées reçoit un message d'erreur, et la demande est perdue. C'est le seul chemin de conversion du site.
3. **Les mentions légales et la politique de confidentialité sont des trames non remplies.** 18 champs restent entre crochets : SIREN, adresse du siège, directeur de la publication, hébergeur, e-mail, téléphone. En l'état, le site est en infraction avec la LCEN et le RGPD.

**Niveau de risque global : élevé tant que ces trois points ne sont pas traités, faible ensuite.** Aucun des trois ne demande de développement : ce sont une ligne de configuration, un branchement de formulaire et des informations à fournir par le cabinet.

Reste, en second rideau, un sujet de fond : les modifications successives page par page ont laissé le site dans un état **éditorialement incohérent** (le terme « pré-diagnostic », censé disparaître, subsiste 31 fois sur 14 pages) et ont **appauvri la navigation** (trois pages ne sont plus atteignables que depuis la page d'accueil).

---

## 2. Tableau de bord

| Catégorie | Bloquant | Important | Souhaitable | Total |
|---|---:|---:|---:|---:|
| Conformité légale et RGPD | 2 | 2 | 0 | 4 |
| Référencement naturel | 1 | 3 | 2 | 6 |
| Cohérence éditoriale | 0 | 4 | 1 | 5 |
| Accessibilité | 0 | 2 | 3 | 5 |
| Performance | 0 | 1 | 2 | 3 |
| Qualité du code | 0 | 1 | 3 | 4 |
| Responsivité | 0 | 0 | 1 | 1 |
| **Total** | **3** | **13** | **12** | **28** |

**Points vérifiés et conformes** (détail en section 6) : débordement horizontal, erreurs JavaScript, hiérarchie des titres, liens et ancres internes, identifiants dupliqués, textes alternatifs des images, libellés de liens, animations et mouvement réduit, menu mobile au clavier, sections récemment éclaircies, tableaux sur petit écran, balises `viewport` et `lang`, zone de sécurité des écrans à encoche, signalement des champs obligatoires, case de consentement.

---

## 3. Constats bloquants

### B1 — Le site interdit son propre référencement

- **Où :** `vercel.json`, ligne 39.
- **Constat :** la configuration d'hébergement ajoute sur **toutes** les pages une instruction `X-Robots-Tag: noindex, nofollow`. En français : « moteurs de recherche, n'enregistrez pas cette page et ne suivez pas ses liens ».
- **Conséquence :** le site n'apparaîtra dans aucun résultat de recherche. Tout le travail de contenu, de mots-clés, de sitemap et de données structurées est neutralisé. C'est vraisemblablement une protection volontaire pendant la phase de préparation — elle doit impérativement être retirée le jour de la mise en ligne.
- **Correction :** supprimer ce bloc d'en-tête.

```json
// vercel.json — SUPPRIMER ces lignes dans le bloc "source": "/(.*)"
{
  "key": "X-Robots-Tag",
  "value": "noindex, nofollow"
}
```

- **Gravité : Bloquant.**

---

### B2 — Le formulaire de contact n'est relié à rien

- **Où :** `contact.html` ligne 144 (`action="#"`), logique dans `assets/js/main.js` lignes 305 à 313.
- **Constat :** le formulaire ne pointe vers aucune adresse d'envoi. Le code le détecte et affiche au visiteur : *« Le formulaire n'est pas encore relié à une boîte de réception. En attendant, écrivez-nous directement par e-mail. »*
- **Conséquence :** aucune demande envoyée par le formulaire n'arrive au cabinet. Sur un site dont l'objectif unique est de générer des premiers contacts, c'est la totalité de la conversion qui est perdue. Le message affiché limite les dégâts, mais il apparaît **après** que le visiteur a saisi ses coordonnées, ce qui est le pire moment.
- **Correction :** deux voies, l'une ou l'autre.
  - *Service tiers, sans serveur* (Formspree, Web3Forms, Tally) — renseigner l'adresse fournie par le service :

```html
<!-- contact.html ligne 144 -->
<form class="form" data-contact-form
      action="https://formspree.io/f/VOTRE-IDENTIFIANT" method="post" novalidate>
```

  - *Boîte technique maison* — faire pointer `action` vers votre propre point de réception.

  Le code JavaScript gère déjà l'envoi, l'état « Envoi en cours… » et le message de confirmation dès que `action` contient une adresse valide. Aucune autre modification n'est nécessaire.
- **Gravité : Bloquant.**

---

### B3 — Mentions légales et politique de confidentialité non renseignées

- **Où :** `mentions-legales.html` (14 champs), `politique-confidentialite.html` (4 champs).
- **Constat :** les deux pages sont des trames de rédaction. Les informations obligatoires figurent entre crochets, non remplies :

| Page | Champs restés vides |
|---|---|
| `mentions-legales.html` | forme juridique, capital social, adresse du siège, SIREN/SIRET, RCS, n° TVA, téléphone, e-mail, nom du directeur de la publication, fonction, hébergeur, assurance RC professionnelle |
| `politique-confidentialite.html` | dénomination sociale du responsable de traitement, adresse e-mail dédiée (2 fois), date de dernière mise à jour |

- **Conséquence :** l'article 6-III de la LCEN impose l'identification de l'éditeur et de l'hébergeur sur tout site professionnel. Le RGPD impose l'identification du responsable de traitement et un moyen d'exercer ses droits. En l'état, un visiteur ne peut ni identifier le cabinet ni exercer ses droits, et la page affiche visiblement des crochets de chantier — ce qui nuit aussi à la crédibilité commerciale.
- **Correction apportée le 30 août 2026 :** ce rapport indiquait initialement que les droits RGPD n’étaient pas énoncés dans la politique de confidentialité. C’est faux. La vérification manuelle établit que la section « 9. Vos droits » liste bien Accès, Rectification, Effacement, Limitation, Opposition, Portabilité, Retrait du consentement et Directives post mortem. Le constat venait d’une recherche automatique trop étroite, pas d’une lacune de la page.
- **Correction :** remplacer chaque `[…]` par la donnée réelle. Aucune intervention technique : ce sont des informations que seul le cabinet détient. Prévoir une relecture par un professionnel du droit — les deux pages le recommandent d'ailleurs elles-mêmes en préambule, mention qu'il faudra retirer avant publication.
- **Gravité : Bloquant.**

---

## 4. Constats importants

### 4.1 Référencement naturel

#### I1 — Trois pages ne sont atteignables que depuis la page d'accueil

- **Où :** `conseil-syndical.html`, `coproprietaire.html`, `syndic-professionnel.html`.
- **Constat :** ces trois pages « profil » ne figurent **ni dans le menu principal, ni dans le pied de page**. Mesure du maillage :

| Page | Liens entrants (hors menu et pied de page) | Depuis |
|---|---:|---|
| `conseil-syndical.html` | 1 | `index.html` |
| `coproprietaire.html` | 1 | `index.html` |
| `syndic-professionnel.html` | 2 | `index.html`, `plan-du-site.html` |

- **Conséquence :** un visiteur qui arrive sur une page ressource depuis Google ne trouvera jamais la page correspondant à son profil. Pour Google, une page avec un seul lien entrant est jugée peu importante et remonte mal. Ces trois pages portent pourtant le discours commercial le plus ciblé du site.
- **Correction :** ajouter une colonne « Vous êtes » au pied de page commun, présent sur les 27 pages.

```html
<!-- à insérer dans <div class="footer__cols"> de chaque page -->
<div class="footer__col">
  <h3>Vous êtes</h3>
  <ul>
    <li><a href="conseil-syndical.html">Membre du conseil syndical</a></li>
    <li><a href="syndic-professionnel.html">Syndic professionnel</a></li>
    <li><a href="coproprietaire.html">Copropriétaire</a></li>
  </ul>
</div>
```

- **Gravité : Important.**

#### I2 — « Notre approche » a perdu la quasi-totalité de ses liens

- **Où :** `approche.html`.
- **Constat :** la page a été retirée du menu principal. Hors menu et pied de page, elle ne reçoit plus que **4 liens** sur l'ensemble du site (`404.html`, `faq.html`, `conseil-syndical.html`, `syndic-professionnel.html`). À titre de comparaison, `services.html` en reçoit 20.
- **Conséquence :** la page décrit la méthode de travail, c'est-à-dire l'argument différenciant du cabinet. Peu liée, elle sera peu vue et mal classée.
- **Correction :** elle reste liée depuis le pied de page (colonne « Le cabinet »), ce qui évite qu'elle disparaisse. Pour la remonter, ajouter un lien contextuel depuis `services.html` et depuis `index.html` — deux pages qui reçoivent chacune 26 et 20 liens entrants.
- **Gravité : Important.**

#### I3 — Titres et descriptions trop longs pour être affichés en entier

- **Où :** 23 pages sur 27 pour le `title`, 11 pages sur 27 pour la `meta description`.
- **Constat :** Google tronque les titres au-delà d'environ 60 caractères et les descriptions au-delà d'environ 160.

| Page | Longueur du titre | Longueur de la description |
|---|---:|---:|
| `syndic-professionnel.html` | 83 | **238** |
| `services.html` | 70 | **218** |
| `faq.html` | 78 | **211** |
| `ressources.html` | 99 | **211** |
| `index.html` | 62 | **203** |
| `ressources-preparer-budget-previsionnel.html` | **111** | 141 |
| `ressources-mise-en-concurrence-article-21.html` | **106** | 142 |

- **Conséquence :** la fin de la phrase est remplacée par « … » dans les résultats de recherche. Quand l'argument le plus fort se trouve en fin de description, il n'est jamais lu. Ce n'est pas une pénalité, c'est une perte de clics.
- **Précision :** les titres et descriptions sont tous **uniques** — aucun doublon sur les 27 pages. C'est le point le plus important, et il est acquis.
- **Correction :** ramener les titres sous 60 caractères et les descriptions entre 120 et 160, en plaçant le bénéfice en tête.
- **Gravité : Important.**

#### I4 — Le fichier `robots.txt` contient encore une consigne de chantier

- **Où :** `robots.txt`, ligne 2.
- **Constat :** le fichier commence par `# Remplacer le domaine ci-dessous par le domaine réel avant mise en ligne.`
- **Conséquence :** aucune conséquence technique — c'est un commentaire, ignoré par les moteurs. Mais le fichier est public et lisible par n'importe qui, y compris un concurrent. Il faut vérifier que le domaine indiqué (`coproperformanceconseil.fr`) est bien le domaine définitif, puis retirer la ligne.
- **Gravité : Important** (parce qu'il signale une vérification non faite, pas pour son effet propre).

---

### 4.2 Cohérence éditoriale

#### I5 — Le terme « pré-diagnostic » subsiste 31 fois sur 14 pages

- **Constat :** le remplacement par « premier échange gratuit » a été appliqué à `index.html`, `services.html`, `syndic-professionnel.html` et `conseil-syndical.html`, mais pas au reste du site.

| Page | Occurrences | Nature |
|---|---:|---|
| `coproprietaire.html` | 5 | phrase d'accroche, réponse FAQ, bloc final, bouton, CTA mobile |
| `ressources-assemblee-generale.html` | 3 | bloc final, bouton, CTA mobile |
| `ressources-contrat-syndic.html` | 3 | idem |
| `ressources-droits-conseil-syndical.html` | 3 | idem |
| `ressources-lire-ses-charges.html` | 3 | idem |
| `ressources-registre-national.html` | 3 | idem |
| `ressources-renovation-energetique.html` | 3 | idem |
| `faq.html` | 2 | réponse « Combien cela coûte ? », CTA mobile |
| `404.html`, `a-propos.html`, `approche.html`, `mentions-legales.html`, `plan-du-site.html`, `politique-confidentialite.html` | 1 chacune | CTA mobile uniquement |

- **Conséquence :** le site propose deux offres d'entrée différentes selon la page consultée. Un visiteur qui passe de la FAQ à la page d'accueil ne comprend pas s'il s'agit du même service. Sept pages ressources affichent encore un bouton « Demander mon pré-diagnostic gratuit » qui contredit le discours des pages principales.
- **Correction :** trois remplacements suffisent à couvrir les 31 occurrences.

```
« Pré-diagnostic gratuit »                    → « Premier échange gratuit »
« Demander mon pré-diagnostic gratuit »       → « Demander mon premier échange gratuit »
« Le premier échange et le pré-diagnostic
   écrit sont gratuits. »                     → « Le premier échange est gratuit. »
```

- **Gravité : Important.**

#### I6 — Trois libellés de bouton principal coexistent

- **Constat :** relevé sur les 27 pages.

| Libellé | Pages |
|---|---|
| « Demander mon premier échange gratuit » | `index.html`, `services.html`, `conseil-syndical.html`, 6 pages ressources récentes |
| « Demander mon pré-diagnostic gratuit » | `coproprietaire.html`, 6 pages ressources plus anciennes |
| « Demander un premier échange » | menu mobile des 27 pages, bandeau de `404.html` |
| « Nous signaler un dossier » | `syndic-professionnel.html` — variante assumée, adressée aux syndics |

- **Conséquence :** un visiteur ne reconnaît pas d'un coup d'œil le bouton principal d'une page à l'autre. Sur un site où le seul objectif est la prise de contact, cette répétition variable affaiblit le réflexe.
- **Correction :** retenir « Demander mon premier échange gratuit » partout, sauf sur `syndic-professionnel.html` où « Nous signaler un dossier » est un choix délibéré et cohérent avec le profil visé. Le libellé du menu mobile (« Demander un premier échange ») peut rester distinct : c'est un bouton de navigation, pas un appel à l'action de page.
- **Gravité : Important.**

#### I7 — « Sans relance » subsiste sur deux pages

- **Où :** `coproprietaire.html` ligne 142, `services.html` ligne 759.
- **Constat :** la formule « sans engagement, sans relance » et « sans relance commerciale » n'a pas été retirée de ces deux pages, alors qu'elle l'a été des deux pages profils traitées.
- **Conséquence :** engagement commercial ferme. Si le cabinet relance un prospect, la promesse est rompue et opposable. Question à trancher : soit la promesse est tenue partout et doit être rétablie sur l'ensemble du site, soit elle est abandonnée et doit disparaître de ces deux pages.
- **Gravité : Important.**

#### I8 — Affirmations engageantes à valider par le cabinet

Ces mentions engagent contractuellement le cabinet. Elles ne relèvent pas d'un correctif technique mais d'une validation.

| Affirmation | Emplacement | Point de vigilance |
|---|---|---|
| « Réponse sous 48 h ouvrées » | `contact.html:312` | Délai tenable en période de forte demande ? |
| « Toute la France, à distance. Audit, analyse et accompagnement sans déplacement. » | `contact.html:299` | Seule promesse géographique du site. Cohérente ailleurs : les 10 autres mentions disent « à distance » sans promesse territoriale. |
| « 50 % d'économie » | `index.html:575` et `589` | Présenté comme « Cas pratique illustratif ». La mention est bien présente ; vérifier qu'elle est aussi lisible que le chiffre, qui est en gras et en grand. |
| « 4 000 € d'économie chaque année » | `index.html:589` | Même cas. |
| « Audit complet des charges à partir de 400 € », « suivi mensuel à partir de 80 €/mois » | `faq.html:500-501` et données structurées ligne 43 | Seuls tarifs publiés du site. Ils figurent aussi dans les données structurées lues par Google, qui peut les afficher directement dans les résultats. |
| « Nous ne percevons aucune commission des prestataires » | `faq.html`, `index.html`, `services.html`, `approche.html` | Cohérent sur 4 pages. Absent des trois pages profils, où il serait pourtant utile. |

- **Point positif :** le nombre de prestations est annoncé de façon **cohérente** — « cinq prestations » sur les 5 pages qui le mentionnent (`index`, `services`, `syndic-professionnel`, `conseil-syndical`, `coproprietaire`). Aucune contradiction.
- **Gravité : Important** (validation), pas de correctif technique.

---

### 4.3 Accessibilité

#### I9 — Cinq combinaisons de couleurs sous le seuil réglementaire

Contrastes mesurés sur les pages réellement affichées, aux largeurs 375 et 1440 pixels. Seuls les écarts réels sont listés — les couleurs conformes ne figurent pas ici.

| Élément | Couleur du texte | Fond | Ratio mesuré | Seuil | Pages |
|---|---|---|---:|---:|---|
| Numéros d'étape `.step__num` | `#B4C4CF` | `#F4F0E9` | **1,58:1** | 3:1 | `syndic-professionnel.html` |
| Étiquette « Nos audits portent sur » `.perimetre__label` | `#6B8497` | `#F4F0E9` | **3,44:1** | 4,5:1 | `syndic-professionnel.html` |
| Mentions « 2 min de lecture », « Poste examiné », catégories d'article | `#6B8497` | `#FBFAF7` | **3,74:1** | 4,5:1 | 14 pages |
| Durée de lecture, sur-titres de pilier `.pilier__sur` | `#6B8497` | `#FFFFFF` | **3,91:1** | 4,5:1 | `ressources.html`, `syndic-professionnel.html` |

- **Constat :** la couleur `--ink-300` (`#6B8497`) sert aux étiquettes secondaires sur 14 pages et n'atteint pas le seuil AA. Les numéros d'étape de `syndic-professionnel.html` sont pratiquement invisibles à 1,58:1 — ce défaut est propre à cette page, car les mêmes numéros ont déjà été corrigés ailleurs (`approche.html` les affiche en `#8A6A2F`, mesuré à 5,02:1).
- **Conséquence :** ces textes sont illisibles pour une personne malvoyante, et difficiles à lire pour tout le monde sur un écran en plein jour. Le seuil de 4,5:1 est une obligation RGAA pour les organismes concernés, et une bonne pratique dans tous les cas.
- **Correction :**

```css
/* assets/css/style.css — assombrir la couleur des étiquettes secondaires */
:root {
  --ink-300: #5A7186;   /* au lieu de #6B8497 — passe à 4,6:1 sur fond papier */
}

/* assets/css/style.css ligne 1450 — numéros d'étape de syndic-professionnel */
.steps--compact .step__num {
  color: #8A6A2F;       /* même laiton assombri que sur approche.html — 5,0:1 */
}
```

- **Gravité : Important.**

#### I10 — Les polices de la charte ne sont jamais chargées

- **Où :** `assets/css/style.css` lignes 68 à 70.
- **Constat :** la feuille de style demande les polices « Inter » et « Instrument Serif ». Or le site ne contient **aucune déclaration `@font-face` et aucun lien vers Google Fonts** : ces polices ne sont jamais téléchargées. Vérifié : le navigateur signale zéro police chargée sur les 12 pages testées.
- **Conséquence :** un visiteur qui a Inter installée sur sa machine voit le design prévu. Tous les autres — la grande majorité — voient la police système de leur appareil : Segoe UI sur Windows, San Francisco sur Mac et iPhone, Roboto sur Android. Le titre en serif prévu (« Instrument Serif ») s'affiche en Georgia ou Times. Le rendu diffère donc d'un visiteur à l'autre, et ne correspond pas à la maquette.
- **Deux options :**
  - *Assumer les polices système* — retirer « Inter » et « Instrument Serif » des déclarations pour que la charte décrive ce qui s'affiche réellement. Gain : zéro octet chargé, aucun décalage de mise en page.
  - *Charger les polices* — les héberger sur le site (recommandé plutôt que Google Fonts, pour le RGPD : Google Fonts en direct transmet l'adresse IP du visiteur à Google, ce que la CNIL a sanctionné).

```html
<!-- à ajouter dans <head> de chaque page si l'on retient la seconde option -->
<link rel="preload" href="assets/fonts/inter-var.woff2" as="font"
      type="font/woff2" crossorigin>
```

```css
/* et dans assets/css/style.css */
@font-face {
  font-family: "Inter";
  src: url("../fonts/inter-var.woff2") format("woff2");
  font-weight: 400 700;
  font-display: swap;   /* le texte reste lisible pendant le chargement */
}
```

- **Gravité : Important.**

---

### 4.4 Performance

#### I11 — Deux mécanismes de bouton flottant différents selon la page

- **Où :** `index.html` utilise `.cta-flottant` ; les 25 autres pages utilisent `.sticky-cta` ; `contact.html` n'en a aucun.
- **Constat :** deux composants distincts, avec deux styles, deux comportements et deux libellés :

| | `.cta-flottant` (accueil) | `.sticky-cta` (25 pages) |
|---|---|---|
| Libellé | « Demander mon premier échange gratuit » | « Pré-diagnostic gratuit » |
| Destination | Calendly (nouvel onglet) | `contact.html` |
| Sur ordinateur | bouton flottant en bas à droite | masqué au-delà de 720 px |
| Disparaît quand… | un bloc CTA ou le pied de page arrive | le pied de page arrive |

- **Conséquence :** le visiteur ne reçoit pas la même proposition selon la page. Depuis l'accueil il est envoyé vers un agenda Calendly, depuis une page ressource vers un formulaire qui ne fonctionne pas (voir B2). Le doublon de libellé aggrave l'incohérence relevée en I5 et I6.
- **Point de vigilance signalé dans le brief :** le comportement du bouton flottant a été vérifié. Il gère correctement la zone de sécurité des écrans à encoche (`env(safe-area-inset-bottom)`), impose une hauteur minimale de 48 px sur mobile, rend au document la place qu'il occupe pour que le pied de page reste atteignable, se désactive à l'impression et respecte le réglage « mouvement réduit ». **Aucun défaut de recouvrement du pied de page ni de comportement sous 375 px n'a été mesuré.** Une réserve mineure : sur `.sticky-cta`, la barre ne disparaît qu'à l'arrivée du **pied de page**, pas à l'arrivée du bloc d'appel à l'action — les deux boutons coexistent donc brièvement à l'écran, alors que le commentaire du code annonce l'inverse.
- **Correction :** unifier sur un seul composant et un seul libellé, et faire disparaître la barre dès qu'un bloc CTA entre à l'écran.

```js
// assets/js/signature.js ligne 522 — observer aussi les blocs CTA
var pied = document.querySelector("footer, .footer");
var bandes = document.querySelectorAll(".cta-band, [data-cta]");
// puis masquer si l'un ou l'autre est visible
```

- **Gravité : Important.**

---

### 4.5 Qualité du code

#### I12 — La charte de couleurs de référence ne décrit pas le site

- **Constat :** la charte annoncée (`#0B1C2C` marine, `#B08D57` doré, `#FFFFFF`, `#1A1A1A`) ne correspond pas au système réellement en place. Le code définit **33 couleurs distinctes**, dont un vert `#17614F` qui est la couleur dominante du site : tous les boutons principaux, tous les liens actifs, tous les accents.

| Couleur de la charte | Usages dans le code | Rôle réel |
|---|---:|---|
| `#0B1C2C` marine | 9 | titres, fonds sombres — conforme |
| `#B08D57` doré | 8 | accents décoratifs uniquement |
| `#1A1A1A` encre | 7 | texte courant — conforme |
| `#FFFFFF` blanc | 1 | fonds de carte — conforme |
| **`#17614F` vert** | **couleur d'accent du système** | **absent de la charte de référence** |

Trois variantes de doré coexistent par ailleurs : `#B08D57` (charte), `#B9924F` (variable `--brass`) et `#8A6A2F` (version assombrie pour respecter les contrastes).
- **Conséquence :** aucune conséquence pour le visiteur — le système est cohérent et lisible. En revanche, toute personne qui reprendra le site en se fiant à la charte fera des choix contradictoires. C'est un risque de dérive à moyen terme.
- **Correction :** mettre la charte à jour pour qu'elle décrive le système réel, ou décider que le doré redevient l'accent principal — ce qui suppose de revoir les contrastes, `#B08D57` ne mesurant que 3,09:1 sur blanc.
- **Gravité : Important.**

---

## 5. Constats souhaitables

| # | Constat | Où | Conséquence | Gravité |
|---|---|---|---|---|
| S1 | 31 étiquettes affichées entre 10,6 et 12 px (catégories d'article, durées de lecture, sur-titres, mentions du pied de page) | 27 pages | Sous le seuil de confort de lecture. Ces textes cumulent souvent petite taille **et** contraste faible (voir I9) : les corriger ensemble | Souhaitable |
| S2 | Le logo du menu mesure 34 px de haut, les liens légaux du pied de page environ 22 px | 27 pages | Sous les 44 px recommandés pour une cible tactile. Les liens à l'intérieur des paragraphes sont exemptés par la norme ; seuls ces deux cas sont concernés | Souhaitable |
| S3 | 4 fichiers image jamais utilisés : `fenetre-balcon.jpg` (151 Ko), `fenetre-balcon.webp` (111 Ko), `fenetre-balcon-tiny.jpg`, `hero-immeuble.svg` | `assets/img/` | 271 Ko déployés sans jamais être servis. Aucun effet visiteur, mais alourdit le dépôt et les sauvegardes | Souhaitable |
| S4 | CSS et JavaScript non minifiés | `assets/css/`, `assets/js/` | 178 Ko bruts, mais **≈ 45 Ko une fois compressés** par l'hébergeur. Le gain d'une minification serait d'environ 10 Ko compressés — réel mais modeste | Souhaitable |
| S5 | `404.html` : pas d'URL canonique, pas de manifeste d'application, description de 48 caractères | `404.html` | Page d'erreur, faible enjeu. Elle est en revanche la seule page sans aucun lien entrant | Souhaitable |
| S6 | À l'ouverture du menu mobile, le focus clavier reste sur la page et n'entre pas dans le menu | 27 pages | Une personne naviguant au clavier doit tabuler à travers la page avant d'atteindre les liens du menu. Le menu se ferme correctement avec Échap, et `aria-expanded` est à jour | Souhaitable |
| S7 | `body:has(.cta-flottant)` applique en permanence 5 rem de marge basse | `assets/css/style.css:4663` | Un espace vide subsiste en bas de la page d'accueil sur mobile même quand la barre est masquée | Souhaitable |
| S8 | Le `sitemap.xml` porte 4 dates de dernière modification différentes (17, 21, 22 et 30 août) | `sitemap.xml` | Des pages modifiées récemment déclarent une date ancienne. Google s'y fie pour prioriser sa recrawl | Souhaitable |
| S9 | 20 déclarations `!important` dans `style.css` | `assets/css/style.css` | Complique les évolutions futures. Volume raisonnable pour 4 848 lignes ; `signature.css` n'en contient aucune | Souhaitable |
| S10 | Aucun bouton flottant sur `contact.html` | `contact.html` | Choix probablement volontaire — le formulaire est la page. À confirmer | Souhaitable |
| S11 | La mention « L'avis d'un professionnel du droit est recommandé » figure en tête des deux pages légales | `mentions-legales.html`, `politique-confidentialite.html` | Ce commentaire de rédaction est visible par le public. À retirer avec les crochets (voir B3) | Souhaitable |
| S12 | Un `<h3>` de 11,2 px dans le pied de page (« Le cabinet », « Prestations ») | 27 pages | Titre de section plus petit que le texte courant : la hiérarchie visuelle est inversée | Souhaitable |

---

## 6. Points vérifiés et conformes

Cette section existe pour éviter de refaire ces vérifications. Chaque ligne a été mesurée, pas supposée.

### Responsivité — aucun défaut

- **Débordement horizontal :** mesuré sur **27 pages × 8 largeurs** (320, 375, 414, 768, 1024, 1280, 1440, 1920 px), soit 216 mesures. **Aucune page ne provoque de défilement latéral.** Le seul signalement obtenu (`ressources.html` à 320 px) s'est révélé être un artefact de la barre de défilement du navigateur de test ; la reprise de la mesure sans barre de défilement ne montre aucun débordement.
- **Grilles et blocs :** aucun élément ne dépasse la largeur de son conteneur à 320 et 375 px. Les grilles se réorganisent correctement en colonne unique.
- **Images :** les 6 images de contenu ont toutes `max-width: 100 %`, des dimensions déclarées (ce qui évite les sauts de mise en page au chargement) et `loading="lazy"` lorsqu'elles sont sous la ligne de flottaison. Aucune image ne dépasse 250 Ko. Le format WebP est déjà servi via `<picture>` sur les trois pages qui portent des photos, avec un aperçu flou en attendant le chargement.
- **Tableaux :** les 3 tableaux du site (`mentions-legales.html`, `politique-confidentialite.html`) sont encapsulés dans un conteneur `.table-scroll` qui défile horizontalement sans casser la page.
- **Balise `viewport` :** présente et correcte (`width=device-width, initial-scale=1`) sur les **27 pages**.
- **Zone de sécurité des écrans à encoche :** `env(safe-area-inset-bottom)` correctement appliquée aux trois éléments fixés en bas d'écran.

### Accessibilité — conforme hors I9 et I10

- **Hiérarchie des titres :** exactement un `<h1>` par page, aucun saut de niveau, sur les 27 pages.
- **Langue :** `lang="fr"` sur les 27 pages. Encodage déclaré sur les 27 pages.
- **Textes alternatifs :** les 6 images de contenu ont un `alt` descriptif renseigné. Aucun `alt` manquant, aucun `alt` vide inapproprié.
- **Libellés de liens :** **aucun** libellé générique de type « en savoir plus », « cliquez ici » ou « lire la suite » sur l'ensemble du site.
- **Formulaire :** chaque champ possède un `<label>` visible et correctement associé. La case de consentement est enveloppée dans son propre `<label>`, **n'est pas pré-cochée**, renvoie vers la politique de confidentialité et précise la finalité. Les champs obligatoires sont signalés par un astérisque **et** par l'attribut `required` **et** par une mention explicite « Champs obligatoires » — donc pas seulement par la couleur. Les erreurs sont annoncées aux lecteurs d'écran (`role="alert"`, `aria-invalid`), et le focus est déplacé sur le premier champ en erreur.
- **Navigation clavier :** aucun `tabindex` positif (qui casserait l'ordre de tabulation). Un lien d'évitement présent sur les 27 pages. Un contour de focus visible défini globalement (2,5 px). Menu mobile : `aria-expanded` et `aria-hidden` correctement mis à jour à l'ouverture et à la fermeture, touche Échap fonctionnelle.
- **Mouvement réduit :** `prefers-reduced-motion` respecté dans les 4 fichiers CSS et JavaScript (9 occurrences).

### Sections récemment éclaircies — aucune trace de texte clair sur fond clair

Vérification ciblée demandée. Contrastes mesurés dans le navigateur :

| Section | Élément | Mesure |
|---|---|---|
| « Le déroulé » — `approche.html` | numéros d'étape | `#8A6A2F` sur blanc — **5,02:1** |
| | titres d'étape | `#0B1C2C` sur blanc — **17,26:1** |
| | textes d'étape | `#1A1A1A` sur blanc — **17,40:1** |
| | étiquettes | `#0B1C2C` sur `#F7F8FA` — **16,24:1** |
| « systématiquement commenté à l'oral » | passage mis en valeur | `#0B1C2C` sur blanc — **17,26:1** |
| « La relation » — `a-propos.html` | titres | `#071320` sur blanc — **18,70:1** |
| | textes | `#415769` sur blanc — **7,52:1** |
| Accroche finale — `approche.html` et `a-propos.html` | `.cta-band__accroche` | `#E8EDF2` sur `#071320` — **15,87:1** |

**Aucun résidu de texte clair hérité d'un fond sombre.** Ces sections sont correctes.

### Alignement des blocs numérotés et centrage des boutons

- **`syndic-professionnel.html`, bloc « Trois choses à savoir » :** les trois titres sont alignés. Mesures : `left = 94,6 px` identique pour les trois à 375 px ; `left = 108,3 px` à 768 px ; `top = 596,0 px` identique sur les trois colonnes à 1440 px. À 375 px, le troisième titre passe sur deux lignes et se réaligne sur son premier mot, sans passer sous le numéro.
- **Boutons d'appel à l'action :** décentrage mesuré à **0,0 px** sur les deux pages profils, aux trois largeurs 375, 768 et 1440 px. Hauteur de 54 à 73 px selon le retour à la ligne du libellé — au-dessus du plancher de 44 px.
- **Réserve :** ce contrôle n'a été fait que sur les deux pages profils. Le centrage des boutons des 25 autres pages n'a pas été mesuré individuellement.

### Code et liens

- **Erreurs JavaScript :** **aucune** sur les 12 pages testées dans un navigateur réel (`index`, `services`, `approche`, `a-propos`, `contact`, `faq`, `ressources`, les 3 pages profils, `404`, `mentions-legales`). Aucune ressource en échec de chargement.
- **Liens internes :** **aucun lien mort.** Tous les `href` internes pointent vers un fichier existant.
- **Ancres :** **toutes les ancres internes résolvent.** En particulier, aucun lien ne pointe vers une ancre `#tarifs` — la section renommée n'a laissé aucun lien orphelin.
- **Identifiants :** aucun identifiant dupliqué sur les 27 pages.
- **Attributs :** aucun attribut dupliqué dans une même balise.
- **Structure HTML :** l'arbre des balises se referme correctement sur les 27 pages. Un `<header>`, un `<nav>`, un `<main>` et un `<footer>` par page ; les articles de ressources utilisent bien `<article>`.
- **Liens externes :** 13 destinations externes, toutes vers des sources publiques (service-public.fr, registre-coproprietes.gouv.fr, france-renov.gouv.fr, ANIL, CNIL) plus un lien Calendly. **Tous les liens ouverts dans un nouvel onglet portent `rel="noopener"`** — aucune faille.
- **Compatibilité navigateurs :** les propriétés CSS modernes employées (`:has()` — 1 usage, `backdrop-filter` — avec préfixe `-webkit-`, `aspect-ratio`, `inset`) et les API JavaScript (`IntersectionObserver`, `requestAnimationFrame`, `matchMedia`, `closest`) sont toutes supportées par les deux dernières versions de Chrome, Firefox et Edge. **Pour Safari :** `:has()` depuis Safari 15.4 (mars 2022), `aspect-ratio` depuis Safari 15, `backdrop-filter` supporté avec le préfixe présent dans le code. Aucun risque identifié.

### Référencement — socle en place

- **Titres et descriptions :** tous **uniques** sur les 27 pages, aucun doublon. URL canonique présente sur 26 pages sur 27 (absente sur `404.html`, ce qui est normal).
- **Open Graph :** 7 balises par page sur les 21 pages de contenu, 10 sur `index.html`. Image de partage définie.
- **Données structurées :** riches et variées — `ProfessionalService`, `Organization` (13 pages), `BreadcrumbList` (21 pages), `FAQPage` (5 pages), `Article` (13 pages), `HowTo`, `OfferCatalog` avec tarifs. Le balisage `ProfessionalService` demandé est bien présent.
- **`sitemap.xml` :** 26 URL, **parfaitement cohérent** avec les pages publiées — aucune page manquante, aucune URL sans fichier. `404.html` en est exclue, ce qui est correct.
- **Scripts :** les deux fichiers JavaScript sont chargés en `defer` sur les 27 pages — ils ne bloquent pas l'affichage.

### Performance — estimation

**Ces chiffres sont une estimation faite à partir des fichiers, pas une mesure sur un vrai réseau.** Une mesure réelle doit être faite après mise en ligne (voir section 8).

| Indicateur | Valeur |
|---|---|
| Socle commun (CSS + JS) | 178 Ko bruts, **≈ 45 Ko compressés** |
| Page médiane | 197 Ko bruts |
| Page la plus lourde | `a-propos.html` — 403 Ko (2 photos) |
| Page la plus légère | `404.html` — 186 Ko |
| Images au-delà de 250 Ko | aucune |

- **LCP (temps d'affichage du plus grand élément) :** favorable. La feuille de style principale est préchargée sur `index.html`, la photo d'accueil porte `fetchpriority="high"`, et un aperçu flou s'affiche pendant le chargement. Sur les 22 pages sans photo, l'élément le plus grand est du texte : l'affichage ne dépend que du CSS.
- **CLS (stabilité de la mise en page) :** favorable. Toutes les images déclarent leurs dimensions, ce qui réserve la place avant le chargement. Aucune police web n'est chargée (I10), donc aucun décalage de substitution de police.
- **INP (réactivité) :** favorable. JavaScript léger (43 Ko bruts, 11 Ko compressés), aucune bibliothèque externe, animations en CSS sur `transform` et `opacity` uniquement.

---

## 7. Plan d'action proposé

Les lots sont classés du plus rentable au moins urgent. Les estimations sont des ordres de grandeur pour une personne connaissant le projet.

### Lot 1 — Débloquer la mise en ligne · ~2 h + informations du cabinet

Sans ce lot, le site ne peut pas être publié utilement.

| Action | Constat | Charge |
|---|---|---|
| Retirer `X-Robots-Tag: noindex` de `vercel.json` | B1 | 5 min |
| Brancher le formulaire sur un service de réception | B2 | 1 h |
| Remplir les 18 champs des pages légales et retirer les mentions de rédaction | B3, S11 | 1 h + collecte des informations |
| Vérifier le domaine dans `robots.txt` et retirer la ligne de consigne | I4 | 5 min |

### Lot 2 — Rétablir la cohérence du discours · ~3 h

Le plus rentable après le lot 1 : trois remplacements couvrent 31 occurrences sur 14 pages.

| Action | Constat | Charge |
|---|---|---|
| Remplacer « pré-diagnostic » partout | I5 | 1 h |
| Unifier le libellé du bouton principal | I6 | 45 min |
| Trancher sur « sans relance » et harmoniser | I7 | 30 min |
| Faire valider par le cabinet les affirmations engageantes (délai, zone, tarifs, pourcentages) | I8 | réunion |

### Lot 3 — Rétablir la navigation · ~2 h

| Action | Constat | Charge |
|---|---|---|
| Ajouter une colonne « Vous êtes » au pied de page des 27 pages | I1 | 1 h |
| Ajouter des liens contextuels vers `approche.html` depuis `index` et `services` | I2 | 30 min |
| Régénérer le `sitemap.xml` avec des dates cohérentes | S8 | 15 min |

### Lot 4 — Accessibilité et lisibilité · ~3 h

| Action | Constat | Charge |
|---|---|---|
| Assombrir `--ink-300` et les numéros d'étape de `syndic-professionnel` | I9 | 30 min |
| Relever les étiquettes de 10,6–12 px à 13 px minimum | S1 | 1 h |
| Trancher sur les polices : les charger ou aligner la charte sur les polices système | I10 | 1 h |
| Porter le logo et les liens légaux à 44 px de zone cliquable | S2 | 30 min |

### Lot 5 — Finitions · ~3 h

| Action | Constat | Charge |
|---|---|---|
| Unifier les deux mécanismes de bouton flottant | I11 | 1 h 30 |
| Mettre la charte de couleurs à jour | I12 | 45 min |
| Raccourcir titres et descriptions des pages prioritaires | I3 | 1 h |
| Supprimer les 4 images inutilisées | S3 | 10 min |
| Déplacer le focus dans le menu mobile à l'ouverture | S6 | 30 min |
| Corriger la marge permanente du bouton flottant | S7 | 10 min |
| Compléter `404.html` | S5 | 15 min |
| Minifier CSS et JavaScript à la publication | S4 | 30 min |

**Charge totale estimée : environ 13 heures**, hors collecte des informations légales et hors validation des engagements commerciaux, qui relèvent du cabinet.

---

## 8. À vérifier en conditions réelles

Ces points ne peuvent pas être établis par analyse du code. Méthode recommandée pour chacun.

| Point | Pourquoi l'analyse statique ne suffit pas | Méthode recommandée |
|---|---|---|
| **Core Web Vitals réels** | Les chiffres de la section 6 sont calculés sur les fichiers. Le temps d'affichage réel dépend du réseau, de l'appareil et du cache de l'hébergeur | PageSpeed Insights sur l'URL de production, puis suivi dans la Search Console (données de terrain, 28 jours glissants) |
| **Rendu sur Safari iOS** | Le test a été fait sur Chrome. Safari gère différemment `backdrop-filter`, `env(safe-area-inset-*)` et la hauteur de fenêtre lors du défilement | Ouvrir le site sur un iPhone réel, en particulier `index.html` (bouton flottant) et `contact.html` (formulaire), en orientation portrait et paysage |
| **Parcours clavier complet** | Le nombre d'éléments focalisables et l'absence de `tabindex` positif ont été vérifiés, mais pas le parcours réel | Parcourir chaque page à la touche Tab du début à la fin, sans souris. Vérifier que le contour de focus est toujours visible et qu'aucun élément ne piège le curseur |
| **Lecteurs d'écran** | La présence des attributs a été vérifiée, pas leur restitution | Tester `contact.html` avec NVDA (Windows) et VoiceOver (Mac/iOS) : annonce des erreurs, du caractère obligatoire, du menu mobile |
| **Liens externes** | Aucune requête réseau sortante n'a été faite pendant cet audit. Les 13 liens externes ont été listés mais **leur validité n'a pas été testée** | Passer un vérificateur de liens sur l'URL de production, ou tester manuellement les 13 destinations |
| **Lien Calendly** | Le lien `calendly.com/contact-coproperformanceconseil/point-decouverte` n'a pas été ouvert | Vérifier que l'agenda existe, est publié et que les créneaux sont ouverts |
| **Comportement au changement d'orientation** | Non testable de façon fiable en navigateur automatisé | Faire pivoter un téléphone réel avec le menu mobile ouvert et vérifier que le menu reste utilisable |
| **Exactitude des affirmations engageantes** | Relève du cabinet, pas de la technique | Validation interne : le délai de 48 h ouvrées est-il tenable, la couverture « toute la France » est-elle assumée, les tarifs de 400 € et 80 €/mois sont-ils à jour |
| **Centrage des boutons sur les 25 autres pages** | Mesuré uniquement sur les deux pages profils | Contrôle visuel rapide à 375 et 1440 px sur `services`, `approche`, `a-propos`, `faq`, `ressources` |
| **Compression réellement servie** | La compression gzip/brotli dépend de la configuration de l'hébergeur, non lisible dans le dépôt | Vérifier l'en-tête `content-encoding` sur l'URL de production |

---

*Aucun fichier du site n'a été modifié lors de cet audit. Ce rapport est le seul fichier créé.*
