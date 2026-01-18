/* ============================================================
   INITIALISATION DU JEU
============================================================ */

/* -----------------------------------------
   Déclaration des scènes
----------------------------------------- */

Scenes.addScene("scene1", "assets/images/scene1.png");
Scenes.addScene("scene2", "assets/images/scene2.png");
Scenes.addScene("scene3", "assets/images/scene3.png");
Scenes.addScene("scene4", "assets/images/scene4.png");
Scenes.addScene("scene5", "assets/images/scene5.png");
Scenes.addScene("poubelle", "assets/images/poubelle.png");
Scenes.addScene("hublotproche", "assets/images/hublotproche.png");
Scenes.addScene("hublotcasse", "assets/images/HublotProcheSansVitre.jpg");

/* -----------------------------------------
   Déclaration des relations de navigation
----------------------------------------- */

Navigation.setParent("poubelle", "scene5");
Navigation.setParent("scene5", "scene1");
Navigation.setParent("scene4", "scene1");
Navigation.setParent("scene3", "scene1");
Navigation.setParent("scene2", "scene1");
Navigation.setParent("hublotproche", "scene2");

/* -----------------------------------------
   Initialisation du moteur
----------------------------------------- */

window.addEventListener("load", () => {

  const music = document.getElementById("bg-music");
  music.volume = 0.4;
  music.play().catch(() => {
    window.addEventListener("click", () => {
      music.play();
    }, { once: true });
  });

  Navigation.init();
  Hotspots.init();
  Popups.init();
  Scenes.init("scene1");
});


/* ============================================================
   SYSTÈME UNIFIÉ : GIF + POPUP AUTO + POPUPS SÉQUENTIELS
============================================================ */

(function () {

  const originalLoadScene = Scenes.loadScene;

  /* ------------------------------------------------------------
     1) GIFS post-transition
  ------------------------------------------------------------ */
  const gifTransitions = {
    hublotproche: {
      gif: "assets/gifs/hublotpoisson.gif",
      duration: 3.16
    }
  };

  /* ------------------------------------------------------------
     2) Popup automatique à l’ouverture d’une scène
  ------------------------------------------------------------ */
  const autoPopups = {
    hublotcasse: "popup-hublotcasse"
  };

  /* ------------------------------------------------------------
     3) Popups séquentiels sur un hotspot
  ------------------------------------------------------------ */
  const sequentialPopupConfig = {
    scene: "hublotproche",
    hotspotId: "texte-hublotnormal",

    firstPopup: "popup-hublotnormal-0",

    popups: [
      "popup-hublotnormal-1",
      "popup-hublotnormal-2",
      "popup-hublotnormal-3",
      "popup-hublotnormal-4",
      "popup-hublotnormal-5"
    ],

    finalScene: "hublotcasse"
  };

  let popupIndex = -1;


  /* ------------------------------------------------------------
     4) WRAP : Hotspots.activateForScene
        → popups simples + popups séquentiels
  ------------------------------------------------------------ */
  const originalActivate = Hotspots.activateForScene;

  Hotspots.activateForScene = function (sceneName) {

    // Laisser le moteur activer/afficher les hotspots
    originalActivate(sceneName);

    // --- Popups simples : tous les hotspots popup-only ouvrent popup-<id> ---
    document.querySelectorAll(`.hotspot.popup-only[data-scene="${sceneName}"]`)
      .forEach(h => {

        // On ignore le hotspot séquentiel (géré plus bas)
        if (sceneName === sequentialPopupConfig.scene &&
            h.id === sequentialPopupConfig.hotspotId) {
          return;
        }

        h.onclick = () => {
          const popupId = "popup-" + h.id;
          Popups.open(popupId);
        };
      });

    // --- Popups séquentiels (hublot) ---
    if (sceneName !== sequentialPopupConfig.scene) {
      popupIndex = -1;
      return;
    }

    const hotspot = document.getElementById(sequentialPopupConfig.hotspotId);
    if (!hotspot) return;

    hotspot.onclick = () => {

      // Premier popup
      if (popupIndex === -1) {
        const popup = document.getElementById(sequentialPopupConfig.firstPopup);
        popup.classList.remove("hidden");

        popup.querySelector(".close").onclick = () => {
          popup.classList.add("hidden");
          popupIndex = 0;
        };

        return;
      }

      // Popups suivants
      if (popupIndex < sequentialPopupConfig.popups.length) {

        const popupId = sequentialPopupConfig.popups[popupIndex];
        const popup = document.getElementById(popupId);
        popup.classList.remove("hidden");

        popup.querySelector(".close").onclick = () => {
          popup.classList.add("hidden");
          popupIndex++;

          if (popupIndex >= sequentialPopupConfig.popups.length) {
            Scenes.loadScene(sequentialPopupConfig.finalScene);
          }
        };

        return;
      }
    };
  };


  /* ------------------------------------------------------------
     5) WRAP : Scenes.loadScene → GIF + popup auto
  ------------------------------------------------------------ */
  Scenes.loadScene = function (name) {

    const gifCfg = gifTransitions[name];
    const popupId = autoPopups[name];

    originalLoadScene(name);

    const img = document.getElementById("scene-image");
    const gifEl = document.getElementById("scene-gif");
    const backBtn = document.getElementById("btn-retour");

    // Correctif : popup auto après transition
    if (popupId) {
      setTimeout(() => {
        const popup = document.getElementById(popupId);
        if (popup) popup.classList.remove("hidden");
      }, 10);
    }

    img.addEventListener("transitionend", function handler() {
      img.removeEventListener("transitionend", handler);

      // CAS 1 : scène avec GIF
      if (gifCfg) {

        document.querySelectorAll(".hotspot").forEach(h => {
          h.dataset._disabled = "1";
          h.style.pointerEvents = "none";
        });
        backBtn.style.display = "none";

        gifEl.src = gifCfg.gif + "?" + Date.now();
        gifEl.style.display = "block";

        setTimeout(() => {

          gifEl.style.display = "none";

          document.querySelectorAll(".hotspot").forEach(h => {
            if (h.dataset._disabled === "1") {
              h.style.pointerEvents = "auto";
              delete h.dataset._disabled;
            }
          });

          backBtn.style.display = "block";

          if (popupId) {
            const popup = document.getElementById(popupId);
            popup.classList.remove("hidden");
          }

        }, gifCfg.duration * 1000);

        return;
      }

      // CAS 2 : popup auto sans GIF
      if (popupId) {
        const popup = document.getElementById(popupId);
        popup.classList.remove("hidden");
      }

    });
  };

})();