# -*- coding: utf-8 -*-
"""Vérifications automatiques du site — à lancer avant de livrer une modification.

    python docs/verifier-le-site.py

Ne modifie rien : le script lit les fichiers et signale ce qui cloche.
Il rend 0 si tout va bien, 1 sinon (utilisable dans une CI).

Ce qu'il contrôle :
  1. chaque lien, image, feuille de style et script pointe vers un fichier
     qui existe réellement (les chemins sont résolus depuis la page qui les cite,
     ce qui vaut aussi bien pour la racine que pour pages/) ;
  2. chaque page a un titre, une description, un canonical, et un seul <h1> ;
  3. le canonical correspond à l'emplacement réel du fichier ;
  4. chaque page indexable est déclarée dans sitemap.xml, et le sitemap ne
     référence pas de page disparue ;
  5. l'encodage est bien de l'UTF-8 sans BOM, et <meta charset> reste dans les
     1024 premiers octets du document.
"""
import io, os, re, sys, glob

DOMAINE = "https://coproperformanceconseil.fr"
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RACINE)

# index.html et 404.html restent à la racine — voir docs/PAGES.md.
PAGES = sorted(glob.glob("*.html")) + sorted(glob.glob("pages/*.html"))
HORS_SITEMAP = {"404.html"}

anomalies = []


def signaler(fichier, message):
    anomalies.append("%-42s %s" % (fichier, message))


def url_publique(fichier):
    """L'adresse à laquelle la page est servie."""
    if fichier == "index.html":
        return DOMAINE + "/"
    return DOMAINE + "/" + fichier.replace(os.sep, "/")


for f in PAGES:
    dossier = os.path.dirname(f) or "."
    brut = io.open(f, "rb").read()

    # 5. encodage
    if brut[:3] == b"\xef\xbb\xbf":
        signaler(f, "commence par un BOM")
    try:
        s = brut.decode("utf-8")
    except UnicodeDecodeError:
        signaler(f, "n'est pas encodé en UTF-8")
        continue
    if b'<meta charset="utf-8">' not in brut[:1024]:
        signaler(f, "<meta charset> hors des 1024 premiers octets")

    # 1. références locales
    refs = set(re.findall(r'(?:href|src)="((?!https?:|mailto:|tel:|#|data:)[^"]+)"', s))
    refs |= set(re.findall(r'srcset="([^" ]+)', s))
    refs |= set(re.findall(r"url\('([^']+)'\)", s))
    for ref in refs:
        cible = ref.split("#")[0].split("?")[0]
        if cible and not os.path.exists(os.path.normpath(os.path.join(dossier, cible))):
            signaler(f, "référence introuvable : " + ref)

    # 2. balises uniques
    for balise, motif in (("<title>", r"<title>"), ("<h1>", r"<h1[ >]")):
        n = len(re.findall(motif, s))
        if n != 1:
            signaler(f, "%d %s (attendu : 1)" % (n, balise))
    if not re.search(r'<meta name="description" content="', s):
        signaler(f, "pas de meta description")

    # 3. canonical — sauf sur une page volontairement non indexée (404)
    indexable = 'content="noindex' not in s
    can = re.search(r'<link rel="canonical" href="([^"]+)"', s)
    if not can:
        if indexable:
            signaler(f, "pas de canonical")
    elif can.group(1) != url_publique(f):
        signaler(f, "canonical = %s (attendu : %s)" % (can.group(1), url_publique(f)))

# 4. sitemap
sitemap = io.open("sitemap.xml", encoding="utf-8").read()
declarees = set(re.findall(r"<loc>([^<]+)</loc>", sitemap))

for f in PAGES:
    if os.path.basename(f) in HORS_SITEMAP:
        continue
    if url_publique(f) not in declarees:
        signaler(f, "absente de sitemap.xml")

for url in sorted(declarees):
    chemin = url.replace(DOMAINE, "").lstrip("/") or "index.html"
    if not os.path.exists(chemin):
        signaler("sitemap.xml", "déclare une page inexistante : " + url)

# ------------------------------------------------------------------ verdict
print("Pages vérifiées : %d" % len(PAGES))
if not anomalies:
    print("Aucune anomalie.")
    sys.exit(0)
print("Anomalies : %d\n" % len(anomalies))
for a in anomalies:
    print("  " + a)
sys.exit(1)
