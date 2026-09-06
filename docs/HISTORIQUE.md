# Historique du projet — décisions et arbitrages

> **Document de travail interne.**
> Il retrace les retours reçus, ce qui a été modifié en conséquence et
> pourquoi. Il n'est pas nécessaire à l'exploitation du site : pour cela,
> voir le [`README.md`](../README.md) à la racine.
>
> Les points signalés ⚠️ dans ce document sont des **décisions en attente** :
> ils sont repris et suivis dans [`CONTENU-A-VALIDER.md`](CONTENU-A-VALIDER.md).

---

> **Note de relecture — septembre 2026.** Depuis la rédaction de ce document,
> les pages ont été regroupées dans `pages/` (sauf `index.html` et `404.html`,
> restés à la racine). Les noms de fichiers cités ci-dessous sont inchangés,
> seul leur chemin a bougé. Voir [`PAGES.md`](PAGES.md).

## Retour client — ce qui a été repris

Quatre demandes, traitées et mesurées.

### 1. « La page d'accueil est très longue »

Mesuré avant : **14 409 px, soit 16 écrans, sur 13 sections**. Après : **8 518 px,
9,5 écrans, 7 sections** — 41 % de moins.

Rien n'a été jeté. Les sections retirées de l'accueil ont rejoint la page où
elles ont leur place :

| Section | Devenue |
|---|---|
| « Ce que nous ouvrons » (les pièces) | `approche.html`, après les cinq étapes |
| Bandeau photo | `approche.html` |
| « Ce sur quoi vous pouvez compter » | `a-propos.html`, après l'indépendance |
| « Problématique » + « Notre rôle » | fondues en une section de trois points |
| « Pourquoi nous » | déjà traitée en détail sur `a-propos.html` |
| Frise défilante | supprimée (décorative) |

Les prestations passent de 2 à 3 colonnes : cinq cartes tiennent en deux rangées
au lieu de trois. Les étapes de la méthode utilisent la variante
`.steps--compact` sur l'accueil ; `approche.html` garde la version détaillée.

### 2. « L'intérêt n'est pas lisible » et « l'audit est gratuit »

- Le sur-titre du hero nomme désormais la cible : **« Pour les conseils syndicaux »**.
- Le sous-titre dit ce que le conseil syndical **y gagne**, plus ce que le cabinet fait.
- Une mention **Gratuit** est posée juste au-dessus du bouton (`.hero__free`) :
  c'est l'objection qu'elle lève, elle doit donc se voir avant le bouton.
- Le bouton principal devient « Demander mon pré-diagnostic gratuit ».
- Une section « Votre intérêt » remplace deux sections par trois bénéfices directs.

> **Les tarifs n'ont pas bougé.** L'audit complet reste à partir de 400 €.
> Ce qui est gratuit — et qui l'était déjà — c'est le premier échange et le
> pré-diagnostic écrit. Annoncer « audit gratuit » aurait contredit la grille
> de `services.html`, de la FAQ et des données structurées.

### 3. « Rendre tout responsive : téléphone, tablette, PC »

C'était un vrai bug, pas une impression : **la page débordait horizontalement
en dessous de 420 px**. Trois causes, aucune visible au-dessus de 768 px.

1. **`min-width: auto` sur les éléments de grille.** Un `<select>` prend la
   largeur de sa plus longue option — ici « Un accompagnement du conseil
   syndical ». Il élargissait son champ, puis le formulaire, puis la page.
2. **Chaînes insécables.** `contact@coproperformanceconseil.fr` mesure 261 px
   et ne comporte aucun point de césure.
3. **Les révélations latérales.** `[data-reveal="right"]` décale l'élément de
   26 px *en attendant* d'être déclenché : tout bloc encore sous la ligne de
   flottaison poussait la page vers la droite.

Correctifs dans `style.css` § 16 bis. Ajouté au passage : champs à 16 px sous
640 px (en deçà, iOS zoome au focus), cibles tactiles à 44 px, boutons pleine
largeur sur mobile.

**Vérifié : aucun débordement sur les 11 pages, à 320 / 360 / 390 / 414 / 768 /
1024 / 1440 px.**

### 4. Page « Ressources »

`ressources.html` : six repères pour les conseils syndicaux, chacun renvoyant à
sa source officielle. Ajoutée à la navigation, au menu mobile, au plan du site
et au `sitemap.xml`, avec ses propres données structurées (`CollectionPage` +
`ItemList`).

**Chaque lien externe a été testé en HTTP 200 avant d'être écrit.** Les six
fiches `service-public.fr` retenues ont été trouvées par balayage et vérifiées
une par une — plusieurs identifiants plausibles renvoyaient un 404, ou une page
sans rapport avec la copropriété.

> **Legifrance ne figure pas dans les sources.** Le site renvoie 403 à toute
> requête automatisée, y compris sur sa racine : ses liens profonds n'ont pas pu
> être vérifiés. Les textes sont donc cités par leur nom, sans lien. À ajouter à
> la main si vous les vérifiez vous-même.

#### Sur l'effet SEO attendu

Une précision utile, parce que l'attente exprimée repose sur un malentendu
courant : **les liens sortants vers des sites .gouv.fr n'apportent pas de
référencement.** Le « jus » SEO circule des liens *entrants* vers votre site,
pas l'inverse. Citer des sources officielles sert la **crédibilité** et la
cohérence thématique — ce qui compte — mais ne fait pas venir Google.

Ce qui amènera réellement du trafic sur cette page :

1. **Le contenu lui-même**, qui répond à des questions réellement tapées
   (« que peut demander le conseil syndical au syndic », « comment lire les
   charges de copropriété »). C'est là qu'est la valeur de la page.
2. **Le retrait du `noindex`.** Tant que l'en-tête `X-Robots-Tag: noindex,
   nofollow` reste dans `vercel.json`, **cette page ne sera jamais indexée** et
   tout le reste est sans effet. C'est le point bloquant numéro un.
3. **La soumission du `sitemap.xml`** dans la Google Search Console, une fois le
   domaine réel branché.

---


## L'accueil comme aiguillage

Demande du client : *« la page d'accueil doit être minimaliste, vu que l'on
redirige le trafic sur différentes pages en fonction du type de personne »*.

### Ce que ça donne

**2 273 px, 2,5 écrans**, contre 14 409 px et 16 écrans au point de départ —
**84 % de moins**. Trois blocs, dans cet ordre :

1. **Le sélecteur** « Vous êtes… », cinq portes d'entrée
2. **Le hero** et son calque de relevé
3. **Une bande de clôture** : les cinq prestations en liste, la gratuité, un bouton

Ont quitté l'accueil : les cartes de prestations, la grille tarifaire, la
méthode, la FAQ et la section « Votre intérêt ». Tout existe sur `services.html`,
`approche.html`, `faq.html` et sur les pages profil.

### Pourquoi de vraies pages, et pas un filtre JavaScript

| | Vraies pages | Filtre JS |
|---|---|---|
| Référencement | chaque page vise ses requêtes | tout reste sur `/` |
| Lien partageable | oui | non |
| Sans JavaScript | fonctionne | rien ne s'affiche |
| Mesure | on sait quel profil convertit | invisible |

Les cinq cartes sont des `<a href>`. Aucune ne dépend du JavaScript.

### Les quatre pages profil

| Page | Angle d'attaque | Prestations retenues |
|---|---|---|
| `conseil-syndical.html` | Contrôler sans y passer ses soirées | 4 |
| `coproprietaire.html` | Comprendre son appel de fonds | 2 |
| `syndic-benevole.html` | Ne pas être seul face aux textes | 3 |
| `syndic-professionnel.html` | Objectiver un dossier | 3 |

Chacune attaque par un problème **réellement distinct** et propose un
sous-ensemble différent de prestations. C'est la condition pour que Google ne
les lise pas comme des quasi-doublons et n'en garde qu'une.

**Le bouton final pré-remplit le formulaire** : `contact.html?profil=…`
sélectionne la qualité correspondante. Le visiteur a déjà dit qui il était en
page d'accueil ; le lui redemander serait une question de trop. Une valeur d'URL
inconnue est ignorée — un paramètre d'URL est une saisie extérieure, jamais une
consigne.

### ⚠️ Le point à trancher : « syndic professionnel »

Ajouter ce profil met en tension le positionnement du site. **Neuf affirmations
deviennent fausses** si un syndic peut vous mandater et vous rémunérer :

| Où | Affirmation |
|---|---|
| `index.html` | « Aucun lien avec un syndic » (hero) |
| `index.html` | « Un tiers, pas une partie » · « Notre seul mandant est la copropriété » |
| `index.html` ×2 | « rémunérés uniquement par la copropriété qui nous mandate » (FAQ + JSON-LD) |
| `approche.html` | « La copropriété nous mandate et nous rémunère. Personne d'autre. » |
| `a-propos.html` | « Un seul mandant : la copropriété. » |
| `faq.html` | « rémunérés uniquement par la copropriété qui nous mandate » |

**Rien n'a été réécrit.** La page `syndic-professionnel.html` a été rédigée avec
le seul cadrage qui ne contredit aucune de ces phrases :

> Le syndic est **à l'origine** de l'intervention et en est l'interlocuteur ;
> le **syndicat des copropriétaires reste le mandant** et le payeur.

C'est aussi le cadrage qui rend le service vendable : un constat n'a de valeur
pour un syndic que s'il est perçu comme neutre par le conseil syndical.

La page porte une pastille **À valider** sur ce point. Deux suites possibles :

- **Ce cadrage est le bon** → retirer la pastille, rien d'autre à faire.
- **Vous entendez être payé directement par des syndics** → les neuf phrases
  ci-dessus doivent être réécrites. La formulation qui resterait vraie :
  *« Nous n'appartenons à aucun groupe de gestion immobilière et ne percevons
  aucune commission de prestataire »* — l'indépendance devient financière et
  structurelle, plus relationnelle.

---


## L'échelle typographique, resserrée

Retour client : *« le design est trop grand »*. C'était mesurable.

| | Avant | Après |
|---|---|---|
| `h1` à 1440 px | 59 px | **46 px** |
| `h2` | 47 px | **34 px** |
| Corps de texte | 17 px | **16 px** |
| Padding vertical de section | 128 px | **76 px** |
| Tuile du sélecteur | 254 px de haut | **132 px** |
| Page d'accueil | 2 925 px | **2 273 px** |

### Pourquoi la modification est globale et non limitée à l'accueil

La demande portait sur la page d'accueil. L'échelle typographique est pourtant
une décision de design system : une accueil 30 % plus dense que le reste du site
aurait produit un décrochage visible à chaque clic dans le menu. Les jetons
`--fs-*` et `--section-y` ont donc été resserrés **partout**, ce qui bénéficie
aussi aux pages longues — `services.html` passe de 10 900 à 8 944 px.

Les valeurs basses des `clamp()` bougent à peine : sur mobile, la taille était
déjà juste. C'est le haut de l'échelle — l'affichage sur grand écran — qui
tenait de l'affiche plutôt que du document professionnel.

### Le sélecteur, posé comme un diagramme

Une rangée de cartes ne dit pas qu'il faut choisir. Un arbre, si. Le sélecteur
est donc un schéma de branchement : nœud racine, tige, barre de distribution,
descentes, nœuds.

**Les traits sont tracés en CSS, pas en SVG.** Ils suivent ainsi la grille à
toutes les largeurs, sans qu'aucune coordonnée n'ait à être recalculée.

Deux détails de géométrie qui ne se voient que quand ils sont faux :

- La barre de distribution ne s'étend pas de 10 % à 90 %. Avec cinq colonnes et
  quatre gouttières, une demi-colonne vaut `(100% − 4 × gap) / 10` — soit 4,8 px
  de plus à 1440 px. Sans cette correction, la barre n'atteint pas les descentes
  extrêmes.
- **Sous 960 px** l'arbre bascule à la verticale : une colonne vertébrale à
  gauche, une amorce vers chaque nœud. Le seuil est haut parce qu'à 860 px un
  nœud tombe à 151 px et « Membre du conseil syndical » se brise sur trois lignes.
- La colonne vertébrale n'est pas un trait unique qu'on masquerait sous le
  dernier nœud : **chaque nœud porte son segment**, et le dernier s'arrête à son
  amorce. Le trait s'arrête parce qu'il n'est pas dessiné, pas parce qu'on le
  recouvre — une ruse au rectangle de fond casse dès que le fond change.

### Un défaut corrigé au passage

Le hero réservait la hauteur du header (`padding-top: calc(var(--header-h) + …)`)
alors qu'il n'ouvre plus la page depuis que le sélecteur le précède. Les deux
espacements se cumulaient : près de 200 px de vide entre les deux blocs. La règle
`.hero:not(:first-child)` supprime ce report.

Le titre du sélecteur est par ailleurs passé de `<h2>` à un paragraphe stylé : il
précédait le `<h1>` du hero, ce qui inversait la hiérarchie des titres. L'ordre
est désormais `H1 > H2 > H3`.

---


## Audit de responsivité

Mené avant transmission au client. **15 pages × 17 largeurs = 255 mesures**,
automatisées : chaque page est chargée une fois, puis le viewport varie sans
rechargement. Les animations de révélation sont neutralisées avant mesure —
sans quoi tout bloc encore sous la ligne de flottaison serait mesuré à son
état initial, décalé et transparent, et non à sa place réelle.

Largeurs couvertes : 320, 360, 375, 390, 412, 428, 480, 600, 640, 768, 820,
1024, 1180, 1280, 1440, 1920, plus 844 × 390 en paysage. La mesure à 640 px
tient lieu de **zoom 200 %** sur un portable 1280.

### Résultat

| Contrôle | Avant | Après |
|---|---|---|
| Débordement horizontal | **0 / 255** | 0 / 255 |
| Lignes de plus de 95 caractères | 18 cas | **0** |
| Cibles tactiles sous 44 px | 255 cas | **87, tous ≥ 1024 px** (souris) |
| Texte sous 10,5 px | 4 composants | **0** |
| Champs déclenchant le zoom iOS | 0 réel | 0 réel |

### Ce qui a été corrigé

- **Texte sous le plancher de lisibilité.** Les onglets « Pièce 01 » du dossier
  tombaient à **9,0 px**, les sur-titres du relevé à 9,9 px, la baseline du logo
  à 9,6 px. Tous remontés au-dessus de 10,5 px. Le public visé est composé de
  bénévoles souvent âgés : en dessous, la lecture devient un effort.
- **Mesure du texte.** Entre 721 et 960 px, les mises en page à deux colonnes se
  replient mais le conteneur reste large : les paragraphes s'étiraient jusqu'à
  **119 caractères**. Bornés à 74ch dans cette bande uniquement.
- **Cibles tactiles.** Navigation d'ancres des pages prestation (39 px) et logo
  (34 px) portés à 44 px sous 960 px.

### Les faux positifs, et pourquoi ils en sont

Un audit automatique signale beaucoup de choses ; les écarter demande de les
regarder une par une.

| Signalé | Verdict |
|---|---|
| `input` à 15,6 px sur contact | Le **piège à robots**, positionné à −9999 px. Jamais focalisé par un humain. |
| Case de consentement 18 × 18 px | **Tout le label (323 × 105) est cliquable et coche la case.** Cible réelle conforme. |
| Lien « politique de confidentialité » 160 × 18 | Lien **en plein milieu d'une phrase** : cas explicitement exempté par WCAG 2.5.5. |
| 87 cibles sous 44 px restantes | Toutes à **1024 px et au-delà** — liens de navigation au pointeur, pas au doigt. |
| `.flag` à 10,1 px | Les pastilles « À valider », marqueurs internes destinés à disparaître. |

### ⚠️ Un point à trancher avant l'envoi

**50 pastilles « À valider » sont visibles** sur le site :

| Page | Pastilles |
|---|---|
| `mentions-legales.html` | 17 |
| `politique-confidentialite.html` | 11 |
| `faq.html` | 9 |
| `a-propos.html` | 6 |
| `approche.html`, `contact.html`, `services.html` | 2 chacune |
| `syndic-professionnel.html` | 1 |

Elles signalent ce que le cabinet doit confirmer — c'est leur raison d'être. Mais
si le lien part vers un tiers, elles donnent l'impression d'un site inachevé.

Un interrupteur existe, documenté plus haut : ajouter `hide-flags` sur le `<body>`
les masque toutes sans les supprimer.

    <body class="hide-flags">

---


## Application du brief designer (août 2026)

Le brief reçu du client a été appliqué et **vérifié point par point** : un
script traduit chaque exigence en test sur le code réel, plutôt que de la
déclarer faite. **52 vérifications, 52 conformes.**

| Partie | Contenu | Vérifs |
|---|---|---|
| 1.1 | Suppression du profil « syndic bénévole » | 8 |
| 1.1+ | Ordre demandé : syndic pro, conseil syndical, copropriétaire | 2 |
| 1.2 | Repositionnement du syndic professionnel | 10 |
| 2 | Les six leviers de conversion | 15 |
| 3 | Corrections éditoriales | 12 |
| 4 | Corrections techniques | 3 |
| — | Bug de superposition signalé par le client | 2 |

### Deux points du brief qui ne demandaient aucune correction

**Le lien téléphone n'était pas cassé.** Le brief signalait un
`href="about:invalid#zCSafez"` empêchant l'appel. Cette chaîne n'existe nulle
part dans le code, ni en local ni en production : c'est un artefact du
sanitiseur de Chrome, produit lorsqu'une page est copiée depuis les outils de
développement. Le lien réel est `tel:+33617470857` et il fonctionne.

**Le repositionnement du syndic professionnel lève une contradiction**
signalée lors d'une itération précédente. En précisant que les prestations sont
« votées et prises en charge par le budget de la copropriété » et qu'elles « ne
portent jamais sur les contrats de syndic ni sur les honoraires », le brief
confirme que le mandant reste la copropriété. Les neuf affirmations
d'indépendance du site restent donc exactes : aucune n'a eu à être réécrite.

### Le bug de superposition, et sa cause

Le client a signalé le sur-titre « RESSOURCES » chevauchant le logo sur mobile.
La superposition existait en réalité **à toutes les largeurs**.

Le header est en `position: fixed` : il ne pousse rien. Sur toutes les pages, le
fil d'Ariane placé en tête de `<main>` fait office de dégagement — sauf sur
`ressources.html`, seule page à ouvrir directement sur `.page-head`, dont la
marge haute ne valait que 24 px.

Corrigé aux deux niveaux : le fil d'Ariane manquant a été ajouté (ses données
structurées `BreadcrumbList` l'annonçaient déjà), et une règle
`main > .page-head:first-child` réserve désormais la hauteur du header. Le
problème ne peut plus réapparaître sur une page future.

### ⚠️ Deux affirmations à confirmer avant diffusion large

Le brief fournit un cas pratique chiffré et un témoignage client :

- « Copropriété de 45 lots à Paris — 18 % de surcoût sur le chauffage »
- « Un rapport neutre qui nous a permis d'aborder l'AG en toute sérénité »

Ni l'un ni l'autre n'est vérifiable depuis le code. Les deux blocs portent une
pastille **À valider**. S'ils ne correspondent pas à des missions réelles, ils
doivent être retirés : publier un cas ou un avis client fabriqué relève de la
pratique commerciale trompeuse.

---


