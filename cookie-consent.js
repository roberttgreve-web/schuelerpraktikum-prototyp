/* Cookie-Banner + Einstellungen fuer schuelerpraktikum.de - eigenes,
   selbst gehostetes Skript (kein Drittanbieter-Consent-Tool), Muster
   uebernommen von coachunited.de (2026-09-14, gleiche Rechtstraegerin/
   Betreiberfamilie), Farben/Schrift ans eigene Theme angepasst, keine
   Server-seitige Consent-Protokollierung (dieser Prototyp hat keine
   eigene API-Route dafuer - falls das spaeter noetig wird, hier ergaenzen).

   GA_ID ist bewusst leer: aktuell ist auf schuelerpraktikum.de KEIN
   Analyse-Tool eingebunden (siehe ÜBERGABE.md, gegengeprueft im Code).
   Der Statistik-Umschalter ist trotzdem schon vorbereitet - sobald hier
   eine echte GA4-Property-ID eingetragen wird, greift loadGA() automatisch,
   ohne dass am Banner selbst etwas geaendert werden muss. */
(function () {
  var CONSENT_KEY = 'sp_cookie_consent';
  var BANNER_VERSION = '1.0';
  var GA_ID = ''; // z.B. 'G-XXXXXXXXXX', sobald Analytics eingerichtet ist

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; }
  }

  function saveConsent(statistics) {
    var consent = { necessary: true, statistics: !!statistics, timestamp: Date.now(), version: BANNER_VERSION };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    return consent;
  }

  function loadGA() {
    if (!GA_ID || window.__spGaLoaded) return;
    window.__spGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function applyConsent(consent) {
    if (consent.statistics) loadGA();
  }

  function decide(statistics) {
    var consent = saveConsent(statistics);
    removeBanner();
    removeModal();
    applyConsent(consent);
  }

  var style = document.createElement('style');
  style.textContent =
    '.sp-cookie-banner { position: fixed; left: 50%; bottom: 0; transform: translateX(-50%); width: 100%; max-width: 420px; background: var(--weiss, #fff); border-radius: 20px 20px 0 0; box-shadow: 0 -8px 32px rgba(14,20,48,0.22); padding: 20px 22px 22px; z-index: 1000; font-family: var(--schrift, "Roboto", system-ui, sans-serif); box-sizing: border-box; }' +
    '.sp-cookie-banner p { font-size: 13.5px; line-height: 1.6; color: var(--tinte-weich, #52646D); margin: 0 0 14px; }' +
    '.sp-cookie-banner a { color: var(--akzent, #00AFD6); }' +
    '.sp-cookie-actions { display: flex; gap: 8px; }' +
    '.sp-cookie-btn { flex: 1; padding: 12px 0; border-radius: 10px; font-size: 13.5px; font-weight: 700; border: none; cursor: pointer; font-family: inherit; }' +
    '.sp-cookie-btn.sp-reject { background: #EEF1F2; color: var(--tinte, #181818); }' +
    '.sp-cookie-btn.sp-accept { background: var(--akzent, #00AFD6); color: #fff; }' +
    '.sp-cookie-settings-link { display: block; width: 100%; text-align: center; margin-top: 12px; font-size: 12.5px; color: var(--tinte-weich, #52646D); text-decoration: underline; cursor: pointer; background: none; border: none; font-family: inherit; }' +
    '.sp-cookie-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1010; display: flex; align-items: flex-end; justify-content: center; }' +
    '.sp-cookie-modal { width: 100%; max-width: 420px; background: var(--weiss, #fff); border-radius: 20px 20px 0 0; padding: 22px; font-family: var(--schrift, "Roboto", system-ui, sans-serif); max-height: 85vh; overflow-y: auto; box-sizing: border-box; }' +
    '.sp-cookie-modal h3 { font-size: 17px; font-weight: 800; color: var(--tinte, #181818); margin: 0 0 14px; }' +
    '.sp-cookie-cat { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 14px 0; border-bottom: 1px solid #EEF1F2; }' +
    '.sp-cookie-cat-title { font-size: 14px; font-weight: 700; color: var(--tinte, #181818); margin-bottom: 3px; }' +
    '.sp-cookie-cat-desc { font-size: 12.5px; line-height: 1.5; color: var(--tinte-weich, #52646D); }' +
    '.sp-cookie-toggle { position: relative; width: 42px; height: 24px; flex-shrink: 0; }' +
    '.sp-cookie-toggle input { opacity: 0; width: 0; height: 0; }' +
    '.sp-cookie-toggle-slider { position: absolute; inset: 0; background: #d8dbe4; border-radius: 24px; cursor: pointer; transition: background .15s; }' +
    '.sp-cookie-toggle-slider::before { content: ""; position: absolute; width: 18px; height: 18px; left: 3px; top: 3px; background: #fff; border-radius: 50%; transition: transform .15s; }' +
    '.sp-cookie-toggle input:checked + .sp-cookie-toggle-slider { background: var(--akzent, #00AFD6); }' +
    '.sp-cookie-toggle input:checked + .sp-cookie-toggle-slider::before { transform: translateX(18px); }' +
    '.sp-cookie-toggle input:disabled + .sp-cookie-toggle-slider { opacity: .5; cursor: not-allowed; }' +
    '.sp-cookie-modal-actions { display: flex; gap: 8px; margin-top: 18px; }' +
    '@media print { .sp-cookie-banner, .sp-cookie-modal-overlay { display: none !important; } }';
  document.head.appendChild(style);

  function reservePageBottomSpace(px) { document.body.style.paddingBottom = px + 'px'; }
  function releasePageBottomSpace() { document.body.style.paddingBottom = ''; }

  function renderBanner() {
    if (document.getElementById('sp-cookie-banner')) return;
    var banner = document.createElement('div');
    banner.className = 'sp-cookie-banner';
    banner.id = 'sp-cookie-banner';
    banner.innerHTML =
      '<p>Wir nutzen technisch notwendige Cookies für den Betrieb dieser Seite. Mit deiner Einwilligung würden wir außerdem Statistik-Cookies nutzen, um die Seite zu verbessern. Mehr dazu in unserer <a href="/rechtliches/datenschutz.html">Datenschutzerklärung</a>.</p>' +
      '<div class="sp-cookie-actions">' +
        '<button type="button" class="sp-cookie-btn sp-reject" id="sp-cookie-reject">Ablehnen</button>' +
        '<button type="button" class="sp-cookie-btn sp-accept" id="sp-cookie-accept">Akzeptieren</button>' +
      '</div>' +
      '<button type="button" class="sp-cookie-settings-link" id="sp-cookie-settings-open">Einstellungen</button>';
    document.body.appendChild(banner);
    reservePageBottomSpace(banner.getBoundingClientRect().height);

    document.getElementById('sp-cookie-reject').addEventListener('click', function () { decide(false); });
    document.getElementById('sp-cookie-accept').addEventListener('click', function () { decide(true); });
    document.getElementById('sp-cookie-settings-open').addEventListener('click', function () {
      removeBanner();
      renderModal();
    });
  }

  function removeBanner() {
    var el = document.getElementById('sp-cookie-banner');
    if (el) el.remove();
    releasePageBottomSpace();
  }

  function renderModal() {
    if (document.getElementById('sp-cookie-modal-overlay')) return;
    var current = getConsent();
    var overlay = document.createElement('div');
    overlay.className = 'sp-cookie-modal-overlay';
    overlay.id = 'sp-cookie-modal-overlay';
    overlay.innerHTML =
      '<div class="sp-cookie-modal">' +
        '<h3>Cookie-Einstellungen</h3>' +
        '<div class="sp-cookie-cat">' +
          '<div><div class="sp-cookie-cat-title">Notwendig</div><div class="sp-cookie-cat-desc">Für den Betrieb der Seite erforderlich (z. B. Speichern deiner Cookie-Auswahl). Kann nicht deaktiviert werden.</div></div>' +
          '<label class="sp-cookie-toggle"><input type="checkbox" checked disabled><span class="sp-cookie-toggle-slider"></span></label>' +
        '</div>' +
        '<div class="sp-cookie-cat">' +
          '<div><div class="sp-cookie-cat-title">Statistik</div><div class="sp-cookie-cat-desc">Hilft uns zu verstehen, wie die Seite genutzt wird (aktuell noch nicht aktiv geschaltet).</div></div>' +
          '<label class="sp-cookie-toggle"><input type="checkbox" id="sp-cookie-stat-toggle"' + ((current && current.statistics) ? ' checked' : '') + '><span class="sp-cookie-toggle-slider"></span></label>' +
        '</div>' +
        '<div class="sp-cookie-modal-actions">' +
          '<button type="button" class="sp-cookie-btn sp-reject" id="sp-cookie-modal-reject">Alle ablehnen</button>' +
          '<button type="button" class="sp-cookie-btn sp-accept" id="sp-cookie-modal-save">Speichern</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    document.getElementById('sp-cookie-modal-reject').addEventListener('click', function () { decide(false); });
    document.getElementById('sp-cookie-modal-save').addEventListener('click', function () {
      var statistics = document.getElementById('sp-cookie-stat-toggle').checked;
      decide(statistics);
    });
  }

  function removeModal() {
    var el = document.getElementById('sp-cookie-modal-overlay');
    if (el) el.remove();
  }

  // Von der Fusszeile aus aufrufbar (Link "Cookie-Einstellungen").
  window.spOpenCookieSettings = function () {
    removeBanner();
    renderModal();
  };

  function init() {
    var consent = getConsent();
    if (consent) {
      applyConsent(consent);
    } else {
      renderBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
