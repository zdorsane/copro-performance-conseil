#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convertit le site statique Copro Performance Conseil en thème WordPress
prêt à installer, accompagné d'un fichier d'import de contenu.

Le principe :

  * l'habillage commun (en-tête, pied de page) vit dans les gabarits PHP
    du thème, sous wordpress/theme/ ;
  * le corps de chaque page — tout ce qui était dans <main id="contenu"> —
    devient le contenu WordPress de la page correspondante, découpé
    section par section en blocs « HTML personnalisé » pour rester
    modifiable depuis l'éditeur ;
  * ce qui variait d'une page à l'autre en dehors du <main> (balises
    meta, données structurées, appel à l'action collant, barre de
    progression) est conservé en métadonnées de page.

Sortie, dans build/wordpress/ :

  copro-performance/          le thème, assets inclus
  copro-performance.zip       le même thème, prêt pour « Téléverser un thème »
  contenu-copro.xml           l'import de contenu (Outils › Importer)
  redirections.htaccess       les 301 des anciennes URL .html
  redirections.csv            le même tableau, lisible
  LISEZ-MOI.md                la marche à suivre côté client

Usage : python tools/exporter-wordpress.py
"""

from __future__ import annotations

import csv
import html
import re
import shutil
import sys
import zipfile
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

# --------------------------------------------------------------------
# Réglages
# --------------------------------------------------------------------

RACINE = Path(__file__).resolve().parent.parent
SORTIE = RACINE / "build" / "wordpress"
THEME_SRC = RACINE / "wordpress" / "theme"

NOM_THEME = "copro-performance"
SITE_URL = "https://coproperformanceconseil.fr"
AUTEUR = "admin"

# Où vivront les images une fois le thème installé.
BASE_ASSETS = f"/wp-content/themes/{NOM_THEME}/assets"

# La page d'accueil devient une page WordPress portant ce slug.
SLUG_ACCUEIL = "accueil"

VIDES = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}


# --------------------------------------------------------------------
# Découpage du <main> en sections
# --------------------------------------------------------------------

class DecoupeurRacine(HTMLParser):
    """Repère les bornes des éléments de premier niveau d'un fragment."""

    def __init__(self, source: str):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.depart_lignes = [0]
        for ligne in source.splitlines(keepends=True):
            self.depart_lignes.append(self.depart_lignes[-1] + len(ligne))
        self.profondeur = 0
        self.debut = None
        self.bornes: list[tuple[int, int]] = []

    def _offset(self) -> int:
        ligne, colonne = self.getpos()
        return self.depart_lignes[ligne - 1] + colonne

    def handle_starttag(self, tag, attrs):
        if tag in VIDES:
            if self.profondeur == 0:
                debut = self._offset()
                self.bornes.append((debut, self.source.find(">", debut) + 1))
            return
        if self.profondeur == 0:
            self.debut = self._offset()
        self.profondeur += 1

    def handle_startendtag(self, tag, attrs):
        if self.profondeur == 0:
            debut = self._offset()
            self.bornes.append((debut, self.source.find(">", debut) + 1))

    def handle_endtag(self, tag):
        if tag in VIDES:
            return
        if self.profondeur > 0:
            self.profondeur -= 1
            if self.profondeur == 0 and self.debut is not None:
                fin = self.source.find(">", self._offset()) + 1
                self.bornes.append((self.debut, fin))
                self.debut = None


def decouper_en_blocs(fragment: str) -> list[str]:
    """Découpe un fragment HTML en ses éléments de premier niveau.

    Le texte et les commentaires qui précèdent un élément lui sont
    rattachés, de sorte que la concaténation des blocs reproduise le
    fragment d'origine à l'octet près.
    """
    decoupeur = DecoupeurRacine(fragment)
    decoupeur.feed(fragment)
    decoupeur.close()

    if not decoupeur.bornes:
        return [fragment] if fragment.strip() else []

    blocs, curseur = [], 0
    for _debut, fin in decoupeur.bornes:
        blocs.append(fragment[curseur:fin])
        curseur = fin
    reste = fragment[curseur:]
    if reste.strip():
        blocs.append(reste)
    elif blocs:
        blocs[-1] += reste

    return [b for b in blocs if b.strip()]


# --------------------------------------------------------------------
# Réécriture des liens
# --------------------------------------------------------------------

def slug_de(fichier: str) -> str:
    """Le slug WordPress correspondant à un fichier HTML du site."""
    nom = Path(fichier).name
    if nom == "index.html":
        return SLUG_ACCUEIL
    return nom[:-5] if nom.endswith(".html") else nom


def reecrire_liens(contenu: str) -> str:
    """Transforme les chemins du site statique en URL WordPress."""

    # D'abord les URL absolues du site — présentes surtout dans les
    # données structurées — pour qu'elles ne soient pas coupées par les
    # règles relatives qui suivent.
    domaine = re.escape(SITE_URL.split("://", 1)[1])
    contenu = re.sub(
        r"(https?://" + domaine + r")/(?:pages/)?index\.html", r"\1/", contenu
    )
    contenu = re.sub(
        r"(https?://" + domaine + r")/(?:pages/)?([a-z0-9][a-z0-9-]*)\.html",
        r"\1/\2/",
        contenu,
    )

    # Les ressources statiques pointent vers le dossier du thème. Le
    # « /? » absorbe la barre oblique des URL absolues (og:image, logo
    # des donnees structurees), sans quoi la substitution en produirait
    # une seconde : « …fr//wp-content/… ».
    contenu = re.sub(r"(?:\.\./)*/?assets/", BASE_ASSETS + "/", contenu)
    contenu = re.sub(
        r"(?:\.\./)*/?site\.webmanifest", BASE_ASSETS + "/site.webmanifest", contenu
    )

    # L'accueil.
    contenu = re.sub(r"(?:\.\./)*index\.html", "/", contenu)

    # Les autres pages : « pages/contact.html », « ../contact.html »,
    # « contact.html » deviennent « /contact/ », ancre comprise.
    contenu = re.sub(
        r"(?:\.\./)*(?:pages/)?(?P<nom>[a-z0-9][a-z0-9-]*)\.html",
        lambda m: "/" + m.group("nom") + "/",
        contenu,
    )
    return contenu


# --------------------------------------------------------------------
# Lecture d'une page
# --------------------------------------------------------------------

def _meta(source: str, motif: str) -> str:
    m = re.search(motif, source, re.I)
    return html.unescape(m.group(1)).strip() if m else ""


def lire_page(chemin: Path) -> dict:
    """Extrait de la page tout ce dont WordPress aura besoin."""
    source = chemin.read_text(encoding="utf-8")
    relatif = chemin.relative_to(RACINE).as_posix()

    corps = re.search(r'<main id="contenu">(.*?)</main>', source, re.S)
    if not corps:
        raise SystemExit(f'{relatif} : pas de <main id="contenu"> trouvé.')

    # Ce que la page plaçait après le pied de page (CTA collant/flottant).
    apres = source.split("</footer>")[-1]
    apres = re.sub(r"</body>|</html>", "", apres)
    apres = re.sub(r"<!--.*?-->", "", apres, flags=re.S).strip()

    # Données structurées de la page.
    jsonld = re.findall(
        r'<script type="application/ld\+json">.*?</script>', source, re.S
    )

    titre = _meta(source, r"<title>(.*?)</title>")
    # WordPress ajoute lui-même « — Nom du site » via title-tag.
    titre_page = re.split(r"\s+[—|]\s+", titre)[0].strip() or slug_de(relatif)

    return {
        "fichier": relatif,
        "slug": slug_de(relatif),
        "titre": titre_page,
        "titre_complet": titre,
        "description": _meta(source, r'<meta name="description" content="(.*?)"'),
        "robots": _meta(source, r'<meta name="robots" content="(.*?)"'),
        "og_image": _meta(source, r'<meta property="og:image" content="(.*?)"'),
        "jsonld": "\n".join(jsonld),
        "contenu": corps.group(1),
        "apres_footer": apres,
        "reperes": _meta(source, r"data-count-tot>([0-9]+)<"),
        "progression": "scroll-progress" in source,
    }


def contenu_en_blocs(page: dict) -> str:
    """Le <main> réécrit et découpé en blocs « HTML personnalisé »."""
    fragment = reecrire_liens(page["contenu"]).strip("\n")
    blocs = decouper_en_blocs(fragment)
    return "\n\n".join(
        "<!-- wp:html -->\n" + b.strip("\n") + "\n<!-- /wp:html -->" for b in blocs
    )


# --------------------------------------------------------------------
# Fichier d'import WordPress (WXR)
# --------------------------------------------------------------------

def cdata(valeur: str) -> str:
    """Enrobe une valeur en CDATA, en neutralisant les fins de section."""
    return "<![CDATA[" + str(valeur).replace("]]>", "]]]]><![CDATA[>") + "]]>"


def item_wxr(page: dict, post_id: int, ordre: int, date: str) -> str:
    metas = {
        "description": page["description"],
        "robots": page["robots"],
        "og_image": page["og_image"],
        "jsonld": reecrire_liens(page["jsonld"]),
        "apres_footer": reecrire_liens(page["apres_footer"]),
        "barre_progression": "1" if page["progression"] else "0",
        "repere_sections": page["reperes"],
        "source_statique": page["fichier"],
    }
    if page["slug"] == "contact":
        metas["cta_entete"] = "formulaire"

    lignes = [
        "	<item>",
        f"		<title>{cdata(page['titre'])}</title>",
        f"		<link>{SITE_URL}/{page['slug']}/</link>",
        f"		<dc:creator>{cdata(AUTEUR)}</dc:creator>",
        f'		<guid isPermaLink="false">{SITE_URL}/?page_id={post_id}</guid>',
        "		<description></description>",
        f"		<content:encoded>{cdata(contenu_en_blocs(page))}</content:encoded>",
        f"		<excerpt:encoded>{cdata(page['description'])}</excerpt:encoded>",
        f"		<wp:post_id>{post_id}</wp:post_id>",
        f"		<wp:post_date>{cdata(date)}</wp:post_date>",
        f"		<wp:post_date_gmt>{cdata(date)}</wp:post_date_gmt>",
        "		<wp:comment_status><![CDATA[closed]]></wp:comment_status>",
        "		<wp:ping_status><![CDATA[closed]]></wp:ping_status>",
        f"		<wp:post_name>{cdata(page['slug'])}</wp:post_name>",
        "		<wp:status><![CDATA[publish]]></wp:status>",
        "		<wp:post_parent>0</wp:post_parent>",
        f"		<wp:menu_order>{ordre}</wp:menu_order>",
        "		<wp:post_type><![CDATA[page]]></wp:post_type>",
        "		<wp:post_password><![CDATA[]]></wp:post_password>",
        "		<wp:is_sticky>0</wp:is_sticky>",
    ]
    for cle, valeur in metas.items():
        if valeur == "":
            continue
        lignes += [
            "		<wp:postmeta>",
            f"			<wp:meta_key>{cdata('_copro_' + cle)}</wp:meta_key>",
            f"			<wp:meta_value>{cdata(valeur)}</wp:meta_value>",
            "		</wp:postmeta>",
        ]
    lignes.append("	</item>")
    return "\n".join(lignes)


def ecrire_wxr(pages: list[dict], destination: Path) -> None:
    date = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    items = [item_wxr(p, 1000 + i, i, date) for i, p in enumerate(pages)]
    xml = f"""<?xml version="1.0" encoding="UTF-8" ?>
<!--
	Contenu du site Copro Performance Conseil, prêt à importer dans
	WordPress via Outils › Importer › WordPress.
	Généré le {date} par tools/exporter-wordpress.py.
-->
<rss version="2.0"
	xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
	xmlns:content="http://purl.org/rss/1.0/modules/content/"
	xmlns:wfw="http://wellformedweb.org/CommentAPI/"
	xmlns:dc="http://purl.org/dc/elements/1.1/"
	xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
	<title>Copro Performance Conseil</title>
	<link>{SITE_URL}</link>
	<description>Conseil indépendant en copropriété</description>
	<language>fr-FR</language>
	<wp:wxr_version>1.2</wp:wxr_version>
	<wp:base_site_url>{SITE_URL}</wp:base_site_url>
	<wp:base_blog_url>{SITE_URL}</wp:base_blog_url>
	<wp:author>
		<wp:author_id>1</wp:author_id>
		<wp:author_login>{cdata(AUTEUR)}</wp:author_login>
		<wp:author_email>{cdata('contact@coproperformanceconseil.fr')}</wp:author_email>
		<wp:author_display_name>{cdata('Copro Performance Conseil')}</wp:author_display_name>
		<wp:author_first_name><![CDATA[]]></wp:author_first_name>
		<wp:author_last_name><![CDATA[]]></wp:author_last_name>
	</wp:author>
{chr(10).join(items)}
</channel>
</rss>
"""
    destination.write_text(xml, encoding="utf-8")


# --------------------------------------------------------------------
# Redirections
# --------------------------------------------------------------------

def ecrire_redirections(pages: list[dict], dossier: Path) -> None:
    lignes = []
    for page in pages:
        if page["slug"] == SLUG_ACCUEIL:
            lignes.append(("/index.html", "/"))
        else:
            ancien = "/" + page["fichier"].replace("pages/", "")
            lignes.append((ancien, f"/{page['slug']}/"))
            # Le site a aussi vécu avec les pages à la racine.
            if page["fichier"].startswith("pages/"):
                lignes.append(("/" + page["fichier"], f"/{page['slug']}/"))

    with (dossier / "redirections.csv").open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["Ancienne URL", "Nouvelle URL", "Code"])
        for ancien, nouveau in lignes:
            w.writerow([ancien, nouveau, 301])

    htaccess = [
        "# Redirections des anciennes URL .html vers les pages WordPress.",
        "# À coller dans le .htaccess du site, AVANT le bloc « # BEGIN WordPress ».",
        "<IfModule mod_rewrite.c>",
        "RewriteEngine On",
    ]
    for ancien, nouveau in lignes:
        motif = re.escape(ancien.lstrip("/"))
        htaccess.append(f"RewriteRule ^{motif}$ {nouveau} [R=301,L]")
    htaccess.append("</IfModule>")
    (dossier / "redirections.htaccess").write_text(
        "\n".join(htaccess) + "\n", encoding="utf-8"
    )


# --------------------------------------------------------------------
# Assemblage
# --------------------------------------------------------------------

def construire_theme(pages: list[dict]) -> Path:
    theme = SORTIE / NOM_THEME
    if theme.exists():
        shutil.rmtree(theme)
    shutil.copytree(THEME_SRC, theme)

    # Les feuilles de style, scripts et images, inchangés.
    shutil.copytree(RACINE / "assets", theme / "assets", dirs_exist_ok=True)
    shutil.copy2(RACINE / "site.webmanifest", theme / "assets" / "site.webmanifest")

    # Le corps de la page 404, que WordPress ne stocke pas en base.
    page404 = next(p for p in pages if p["fichier"] == "404.html")
    corps404 = reecrire_liens(page404["contenu"]).strip("\n")
    (theme / "parts").mkdir(exist_ok=True)
    (theme / "parts" / "contenu-404.html").write_text(corps404, encoding="utf-8")

    return theme


def zipper(theme: Path) -> Path:
    archive = SORTIE / f"{NOM_THEME}.zip"
    if archive.exists():
        archive.unlink()
    with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as z:
        for fichier in sorted(theme.rglob("*")):
            if fichier.is_file():
                z.write(fichier, Path(NOM_THEME) / fichier.relative_to(theme))
    return archive


def main() -> int:
    fichiers = [RACINE / "index.html"]
    fichiers += sorted((RACINE / "pages").glob("*.html"))

    pages = [lire_page(f) for f in fichiers]
    page404 = lire_page(RACINE / "404.html")

    SORTIE.mkdir(parents=True, exist_ok=True)

    theme = construire_theme(pages + [page404])
    ecrire_wxr(pages, SORTIE / "contenu-copro.xml")
    ecrire_redirections(pages, SORTIE)
    shutil.copy2(RACINE / "wordpress" / "LISEZ-MOI.md", SORTIE / "LISEZ-MOI.md")
    archive = zipper(theme)

    print(f"Thème        : {theme.relative_to(RACINE)}")
    print(f"Archive      : {archive.relative_to(RACINE)} "
          f"({archive.stat().st_size / 1024:.0f} Ko)")
    print(f"Contenu      : build/wordpress/contenu-copro.xml ({len(pages)} pages)")
    print("Redirections : build/wordpress/redirections.htaccess")
    print()
    for page in pages:
        blocs = contenu_en_blocs(page).count("<!-- wp:html -->")
        print(f"  {page['slug']:<48} {blocs:>3} sections")
    return 0


if __name__ == "__main__":
    sys.exit(main())
