document.addEventListener("DOMContentLoaded", function () {
  /* ---- mobile hamburger menu ---- */
  var hamburger = document.getElementById("hamburgerBtn");
  var mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---- hide mobile sticky CTA once the contact form is in view ---- */
  var stickyCta = document.getElementById("stickyCta");
  var contactSection = document.getElementById("contact");

  if (stickyCta && contactSection && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          stickyCta.style.transform = entry.isIntersecting
            ? "translateY(100%)"
            : "translateY(0)";
          stickyCta.style.transition = "transform 0.25s ease";
        });
      },
      { threshold: 0.15 },
    );
    ctaObserver.observe(contactSection);
  }

  /* ---- restrained scroll-reveal for editorial sections ---- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    revealEls.length &&
    "IntersectionObserver" in window &&
    !prefersReducedMotion
  ) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---- inquiry form: friendly inline confirmation for Netlify AJAX submit ---- */
  var form = document.getElementById("inquiryForm");
  var formNote = document.getElementById("formNote");

  if (form && formNote) {
    form.addEventListener("submit", function (e) {
      // Let Netlify handle the actual submission (data-netlify="true").
      // This just gives the user immediate, accessible feedback.
      var formData = new FormData(form);

      e.preventDefault();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
        .then(function () {
          formNote.textContent = "Thanks — we'll be in touch soon!";
          formNote.classList.add("success");
          form.reset();
        })
        .catch(function () {
          formNote.textContent =
            "Something went wrong. Please call 719-200-4906 or email info@maddoxkempo.com.";
        });
    });
  }
});
