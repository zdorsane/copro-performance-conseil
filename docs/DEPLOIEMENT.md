# Déploiement et mise en ligne

Le site est **statique** : aucun PHP, aucun Node côté serveur, aucune base de
données. N'importe quel hébergement de fichiers convient.

| | |
|---|---|
| **Site en ligne (préproduction)** | <https://copro-performance-conseil.vercel.app> |
| Adresse historique | <https://copro-site.vercel.app> (toujours valide) |
| **Dépôt** | <https://github.com/zdorsane/copro-performance-conseil> |
| **Projet Vercel** | `dorsanes-projects/copro-site` |
| **Domaine cible** | `coproperformanceconseil.fr` — *pas encore branché* |

---

## 1. Le cycle de travail courant

Le dépôt GitHub est **connecté au projet Vercel**. Publier une modification se
résume à :

```bash
git add -A
git commit -m "Description du changement"
git push
```

Vercel reconstruit et publie dans la foulée. Aucune commande de déploiement à
lancer à la main.

Pour vérifier qu'une mise à jour est bien en ligne :

```bash
curl -s https://copro-performance-conseil.vercel.app | grep -c signature.css
```

---

## 2. ⚠️ Trois points bloquants avant la mise en production

### 2.1 Retirer le `noindex`

`vercel.json` envoie aujourd'hui, sur toutes les pages :

```json
{ "key": "X-Robots-Tag", "value": "noindex, nofollow" }
```

C'est **volontaire** en préproduction : cela évite que l'adresse `.vercel.app`
soit indexée en doublon du domaine réel, ce qui pénaliserait le référencement.

**Une fois le domaine réel branché, supprimer cette entrée et redéployer.**
Sans cela, le site ne sera jamais référencé, quel que soit le travail de
référencement effectué par ailleurs.

### 2.2 Activer l'adresse chez FormSubmit

Le formulaire est branché sur FormSubmit, vers
`contact@coproperformanceconseil.fr`. Le service exige **une activation unique
de l'adresse destinataire** : tant qu'elle n'est pas faite, les envois sont
acceptés côté visiteur mais **aucun courriel n'arrive**.

C'est l'affaire de deux minutes, et cela se fait depuis le site publié — voir
§ 4 ci-dessous.

### 2.3 Compléter la politique de confidentialité

`mentions-legales.html` est renseignée depuis le 6 septembre 2026 (éditeur,
SIREN / SIRET, siège, directeur de la publication, hébergeur). ⚠️ Elle déclare
**Hostinger** comme hébergeur alors que le site est déployé sur **Vercel** :
cette contradiction est à lever avant publication.

`politique-confidentialite.html` reste une trame : responsable de traitement,
sous-traitants et durées de conservation restent à renseigner. Ces mentions sont
**obligatoires** (art. 6-III de la LCEN, RGPD art. 13).

Le détail est suivi dans [`CONTENU-A-VALIDER.md`](CONTENU-A-VALIDER.md).

---

## 3. Brancher le domaine réel

> ⚠️ `coproperformanceconseil.fr` sert déjà un autre site. Brancher le domaine
> sur Vercel le remplacera. À ne faire qu'une fois les trois points du § 2
> traités.

```bash
vercel domains add coproperformanceconseil.fr
vercel alias set copro-site.vercel.app coproperformanceconseil.fr
```

Puis, chez le registrar :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Enfin : retirer le `noindex` (§ 2.1) et soumettre `sitemap.xml` dans la Google
Search Console.

---

## 4. Le formulaire de contact

### Ce qui est en place

`pages/contact.html` poste vers **FormSubmit** :

```html
<form class="form" data-contact-form
      action="https://formsubmit.co/contact@coproperformanceconseil.fr"
      method="post" novalidate>
```

Aucun compte, aucune clé d'API : le service prend l'adresse destinataire
directement dans l'`action`. Les demandes arrivent par courriel sur
`contact@coproperformanceconseil.fr`, mises en page en tableau
(`_template`), avec pour objet « Nouvelle demande —
coproperformanceconseil.fr » (`_subject`), et sans page captcha intermédiaire
(`_captcha=false`).

`main.js` gère la validation, l'état de chargement, les messages de retour, le
piège à robots (`_honey`) et le consentement RGPD. À l'envoi, il bascule
l'adresse vers la variante `https://formsubmit.co/ajax/…`, qui répond en JSON :
le visiteur **ne quitte pas la page**.

Deux réglages complètent le circuit jusqu'à la boîte du cabinet :

| Réglage | Où | Effet |
|---|---|---|
| `_replyto` | ajouté à l'envoi par `main.js`, depuis le champ `email` | Répondre au courriel de notification écrit **au visiteur**, pas au service. Le champ n'est posé que s'il est rempli : vide, il écraserait la détection automatique du service. |
| `_next` | champ caché de `contact.html` | Sans JavaScript, le navigateur poste le formulaire normalement ; le service redirige alors vers `…/contact.html?envoi=ok` plutôt que vers sa propre page de remerciement, et `main.js` y affiche la même confirmation qu'en envoi normal, puis retire le paramètre de la barre d'adresse. |

> `_next` pointe sur le **domaine définitif**. Tant que le site vit sur son
> adresse `.vercel.app`, ce retour n'aboutit pas — il ne concerne que les
> visiteurs sans JavaScript, et se rétablit dès le domaine branché (§ 3).

### ⚠️ L'activation, à faire une fois

FormSubmit n'envoie rien vers une adresse tant qu'elle n'a pas été confirmée.
Au **tout premier envoi**, le service expédie un courriel d'activation
contenant un lien à cliquer.

1. Ouvrir la page contact **du site publié** (pas le fichier local : le service
   refuse les envois venant de `file://`).
2. Envoyer un message de test.
3. Ouvrir la boîte `contact@coproperformanceconseil.fr`, cliquer le lien
   d'activation de FormSubmit.
4. Renvoyer un message de test : il doit désormais arriver dans la boîte.

Tant que l'étape 3 n'est pas faite, le visiteur voit bien la confirmation
« votre demande est bien enregistrée », mais **le message n'arrive pas**.
C'est le point à vérifier en premier si le cabinet ne reçoit rien.

> À refaire si l'adresse de réception change : l'activation porte sur
> l'adresse, pas sur le site.

### Changer de service

`main.js` ne dépend d'aucun prestataire : il poste l'`action` en `fetch` +
`FormData` et attend une réponse HTTP 2xx. Remplacer l'`action` par une adresse
[Formspree](https://formspree.io), [Web3Forms](https://web3forms.com) ou
[Formcarry](https://formcarry.com) suffit — seule la bascule vers `/ajax/` est
propre à FormSubmit, et elle ne se déclenche que sur ses propres adresses.

Penser alors à retirer les champs cachés `_subject`, `_template`, `_captcha` et
à renommer le piège `_honey`, qui sont des conventions FormSubmit.

> FormSubmit héberge **hors UE**. Le transfert est à documenter dans la
> politique de confidentialité (§ 6) — point suivi dans
> [`CONTENU-A-VALIDER.md`](CONTENU-A-VALIDER.md).

### Option B — endpoint maison (PHP, Node…)

Même principe : renseigner `action` avec l'URL de l'endpoint, qui doit accepter
un `POST` multipart et répondre avec un code 2xx.

Champs envoyés, dans l'ordre du formulaire — c'est aussi l'ordre du corps du
courriel de notification, `FormData` suivant l'ordre du DOM :

`nom`, `prenom`, `email`, `telephone`, `qualite`, `sujet`, `lots`, `message`,
`consentement`, plus `_honey` (champ piège : s'il est rempli, la requête vient
d'un robot et doit être ignorée côté serveur également) et `_replyto`, ajouté à
l'envoi par `main.js` à partir du champ `email`.

### Option C — lien e-mail uniquement

Si aucun back-end n'est souhaité dans l'immédiat : supprimer le formulaire et ne
conserver que le panneau de coordonnées, déjà présent à droite.

---

## 5. Redéploiement manuel via le CLI Vercel

À n'utiliser que si le dépôt Git n'est pas connecté au projet Vercel.

Le déploiement se fait depuis une **copie** du dossier : le `&` de `client&`
fait échouer le CLI Vercel sans message d'erreur explicite.

```bash
DEPLOY=C:/Users/DELL/AppData/Local/Temp/copro-deploy
rm -rf "$DEPLOY" && mkdir -p "$DEPLOY"
cp -r *.html *.txt *.xml *.webmanifest vercel.json .vercelignore pages assets README.md "$DEPLOY/"
cd "$DEPLOY"
vercel link --yes --project copro-site
vercel deploy --prod --yes
```

---

## 6. Héberger ailleurs que sur Vercel

| Plateforme | Marche à suivre |
|---|---|
| **Netlify** | Glisser-déposer le dossier, ou connecter un dépôt Git |
| **GitHub Pages** | Pousser sur une branche, activer Pages dans les réglages |
| **OVH / Infomaniak / o2switch** | Envoyer le contenu du dossier en FTP dans `www/` |

Dans tous les cas, ne pas oublier :

1. Activer **HTTPS** (Let's Encrypt est gratuit chez tous ces hébergeurs)
2. Rediriger `http://` → `https://` et forcer une seule version du domaine
   (avec ou sans `www`)
3. Configurer la page d'erreur 404 vers `404.html`, **qui doit rester à la
   racine** : c'est là que les hébergeurs la cherchent (comme `index.html`).
   Les 25 autres pages sont servies depuis `/pages/`
4. Renseigner l'hébergeur dans les mentions légales — c'est une obligation légale
5. Reporter les en-têtes de `vercel.json` (sécurité + cache) dans la
   configuration de l'hébergeur
6. Soumettre `sitemap.xml` dans la Google Search Console

---

## 7. Ce que `vercel.json` configure

| Bloc | Effet |
|---|---|
| `/assets/img/(.*)` | Cache d'un an, immuable — remplacer une image demande de changer son nom |
| `/assets/(css\|js)/(.*)` | Revalidation à chaque visite — la version se pilote par `?v=` dans le HTML |
| `/(.*)` | En-têtes de sécurité : `nosniff`, `SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`, HSTS |
| `/(.*)` | `X-Robots-Tag: noindex` — **à retirer à la mise en production** |
| `cleanUrls: false` | Les URL gardent leur `.html`, conformément aux `canonical` et au `sitemap.xml` |

`.vercelignore` exclut du déploiement tous les `.md` sauf le `README.md`, ainsi
que le dossier `docs/` : la documentation reste dans le dépôt, elle n'est pas
publiée sur le site.

---

## 8. Performance — avant la mise en production

Déjà en place : zéro dépendance externe, photos en WebP avec repli JPEG toutes
sous 170 Ko, `width`/`height` sur toutes les images (CLS proche de zéro),
`fetchpriority="high"` sur le seul visuel du hero, `loading="lazy"` ailleurs,
animations en `transform`/`opacity` seulement.

Restent à faire côté serveur : minifier CSS et JS (ils sont livrés non minifiés,
donc lisibles pour la maintenance), activer gzip/brotli, servir en HTTP/2.
Vercel fait déjà les trois.
