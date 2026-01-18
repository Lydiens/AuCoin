/* ============================================================
   POPUPS MODULE
   Gère :
   - ouverture / fermeture
   - drag & drop
   - boutons de fermeture
============================================================ */

const Popups = (() => {

  /* -----------------------------------------
     Ouvrir un popup
  ----------------------------------------- */
  function open(id) {
    const popup = document.getElementById(id);
    if (popup) popup.classList.remove("hidden");
  }

  /* -----------------------------------------
     Fermer un popup
  ----------------------------------------- */
  function close(id) {
    const popup = document.getElementById(id);
    if (popup) popup.classList.add("hidden");
  }

  /* -----------------------------------------
     Initialisation des popups
  ----------------------------------------- */
  function init() {

    /* -----------------------------
       Boutons de fermeture
    ----------------------------- */
    document.querySelectorAll(".popup .close").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".popup").classList.add("hidden");
      });
    });

    /* -----------------------------
       Drag & Drop
    ----------------------------- */
    document.querySelectorAll(".popup").forEach(popup => {

      const header = popup.querySelector(".popup-header");
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      header.addEventListener("mousedown", e => {
        isDragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;
      });

      document.addEventListener("mousemove", e => {
        if (!isDragging) return;
        popup.style.left = (e.clientX - offsetX) + "px";
        popup.style.top = (e.clientY - offsetY) + "px";
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });
    });
  }

  return {
    open,
    close,
    init
  };

})();