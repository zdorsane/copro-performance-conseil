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

### 2.2 Brancher le formulaire de contact

Il n'envoie rien en l'état — voir § 4 ci-dessous.

### 2.3 Compléter les deux pages légales

`mentions-legales.html` et `politique-confidentialite.html` sont des trames :
SIREN, adresse du siège, directeur de la publication, hébergeur restent à
renseigner. Ces mentions sont **obligatoires** (art. 6-III de la LCEN).

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

## 4. Brancher le formulaire de contact

Le formulaire de `contact.html` **n'envoie rien** : son attribut `action` vaut
`#`. Un message d'erreur explicite s'affiche si on le soumet, plutôt qu'un faux
message de succès.

Le JavaScript gère déjà la validation, l'état de chargement, les messages de
retour, le piège à robots et le consentement RGPD. Il ne reste qu'à fournir une
destination.

### Option A — service tiers, sans serveur (le plus simple)

Créer un formulaire chez [Formspree](https://formspree.io),
[Web3Forms](https://web3forms.com) ou [Formcarry](https://formcarry.com), puis :

```html
<form class="form" data-contact-form action="https://formspree.io/f/VOTRE_ID" method="post" novalidate>
```

C'est tout : `main.js` détecte l'`action` et envoie en `fetch` + `FormData`, en
attendant une réponse HTTP 2xx.

> Vérifier que le prestataire retenu héberge dans l'UE, ou documenter le
> transfert dans la politique de confidentialité (§ 6).

### Option B — endpoint maison (PHP, Node…)

Même principe : renseigner `action` avec l'URL de l'endpoint, qui doit accepter
un `POST` multipart et répondre avec un code 2xx.

Champs envoyés, dans l'ordre du formulaire — c'est aussi l'ordre du corps du
courriel de notification, `FormData` suivant l'ordre du DOM :

`nom`, `prenom`, `email`, `telephone`, `qualite`, `sujet`, `lots`, `message`,
`consentement`, plus `_gotcha` (champ piège : s'il est rempli, la requête vient
d'un robot et doit être ignorée côté serveur également).

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
