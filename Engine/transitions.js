/* ============================================================
   TRANSITIONS MODULE (double-buffer, anti-flash)
   - zéro flash même en réseau
   - fade-out → fade-in propre
   - compatible GIF, popups, hotspots
============================================================ */

const Transitions = (() => {

  // Image principale (déjà dans ton HTML)
  const oldImg = document.getElementById("scene-image");

  // Nouvelle image (buffer invisible)
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
  newImg.style.pointerEvents = "none";

  // On ajoute le buffer dans la scène
  oldImg.parentNode.appendChild(newImg);

  function apply(callback) {

    // Désactiver les hotspots pendant la transition
    Hotspots.hideAll();

    // Le callback doit fournir la nouvelle image
    let newSrc = null;
    callback && callback((src) => newSrc = src);

    if (!newSrc) return;

    // Charger la nouvelle image dans le buffer invisible
    newImg.src = newSrc;

    newImg.onload = () => {

      // Fade-out de l'image actuelle
      oldImg.style.opacity = 0;

      // Quand le fade-out commence → fade-in du buffer
      setTimeout(() => {

        newImg.style.opacity = 1;

        // Quand le fade-in est terminé → swap
        setTimeout(() => {

          // On remplace l'image principale par la nouvelle
          oldImg.src = newSrc;

          // Correction anti-flash :
          // On attend un frame pour éviter la superposition
          requestAnimationFrame(() => {

            // On cache le buffer
            newImg.style.opacity = 0;

            // On remet oldImg visible uniquement quand newImg est invisible
            setTimeout(() => {
              oldImg.style.opacity = 1;
            }, 50);

          });

        }, 600); // durée du fade-in

      }, 300); // petit délai pour laisser le fade-out commencer
    };
  }

  return { apply };

})();