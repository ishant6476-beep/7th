(() => {
  "use strict";
  const PHONE_DISPLAY = "7903946440";
  const PHONE_E164 = "+917903946440";
  const WHATSAPP_URL = "https://wa.me/917903946440?text=Hello%20Prime%20Polo%2C%20I%20would%20like%20to%20discuss%20a%20marketing%20project.";

  function createSection(id, className, eyebrow, title, intro, cards) {
    const section = document.createElement("section");
    section.id = id;
    section.className = `section ds-generated-section ${className}`;
    section.innerHTML = `<div class="container-elite"><div class="section-heading"><span class="section-tag">${eyebrow}</span><h2>${title}</h2><p>${intro}</p></div><div class="ds-generated-grid">${cards.map((card, index) => `<article><small>${String(index + 1).padStart(2, "0")}</small><h3>${card.title}</h3><p>${card.copy}</p>${card.meta ? `<strong>${card.meta}</strong>` : ""}</article>`).join("")}</div><div class="ds-generated-cta"><a href="#contact">Start a conversation →</a></div></div>`;
    return section;
  }

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

    const main = document.querySelector("main");
    const servicesSection = document.querySelector(".services-section");
    if (main && servicesSection && !document.getElementById("influencer")) {
      const influencer = createSection(
        "influencer",
        "ds-influencer-section",
        "Influencer Marketing",
        "Creator influence, engineered to perform.",
        "From creator discovery and UGC production to rights, amplification and reporting, Prime Polo builds influencer programs around brand fit and measurable outcomes.",
        [
          { title: "Strategy & Casting", copy: "Audience research, creator shortlisting, authenticity checks and campaign architecture aligned with your objective." },
          { title: "UGC & Content Rights", copy: "Platform-native creator assets with clear usage rights for organic publishing, paid amplification and repurposing." },
          { title: "Campaign Operations", copy: "Briefing, negotiation, approvals, timelines, creator coordination and brand-safety management from one team." },
          { title: "Measurement & Scale", copy: "Reach, engagement, traffic, leads, sales and content-performance reporting used to scale proven creator partnerships." }
        ]
      );
      main.insertBefore(influencer, servicesSection);
    }

    const resultsSection = document.querySelector(".results");
    if (main && resultsSection && !document.getElementById("news-awards")) {
      const news = createSection(
        "news-awards",
        "ds-news-section",
        "News & Awards",
        "News, milestones & recognition.",
        "A transparent record of Prime Polo's progress. Verified press coverage and awards will be published here as they are received.",
        [
          { title: "Prime Polo formed", copy: "Prime Polo began operations in 2026 with an integrated approach to creative, technology, media and measurable growth.", meta: "2026 · Company milestone" },
          { title: "Full-service capability launched", copy: "The agency expanded its offer across SEO, AEO, GEO, social, influencer, UGC, web, mobile, media and automation.", meta: "2026 · Service update" },
          { title: "Bihta growth studio", copy: "Prime Polo established its business base at Vikas Nagar, Bihta, Bihar 801103 to serve brands through an India-first, remote-ready model.", meta: "2026 · Studio update" },
          { title: "Recognition desk", copy: "No unverified awards are claimed. Confirmed industry recognition, press mentions and certifications will appear here with source links.", meta: "Transparent by design" }
        ]
      );
      main.insertBefore(news, resultsSection);
    }

    const contactSection = document.querySelector(".contact");
    if (main && contactSection && !document.getElementById("international")) {
      const international = createSection(
        "international",
        "ds-international-section",
        "International",
        "Built in Bihar. Ready for borderless growth.",
        "Prime Polo supports remote collaboration and international growth enquiries with localized strategy, clear workflows and senior-led delivery.",
        [
          { title: "Market Entry & Localization", copy: "Audience, competitor, offer and channel research adapted to the language and buying behavior of each target market." },
          { title: "International SEO, AEO & GEO", copy: "Search architecture, multilingual content planning and AI-search visibility designed for multi-market discovery." },
          { title: "Cross-Border Media", copy: "Campaign planning for Google, Meta, LinkedIn, display and video with market-level measurement and budget control." },
          { title: "Remote Delivery", copy: "Structured communication, shared dashboards, documented approvals and timezone-aware delivery for distributed client teams." }
        ]
      );
      main.insertBefore(international, contactSection);
    }

    document.querySelectorAll("img").forEach((image) => {
      const signal = `${image.alt || ""} ${image.className || ""}`.toLowerCase();
      const isPrimePoloLogo = image.classList.contains("brand-logo") || image.classList.contains("footer-logo") || /prime polo|rising with trust/.test(signal);
      if (isPrimePoloLogo) {
        image.classList.remove("company-logo");
        image.classList.add("own-logo");
      } else if (/logo|client|partner|brand-mark/.test(signal)) {
        image.classList.add("company-logo");
      }
    });

    const headerActions = document.querySelector(".header-actions");
    if (headerActions && !headerActions.querySelector(".ds-header-contact")) {
      const contacts = document.createElement("span");
      contacts.className = "ds-header-contact desktop-only";
      contacts.innerHTML = `<a href="tel:${PHONE_E164}">Call ${PHONE_DISPLAY}</a><a href="${WHATSAPP_URL}" target="_blank" rel="noopener">WhatsApp</a>`;
      headerActions.insertBefore(contacts, headerActions.firstChild);
    }

    if (!document.querySelector(".ds-phone-dock")) {
      const dock = document.createElement("aside");
      dock.className = "ds-phone-dock";
      dock.setAttribute("aria-label", "Call or WhatsApp Prime Polo");
      dock.innerHTML = `<a class="call" href="tel:${PHONE_E164}">☎ <span>Call ${PHONE_DISPLAY}</span></a><a class="whatsapp" href="${WHATSAPP_URL}" target="_blank" rel="noopener">◉ <span>WhatsApp</span></a>`;
      document.body.append(dock);
    }

    const contactDetails = document.querySelector(".contact-details");
    if (contactDetails && !contactDetails.querySelector(".ds-direct-phone")) {
      const phone = document.createElement("a");
      phone.className = "ds-direct-phone";
      phone.href = `tel:${PHONE_E164}`;
      phone.textContent = `Call: ${PHONE_DISPLAY}`;
      const whatsapp = document.createElement("a");
      whatsapp.className = "ds-direct-phone ds-whatsapp-link";
      whatsapp.href = WHATSAPP_URL;
      whatsapp.target = "_blank";
      whatsapp.rel = "noopener";
      whatsapp.textContent = "Chat on WhatsApp";
      contactDetails.append(phone, whatsapp);
    }

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
