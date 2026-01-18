/* ============================================================
   HOTSPOTS MODULE
   Gère :
   - l’enregistrement des hotspots (optionnel)
   - l’activation selon la scène
   - les clics (navigation, popup, actions)
============================================================ */

const Hotspots = (() => {

  /* -----------------------------------------
     Masquer tous les hotspots (transition)
  ----------------------------------------- */
  function hideAll() {
    document.querySelectorAll(".hotspot").forEach(h => {
      h.style.display = "none";
    });
  }

  /* -----------------------------------------
     Activer les hotspots d'une scène
  ----------------------------------------- */
  function activateForScene(sceneName) {

    // Masquer tous les hotspots
    hideAll();

    // Afficher ceux de la scène active
    document.querySelectorAll(`.hotspot[data-scene="${sceneName}"]`)
      .forEach(h => {
        h.style.display = "block";
      });
  }

  /* -----------------------------------------
     Initialisation des clics
  ----------------------------------------- */
  function init() {

    document.querySelectorAll(".hotspot").forEach(h => {

      h.addEventListener("click", () => {

        /* -----------------------------
           POPUP
        ----------------------------- */
        if (h.classList.contains("popup-only")) {

          const popupId = "popup-" + h.id
            .replace("texte-", "")
            .replace("popup-", "");

          Popups.open(popupId);
          return;
        }

        /* -----------------------------
           NAVIGATION
        ----------------------------- */
        const target = h.dataset.target;
        if (target) {
          Scenes.loadScene(target);
          return;
        }

        /* -----------------------------
           FUTURES ACTIONS
        ----------------------------- */
      });
    });
  }

  return {
    activateForScene,
    hideAll,     // ← ajouté proprement
    init
  };

})();