/* ==========================================================================
   COPRO PERFORMANCE CONSEIL — signature.js
   --------------------------------------------------------------------------
   Calque « Le Relevé ». Vanilla JS, aucune dépendance, chargé en `defer`.

   Complète main.js sans jamais le remplacer : chaque bloc ci-dessous est
   autonome et s'arrête de lui-même si son marqueur est absent de la page.

   Règle tenue partout : `prefers-reduced-motion: reduce` coupe le mouvement
   et pose directement l'état final. Rien n'est jamais caché derrière une
   animation qui ne se jouerait pas.

   Sommaire
   1. Rideau d'ouverture
   2. Mesure et tracé des dessins (SVG)
   3. Calque d'analyse du hero
   4. Pile de documents
   5. Tracé de méthode lié au défilement
   6. Relief des cartes au pointeur
   7. Projecteur curseur
   8. Boutons magnétiques
   9. Compteurs
   10. Frise défilante
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var canObserve = "IntersectionObserver" in window;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Petit utilitaire : observer une fois, puis lâcher. */
  function observeOnce(el, onEnter, ratio) {
    if (!canObserve) {
      onEnter();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          onEnter();
          io.unobserve(entry.target);
        });
      },
      { threshold: ratio || 0.2, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
  }

  /* ----------------------------------------------------------------------
     1. Rideau d'ouverture
     ----------------------------------------------------------------------
     Le rideau est retiré au `load`, avec un plancher de durée pour que le
     tracé de la marque ait le temps d'exister — et un plafond dur, pour
     qu'une image lente ne retienne jamais la page en otage.
     ---------------------------------------------------------------------- */
  var BOOT_MS = 950; // durée nominale du rideau, reprise par le relevé
  var bootFinAt = 0; // horodatage de la levée du rideau, 0 s'il n'y en a pas

  function initBoot() {
    var boot = document.querySelector("[data-boot]");
    if (!boot) return;

    var html = document.documentElement;

    // Le rideau est une entrée en matière, pas un péage : il ne se joue
    // qu'une fois par session, sur la page par laquelle on arrive. En
    // navigation interne, les pages s'ouvrent d'un coup.
    var dejaVu = false;
    try {
      dejaVu = window.sessionStorage.getItem("cpc-boot") === "1";
      window.sessionStorage.setItem("cpc-boot", "1");
    } catch (e) {
      dejaVu = false; // navigation privée stricte : on joue le rideau
    }

    if (reduceMotion || dejaVu) {
      boot.parentNode.removeChild(boot);
      return;
    }

    // Le défilement est neutralisé tant que le rideau est là, sinon on
    // peut se retrouver au milieu de la page quand il se retire.
    var overflowAvant = html.style.overflow;
    html.style.overflow = "hidden";

    var started = Date.now();
    var closed = false;

    bootFinAt = started + BOOT_MS;

    function close() {
      if (closed) return;
      closed = true;
      html.style.overflow = overflowAvant;
      boot.classList.add("is-done");
      window.setTimeout(function () {
        if (boot.parentNode) boot.parentNode.removeChild(boot);
      }, 700);
    }

    window.addEventListener("load", function () {
      var elapsed = Date.now() - started;
      window.setTimeout(close, Math.max(0, BOOT_MS - elapsed));
    });

    // Filet de sécurité : quoi qu'il arrive, le rideau tombe.
    window.setTimeout(close, 2600);
  }

  /* ----------------------------------------------------------------------
     2. Mesure et tracé des dessins
     ----------------------------------------------------------------------
     Chaque tracé SVG reçoit sa longueur réelle dans `--len`, ce qui permet
     au CSS d'animer `stroke-dashoffset` sans valeur devinée. L'index `--i`
     échelonne l'ordre des traits : le dessin se construit, il n'apparaît pas.
     ---------------------------------------------------------------------- */
  function measure(root, selector) {
    var paths = root.querySelectorAll(selector);
    paths.forEach(function (path, i) {
      var len = 0;
      try {
        len = path.getTotalLength();
      } catch (e) {
        len = 0;
      }
      if (!len || !isFinite(len)) len = 400;
      path.style.setProperty("--len", String(Math.ceil(len)));
      if (!path.style.getPropertyValue("--i")) {
        path.style.setProperty("--i", String(i));
      }
    });
  }

  function initDrawings() {
    // Marque du rideau d'ouverture
    var bootMark = document.querySelector(".boot__mark");
    if (bootMark) measure(bootMark, "[data-boot-stroke]");

    var illus = document.querySelectorAll(".illu");
    if (!illus.length) return;

    illus.forEach(function (illu) {
      measure(illu, "[data-draw]");

      illu.querySelectorAll("[data-pop]").forEach(function (el, i) {
        if (!el.style.getPropertyValue("--i")) {
          el.style.setProperty("--i", String(i));
        }
      });

      if (reduceMotion) {
        illu.classList.add("is-drawn");
        return;
      }

      observeOnce(
        illu,
        function () {
          illu.classList.add("is-drawn");
        },
        0.35
      );
    });
  }

  /* ----------------------------------------------------------------------
     3. Calque d'analyse du hero
     ----------------------------------------------------------------------
     Le relevé se dessine par-dessus la photo dès que le cadre est visible.
     ---------------------------------------------------------------------- */
  function initReleve() {
    var releve = document.querySelector("[data-releve]");
    if (!releve) return;

    measure(releve, "[data-trace]");

    releve.querySelectorAll("[data-node]").forEach(function (el, i) {
      if (!el.style.getPropertyValue("--i")) {
        el.style.setProperty("--i", String(i));
      }
    });

    releve.querySelectorAll(".releve__annot").forEach(function (el, i) {
      if (!el.style.getPropertyValue("--i")) {
        el.style.setProperty("--i", String(i));
      }
    });

    if (reduceMotion) {
      releve.classList.add("is-visible");
      return;
    }

    // Deux conditions avant de lancer le tracé : le cadre doit être dans
    // le champ (sinon, sur mobile, le relevé se dessine sur une photo
    // encore voilée), et le rideau doit avoir fini de se lever.
    observeOnce(
      releve,
      function () {
        var reste = Math.max(0, bootFinAt - Date.now());
        window.setTimeout(function () {
          releve.classList.add("is-visible");
        }, reste + 150);
      },
      0.25
    );
  }

  /* ----------------------------------------------------------------------
     4. Pile de documents
     ----------------------------------------------------------------------
     Les feuilles arrivent empilées et se déploient en éventail. Les
     positions viennent du HTML (`data-x`, `data-y`, `data-r`) pour rester
     lisibles et ajustables sans toucher au script.
     ---------------------------------------------------------------------- */
  function initDossier() {
    var dossier = document.querySelector("[data-dossier]");
    if (!dossier) return;

    var sheets = dossier.querySelectorAll(".dossier__sheet");

    sheets.forEach(function (sheet, i) {
      sheet.style.setProperty("--i", String(i));
      sheet.style.setProperty("--x", sheet.getAttribute("data-x") || "0");
      sheet.style.setProperty("--y", sheet.getAttribute("data-y") || "0");
      sheet.style.setProperty("--r", sheet.getAttribute("data-r") || "0");
      sheet.style.zIndex = String(i + 1);

      sheet.querySelectorAll(".dossier__lines i").forEach(function (line, j) {
        line.style.setProperty("--j", String(j));
      });
    });

    if (reduceMotion) {
      dossier.classList.add("is-open");
      return;
    }

    observeOnce(
      dossier,
      function () {
        dossier.classList.add("is-open");
      },
      0.25
    );
  }

  /* ----------------------------------------------------------------------
     5. Tracé de méthode lié au défilement
     ----------------------------------------------------------------------
     La progression du tracé suit la position de la section dans la fenêtre.
     Lecture du scroll dans un rAF : aucun calcul de layout dans l'événement.
     ---------------------------------------------------------------------- */
  function initTraceMethode() {
    var wrap = document.querySelector("[data-trace-methode]");
    if (!wrap || reduceMotion) return;

    var ticking = false;

    function update() {
      var box = wrap.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;

      // 0 quand le haut de la section atteint 82 % de la fenêtre,
      // 1 quand son bas repasse au-dessus de 45 %.
      var start = vh * 0.82;
      var end = -box.height + vh * 0.45;
      var p = (start - box.top) / (start - end);

      p = Math.max(0, Math.min(1, p));
      wrap.style.setProperty("--p", p.toFixed(4));
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  /* ----------------------------------------------------------------------
     6. Relief des cartes au pointeur
     ----------------------------------------------------------------------
     Inclinaison de quelques degrés + lueur suiveuse. Pointeur fin
     uniquement : sur écran tactile, le survol n'a pas de sens.
     ---------------------------------------------------------------------- */
  function initTilt() {
    if (reduceMotion || !finePointer) return;

    var cards = document.querySelectorAll(".tilt");
    if (!cards.length) return;

    cards.forEach(function (card) {
      var raf = null;
      var box = null;

      function apply(e) {
        raf = null;
        if (!box) return;

        var px = (e.clientX - box.left) / box.width;
        var py = (e.clientY - box.top) / box.height;

        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        card.style.setProperty("--tx", (px - 0.5).toFixed(3));
        card.style.setProperty("--ty", (py - 0.5).toFixed(3));
      }

      card.addEventListener("pointerenter", function () {
        box = card.getBoundingClientRect();
        card.classList.add("is-tilting");
      });

      card.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
          apply(e);
        });
      });

      card.addEventListener("pointerleave", function () {
        card.classList.remove("is-tilting");
        card.style.setProperty("--tx", "0");
        card.style.setProperty("--ty", "0");
        box = null;
      });
    });
  }

  /* ----------------------------------------------------------------------
     7. Projecteur curseur
     ---------------------------------------------------------------------- */
  function initSpotlight() {
    if (reduceMotion || !finePointer) return;

    document.querySelectorAll(".spotlight").forEach(function (zone) {
      var raf = null;

      zone.addEventListener("pointerenter", function () {
        zone.classList.add("is-lit");
      });

      zone.addEventListener("pointerleave", function () {
        zone.classList.remove("is-lit");
      });

      zone.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
          raf = null;
          var box = zone.getBoundingClientRect();
          zone.style.setProperty(
            "--sx",
            (((e.clientX - box.left) / box.width) * 100).toFixed(1) + "%"
          );
          zone.style.setProperty(
            "--sy",
            (((e.clientY - box.top) / box.height) * 100).toFixed(1) + "%"
          );
        });
      });
    });
  }

  /* ----------------------------------------------------------------------
     8. Boutons magnétiques
     ----------------------------------------------------------------------
     Le bouton se décale légèrement vers le curseur qui l'approche. Le
     déplacement est plafonné : la cible de clic reste franche.
     ---------------------------------------------------------------------- */
  function initMagnet() {
    if (reduceMotion || !finePointer) return;

    var LIMIT = 6; // pixels

    document.querySelectorAll(".magnet").forEach(function (btn) {
      var raf = null;

      btn.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
          raf = null;
          var box = btn.getBoundingClientRect();
          var dx = (e.clientX - (box.left + box.width / 2)) / (box.width / 2);
          var dy = (e.clientY - (box.top + box.height / 2)) / (box.height / 2);

          btn.classList.add("is-pulled");
          btn.style.setProperty("--mgx", (dx * LIMIT).toFixed(2));
          btn.style.setProperty("--mgy", (dy * LIMIT).toFixed(2));
        });
      });

      btn.addEventListener("pointerleave", function () {
        btn.classList.remove("is-pulled");
        btn.style.setProperty("--mgx", "0");
        btn.style.setProperty("--mgy", "0");
      });
    });
  }

  /* ----------------------------------------------------------------------
     9. Compteurs
     ----------------------------------------------------------------------
     Les valeurs sont écrites en clair dans le HTML (`data-tally`) : sans
     JS, le chiffre juste est déjà là. Le script ne fait que l'animer.
     ---------------------------------------------------------------------- */
  function initTally() {
    var nums = document.querySelectorAll("[data-tally]");
    if (!nums.length) return;

    nums.forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-tally"));
      if (isNaN(target)) return;

      var out = el.querySelector("[data-tally-out]") || el;
      var final = out.textContent;

      if (reduceMotion) return;

      observeOnce(
        el,
        function () {
          var t0 = null;
          var span = 1100;

          function step(now) {
            if (t0 === null) t0 = now;
            var k = Math.min(1, (now - t0) / span);
            // Sortie amortie : rapide au début, posée à l'arrivée.
            var eased = 1 - Math.pow(1 - k, 3);
            out.textContent = String(Math.round(target * eased));
            if (k < 1) {
              window.requestAnimationFrame(step);
            } else {
              out.textContent = final;
            }
          }

          out.textContent = "0";
          window.requestAnimationFrame(step);
        },
        0.5
      );
    });
  }

  /* ----------------------------------------------------------------------
     10. Frise défilante
     ----------------------------------------------------------------------
     Le groupe est dupliqué une fois pour que la boucle à -50 % soit
     invisible. Dupliquer en JS évite de maintenir deux fois le même
     contenu dans le HTML — et le duplicata est masqué aux technologies
     d'assistance.
     ---------------------------------------------------------------------- */
  function initFrise() {
    var track = document.querySelector("[data-frise]");
    if (!track || reduceMotion) return;

    var group = track.querySelector(".frise__group");
    if (!group) return;

    var clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }

  /* ----------------------------------------------------------------------
     11. Profil repris depuis l'URL
     ----------------------------------------------------------------------
     Les pages profil pointent vers contact.html?profil=xxx. Le visiteur a
     déjà dit qui il était en page d'accueil : lui redemander serait une
     question de trop. On pré-remplit, sans verrouiller — il reste libre
     de changer.
     ---------------------------------------------------------------------- */
  function initProfilUrl() {
    var champ = document.getElementById("qualite");
    if (!champ || !window.URLSearchParams) return;

    var voulu;
    try {
      voulu = new URLSearchParams(window.location.search).get("profil");
    } catch (e) {
      return;
    }
    if (!voulu) return;

    // Ne retenir que les valeurs réellement proposées : un paramètre
    // d'URL est une saisie extérieure, jamais une consigne.
    var existe = Array.prototype.some.call(champ.options, function (o) {
      return o.value === voulu;
    });
    if (!existe) return;

    champ.value = voulu;
  }

  /* ----------------------------------------------------------------------
     12. CTA collant (mobile)
     ----------------------------------------------------------------------
     Le bouton n'apparaît qu'une fois le hero dépassé — l'afficher d'emblée
     reviendrait à masquer le contenu au moment où le visiteur le découvre.
     Il s'efface quand le pied de page entre dans le champ : à cet instant
     le vrai bouton est visible, et deux appels à l'action simultanés se
     nuisent l'un à l'autre.
     ---------------------------------------------------------------------- */
  function initStickyCta() {
    var cta = document.querySelector("[data-sticky-cta]");
    if (!cta) return;

    var pied = document.querySelector("footer, .footer");
    var seuil = 480; // hauteur approximative du premier écran
    var ticking = false;
    var piedVisible = false;

    if (canObserve && pied) {
      new IntersectionObserver(
        function (entries) {
          piedVisible = entries[0].isIntersecting;
          maj();
        },
        { rootMargin: "0px 0px -40% 0px" }
      ).observe(pied);
    }

    function maj() {
      var assezBas = window.scrollY > seuil;
      cta.classList.toggle("is-visible", assezBas && !piedVisible);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(maj);
      },
      { passive: true }
    );

    maj();
  }

  /* ----------------------------------------------------------------------
     13. CTA flottant (page d'accueil)
     ----------------------------------------------------------------------
     Le bouton ne se montre qu'une fois le premier bloc CTA dépassé :
     l'afficher d'emblée reviendrait à couvrir le contenu au moment même où
     le visiteur le découvre. Il s'efface dès qu'un des blocs CTA de la page,
     le formulaire de contact ou le pied de page entre à l'écran — deux
     appels à l'action simultanés se nuisent l'un à l'autre.

     Le seuil est observé, jamais calculé en pixels : une valeur en dur ne
     survit pas au premier changement de contenu.
     ---------------------------------------------------------------------- */
  function initCtaFlottant() {
    var flottant = document.querySelector("[data-cta-flottant]");
    if (!flottant) return;

    var blocs = document.querySelectorAll("[data-cta]");
    if (!blocs.length) return;

    function afficher(v) {
      flottant.classList.toggle("is-visible", v);
      flottant.setAttribute("aria-hidden", v ? "false" : "true");
    }

    // Sans IntersectionObserver, le bouton reste simplement affiché : mieux
    // vaut un appel à l'action permanent que pas d'appel du tout.
    if (!canObserve) {
      afficher(true);
      return;
    }

    var depasse = false; // le premier bloc CTA est sorti par le haut
    var vus = []; // éléments concurrents actuellement à l'écran

    function maj() {
      afficher(depasse && vus.length === 0);
    }

    // 1. Franchissement du premier bloc CTA.
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          // `top < 0` distingue « déjà lu » de « pas encore atteint ».
          depasse = !e.isIntersecting && e.boundingClientRect.top < 0;
          maj();
        });
      },
      { threshold: 0 }
    ).observe(blocs[0]);

    // 2. Effacement dès qu'un vrai bouton occupe l'écran.
    function surveiller(cibles, marge) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            var i = vus.indexOf(e.target);
            if (e.isIntersecting && i === -1) vus.push(e.target);
            else if (!e.isIntersecting && i !== -1) vus.splice(i, 1);
          });
          maj();
        },
        { threshold: 0, rootMargin: marge || "0px" }
      );
      Array.prototype.forEach.call(cibles, function (c) {
        if (c) io.observe(c);
      });
    }

    surveiller(blocs);
    surveiller([document.querySelector("main form")]);

    // Le pied de page est haut : on ne masque le bouton qu'une fois qu'il
    // occupe réellement le bas de l'écran, pour ne pas le faire disparaître
    // trop tôt tout en ne recouvrant jamais les mentions légales.
    surveiller(
      [document.querySelector("footer, .footer")],
      "0px 0px -40% 0px"
    );
  }

  /* ----------------------------------------------------------------------
     Démarrage
     ---------------------------------------------------------------------- */
  function start() {
    initProfilUrl();
    initStickyCta();
    initCtaFlottant();
    initBoot();
    initDrawings();
    initReleve();
    initDossier();
    initTraceMethode();
    initTilt();
    initSpotlight();
    initMagnet();
    initTally();
    initFrise();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
