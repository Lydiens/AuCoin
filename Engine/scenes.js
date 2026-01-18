/* ============================================================
   SCENES MODULE
   Gère :
   - la scène actuelle
   - le chargement d’une scène
   - l’image affichée
   - les hotspots visibles
   - la transition Myst-like
   - la fermeture des popups
   - la mise à jour du bouton retour
============================================================ */

const Scenes = (() => {

  let currentScene = null;
  const sceneImages = {}; // { sceneName: "assets/images/sceneX.png" }

  /* -----------------------------------------
     Ajouter une scène
  ----------------------------------------- */
  function addScene(name, imagePath) {
    sceneImages[name] = imagePath;
  }

  /* -----------------------------------------
     Obtenir la scène actuelle
  ----------------------------------------- */
  function getCurrentScene() {
    return currentScene;
  }

  /* -----------------------------------------
     Charger une scène avec transition Myst-like
  ----------------------------------------- */
  function loadScene(name) {

    currentScene = name;

    const img = document.getElementById("scene-image");

    // Transition Myst-like
    Transitions.apply(() => {

      // Changer l’image pendant le fade-out
      img.src = sceneImages[name];

      // Fermer tous les popups
      document.querySelectorAll(".popup").forEach(p =>
        p.classList.add("hidden")
      );

      // Activer les hotspots de la scène
      Hotspots.activateForScene(name);

      // Mettre à jour le bouton retour
      Navigation.updateBackButton(name);

    });
  }

  /* -----------------------------------------
     Initialisation du module
  ----------------------------------------- */
  function init(initialScene) {
    currentScene = initialScene;

    // Afficher les hotspots de la scène initiale
    Hotspots.activateForScene(initialScene);

    // Cacher le bouton retour si pas de parent
    Navigation.updateBackButton(initialScene);
  }

  return {
    addScene,
    loadScene,
    getCurrentScene,
    init
  };

})();