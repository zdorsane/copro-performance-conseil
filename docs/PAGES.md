# Inventaire des pages

**27 pages.** Ce document donne, pour chacune : son rang dans le parcours, son
rôle, son gabarit et son plan.

**Où se trouvent-elles ?** 25 pages dans **`pages/`**, deux à la racine :

| Fichier | Où | Pourquoi |
|---|---|---|
| `index.html` | racine | C'est le fichier servi quand on demande le domaine lui-même. Dans `pages/`, la page d'accueil n'aurait plus d'adresse. |
| `404.html` | racine | L'hébergeur la cherche à la racine pour répondre aux adresses inexistantes. Ailleurs, elle ne serait jamais servie. |
| les 25 autres | `pages/` | Aucune contrainte technique — c'est du rangement. |

> **Le nom du fichier est l'adresse publique** : `pages/services.html` se lit sur
> `coproperformanceconseil.fr/pages/services.html`. Déplacer ou renommer une
> page change donc son URL. Tant que le site n'est pas indexé, cela ne coûte
> rien ; **après la mise en production, il faudra une redirection 301** depuis
> l'ancienne adresse.
>
> À l'intérieur de `pages/`, les articles sont regroupés par **préfixe de nom**
> (`ressources-*`) : ils restent triés à côté de leur sommaire.

Sauf mention contraire, les fichiers cités plus bas sont dans `pages/`.

---

## Vue d'ensemble

| # | Page | Groupe | Rôle en une ligne |
|---|---|---|---|
| 1 | `index.html` *(racine)* | Entrée | Aiguiller le visiteur vers sa page profil |
| 2 | `syndic-professionnel.html` | Profil | Cible prioritaire : le syndic qui externalise |
| 3 | `conseil-syndical.html` | Profil | Le conseiller syndical qui veut contrôler sans y passer ses soirées |
| 4 | `coproprietaire.html` | Profil | Le copropriétaire qui veut comprendre ses charges |
| 5 | `services.html` | Cabinet | Les cinq prestations, en détail |
| 6 | `approche.html` | Cabinet | La méthode en cinq étapes |
| 7 | `a-propos.html` | Cabinet | Vision, convictions, indépendance |
| 8 | `ressources.html` | Ressources | Sommaire des 13 articles |
| 9–21 | `ressources-*.html` | Ressources | 13 articles de fond (détail plus bas) |
| 22 | `faq.html` | Conversion | 4 thèmes, questions fréquentes |
| 23 | `contact.html` | Conversion | Formulaire + coordonnées |
| 24 | `plan-du-site.html` | Service | Toutes les pages, classées |
| 25 | `mentions-legales.html` | Légal | ⚠️ Trame à compléter |
| 26 | `politique-confidentialite.html` | Légal | ⚠️ Trame à compléter |
| 27 | `404.html` *(racine)* | Service | Page d'erreur |

---

## Les sept gabarits

| Gabarit | Pages concernées | Structure |
|---|---|---|
| **Accueil** | `index.html` | Sélecteur de profil → hero → livrable → cas → contact → clôture |
| **Profil** | 3 pages | Problème vécu → bénéfices → prestations retenues → FAQ ciblée → CTA |
| **Cabinet** | `services`, `approche`, `a-propos` | Fil d'Ariane → page-head → sections → CTA |
| **Sommaire** | `ressources.html` | Fil d'Ariane → page-head → cartes d'articles → sources officielles |
| **Article** | 13 pages `ressources-*` | Fil d'Ariane → corps → « L'essentiel » → sources officielles → prestation liée → « À lire aussi » |
| **Légal** | 2 pages | Fil d'Ariane → sections numérotées |
| **Utilitaire** | `plan-du-site`, `404`, `contact` | Formats propres |

Pour créer une page, on part de la page existante du gabarit le plus proche —
voir [`DEVELOPPEMENT.md`](DEVELOPPEMENT.md) § 6.

---

## 1. Entrée

### `index.html` — Accueil

**Rôle.** L'accueil **aiguille, il n'expose pas.** Le visiteur doit se situer en
un coup d'œil et partir vers sa page profil. La page fait trois écrans.

| Section | Contenu |
|---|---|
| 1 | **Sélecteur de profil** — un nœud racine « Vous êtes… » qui se ramifie vers 4 destinations. Ce sont de vrais liens, pas des boutons JavaScript |
| 2 | **Hero** — promesse, premier échange gratuit, CTA, repères de confiance, photo sous calque de relevé |
| 3 | **Ce que vous recevez** — le livrable, illustré |
| 4 | **À quoi ressemble un constat** — cas pratique chiffré ⚠️ *à confirmer* |
| 5 | **Un interlocuteur à votre écoute** — canaux de contact |
| 6 | **Cinq prestations, un premier échange gratuit** — bande de clôture |

**Sorties :** les 4 pages profil, `services.html` (par ancres), `contact.html`.

---

## 2. Pages profil

Trois portes d'entrée, une par situation. Toutes suivent la même structure et
finissent sur `contact.html`, dont le formulaire est **pré-rempli avec la
qualité du visiteur** (module `initProfilUrl` de `signature.js`) : le visiteur
n'a pas à redire qui il est.

### `syndic-professionnel.html` — cible prioritaire

> H1 : *Un partenaire externe, pas un contrôleur.*

Trois choses à savoir (gratuit pour le cabinet · honoraires préservés · temps
gagné) → quatre bénéfices → ce que nous examinons et ne touchons pas → trois
étapes → prestations → approche → CTA.

⚠️ Le cadre commercial de cette page (gratuité pour le cabinet) est un point à
confirmer — voir [`CONTENU-A-VALIDER.md`](CONTENU-A-VALIDER.md).

### `conseil-syndical.html`

> H1 : *Contrôler la gestion, sans y passer vos soirées.*

Le problème (le temps manque, les repères manquent, le mandat est collégial) →
ce que vous y gagnez → trois hésitations, trois réponses → prestations → FAQ
ciblée → CTA.

C'est la page profil la mieux maillée : **9 pages y renvoient**, dont 6 articles
de ressources.

### `coproprietaire.html`

> H1 : *Comprendre ce que vous payez, vraiment.*

Le problème (la hausse est visible, sa cause ne l'est pas) → ce que vous y
gagnez → prestations → FAQ ciblée → CTA.

⚠️ **Point d'attention :** cette page n'est atteignable que depuis l'accueil.
Elle mériterait d'être reliée depuis les articles qui parlent de charges.

---

## 3. Le cabinet

### `services.html` — Les prestations

Cinq blocs, un par prestation, chacun sur le schéma **Problème → Intervention →
Bénéfice**, chacun avec son ancre :

| Ancre | Prestation |
|---|---|
| `#audit` | Audit complet des contrats |
| `#charges` | Analyse des dépenses de la copropriété |
| `#contrats` | Renégociation des contrats |
| `#optimisation` | Optimisation des charges |
| `#accompagnement` | Accompagnement et conseil |
| `#premier-echange` | Commencez sans rien dépenser |

Puis : ce que vous recevez · **ce que nous ne faisons pas** (le périmètre, dit
franchement) · CTA.

C'est la page la plus liée du site : **les 27 pages y renvoient**, via le pied
de page.

### `approche.html` — La méthode

Un constat sans source n'est qu'une opinion → **les cinq étapes** → ce que nous
ouvrons, pièce par pièce → ce que la mission demande de votre côté → questions
sur le déroulé → CTA.

### `a-propos.html` — Le cabinet

Le constat de départ → trois convictions → **l'indépendance, concrètement** → ce
sur quoi vous pouvez compter → comment nous travaillons avec vous → qui est
derrière Copro Performance Conseil → CTA.

---

## 4. Ressources — 1 sommaire + 13 articles

### `ressources.html` — le sommaire

Les 13 articles en cartes, puis « Où obtenir un conseil neutre et gratuit »
(ADIL, ANIL, associations) et un CTA.

> Le chapô annonce **treize articles**. Ce nombre est à mettre à jour à chaque
> ajout ou retrait.

### Les 13 articles

Ordre canonique — **identique** dans `ressources.html`, `plan-du-site.html` et
`sitemap.xml`. Le conserver.

| # | Fichier | Sujet |
|---|---|---|
| 1 | `ressources-droits-conseil-syndical.html` | Que peut demander le conseil syndical au syndic ? |
| 2 | `ressources-lire-ses-charges.html` | Comment lire les charges de sa copropriété |
| 3 | `ressources-assemblee-generale.html` | Préparer une assemblée générale |
| 4 | `ressources-contrat-syndic.html` | Le contrat de syndic : ce qu'il faut regarder |
| 5 | `ressources-renovation-energetique.html` | Rénovation énergétique : par où commencer |
| 6 | `ressources-registre-national.html` | Le registre national des copropriétés |
| 7 | `ressources-mise-en-concurrence-article-21.html` | Mise en concurrence : ce que dit l'article 21 |
| 8 | `ressources-forfait-syndic-prestations-particulieres.html` | Forfait et prestations particulières : la frontière |
| 9 | `ressources-reconduction-tacite-contrats-entretien.html` | Reconduction tacite : le calendrier à tenir |
| 10 | `ressources-comparer-devis-perimetre-commun.html` | Comparer des devis : la méthode du périmètre commun |
| 11 | `ressources-contrat-chauffage-p1-p2-p3.html` | Contrat de chauffage : P1, P2, P3 |
| 12 | `ressources-preparer-budget-previsionnel.html` | Préparer le budget prévisionnel, poste par poste |
| 13 | `ressources-reprendre-copropriete-pieces-a-rassembler.html` | Reprendre une copropriété : les pièces à rassembler |

**Structure commune à tous les articles :**

1. Fil d'Ariane `Accueil › Ressources › l'article`
2. Le corps de l'article, en sections `h2`
3. **« L'essentiel »** — le résumé encadré
4. **« Sources officielles »** — service-public.fr, Légifrance, ANIL…
5. **La prestation liée** — un pont vers `services.html`
6. **« À lire aussi »** — 2 à 3 articles voisins

Les articles sont le levier SEO longue traîne du site : ils visent des requêtes
précises que les pages commerciales ne peuvent pas capter.

---

## 5. Conversion

### `faq.html`

Quatre thèmes, chacun avec son ancre :

| Ancre | Thème |
|---|---|
| `#comprendre` | Comprendre la démarche |
| `#deroulement` | Déroulement d'une mission |
| `#pratique` | Aspects pratiques |
| `#confiance` | Indépendance et confidentialité |

L'accordéon est accessible et **s'ouvre automatiquement sur la question visée**
quand on arrive par une ancre.

### `contact.html`

Formulaire (validation, états, anti-spam, consentement RGPD) · autres moyens de
contact · ce qui se passe ensuite · engagements sur les données.

Le formulaire est branché sur **FormSubmit**, vers
`contact@coproperformanceconseil.fr`. ⚠️ L'adresse doit être **activée une
fois** chez le service avant que les messages arrivent — voir
[`DEPLOIEMENT.md`](DEPLOIEMENT.md) § 4.

---

## 6. Service et légal

### `plan-du-site.html`

Toutes les pages, classées en quatre colonnes : Le cabinet · Vous êtes… ·
Ressources · Aide et informations. À mettre à jour à chaque page ajoutée.

### `mentions-legales.html` ⚠️

Dix sections. **Trame incomplète** : éditeur, directeur de publication,
hébergeur, SIREN restent à renseigner. Obligation légale (LCEN art. 6-III).

### `politique-confidentialite.html` ⚠️

Onze sections, dont § 4 « Le sort des documents de copropriété » et § 7
« Cookies » (le site n'en dépose aucun). **Trame incomplète.**

### `404.html`

Page d'erreur, avec des chemins de secours vers les pages principales. Elle
n'est **pas** dans le `sitemap.xml`, volontairement.

---

## Maillage interne — état actuel

| Page | Nombre de pages qui y renvoient |
|---|---|
| `services.html`, `approche.html`, `ressources.html` | 27 (pied de page) |
| `conseil-syndical.html` | 9 |
| `syndic-professionnel.html` | 3 |
| `coproprietaire.html` | **2** ⚠️ |

Toute nouvelle page doit être reliée depuis **au moins deux** endroits : le plan
du site, et une page thématiquement voisine.
