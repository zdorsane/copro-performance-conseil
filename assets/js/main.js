/* ==========================================================================
   COPRO PERFORMANCE CONSEIL — main.js
   Vanilla JS, sans dépendance. Chargé en `defer`.
   Toutes les animations respectent `prefers-reduced-motion`.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------------------------------------------------------
     1. Header — état « collé » au scroll
     ---------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector("[data-header]");
    if (!header) return;

    var ticking = false;

    function update() {
      header.classList.toggle("is-stuck", window.scrollY > 24);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  /* ----------------------------------------------------------------------
     2. Navigation mobile
     ---------------------------------------------------------------------- */
  function initMobileNav() {
    var burger = document.querySelector("[data-burger]");
    var panel = document.querySelector("[data-mobile-nav]");
    if (!burger || !panel) return;

    function setOpen(open) {
      burger.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", String(!open));
      document.body.classList.toggle("is-locked", open);
      burger.setAttribute(
        "aria-label",
        open ? "Fermer le menu" : "Ouvrir le menu"
      );
    }

    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });

    // Fermeture au clic sur un lien
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    // Fermeture à l'échappement
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        burger.focus();
      }
    });

    // Fermeture si on repasse en desktop
    window.matchMedia("(min-width: 941px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });

    setOpen(false);
  }

  /* ----------------------------------------------------------------------
     3. Révélations au scroll
     ---------------------------------------------------------------------- */
  function initReveals() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     4. Décalage automatique des enfants (effet cascade)
     ---------------------------------------------------------------------- */
  function initStagger() {
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var children = group.querySelectorAll("[data-reveal]");
      children.forEach(function (child, i) {
        if (!child.style.getPropertyValue("--d")) {
          child.style.setProperty("--d", String(i));
        }
      });
    });

    // Index pour l'animation du menu mobile
    document
      .querySelectorAll("[data-mobile-nav] .mobile-nav__link")
      .forEach(function (el, i) {
        el.style.setProperty("--i", String(i));
      });
  }

  /* ----------------------------------------------------------------------
     5. Accordéon FAQ (accessible)
     ---------------------------------------------------------------------- */
  function initFaq() {
    var triggers = document.querySelectorAll("[data-faq-trigger]");
    if (!triggers.length) return;

    triggers.forEach(function (trigger) {
      var panel = document.getElementById(
        trigger.getAttribute("aria-controls")
      );
      if (!panel) return;

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";
        var group = trigger.closest("[data-faq]");

        // Mode accordéon : on referme les autres du même groupe
        if (!isOpen && group && group.hasAttribute("data-faq-exclusive")) {
          group.querySelectorAll("[data-faq-trigger]").forEach(function (other) {
            if (other === trigger) return;
            other.setAttribute("aria-expanded", "false");
            var otherPanel = document.getElementById(
              other.getAttribute("aria-controls")
            );
            if (otherPanel) otherPanel.classList.remove("is-open");
          });
        }

        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.classList.toggle("is-open", !isOpen);
      });
    });

    // Ouverture directe via ancre (#question-3)
    if (window.location.hash) {
      var target = document.querySelector(
        '[data-faq-trigger][aria-controls="' +
          window.location.hash.slice(1) +
          '"]'
      );
      if (target) target.click();
    }
  }

  /* ----------------------------------------------------------------------
     6. Parallaxe douce
     ---------------------------------------------------------------------- */
  function initParallax() {
    var items = document.querySelectorAll("[data-parallax]");
    if (!items.length || reduceMotion) return;
    if (window.matchMedia("(max-width: 940px)").matches) return;

    var ticking = false;

    function update() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.08;
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        el.style.transform =
          "translate3d(0," + (-progress * speed * 100).toFixed(2) + "px,0)";
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    update();
  }

  /* ----------------------------------------------------------------------
     7. Formulaire de contact — validation & retour utilisateur
     ---------------------------------------------------------------------- */
  function initForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector('[type="submit"]');

    /* `html` n'est vrai que pour des messages ecrits ici meme, jamais pour
       une donnee saisie par le visiteur : aucun risque d'injection. */
    function showStatus(type, message, html) {
      if (!status) return;
      status.className =
        "form__status is-visible form__status--" +
        (type === "ok" ? "ok" : "err");
      if (html) status.innerHTML = message;
      else status.textContent = message;
      status.setAttribute("role", type === "ok" ? "status" : "alert");
    }

    function validateField(field) {
      var control = field.querySelector(".field__control");
      if (!control) return true;
      var valid = control.checkValidity();
      field.classList.toggle("has-error", !valid);
      control.setAttribute("aria-invalid", String(!valid));
      return valid;
    }

    // Validation au blur, nettoyage à la saisie
    form.querySelectorAll(".field").forEach(function (field) {
      var control = field.querySelector(".field__control");
      if (!control) return;
      control.addEventListener("blur", function () {
        if (control.value) validateField(field);
      });
      control.addEventListener("input", function () {
        if (field.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Piège à robots
      var honeypot = form.querySelector('[name="_honey"]');
      if (honeypot && honeypot.value) return;

      var firstInvalid = null;
      form.querySelectorAll(".field").forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });

      /* Les champs sont controles AVANT le consentement : sur un formulaire
         vide, annoncer d'abord « acceptez la politique » et deplacer le focus
         tout en bas laissait croire que le reste etait rempli. */
      if (firstInvalid) {
        showStatus(
          "err",
          "Certains champs doivent être complétés ou corrigés avant l’envoi."
        );
        var control = firstInvalid.querySelector(".field__control");
        if (control) control.focus();
        return;
      }

      var consent = form.querySelector('[name="consentement"]');
      if (consent && !consent.checked) {
        showStatus(
          "err",
          "Merci d’accepter la politique de confidentialité pour envoyer votre message."
        );
        consent.focus();
        return;
      }

      /* ------------------------------------------------------------------
         ENVOI DE LA DEMANDE
         Le formulaire est poste au service de reception configure dans son
         attribut `action`. Le visiteur ne quitte pas la page : on affiche
         la confirmation sur place et on remet le formulaire a zero.
         ------------------------------------------------------------------ */
      var endpoint = form.getAttribute("action");

      if (!endpoint || endpoint === "#") {
        showStatus(
          "err",
          "L’envoi du formulaire n’est pas encore configuré. " +
            "Écrivez-nous directement à " +
            '<a href="mailto:contact@coproperformanceconseil.fr">' +
            "contact@coproperformanceconseil.fr</a>.",
          true
        );
        return;
      }

      /* FormSubmit expose deux points d'entree pour la meme adresse : celui
         de `action` renvoie une page HTML de remerciement — c'est le filet
         sans JavaScript — tandis que la variante `/ajax/` repond en JSON et
         laisse le visiteur sur la page. Le second n'existant que pour ce
         service, on ne bascule que si l'adresse est bien la sienne. */
      if (/^https:\/\/formsubmit\.co\/(?!ajax\/)/.test(endpoint)) {
        endpoint = endpoint.replace(
          "https://formsubmit.co/",
          "https://formsubmit.co/ajax/"
        );
      }

      var initialLabel = submit ? submit.textContent : "";
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Envoi…";
      }

      function restoreSubmit() {
        if (!submit) return;
        submit.disabled = false;
        submit.textContent = initialLabel;
      }

      function onFailure() {
        showStatus(
          "err",
          "L’envoi a échoué. Merci de réessayer, ou de nous écrire à " +
            '<a href="mailto:contact@coproperformanceconseil.fr">' +
            "contact@coproperformanceconseil.fr</a>.",
          true
        );
        restoreSubmit();
      }

      function onSuccess() {
        showStatus(
          "ok",
          "Merci, votre demande est bien enregistrée. Nous revenons vers vous " +
            "sous 48 h ouvrées pour convenir d’un créneau."
        );
        form.reset();
        restoreSubmit();
      }

      var data = new FormData(form);

      /* `fetch` garde le visiteur sur la page. Sans lui — navigateur ancien,
         script bloque — le formulaire part en POST classique et le service
         affiche sa propre page de confirmation. */
      if (!window.fetch) {
        form.submit();
        return;
      }

      window
        .fetch(endpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        })
        .then(function (response) {
          if (response.ok) onSuccess();
          else onFailure();
        })
        .catch(onFailure);
    });
  }

  /* ----------------------------------------------------------------------
     8. Barre de progression de lecture
     ---------------------------------------------------------------------- */
  function initScrollProgress() {
    if (reduceMotion) return;
    var bar = document.querySelector("[data-progress]");
    if (!bar) return;

    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ----------------------------------------------------------------------
     9. Photos : chargement progressif + voile de révélation
     ---------------------------------------------------------------------- */
  function initMedia() {
    // Fondu à l'arrivée du fichier (le flou de base reste visible avant)
    document.querySelectorAll(".media img").forEach(function (img) {
      if (img.complete && img.naturalWidth) {
        img.classList.add("is-loaded");
      } else {
        img.addEventListener("load", function () {
          img.classList.add("is-loaded");
        });
        img.addEventListener("error", function () {
          img.classList.add("is-loaded");
        });
      }
    });

    // Retrait du voile quand le cadre entre dans le champ
    var frames = document.querySelectorAll("[data-media]");
    if (!frames.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      frames.forEach(function (f) {
        f.classList.add("is-visible");
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    frames.forEach(function (f) {
      obs.observe(f);
    });
  }

  /* ----------------------------------------------------------------------
     10. Découpage des titres en mots, pour une révélation en cascade
     ---------------------------------------------------------------------- */
  function splitInto(node, counter) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var text = child.textContent;
        if (!text.trim()) return;
        var frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          var outer = document.createElement("span");
          outer.className = "w";
          var inner = document.createElement("span");
          inner.className = "w-i";
          inner.style.setProperty("--wi", String(counter.n++));
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && !child.classList.contains("w")) {
        // on descend dans les éléments inline (ex. .serif-em) sans les casser
        splitInto(child, counter);
      }
    });
  }

  function initSplitText() {
    var titles = document.querySelectorAll("[data-split]");
    if (!titles.length) return;

    if (reduceMotion) {
      titles.forEach(function (t) {
        t.classList.add("is-visible");
      });
      return;
    }

    titles.forEach(function (t) {
      splitInto(t, { n: 0 });
    });

    if (!("IntersectionObserver" in window)) {
      titles.forEach(function (t) {
        t.classList.add("is-visible");
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 }
    );

    titles.forEach(function (t) {
      obs.observe(t);
    });
  }

  /* ----------------------------------------------------------------------
     11. Étape active dans la méthodologie
     ---------------------------------------------------------------------- */
  function initSteps() {
    var steps = document.querySelectorAll(".step");
    if (!steps.length || !("IntersectionObserver" in window)) return;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          e.target.classList.toggle("is-active", e.isIntersecting);
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );

    steps.forEach(function (s) {
      obs.observe(s);
    });
  }

  /* ----------------------------------------------------------------------
     12. Listes à puces : apparition en cascade
     ---------------------------------------------------------------------- */
  function initCheckLists() {
    var lists = document.querySelectorAll(".check-list");
    if (!lists.length) return;

    lists.forEach(function (list) {
      Array.prototype.slice.call(list.children).forEach(function (li, i) {
        li.style.setProperty("--li", String(i));
      });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      lists.forEach(function (l) {
        l.classList.add("is-visible");
      });
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 }
    );

    lists.forEach(function (l) {
      obs.observe(l);
    });
  }

  /* ----------------------------------------------------------------------
     13. Compteur de section flottant
     ---------------------------------------------------------------------- */
  function initSectionCount() {
    var box = document.querySelector("[data-section-count]");
    if (!box || reduceMotion || !("IntersectionObserver" in window)) return;

    var sections = document.querySelectorAll("main [data-count-label]");
    if (!sections.length) return;

    var cur = box.querySelector("[data-count-cur]");
    var tot = box.querySelector("[data-count-tot]");
    var lab = box.querySelector("[data-count-label-out]");
    if (tot) tot.textContent = String(sections.length).padStart(2, "0");

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i =
            Array.prototype.indexOf.call(sections, e.target) + 1;
          if (cur) cur.textContent = String(i).padStart(2, "0");
          if (lab) lab.textContent = e.target.getAttribute("data-count-label");
        });
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 }
    );

    sections.forEach(function (s) {
      obs.observe(s);
    });

    // n'apparaît qu'une fois le hero dépassé
    var ticking = false;
    function toggle() {
      box.classList.toggle("is-on", window.scrollY > window.innerHeight * 0.7);
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(toggle);
          ticking = true;
        }
      },
      { passive: true }
    );
    toggle();
  }

  /* ----------------------------------------------------------------------
     14. Année courante dans le footer
     ---------------------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ----------------------------------------------------------------------
     Initialisation
     ---------------------------------------------------------------------- */
  function init() {
    initHeader();
    initMobileNav();
    initStagger();
    initSplitText();
    initReveals();
    initMedia();
    initCheckLists();
    initSteps();
    initFaq();
    initParallax();
    initScrollProgress();
    initSectionCount();
    initForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
