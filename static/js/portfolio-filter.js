document.addEventListener("DOMContentLoaded", function () {
  // ========== PORTFOLIO FILTER ==========
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-card");
  const certificateSubcards = document.getElementById("certificate-subcards");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      if (certificateSubcards && filter !== "certificates") {
        certificateSubcards.style.display = "none";
        document
          .getElementById("certificates-parent")
          ?.classList.remove("expanded");
      }

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
          card.style.display = "block";
        } else {
          card.classList.add("hidden");
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });

      if (filter === "certificates" && certificateSubcards) {
        setTimeout(() => {
          certificateSubcards.style.display = "grid";
          document
            .getElementById("certificates-parent")
            ?.classList.add("expanded");
        }, 300);
      }
    });
  });

  // ========== CERTIFICATE EXPANSION ==========
  const certificateParent = document.getElementById("certificates-parent");

  if (certificateParent && certificateSubcards) {
    certificateParent.addEventListener("click", function (e) {
      e.preventDefault();

      if (
        certificateSubcards.style.display === "none" ||
        !certificateSubcards.style.display
      ) {
        certificateSubcards.style.display = "grid";
        this.classList.add("expanded");
      } else {
        certificateSubcards.style.display = "none";
        this.classList.remove("expanded");
      }
    });
  }

  // ========== CERTIFICATE MODAL LIGHTBOX WITH ZOOM ==========
  const modal = document.getElementById("cert-modal");
  const modalImg = document.getElementById("cert-modal-img");
  const modalCaption = document.getElementById("cert-modal-caption");
  const closeBtn = document.querySelector(".cert-modal-close");

  let currentScale = 1;
  let isZoomed = false;

  // Create zoom indicator
  const zoomIndicator = document.createElement("div");
  zoomIndicator.className = "zoom-indicator";
  zoomIndicator.textContent = "100%";
  modal?.appendChild(zoomIndicator);

  // Open modal when clicking certificate card
  document.querySelectorAll(".certificate-card").forEach((card) => {
    card.addEventListener("click", function () {
      const certImage = this.getAttribute("data-cert-image");
      const certName = this.getAttribute("data-cert-name");

      modal.style.display = "block";
      modalImg.src = certImage;
      modalCaption.innerHTML = certName;

      // Reset zoom
      currentScale = 1;
      isZoomed = false;
      modalImg.style.transform = `scale(${currentScale})`;
      modalImg.classList.remove("zoomed");
      updateZoomIndicator();
    });
  });

  // Zoom with mouse wheel
  modalImg?.addEventListener("wheel", function (e) {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    currentScale = Math.min(Math.max(0.5, currentScale + delta), 3);

    this.style.transform = `scale(${currentScale})`;

    if (currentScale > 1) {
      this.classList.add("zoomed");
      isZoomed = true;
    } else {
      this.classList.remove("zoomed");
      isZoomed = false;
    }

    updateZoomIndicator();
  });

  // Click image to toggle zoom
  modalImg?.addEventListener("click", function (e) {
    e.stopPropagation();

    if (!isZoomed) {
      currentScale = 2;
      this.classList.add("zoomed");
      isZoomed = true;
    } else {
      currentScale = 1;
      this.classList.remove("zoomed");
      isZoomed = false;
    }

    this.style.transform = `scale(${currentScale})`;
    updateZoomIndicator();
  });

  // Update zoom indicator
  function updateZoomIndicator() {
    const percentage = Math.round(currentScale * 100);
    zoomIndicator.textContent = `${percentage}%`;
    zoomIndicator.classList.add("show");

    setTimeout(() => {
      zoomIndicator.classList.remove("show");
    }, 1000);
  }

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
      currentScale = 1;
      isZoomed = false;
      modalImg.style.transform = "scale(1)";
      modalImg.classList.remove("zoomed");
    });
  }

  // Close modal when clicking background
  modal?.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      currentScale = 1;
      isZoomed = false;
      modalImg.style.transform = "scale(1)";
      modalImg.classList.remove("zoomed");
    }
  });

  // Close modal with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
      currentScale = 1;
      isZoomed = false;
      modalImg.style.transform = "scale(1)";
      modalImg.classList.remove("zoomed");
    }
  });

  // Reset zoom with double-click
  modalImg?.addEventListener("dblclick", function (e) {
    e.stopPropagation();
    currentScale = 1;
    isZoomed = false;
    this.style.transform = "scale(1)";
    this.classList.remove("zoomed");
    updateZoomIndicator();
  });
});
