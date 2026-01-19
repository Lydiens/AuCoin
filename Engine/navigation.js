/* ============================================================
   NAVIGATION MODULE
   Gère :
   - l’arborescence des retours
   - le bouton retour
   - la logique de navigation arrière
============================================================ */

const Navigation = (() => {

  // Table des parents : { enfant: parent }
  const parents = {};

  /* -----------------------------------------
     Définir le parent d'une scène
  ----------------------------------------- */
  function setParent(child, parent) {
    parents[child] = parent;
  }

  /* -----------------------------------------
     Retourner à la scène parente
  ----------------------------------------- */
  function goBack() {
    const current = Scenes.getCurrentScene();
    const parent = parents[current];

    if (parent) {
      Scenes.loadScene(parent);
    }
  }

  /* -----------------------------------------
     Afficher ou cacher le bouton retour
  ----------------------------------------- */
  function updateBackButton(sceneName) {
    const btn = document.getElementById("btn-retour");

    if (parents[sceneName]) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }

  /* -----------------------------------------
     Initialisation du bouton retour
  ----------------------------------------- */
  function init() {
    const btn = document.getElementById("btn-retour");
    btn.addEventListener("click", goBack);
  }

  return {
    setParent,
    goBack,
    updateBackButton,
    init
  };

})();