// Klick-Play fuer die eingebetteten SIEYA-Videos auf den Wissen_SIEYA_*-Seiten:
// zeigt zunaechst nur ein Foto mit Play-Button (echter, indexierbarer Inhalt
// drumherum bleibt bestehen), erst ein Klick laedt das eigentliche iframe mit
// der SIEYA-Video-URL (inkl. UTM) nach - kein automatisches Embed beim Laden.
document.querySelectorAll(".wsv-video").forEach(function (el) {
  el.addEventListener("click", function () {
    var url = el.getAttribute("data-video");
    if (!url) return;
    el.innerHTML =
      '<iframe src="' + url + '" title="SIEYA Video" loading="lazy" allow="fullscreen" allowfullscreen></iframe>';
  }, { once: true });
});
