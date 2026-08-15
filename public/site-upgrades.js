(() => {
  "use strict";
  const PHONE_DISPLAY = "7903946440";
  const PHONE_E164 = "+917903946440";
  const WHATSAPP_URL = "https://wa.me/917903946440?text=Hello%20Prime%20Polo%2C%20I%20would%20like%20to%20discuss%20a%20marketing%20project.";

  const BLOG_ARTICLES = [
    {
      title: "SEO, AEO & GEO in 2026",
      eyebrow: "Search Strategy",
      body: `<p>Search visibility now spans three connected surfaces. SEO earns discoverability in traditional results. AEO structures clear answers for featured snippets and answer engines. GEO helps credible brand information appear in generative AI responses.</p><h4>Start with one evidence base</h4><p>Do not build three disconnected content programs. Begin with customer questions, commercial topics, first-party expertise and verifiable proof. Build technically accessible pages around those themes, then structure concise answers, definitions, comparisons and supporting data that machines and people can interpret.</p><h4>Measure business movement</h4><p>Track qualified organic traffic, assisted conversions, branded demand, citations, lead quality and revenue—not rankings alone. Strong search programs combine technical health, useful content, authority and conversion design.</p>`
    },
    {
      title: "A better influencer brief",
      eyebrow: "Influencer Marketing",
      body: `<p>A creator brief should create clarity without removing the creator's voice. It needs one commercial objective, a precise audience, the product truth, non-negotiable claims, required deliverables, usage rights, timing and a measurement plan.</p><h4>Choose fit before reach</h4><p>Review audience relevance, content quality, historical consistency, engagement credibility and brand safety before follower count. The strongest creator is the one whose audience has a believable reason to care.</p><h4>Plan distribution early</h4><p>Decide whether content will remain organic, be whitelisted for paid media or be adapted across brand channels. Rights, formats and hooks should be agreed before production, not after a strong asset appears.</p>`
    },
    {
      title: "Measure paid media honestly",
      eyebrow: "Performance Marketing",
      body: `<p>Platform-reported return is useful, but it is not the complete commercial truth. A reliable measurement system connects campaign data to analytics, CRM stages, sales outcomes and contribution margin.</p><h4>Use a metric hierarchy</h4><p>Begin with business outcomes such as profitable revenue or qualified pipeline. Then monitor CAC, conversion rate and lead quality. Use clicks, CPM and engagement as diagnostic signals—not final success metrics.</p><h4>Test incrementally</h4><p>Document the hypothesis, audience, offer, creative variable and decision threshold before launch. Hold enough variables constant to learn something, and scale only when performance remains sound beyond the platform dashboard.</p>`
    },
    {
      title: "The conversion-ready website",
      eyebrow: "Web & CRO",
      body: `<p>A conversion-ready website answers five questions quickly: what is offered, who it is for, why it is different, what proof exists and what the visitor should do next.</p><h4>Remove friction before adding effects</h4><p>Prioritize message hierarchy, mobile speed, readable layouts, focused calls to action and trustworthy proof. Every field, animation and navigation choice should help the user decide rather than compete for attention.</p><h4>Instrument the journey</h4><p>Track meaningful actions, validate forms, preserve campaign attribution and review where qualified visitors stop. Conversion optimization is a continuous system of evidence-led improvements, not a one-time redesign.</p>`
    }
  ];

  const SERVICE_DETAILS = {
    "Creative & Communication": ["Brand and audience research", "Positioning and messaging", "Campaign concepts", "Visual communication systems", "Creative production and rollout"],
    "Search Engine Marketing": ["Technical SEO", "SEO content strategy", "Local and e-commerce SEO", "AEO and GEO", "Paid search management", "Authority and reporting"],
    "Full-Funnel Digital Marketing": ["Growth audit and strategy", "Channel planning", "Acquisition campaigns", "Landing journeys", "Lifecycle and retention", "Commercial reporting"],
    "Website & Web App Development": ["Discovery and architecture", "UX and UI design", "Responsive development", "E-commerce and web applications", "Analytics and technical SEO", "Maintenance"],
    "Mobile Application Development": ["Product discovery", "UX/UI prototypes", "Android and iOS development", "API integrations", "Testing and launch", "Product iteration"],
    "Ad Management": ["Google Ads", "Meta Ads", "LinkedIn Ads", "Display and video", "Creative testing", "Attribution and optimization"],
    "UGC Content Creation": ["Creator sourcing", "Concepts and scripts", "UGC production", "Editing and variants", "Usage rights", "Paid-media adaptation"],
    "Social Media Marketing": ["Channel strategy", "Content calendars", "Creative production", "Community management", "Social listening", "Reporting"],
    "Influencer Marketing": ["Creator discovery", "Vetting and negotiation", "Campaign management", "Content approvals", "Rights and amplification", "Measurement"],
    "Online Reputation Management": ["Review monitoring", "Sentiment analysis", "Response workflows", "Search reputation", "Crisis support", "Brand-safety reporting"],
    "Content Marketing & Video": ["Editorial strategy", "Copywriting", "Reels and social video", "Brand films", "Distribution", "Performance analysis"],
    "Branding & Design": ["Brand strategy", "Naming and messaging", "Visual identity", "Packaging and collateral", "Design systems", "Launch support"]
  };

  function openContentModal(title, eyebrow, html) {
    document.querySelector(".ds-content-modal")?.remove();
    const modal = document.createElement("div");
    modal.className = "ds-content-modal";
    modal.innerHTML = `<section role="dialog" aria-modal="true" aria-label="${title.replaceAll('"', '')}"><button class="ds-modal-close" type="button" aria-label="Close">×</button><small>${eyebrow}</small><h2>${title}</h2><div class="ds-modal-copy">${html}</div><a class="ds-modal-cta" href="#contact">Discuss this with Prime Polo →</a></section>`;
    const close = () => modal.remove();
    modal.querySelector(".ds-modal-close").addEventListener("click", close);
    modal.addEventListener("click", event => { if (event.target === modal) close(); });
    document.body.append(modal);
    modal.querySelector(".ds-modal-close").focus();
  }

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
    if (servicesSection) {
      servicesSection.id = "services";
      servicesSection.querySelectorAll(".service-item").forEach(card => {
        if (card.dataset.serviceReady === "true") return;
        card.dataset.serviceReady = "true";
        const title = card.querySelector("h3")?.textContent?.trim() || "Prime Polo service";
        const description = card.querySelector("p")?.textContent?.trim() || "";
        const features = SERVICE_DETAILS[title] || ["Discovery and strategy", "Senior-led execution", "Measurement and optimization", "Clear reporting"];
        const link = card.querySelector("a");
        if (link) {
          link.href = `#services`;
          link.textContent = "Explore service →";
          link.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            openContentModal(title, "Prime Polo Service", `<p>${description}</p><h4>What we can provide</h4><ul>${features.map(item => `<li>${item}</li>`).join("")}</ul>`);
          });
        }
      });
      const catalog = servicesSection.querySelector(".service-catalog");
      if (catalog) catalog.id = "service-catalog";
    }
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
    if (main && resultsSection && !document.getElementById("blog")) {
      const blog = createSection(
        "blog",
        "ds-blog-section",
        "Prime Polo Blog",
        "Practical thinking for modern growth teams.",
        "Actionable articles on search, creators, performance media, automation and conversion—written for teams that need clearer decisions, not more marketing noise.",
        [
          { title: "SEO, AEO & GEO in 2026", copy: "How to build visibility across Google search, answer engines and generative AI without fragmenting your content strategy.", meta: "Search · 7 minute read" },
          { title: "A better influencer brief", copy: "The commercial, creative and measurement inputs every creator campaign needs before outreach begins.", meta: "Influencer · 6 minute read" },
          { title: "Measure paid media honestly", copy: "A practical framework for connecting platform data to CAC, qualified pipeline, contribution margin and revenue.", meta: "Performance · 8 minute read" },
          { title: "The conversion-ready website", copy: "A focused checklist for message clarity, proof, speed, analytics and friction across high-intent landing experiences.", meta: "Web & CRO · 5 minute read" }
        ]
      );
      blog.querySelectorAll("article").forEach((article, index) => {
        article.classList.add("ds-blog-card");
        article.tabIndex = 0;
        article.setAttribute("role", "button");
        article.setAttribute("aria-label", `Read ${article.querySelector("h3")?.textContent || "blog article"}`);
        article.dataset.article = String(index);
        const read = document.createElement("button");
        read.type = "button";
        read.className = "ds-read-article";
        read.textContent = "Read article →";
        article.append(read);
      });
      blog.querySelectorAll(".ds-blog-card").forEach(card => {
        const open = () => {
          const article = BLOG_ARTICLES[Number(card.dataset.article)];
          if (article) openContentModal(article.title, article.eyebrow, article.body);
        };
        card.addEventListener("click", open);
        card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } });
      });
      main.insertBefore(blog, resultsSection);
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
