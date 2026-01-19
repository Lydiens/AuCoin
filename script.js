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
Scenes.addScene("tablepapier1", "assets/images/tablepapier1.png");
Scenes.addScene("tablepapier2", "assets/images/tablepapier2.png");
Scenes.addScene("tablepapiervide", "assets/images/tablepapiervide.png");
Scenes.addScene("planlargemurpapier", "assets/images/planlargemurpapier.png");
Scenes.addScene("hublotrouge", "assets/images/hublotrouge.png");
Scenes.addScene("murchair", "assets/images/murchair.png");
Scenes.addScene("murchairbouche", "assets/images/murchairbouche.png");
Scenes.addScene("tablechair", "assets/images/tablechair.png");
Scenes.addScene("toutchair", "assets/images/toutchair.png");
Scenes.addScene("hublotoeil", "assets/images/hublotoeil.png");

/* -----------------------------------------
   Déclaration des relations de navigation
----------------------------------------- */

Navigation.setParent("poubelle", "scene5");
Navigation.setParent("scene5", "scene1");
Navigation.setParent("scene4", "scene1");
Navigation.setParent("scene3", "scene1");
Navigation.setParent("scene2", "scene1");
Navigation.setParent("hublotproche", "scene2");
Navigation.setParent("tablepapier1", "scene4");
Navigation.setParent("tablepapier2", "tablepapier1");
Navigation.setParent("tablepapiervide", "planlargemurpapier");
Navigation.setParent("hublotrouge", "planlargemurpapier");
Navigation.setParent("murchair", "planlargemurpapier");
Navigation.setParent("tablechair", "planlargemurpapier");
Navigation.setParent("hublotoeil", "planlargemurpapier");

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
     2) Popups automatiques
  ------------------------------------------------------------ */
  const autoPopups = {
    hublotcasse: "popup-hublotcasse",
    tablepapiervide: "popup-table-vide" ,
    toutchair: "popup-tout-chair",
  };

  /* ------------------------------------------------------------
     3) Popups séquentiels MULTI-SÉQUENCES
  ------------------------------------------------------------ */

  const sequentialPopupConfigs = [

    /* --- Séquence 1 : Hublot normal --- */
    {
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
      finalScene: "hublotcasse",
      index: -1
    },

    /* --- Séquence 2 : Mur chair --- */
    {
      scene: "murchair",
      hotspotId: "texte-mur-chair",
      firstPopup: "popup-texte-mur-chair",
      popups: [
        "popup-mur-chair-1",
        "popup-mur-chair-2",
        "popup-mur-chair-3"
      ],
      finalScene: "murchairbouche",
      index: -1
    }

  ];

  /* ------------------------------------------------------------
     4) WRAP : Hotspots.activateForScene
  ------------------------------------------------------------ */

  const originalActivate = Hotspots.activateForScene;

  Hotspots.activateForScene = function (sceneName) {

    originalActivate(sceneName);

    /* --- Popups simples --- */
    document.querySelectorAll(`.hotspot.popup-only[data-scene="${sceneName}"]`)
      .forEach(h => {

        // Si ce hotspot appartient à une séquence, on le laisse à la séquence
        const seq = sequentialPopupConfigs.find(s => s.scene === sceneName && s.hotspotId === h.id);
        if (seq) return;

        h.onclick = () => {
          const popupId = "popup-" + h.id;
          Popups.open(popupId);
        };
      });

    /* --- Popups séquentiels (multi-séquences) --- */
    const seq = sequentialPopupConfigs.find(s => s.scene === sceneName);

    if (!seq) {
      sequentialPopupConfigs.forEach(s => s.index = -1);
      return;
    }

    seq.index = -1;

    const hotspot = document.getElementById(seq.hotspotId);
    if (!hotspot) return;

    hotspot.onclick = () => {

      /* Premier popup */
      if (seq.index === -1) {
        const popup = document.getElementById(seq.firstPopup);
        popup.classList.remove("hidden");

        popup.querySelector(".close").onclick = () => {
          popup.classList.add("hidden");
          seq.index = 0;
        };

        return;
      }

      /* Popups suivants */
      if (seq.index < seq.popups.length) {

        const popupId = seq.popups[seq.index];
        const popup = document.getElementById(popupId);
        popup.classList.remove("hidden");

        popup.querySelector(".close").onclick = () => {
          popup.classList.add("hidden");
          seq.index++;

          if (seq.index >= seq.popups.length) {
            // On attend un nouveau clic sur le hotspot
            hotspot.onclick = () => {
              Scenes.loadScene(seq.finalScene);
            };
          }
        };

        return;
      }
    };
  };


  /* ------------------------------------------------------------
     5) WRAP : Scenes.loadScene → GIF + popup auto
  ------------------------------------------------------------ */

  let autoPopupTimer = null;

  Scenes.loadScene = function (name) {

    const gifCfg = gifTransitions[name];
    const popupId = autoPopups[name] || null;

    if (autoPopupTimer) {
      clearTimeout(autoPopupTimer);
      autoPopupTimer = null;
    }

    originalLoadScene(name);

    const img = document.getElementById("scene-image");
    const gifEl = document.getElementById("scene-gif");
    const backBtn = document.getElementById("btn-retour");

    /* GIF */
    if (gifCfg) {
      img.addEventListener("transitionend", function handler() {
        img.removeEventListener("transitionend", handler);

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

        }, gifCfg.duration * 1000);
      });
    }

    /* Popup auto */
    if (popupId) {
      autoPopupTimer = setTimeout(() => {
        const popup = document.getElementById(popupId);
        if (popup) popup.classList.remove("hidden");
        autoPopupTimer = null;
      }, 700);
    }
  };

})();