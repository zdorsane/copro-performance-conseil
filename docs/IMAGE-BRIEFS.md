# Images du site — état, direction artistique, remplacement

## Ce qui est en place aujourd'hui

Le site utilise **trois photographies réelles** et **une illustration vectorielle**.

| Fichier | Emplacement | Nature |
|---|---|---|
| `hero-immeuble.jpg` / `.webp` | Accueil — visuel du hero | Photo CC0 |
| `toits-paris.jpg` / `.webp` | Accueil — bandeau entre deux sections | Photo CC0 |
| `fenetre-balcon.jpg` / `.webp` | À propos — respiration visuelle | Photo CC0 |
| `analyse-documents.svg` | Accueil + Approche — section analyse | Illustration créée pour le projet |
| `hero-immeuble.svg` | *inutilisé* | Illustration de repli, conservée au cas où |
| *jeu « Le Relevé »* | Accueil + Services — cartes et blocs prestation | **Cinq illustrations au trait, en SVG inline** |

> **Depuis l'ajout du calque « Le Relevé »**, l'essentiel de l'iconographie du
> site n'est plus photographique mais dessinée. Voir la section correspondante
> du [`README.md`](../README.md). Les cinq illustrations sont écrites directement
> dans le HTML — c'est ce qui permet de les animer trait par trait — et n'ont
> donc pas de fichier propre dans `assets/img/`.
>
> Elles sont **originales** : aucune banque d'images, aucune licence à
> surveiller, aucun risque de retrouver le même visuel chez un concurrent.
> La photo du hero est conservée et reçoit désormais le calque de relevé
> par-dessus.

**Licences** : les trois photographies sont en **CC0** (domaine public), récupérées
via Wikimedia Commons. L'usage commercial est libre et l'attribution n'est pas
juridiquement exigée. Les sources sont tout de même tracées dans
[`CREDITS-PHOTOS.md`](CREDITS-PHOTOS.md).

**Comment elles ont été choisies** : quatorze candidates ont été téléchargées puis
examinées une par une. Onze ont été écartées — architecture américaine ou
japonaise, personne identifiable, immeuble dégradé, colorimétrie incompatible.
Seules trois passaient le double filtre « architecture résidentielle française »
et « registre professionnel rassurant ».

**Chaque photo est déclinée en trois fichiers** :
- `.webp` — servi en priorité, plus léger
- `.jpg` — repli universel
- `-tiny.jpg` — miniature 20 px affichée floutée pendant le chargement, pour
  éviter le rectangle vide (voir `.media` dans `style.css` § 14 bis)

Toutes sont sous 170 Ko.

---

## Direction artistique

| Critère | Parti pris |
|---|---|
| **Registre** | Photographie éditoriale, pas photographie de stock corporate |
| **Sujets** | Architecture résidentielle française, matière, lumière. **Jamais** de réunion souriante mise en scène |
| **Lumière** | Naturelle, latérale, jour couvert doux ou heure dorée |
| **Colorimétrie** | Désaturée (~ -14 %), dominante pierre / ardoise / vert profond |
| **Cadrage** | Généreux, un sujet clair, beaucoup de vide |
| **À proscrire** | Poignées de main, immeubles de bureaux américains, graphiques 3D, façades dégradées |

### Palette de référence

| Rôle | Hex |
|---|---|
| Encre (fonds sombres) | `#0B1C2C` |
| Papier (fonds clairs) | `#FBFAF7` |
| Vert conseil (accent) | `#17614F` |
| Vert clair (sur fond sombre) | `#7FD3B8` |
| Laiton (micro-accent) | `#B9924F` |

---

## Règle absolue

> **Aucune photographie de personne** ne doit être ajoutée si elle ne représente
> pas quelqu'un de réellement lié au cabinet, avec son accord écrit.
>
> Pas de portraits de banque d'images présentés comme l'équipe, pas de faux
> clients, pas de visages générés. C'est une question de conformité (pratique
> commerciale trompeuse) autant que de crédibilité.
>
> Une candidate a d'ailleurs été écartée pour cette raison précise pendant la
> sélection.

---

## Remplacer une photo

Si le cabinet dispose de ses propres photographies — ce qui serait préférable,
notamment de copropriétés réellement suivies :

**1. Préparer les fichiers** aux mêmes dimensions :

| Image | Dimensions | Ratio |
|---|---|---|
| `hero-immeuble` | 1040 × 1300 | 4:5 portrait |
| `toits-paris` | 1700 × 620 | ~2,7:1 panoramique |
| `fenetre-balcon` | 1300 × 812 | 16:10 |

**2. Générer les trois variantes.** Le script utilisé est reproductible :
recadrage au ratio, désaturation à 0,86, contraste à 1,04, puis export JPEG et
WebP sous un plafond de 170 Ko, plus une miniature 20 px.

**3. Remplacer les fichiers** en gardant les mêmes noms — aucune modification
HTML n'est alors nécessaire.

**4. Mettre à jour** le texte alternatif (`alt`) et
[`CREDITS-PHOTOS.md`](CREDITS-PHOTOS.md).

### Points de vigilance

- Conserver `width` et `height` sur chaque `<img>` : ils réservent la place et
  évitent les sauts de mise en page (CLS proche de zéro).
- `fetchpriority="high"` **uniquement** sur le visuel du hero ; `loading="lazy"`
  partout ailleurs.
- Rédiger un `alt` descriptif. Si l'image est purement décorative, mettre `alt=""`.
- Le `-tiny.jpg` est déclaré en `background-image` inline sur le conteneur
  `.media` : le régénérer aussi, sinon le flou de chargement ne correspondra plus.

---

## Images encore à produire (optionnel)

### Portrait du fondateur — page À propos
Portrait professionnel, lumière naturelle, cadrage buste, arrière-plan neutre.
Ratio 4:5. **À produire uniquement avec la personne réelle.** La section
correspondante attend cet élément (voir `CONTENU-A-VALIDER.md` § 4).

### Détail architectural — séparateur
Macro sur une matière : ferronnerie, pierre de taille, boîtes aux lettres,
cage d'escalier. Ratio 21:9.

### Restitution de travail
Deux ou trois personnes autour d'un document, de loin ou de dos, sans visage
identifiable. Ratio 16:9.

---

## Sources d'images libres de droits

Vérifier la licence au cas par cas.

- **Wikimedia Commons** — utilisé ici ; filtrer sur CC0 ou domaine public.
  Attention : la politique robots impose un User-Agent descriptif et un débit
  modéré si vous automatisez les téléchargements.
- **Unsplash**, **Pexels** — bon fonds en architecture
- **Kaboompics** — natures mortes et plans de travail

Requêtes utiles : `haussmann facade`, `parisian building`, `french apartment
building`, `wrought iron balcony`, `paris rooftops`.
