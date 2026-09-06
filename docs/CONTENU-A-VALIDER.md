# Contenu à valider avant mise en ligne

> **À lire en premier.**
> Ce site a été conçu sans aucune source d'information sur l'entreprise :
> le dossier de départ était vide et aucune présence en ligne de
> « Copro Performance Conseil » n'a pu être trouvée.
>
> Tout le **contenu marketing** (accroches, argumentaires, structure éditoriale,
> FAQ) a donc été rédigé de zéro. En revanche, **aucun fait n'a été inventé** :
> pas de chiffres d'expérience, pas de nombre de copropriétés accompagnées, pas
> de pourcentage d'économies, pas de témoignage, pas de photo de personne.
>
> Chaque élément qui exige une confirmation du cabinet est signalé dans le site
> par une pastille `À valider` et listé ci-dessous.

---

> **Où sont les pages ?** Dans `pages/`, sauf `index.html` et `404.html`
> qui restent à la racine. Voir [`PAGES.md`](PAGES.md).

---

## Comment masquer les pastilles

Les pastilles sont là pour la relecture. Deux options :

**Provisoirement** — ajouter la classe `hide-flags` sur la balise `<body>` :

```html
<body class="hide-flags">
```

**Définitivement** — une fois chaque point tranché, supprimer les
`<span class="flag">…</span>` du HTML, puis le bloc `.flag` dans
`assets/css/style.css` (§ 08).

---

## 1. Identité et coordonnées — BLOQUANT

Ces éléments apparaissent dans le pied de page de **toutes** les pages, ainsi que
sur la page contact. Les valeurs actuelles sont des espaces réservés.

| Élément | Valeur actuelle (fictive) | Action |
|---|---|---|
| Nom de domaine | `www.copro-performance-conseil.fr` | Remplacer partout (voir § 6) |
| E-mail | `contact@copro-performance-conseil.fr` | Remplacer |
| Téléphone | `+33 6 17 47 08 57` | ✅ Confirmé par le client — affichage au format international, `tel:+33617470857` |
| Zone d'intervention | « France entière, à distance ou sur site » | Confirmer ou corriger |
| Horaires de disponibilité | Non renseignés | À fournir (page contact) |

---

## 2. Prestations — à confirmer

Les quatre prestations sont **une proposition**, construite d'après le
positionnement « conseil indépendant en copropriété » indiqué dans le brief.
Aucune n'a pu être vérifiée auprès d'une source.

| # | Prestation | À trancher |
|---|---|---|
| 01 | Audit de copropriété | Est-elle réellement proposée ? Sous ce nom ? |
| 02 | Analyse des charges | Idem — c'est celle présentée comme « la plus demandée », à confirmer |
| 03 | Analyse des contrats | Idem — la liste des contrats couverts est-elle exacte ? |
| 04 | Optimisation des charges | **Ajoutée sur demande.** Le cabinet propose-t-il vraiment cet accompagnement à la mise en concurrence ? |
| 05 | Accompagnement du conseil syndical | Idem — le format « dans la durée » correspond-il à l'offre ? |

**Si une prestation n'est pas proposée**, supprimer le bloc correspondant dans
`pages/services.html`, sa carte dans `index.html`, sa ligne dans les pieds de page et
son entrée dans le JSON-LD `hasOfferCatalog` de `index.html`.

**Si une prestation manque**, elle peut être ajoutée en dupliquant un bloc
`.service-block` existant.

---

## 2 bis. Tarifs — décision prise, montants à définir

Le site affiche désormais :

- **Premier échange + pré-diagnostic écrit : gratuit** — c'est le levier
  d'acquisition. Mis en avant sur l'accueil, la page Services et la FAQ.
- **Les cinq prestations : « Sur devis »** — aucun montant n'a été inventé.

À trancher par le cabinet :

- [ ] Le pré-diagnostic gratuit est-il réellement tenable ? Il engage un temps
      de travail non facturé sur chaque contact entrant.
- [ ] Que contient exactement ce pré-diagnostic gratuit ? Le site annonce
      « une trentaine de minutes + un retour écrit court ». À confirmer.
- [ ] Faut-il afficher une fourchette de prix plutôt que « Sur devis » ?
      Une fourchette rassure et filtre les demandes hors budget ; « Sur devis »
      préserve la marge de négociation.
- [ ] Si des montants sont retenus, remplacer les cinq « Sur devis » dans
      `pages/services.html` § Tarifs et retirer la pastille de validation.

> **Attention à la cohérence.** Le site affirme par ailleurs que l'honoraire
> n'est *jamais indexé sur les économies constatées*. Un tarif au succès
> contredirait ce positionnement — et l'argument d'indépendance qui en découle.

---

## 3. Engagements d'indépendance — VÉRIFIER AVEC SOIN

Ce sont les affirmations les plus fortes du site, et les plus engageantes
juridiquement. Elles découlent logiquement du positionnement « indépendant »,
mais elles décrivent un **modèle économique** qui doit être confirmé.

- [ ] « Aucune commission perçue auprès de prestataires ou d'entreprises de travaux »
- [ ] « Aucune appartenance à un groupe de gestion immobilière »
- [ ] « Rémunéré uniquement par la copropriété mandante »
- [ ] « Honoraire fixe, jamais indexé sur les économies constatées »
- [ ] « Nous ne vendons ni travaux ni contrats, aucune entreprise partenaire »
- [ ] « Nous ne tenons aucune liste de partenaires »

**Où** : `index.html` (sections « Pourquoi nous » et « Engagements »),
`pages/a-propos.html` (section « L'indépendance, concrètement »),
`pages/services.html` (section « Ce que nous ne faisons pas »),
`pages/faq.html` (thème 04).

> Une allégation d'indépendance inexacte relève de la pratique commerciale
> trompeuse (art. L.121-2 du Code de la consommation). À ne pas laisser passer.

---

## 4. Page « À propos » — section vide à remplir

La section « Qui est derrière Copro Performance Conseil » est **volontairement
laissée vide**, avec la liste des éléments à fournir. Aucun parcours, aucune
ancienneté et aucune qualification n'ont été inventés.

À fournir :
- [ ] Prénom, nom, fonction du ou des fondateurs
- [ ] Parcours professionnel et expérience du secteur
- [ ] Diplômes, certifications, affiliations éventuelles
- [ ] Année de création du cabinet
- [ ] Zone géographique d'intervention réelle
- [ ] Un portrait photographique professionnel

---

## 5. Pages légales — OBLIGATOIRES, incomplètes

`pages/mentions-legales.html` et `pages/politique-confidentialite.html` sont des **trames
conformes** au droit français, mais elles **ne peuvent pas être publiées en
l'état**. Tous les champs entre crochets `[…]` sont à renseigner.

### Mentions légales — champs manquants
- [ ] Forme juridique, capital social
- [ ] Adresse du siège social
- [ ] SIREN / SIRET, RCS, n° TVA intracommunautaire
- [ ] Nom du directeur de la publication
- [ ] Coordonnées complètes de l'hébergeur (nom, adresse, téléphone)
- [ ] Assurance de responsabilité civile professionnelle (si souscrite)
- [ ] Date de dernière mise à jour

### Politique de confidentialité — champs manquants
- [ ] Identité du responsable de traitement
- [ ] Adresse e-mail dédiée aux demandes RGPD
- [ ] Liste nominative des sous-traitants (hébergeur, messagerie, formulaire, stockage)
- [ ] Localisation des données et garanties en cas de transfert hors UE
- [ ] Confirmation des durées de conservation proposées
- [ ] Confirmation du point « aucun cookie » (vrai en l'état, à revoir si un outil de statistiques est ajouté)
- [ ] Date de dernière mise à jour

> Faire relire ces deux pages par un professionnel du droit avant publication.

---

## 6. Nom de domaine — à remplacer partout

Le domaine `https://www.copro-performance-conseil.fr` est un espace réservé.
Il apparaît dans :

- les balises `<link rel="canonical">` — **une par page**
- les balises `og:url` et `og:image` — **une par page**
- `robots.txt` (ligne `Sitemap:`)
- `sitemap.xml` (9 balises `<loc>`)
- les blocs JSON-LD de `index.html`, `pages/services.html`, `pages/approche.html`,
  `pages/a-propos.html`, `pages/faq.html`, `pages/contact.html`

Recherche / remplacement global sur `www.copro-performance-conseil.fr`.

---

## 7. Points de détail signalés dans le site

| Page | Élément | Question |
|---|---|---|
| `pages/approche.html` | Durée d'une mission | Ordre de grandeur à communiquer ? |
| `pages/approche.html`, `pages/faq.html` | Accord de l'AG / financement | Formulation prudente retenue — à faire valider juridiquement |
| `pages/faq.html` | Visite sur place | Proposée ? Facturée ? |
| `pages/faq.html` | Zone d'intervention sur site | Périmètre géographique réel |
| `pages/faq.html` | Tarification | Le principe « honoraire fixe, jamais au résultat » est-il exact ? |
| `pages/faq.html` | Références clients | Le principe « sur demande, avec accord » convient-il ? |
| `pages/services.html` | Bandeau « contenu à valider » en tête de page | À supprimer une fois les prestations confirmées |

---

## 8. Ce qui a été délibérément écarté

Pour mémoire, et conformément au brief — ces éléments **n'ont pas** été créés
faute de données réelles :

- ❌ Chiffres d'expérience (« X ans », « X copropriétés accompagnées »)
- ❌ Pourcentages d'économies moyennes
- ❌ Taux de satisfaction client
- ❌ Témoignages clients
- ❌ Logos de clients ou de partenaires
- ❌ Photographies de personnes (équipe, clients, portraits)
- ❌ Grille tarifaire
- ❌ Certifications ou labels

Le site est conçu pour **fonctionner sans eux** : la réassurance repose sur des
engagements de méthode plutôt que sur des preuves chiffrées. C'est un parti pris
crédible pour un cabinet indépendant, et il pourra être enrichi plus tard sans
refonte — voir `../README.md` § « Faire évoluer le site ».
