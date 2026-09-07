# Ouvrir le site Copro Performance Conseil dans WordPress

Ce dossier contient le site converti en thème WordPress. Le rendu est
identique au site actuel : mêmes styles, mêmes animations, même
balisage. Ce qui change, c'est que **le contenu de chaque page devient
modifiable depuis l'administration WordPress**.

## Ce que contient la livraison

| Fichier | À quoi il sert |
|---|---|
| `copro-performance.zip` | Le thème. C'est ce que l'on téléverse dans WordPress. |
| `copro-performance/` | Le même thème décompressé, si un accès FTP est préféré. |
| `contenu-copro.xml` | Les 26 pages du site, à importer dans WordPress. |
| `redirections.htaccess` | Les redirections des anciennes adresses `.html`. |
| `redirections.csv` | Le même tableau, lisible dans un tableur. |

## Prérequis

- WordPress 6.3 ou plus récent, PHP 7.4 ou plus récent
- Un compte **administrateur** sur une installation WordPress simple
  (pas un réseau multisite : l'import de HTML y est filtré)

## Installation, dans cet ordre

**1. Installer le thème.**
Apparence › Thèmes › Ajouter › Téléverser un thème › choisir
`copro-performance.zip` › Installer › **Activer**.

**2. Importer le contenu.**
Outils › Importer › WordPress › Installer maintenant, puis Lancer
l'importateur. Choisir `contenu-copro.xml`, attribuer les contenus à
votre compte administrateur, et lancer. Ne pas cocher « Télécharger et
importer les fichiers joints » : les images sont déjà dans le thème.

**3. Vérifier deux réglages.**
Le thème les positionne seul, mais mieux vaut confirmer :
- Réglages › Permaliens : **Nom de l'article** (`/%postname%/`)
- Réglages › Lecture : la page d'accueil doit être **Accueil**

**4. Renseigner l'identité du site.**
Réglages › Général :
- Titre du site : `Copro Performance Conseil`
- Slogan : `Conseil indépendant en copropriété`

Ces deux champs s'affichent dans l'en-tête et le pied de page. Tant
qu'ils ne sont pas corrects, un avertissement s'affiche dans
l'administration.

**5. Poser les redirections.**
Coller le contenu de `redirections.htaccess` dans le fichier
`.htaccess` du site, **avant** le bloc `# BEGIN WordPress`. Sans cela,
les anciennes adresses en `.html` déjà référencées par Google
renverront une erreur 404.

Sur un hébergement sans Apache (Nginx, LiteSpeed en mode strict), passer
plutôt par une extension de redirection et importer `redirections.csv`.

**6. Tester le formulaire de contact.**
Le formulaire passe par FormSubmit et envoie à
`contact@coproperformanceconseil.fr`. FormSubmit valide chaque domaine
séparément : depuis le nouveau site, envoyer un premier message de test,
puis cliquer le lien de confirmation reçu par courriel. Sans cette
étape, les messages ne partent pas.

## Ce qui est modifiable, et où

| Élément | Où le modifier |
|---|---|
| Le texte des pages | Pages › la page voulue. Chaque section est un bloc « HTML personnalisé ». |
| Le menu principal | Apparence › Menus, emplacement « Navigation principale ». |
| Les liens légaux du pied de page | Apparence › Menus, emplacement « Liens légaux ». |
| Le nom et le slogan | Réglages › Général. |
| Le titre et la description SEO | En bas de chaque page, champs personnalisés `_copro_description`. |

Le reste du pied de page (le texte de présentation, les colonnes
« Prestations » et « Le cabinet ») est dans le fichier `footer.php` du
thème : c'est une modification de code, pas de contenu.

## Comment le contenu est organisé

Le corps de chaque page a été découpé section par section. Dans
l'éditeur, une page apparaît donc comme une pile de blocs « HTML
personnalisé », un par section du site. Pour changer un texte, on ouvre
le bloc concerné et on modifie le texte entre les balises, sans toucher
aux balises elles-mêmes.

C'est le prix de la fidélité au design : le site d'origine est du HTML
écrit à la main, avec des classes et des animations sur mesure. Le
reconstruire en blocs WordPress natifs aurait dégradé le rendu.

## Limites connues

- **Ne pas renommer le dossier du thème.** Les images des pages sont
  servies depuis `/wp-content/themes/copro-performance/assets/`. Un
  renommage casserait toutes les illustrations.
- **Les images vivent dans le thème**, pas dans la médiathèque. Pour en
  remplacer une, il faut déposer le nouveau fichier dans
  `assets/img/` du thème, sous le même nom.
- **La page 404** n'est pas une page WordPress : son contenu est dans
  `parts/contenu-404.html`, à l'intérieur du thème.
- **Le référencement** : le thème produit lui-même les balises meta,
  Open Graph et les données structurées reprises du site actuel. Si une
  extension SEO (Yoast, Rank Math, SEOPress) est installée, le thème
  s'efface automatiquement pour lui laisser la main — il faudra alors
  ressaisir les titres et descriptions dans cette extension.

## Régénérer le thème depuis les sources

Le thème est produit à partir du site statique par un script. Après une
modification des fichiers HTML d'origine :

```
python tools/exporter-wordpress.py
```

Tout ce dossier est reconstruit. Attention : cela régénère aussi
`contenu-copro.xml`, dont un nouvel import **écraserait** les
modifications faites entre-temps dans WordPress.
