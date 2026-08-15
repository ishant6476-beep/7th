(() => {
  "use strict";
  function upgrade() {
    const hero = document.querySelector(".hero-image");
    if (hero) {
      hero.src = "/images/hero-3d-growth.jpg";
      hero.alt = "Prime Polo 3D growth pathways and digital analytics city";
    }

    const servicesContainer = document.querySelector(".services-section .container-elite");
    const servicesGrid = servicesContainer?.querySelector(".services-grid");
    if (servicesContainer && servicesGrid && !servicesContainer.querySelector(".ds-section-visual")) {
      const visual = document.createElement("figure");
      visual.className = "ds-section-visual";
      const image = document.createElement("img");
      image.src = "/images/services-3d-orbit.jpg";
      image.alt = "3D orbit illustrating Prime Polo's integrated marketing services";
      image.loading = "lazy";
      visual.append(image);
      servicesContainer.insertBefore(visual, servicesGrid);
    }

    document.querySelectorAll("img").forEach((image) => {
      const signal = `${image.alt || ""} ${image.className || ""}`.toLowerCase();
      if (/logo|client|partner|brand-mark/.test(signal)) image.classList.add("company-logo");
    });

    const map = document.querySelector(".map-visual");
    if (map && !map.querySelector("iframe")) {
      map.innerHTML = "";
      const frame = document.createElement("iframe");
      frame.title = "Prime Polo office map — Vikas Nagar, Bihta, Bihar 801103";
      frame.src = "https://www.google.com/maps?q=Vikas%20Nagar%2C%20Bihta%2C%20Bihar%20801103&output=embed";
      frame.loading = "lazy";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.allowFullscreen = true;
      const bar = document.createElement("div");
      bar.className = "ds-map-bar";
      bar.innerHTML = '<strong>Vikas Nagar, Bihta, Bihar 801103</strong><a href="https://www.google.com/maps/search/?api=1&query=Vikas+Nagar%2C+Bihta%2C+Bihar+801103" target="_blank" rel="noopener">Open in Google Maps</a>';
      map.append(frame, bar);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", upgrade, { once: true });
  else upgrade();
  // The recovered React bundle is a module and can render after classic defer
  // scripts. Retry briefly so enhancements attach after the SPA has mounted.
  let attempts = 0;
  const mountTimer = window.setInterval(() => {
    upgrade();
    attempts += 1;
    if (attempts >= 20 || (document.querySelector(".hero-image") && document.querySelector(".map-visual iframe"))) {
      window.clearInterval(mountTimer);
    }
  }, 250);
  // Reapply after SPA route changes.
  window.addEventListener("popstate", () => setTimeout(upgrade, 100));
  window.addEventListener("hashchange", () => setTimeout(upgrade, 100));
})();
