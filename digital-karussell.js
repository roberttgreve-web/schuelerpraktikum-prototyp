// Scroll-Logik fuer das "Digital mal reinschnuppern"-Karussell (.zehnmin) -
// ausgelagert aus Praktikumsfinder_Vorschau.html, damit Seiten ausserhalb der
// Hauptsuche (z.B. die rund_ums_praktikum-Artikel) dieselbe Kachel-Reihe ohne
// Code-Duplikat einbinden koennen. Reine Optik/Bedienung (Pfeile scrollen um
// eine Kachelbreite) - die Kacheln selbst werden serverseitig ins HTML
// geschrieben (siehe baue_artikelseiten.py), kein Nachladen per JS noetig.
(function () {
  const bahn = document.getElementById("zm-bahn");
  const zmLinks = document.getElementById("zm-links");
  const zmRechts = document.getElementById("zm-rechts");
  if (!bahn || !zmLinks || !zmRechts) return;

  function kachelSchritt() {
    const erste = bahn.querySelector(".zm-kachel");
    if (!erste) return bahn.clientWidth;
    const abstand = parseFloat(getComputedStyle(bahn).columnGap) || 0;
    return erste.getBoundingClientRect().width + abstand;
  }

  function pfeileAktualisieren() {
    const rest = bahn.scrollWidth - bahn.clientWidth - bahn.scrollLeft;
    zmLinks.disabled = bahn.scrollLeft <= 2;
    zmRechts.disabled = rest <= 2;
  }

  let laeuft = null;

  function gleiteZu(ziel) {
    if (laeuft) cancelAnimationFrame(laeuft);
    const start = bahn.scrollLeft;
    const grenze = bahn.scrollWidth - bahn.clientWidth;
    const ende = Math.max(0, Math.min(ziel, grenze));

    if (document.visibilityState !== "visible"
        || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bahn.scrollLeft = ende;
      pfeileAktualisieren();
      return;
    }

    const dauer = 320, beginn = performance.now();
    (function schritt(jetzt) {
      const t = Math.min(1, (jetzt - beginn) / dauer);
      const weich = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      bahn.scrollLeft = start + (ende - start) * weich;
      if (t < 1) laeuft = requestAnimationFrame(schritt);
      else { laeuft = null; pfeileAktualisieren(); }
    })(beginn);
  }

  zmRechts.addEventListener("click", () => gleiteZu(bahn.scrollLeft + kachelSchritt()));
  zmLinks.addEventListener("click", () => gleiteZu(bahn.scrollLeft - kachelSchritt()));
  bahn.addEventListener("scroll", pfeileAktualisieren);
  window.addEventListener("resize", pfeileAktualisieren);
  pfeileAktualisieren();
})();
