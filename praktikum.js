// Wird von jeder generierten Praktikumsseite geladen (praktikum/{land}/{slug}.html),
// deshalb ausschliesslich mit dem Pfad-Praefix "../../" gearbeitet.

// Pool der "Digital mal reinschnuppern"-Kacheln, identisch zur Startseite.
// Nur Kacheln mit echtem Ziel drin - die zwei SIEYA-Kacheln haben noch keine
// Ziel-URL und wuerden hier ins Leere fuehren.
var ZM_POOL = [
  {
    href: "../../Zehn_Minuten_Praktikum_SIEMENS.html", intern: true,
    img: "kachel_siemens.jpg", pos: "",
    label: "Ein Sensor ist kaputt — und 20.000 Flaschen warten.",
    sub: "Siemens · Elektroniker*in Automatisierungstechnik",
  },
  {
    href: "https://amazonfutureengineer.deinerstertag.de/experiences/virtuelle-tour-bei-amazon-music/", intern: false,
    img: "kachel_amazon.webp", pos: "",
    label: "Wer entdeckt Stars wie Nina Chuba?",
    sub: "Amazon Music · Blick hinter die Kulissen",
  },
  {
    href: "../../Zehn_Minuten_Praktikum_AUTOEDER.html", intern: true,
    img: "kachel_autoeder.jpg", pos: "pos-right",
    label: "Der Anlasser ist kaputt. Findest du das Problem?",
    sub: "Auto Eder Gruppe · Kfz-Mechatroniker*in",
  },
  {
    href: "../../Zehn_Minuten_Praktikum_UKMV.html", intern: true,
    img: "kachel_ukmv.jpg", pos: "",
    label: "Jonas ist im Sportunterricht gestürzt. Wer zahlt jetzt?",
    sub: "Unfallkasse MV · Sozialversicherungsfachangestellte*r",
  },
  {
    href: "https://amazonfutureengineer.deinerstertag.de/experiences/virtuelle-tour-bei-audible/", intern: false,
    img: "kachel_audible.jpeg", pos: "",
    label: "Wie entsteht ein Hit-Hörbuch?",
    sub: "Audible · Blick hinter die Kulissen",
  },
  {
    href: "https://amazonfutureengineer.deinerstertag.de/experiences/virtuelle-tour-durch-amazon-mgm-studios/", intern: false,
    img: "kachel_mgm.webp", pos: "",
    label: "Wie entsteht ein Blockbuster?",
    sub: "Amazon MGM Studios · Blick hinter die Kulissen",
  },
  {
    href: "https://amazonfutureengineer.deinerstertag.de/experiences/virtuelle-tour-durch-aws/", intern: false,
    img: "kachel_aws.webp", pos: "",
    label: "Wie entsteht eine KI-Lösung bei AWS?",
    sub: "AWS · Welche Tech-Jobs dahinterstecken",
  },
  {
    href: "https://amazonfutureengineer.deinerstertag.de/experiences/virtuelle-tour-durch-ein-rechenzentrum/", intern: false,
    img: "kachel_rechenzentrum.webp", pos: "",
    label: "Wer bringt deine Lieblingsserie ins Wohnzimmer?",
    sub: "Amazon Rechenzentrum · Die Cloud-Profis entdecken",
  },
  {
    href: "https://amazonfutureengineer.deinerstertag.de/experiences/virtuelle-tour-durch-ein-logistikzentrum/", intern: false,
    img: "kachel_logistik.webp", pos: "",
    label: "Wie werden Pakete intelligent sortiert?",
    sub: "Amazon Logistikzentrum · Die Tech dahinter entdecken",
  },
];

function zmGemischt() {
  var pool = ZM_POOL.slice();
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  return pool;
}

function zmKachelnRendern() {
  var ziel = document.getElementById("side-mini-tiles");
  if (!ziel) return;
  // Alle neun statt nur drei - beim Runterscrollen soll jede Kachel einmal
  // vorbeikommen, nicht nur eine zufaellige Auswahl.
  zmGemischt().forEach(function (t) {
    var a = document.createElement("a");
    a.className = "mini-tile";
    a.href = t.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML =
      '<img class="' + t.pos + '" src="../../vorschau_bilder/' + t.img + '" alt="">' +
      '<div class="mini-tile-label">' + t.label + "</div>" +
      '<div class="mini-tile-sub">' + t.sub + "</div>";
    ziel.appendChild(a);
  });
}

// Die gelbe Box laeuft zunaechst ganz normal im Textfluss mit, damit beim
// Runterscrollen nacheinander alle Kacheln sichtbar werden. Erst wenn die
// letzte Kachel oben aus dem Bild gelaufen ist, rastet die Box ein (native
// position:sticky kann dieses "erst normal, dann fest" nicht von allein,
// deshalb der Sentinel + Scroll-Check - identisch zur Suchseite).
function zmStickyReveal() {
  var box = document.getElementById("side-col");
  var sentinel = document.getElementById("side-col-sentinel");
  if (!box || !sentinel) return;
  var versatz = 20;
  var angefordert = false;
  function pruefen() {
    angefordert = false;
    box.classList.toggle("ds-sticky", sentinel.getBoundingClientRect().top < versatz);
  }
  document.addEventListener("scroll", function () {
    if (!angefordert) { requestAnimationFrame(pruefen); angefordert = true; }
  }, { passive: true });
  // Backstop: manche Browser liefern getBoundingClientRect() im
  // scroll-Handler nicht immer sofort aktuell (Layout haengt der
  // Scrollposition kurz hinterher) - ein Intervall faengt das ab, statt
  // dass die Box im falschen Zustand haengen bleibt.
  setInterval(pruefen, 300);
  pruefen();
}

// Derselbe Hinweis wie auf der Suchseite ("Gleich geht's auf die Seite der
// Organisation"), hier verdrahtet an den einzigen echten Aussenlink der
// Seite: den CTA-Button zur Firmenwebsite. sessionStorage-Key ist bewusst
// identisch zur Suchseite, damit der Hinweis site-weit nur einmal je Sitzung
// erscheint statt auf jeder Zwischenseite erneut.
function zmHinweisVerdrahten() {
  var link = document.getElementById("firmenlink");
  var schleier = document.getElementById("schleier");
  if (!link || !schleier) return;
  var verstanden = document.getElementById("verstanden");
  var schliessenBtn = document.getElementById("hinweisSchliessen");
  var ziel = link.getAttribute("href");
  if (!ziel || ziel === "#") return;

  function schliessen() { schleier.hidden = true; }

  function oeffnen() {
    var a = document.createElement("a");
    a.href = ziel; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
  }

  link.addEventListener("click", function (e) {
    if (sessionStorage.getItem("hinweisGezeigt")) return; // nur beim ersten Mal
    e.preventDefault();
    sessionStorage.setItem("hinweisGezeigt", "1");
    schleier.hidden = false;
    verstanden.focus();
  });
  verstanden.addEventListener("click", function () { schliessen(); oeffnen(); });
  schliessenBtn.addEventListener("click", schliessen);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !schleier.hidden) schliessen();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  zmKachelnRendern();
  zmHinweisVerdrahten();
  zmStickyReveal();
});
