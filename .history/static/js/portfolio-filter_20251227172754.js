document.addEventListener("DOMContentLoaded", function () {
  // ========== PORTFOLIO FILTER ==========
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-card");
  const certificateSubcards = document.getElementById("certificate-subcards");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      // Hide certificate subcards when switching filters
      if (certificateSubcards && filter !== "certificates") {
        certificateSubcards.style.display = "none";
        document
          .getElementById("certificates-parent")
          ?.classList.remove("expanded");
      }

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          // Show card
          card.classList.remove("hidden");
          card.style.display = "block";
        } else {
          // Hide card
          card.classList.add("hidden");
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });

      // Show subcards if certificates filter is active
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

  // ========== CERTIFICATE MODAL LIGHTBOX ==========
  const modal = document.getElementById("cert-modal");
  const modalImg = document.getElementById("cert-modal-img");
  const modalCaption = document.getElementById("cert-modal-caption");
  const closeBtn = document.querySelector(".cert-modal-close");

  // Open modal when clicking certificate card
  document.querySelectorAll(".certificate-card").forEach((card) => {
    card.addEventListener("click", function () {
      const certImage = this.getAttribute("data-cert-image");
      const certName = this.getAttribute("data-cert-name");

      modal.style.display = "block";
      modalImg.src = certImage;
      modalCaption.innerHTML = certName;
    });
  });

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }

  // Close modal when clicking outside image
  modal?.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Close modal with ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
    }
  });
});
