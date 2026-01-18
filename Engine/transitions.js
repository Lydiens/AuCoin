/* ============================================================
   TRANSITIONS MODULE
   Gère :
   - la transition Myst-like (fade-out → changement → fade-in)
   - désactivation des hotspots pendant la transition
============================================================ */

const Transitions = (() => {

  function apply(callback) {
    const img = document.getElementById("scene-image");

    // Désactiver tous les hotspots immédiatement
    Hotspots.hideAll();

    // Début du fade-out
    img.classList.add("out");

    setTimeout(() => {

      // Changer l’image pendant le noir
      if (callback) callback();

      // Fade-in
      img.classList.remove("out");

    }, 600);
  }

  return { apply };

})();