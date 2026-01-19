/* ============================================================
   TRANSITIONS MODULE (double-buffer)
   - zéro flash
   - fade-out → fade-in propre
   - compatible réseau
============================================================ */

const Transitions = (() => {

  const oldImg = document.getElementById("scene-image");
  const newImg = document.createElement("img");

  newImg.id = "scene-image-new";
  newImg.className = "pixel";
  newImg.style.position = "absolute";
  newImg.style.top = "0";
  newImg.style.left = "0";
  newImg.style.width = "100%";
  newImg.style.height = "100%";
  newImg.style.opacity = "0";
  newImg.style.transition = "opacity 0.6s ease";

  oldImg.parentNode.appendChild(newImg);

  function apply(callback) {

    Hotspots.hideAll();

    // On récupère la nouvelle image à charger
    let newSrc = null;
    callback && callback((src) => newSrc = src);

    if (!newSrc) return;

    // Charger la nouvelle image dans le buffer invisible
    newImg.src = newSrc;

    newImg.onload = () => {

      // Fade-out de l'ancienne image
      oldImg.style.opacity = 0;

      setTimeout(() => {

        // Fade-in de la nouvelle image
        newImg.style.opacity = 1;

        setTimeout(() => {

          // On remplace l'ancienne image par la nouvelle
          oldImg.src = newSrc;
          oldImg.style.opacity = 1;

          // On reset le buffer
          newImg.style.opacity = 0;

        }, 600);

      }, 300);
    };
  }

  return { apply };

})();