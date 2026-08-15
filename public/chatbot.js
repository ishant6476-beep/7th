(() => {
  "use strict";

  const SERVICES = [
    'Creative & Communication',
    'Search Engine Marketing (SEO, AEO & GEO)',
    'Full-Funnel Digital Marketing',
    'Website & Web App Development',
    'Mobile Application Development',
    'Ad Management',
    'UGC Content Creation',
    'Social Media Marketing',
    'Influencer Marketing',
    'Online Reputation Management',
    'Content Marketing & Video Production',
    'Branding & Design',
    'Performance Marketing',
    'Lead Generation',
    'Marketing Automation & CRM',
    'Analytics, Attribution & Reporting',
  ];

  const PROFILE_FIELDS = {
    influencer: [
      ["creator_name", "Creator/stage name", "text", true],
      ["primary_handle", "Primary social handle", "text", true],
      ["profile_links", "Profile links (one per line)", "textarea", true],
      ["niche", "Content niche/category", "text", true],
      ["primary_platform", "Primary platform", "select", true, ["Instagram", "YouTube", "LinkedIn", "Facebook", "X / Twitter", "Twitch", "Podcast", "Blog", "Other"]],
      ["other_platforms", "Other active platforms", "text", false],
      ["audience_size", "Total audience/follower size", "text", true],
      ["avg_views", "Average views/reach per post", "text", false],
      ["engagement_rate", "Average engagement rate", "text", false],
      ["audience_profile", "Audience age, interests and demographics", "textarea", true],
      ["audience_locations", "Top audience cities/countries", "text", true],
      ["content_languages", "Content languages", "text", true],
      ["content_formats", "Main content formats", "text", true],
      ["years_creating", "Years creating professionally", "text", false],
      ["past_collaborations", "Past brand collaborations", "textarea", false],
      ["current_rates", "Current collaboration rate/range", "text", false],
      ["representation", "Manager/agency representation", "text", false],
      ["creator_goal", "Primary creator/business goal", "textarea", true],
      ["creator_challenge", "Biggest current challenge", "textarea", true],
    ],
    company: [
      ["company_name", "Company/brand name", "text", true],
      ["job_title", "Your job title", "text", true],
      ["website", "Company website", "url", false],
      ["industry", "Industry/category", "text", true],
      ["business_model", "Business model", "select", true, ["B2B", "B2C", "D2C", "Marketplace", "SaaS", "Services", "Nonprofit", "Other"]],
      ["company_size", "Company size", "select", true, ["1–5", "6–20", "21–50", "51–200", "201–500", "500+"]],
      ["years_operating", "Years in business", "text", false],
      ["headquarters", "Headquarters/location", "text", true],
      ["markets_served", "Cities/countries served", "text", true],
      ["target_audience", "Target customer/audience", "textarea", true],
      ["offer", "Main products/services and typical value", "textarea", true],
      ["revenue_range", "Approximate annual revenue range", "select", false, ["Pre-revenue", "Under ₹50L", "₹50L–₹2Cr", "₹2Cr–₹10Cr", "₹10Cr–₹50Cr", "₹50Cr+", "Prefer not to say"]],
      ["marketing_team", "Current marketing team/resources", "textarea", true],
      ["current_channels", "Current marketing channels", "textarea", true],
      ["current_tools", "CRM, analytics and marketing tools", "textarea", false],
      ["company_goal", "Primary commercial/marketing goal", "textarea", true],
      ["company_challenge", "Biggest growth constraint", "textarea", true],
      ["decision_process", "Decision makers and approval process", "textarea", false],
    ],
    agency: [
      ["agency_name", "Agency name", "text", true],
      ["job_title", "Your role/title", "text", true],
      ["website", "Agency website", "url", false],
      ["agency_type", "Agency type/specialization", "text", true],
      ["team_size", "Team size", "select", true, ["Solo", "2–5", "6–20", "21–50", "51–100", "100+"]],
      ["headquarters", "Headquarters/location", "text", true],
      ["markets_served", "Markets/countries served", "text", true],
      ["agency_services", "Services your agency currently offers", "textarea", true],
      ["client_profile", "Typical client industries and sizes", "textarea", true],
      ["active_clients", "Approximate active client count", "text", false],
      ["partnership_type", "Partnership required", "select", true, ["White-label delivery", "Specialist subcontracting", "Overflow capacity", "Referral partnership", "Joint pitch", "Technology/automation partner", "Other"]],
      ["white_label", "White-label/confidentiality requirements", "textarea", false],
      ["current_stack", "Current tools and delivery stack", "textarea", false],
      ["delivery_capacity", "Current capacity and resource gap", "textarea", true],
      ["agency_goal", "Partnership goal", "textarea", true],
      ["agency_challenge", "Biggest delivery/growth challenge", "textarea", true],
    ],
  };

  const KNOWLEDGE = [
    [/^(hi|hello|hey|namaste)\b/i, "Hello! I can explain Prime Polo’s services or help you submit a detailed profile for a tailored plan. Choose “Get a plan” above to begin."],
    [/seo|organic|rank on google|keyword/i, "Our SEO work includes technical audits, keyword and competitor research, site architecture, on-page optimization, content planning, authority building, and reporting. We prioritize qualified organic demand and conversion—not rankings alone."],
    [/advertising|paid media|google ads|meta ads|ppc/i, "Performance marketing covers Google, Meta, LinkedIn, display, and video, connecting targeting, creative testing, landing pages, attribution, and optimization against CAC, ROAS, pipeline, and revenue."],
    [/price|pricing|cost|budget|how much/i, "Engagements typically range from INR 2 lakh to INR 50 lakh or more per month depending on scope, channels, production, technology, and media. Complete the detailed profile under “Get a plan” for an appropriate recommendation."],
    [/service|what do you do|help/i, `Prime Polo can provide: ${SERVICES.join(", ")}. Choose “Get a plan” to select every service you are interested in.`],
    [/contact|email|meeting|proposal/i, "Email info@primepolomarketing.in, call or WhatsApp +91 7903946440, or complete the “Get a plan” profile. The structured profile helps the team prepare a relevant response before contacting you."],
  ];

  function fallback(message) {
    return KNOWLEDGE.find(([pattern]) => pattern.test(message))?.[1]
      || "Ask me about Prime Polo’s marketing services, pricing, process, or results. For a tailored recommendation, choose “Get a plan” and complete your Influencer, Company, or Agency profile.";
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function makeField([name, labelText, type, required, options]) {
    const label = el("label", "ppai-field");
    const caption = el("span", "ppai-label", `${labelText}${required ? " *" : ""}`);
    let input;
    if (type === "textarea") {
      input = el("textarea", "ppai-control");
      input.rows = 3;
    } else if (type === "select") {
      input = el("select", "ppai-control");
      const placeholder = el("option", "", "Select an option");
      placeholder.value = "";
      input.append(placeholder);
      options.forEach((option) => {
        const item = el("option", "", option);
        item.value = option;
        input.append(item);
      });
    } else {
      input = el("input", "ppai-control");
      input.type = type;
    }
    input.name = name;
    input.required = required;
    input.maxLength = type === "textarea" ? 2000 : 300;
    label.append(caption, input);
    return label;
  }

  function boot() {
    document.querySelectorAll(".chatbot").forEach((node) => node.style.setProperty("display", "none", "important"));

    const host = el("section", "ppai-host");
    const panel = el("div", "ppai-panel");
    panel.hidden = true;

    const header = el("header", "ppai-header");
    const identity = el("div", "ppai-identity");
    identity.append(el("strong", "", "Prime Intelligence"), el("small", "", "● Online now"));
    const close = el("button", "ppai-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close chat");
    header.append(identity, close);

    const tabs = el("nav", "ppai-tabs");
    const chatTab = el("button", "active", "AI Assistant");
    const planTab = el("button", "", "Get a plan");
    chatTab.type = planTab.type = "button";
    tabs.append(chatTab, planTab);

    const chatView = el("div", "ppai-view ppai-chat-view");
    const messages = el("div", "ppai-messages");
    messages.setAttribute("aria-live", "polite");
    const chatForm = el("form", "ppai-form");
    const chatInput = el("input", "ppai-input");
    chatInput.maxLength = 800;
    chatInput.placeholder = "Ask about growth…";
    const send = el("button", "ppai-send", "Send");
    send.type = "submit";
    chatForm.append(chatInput, send);
    chatView.append(messages, chatForm);

    const planView = el("div", "ppai-view ppai-plan-view");
    planView.hidden = true;
    const planIntro = el("div", "ppai-plan-intro");
    planIntro.append(el("strong", "", "Tell us who you are"), el("p", "", "Choose a profile. We’ll collect the details needed to recommend the right services."));
    const profileChoices = el("div", "ppai-profile-choices");
    [["influencer", "Influencer", "Creators, public figures and personal brands"], ["company", "Company", "Businesses, brands, startups and institutions"], ["agency", "Agency", "Marketing, creative and consulting partners"]].forEach(([value, title, description]) => {
      const button = el("button", "ppai-profile");
      button.type = "button";
      button.dataset.profile = value;
      button.append(el("strong", "", title), el("small", "", description));
      profileChoices.append(button);
    });
    planView.append(planIntro, profileChoices);

    const toggle = el("button", "ppai-toggle", "✦");
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open Prime Intelligence");

    panel.append(header, tabs, chatView, planView);
    host.append(panel, toggle);
    document.body.append(host);

    const history = [];
    let busy = false;

    function addMessage(role, text) {
      const row = el("div", `ppai-message ppai-${role}`);
      row.append(el("p", "", text));
      messages.append(row);
      messages.scrollTop = messages.scrollHeight;
      history.push({ role, content: text });
    }

    function switchView(view) {
      const chat = view === "chat";
      chatView.hidden = !chat;
      planView.hidden = chat;
      chatTab.classList.toggle("active", chat);
      planTab.classList.toggle("active", !chat);
    }

    function renderIntake(profile) {
      planView.innerHTML = "";
      const form = el("form", "ppai-intake");
      form.dataset.profile = profile;
      form.append(el("h3", "", `${profile[0].toUpperCase()}${profile.slice(1)} profile`));
      form.append(el("p", "ppai-required-note", "Fields marked * are required. Your details will be stored securely for follow-up."));

      const contactSection = el("fieldset", "ppai-section");
      contactSection.append(el("legend", "", "1. Contact details"));
      [
        ["full_name", "Full name", "text", true],
        ["email", "Business email", "email", true],
        ["phone", "Phone / WhatsApp with country code", "tel", true],
        ["preferred_contact", "Preferred contact method", "select", true, ["Email", "Phone call", "WhatsApp"]],
      ].forEach((field) => contactSection.append(makeField(field)));

      const occupationSection = el("fieldset", "ppai-section");
      occupationSection.append(el("legend", "", "2. Occupation and business details"));
      PROFILE_FIELDS[profile].forEach((field) => occupationSection.append(makeField(field)));

      const serviceSection = el("fieldset", "ppai-section");
      serviceSection.append(el("legend", "", "3. Services required *"));
      serviceSection.append(el("p", "ppai-help", "Select every service you may need. The team will prioritize them after reviewing your profile."));
      const serviceGrid = el("div", "ppai-service-grid");
      SERVICES.forEach((service) => {
        const label = el("label", "ppai-check");
        const box = el("input");
        box.type = "checkbox";
        box.name = "services";
        box.value = service;
        label.append(box, el("span", "", service));
        serviceGrid.append(label);
      });
      serviceSection.append(serviceGrid);
      [
        ["other_service", "Any other service required", "text", false],
        ["objectives", "What outcomes do you want to achieve?", "textarea", true],
        ["success_metrics", "How will you measure success?", "textarea", true],
        ["current_providers", "Current agency, freelancers or internal support", "textarea", false],
        ["monthly_budget", "Approximate monthly marketing budget", "select", true, ["Under ₹2L", "₹2L–₹5L", "₹5L–₹10L", "₹10L–₹25L", "₹25L–₹50L", "₹50L+", "Need guidance"]],
        ["timeline", "Preferred start timeline", "select", true, ["Immediately", "Within 30 days", "1–3 months", "3–6 months", "Exploring options"]],
        ["additional_notes", "Anything else the team should know", "textarea", false],
        ["referral_source", "How did you hear about Prime Polo?", "text", false],
      ].forEach((field) => serviceSection.append(makeField(field)));

      const consent = el("label", "ppai-consent");
      const consentBox = el("input");
      consentBox.type = "checkbox";
      consentBox.name = "consent";
      consentBox.required = true;
      consent.append(consentBox, el("span", "", "I consent to Prime Polo storing these details and contacting me about relevant services. *"));

      // Honeypot for automated spam.
      const websiteTrap = el("input", "ppai-trap");
      websiteTrap.name = "website_confirm";
      websiteTrap.tabIndex = -1;
      websiteTrap.autocomplete = "off";

      const status = el("div", "ppai-intake-status");
      const actions = el("div", "ppai-intake-actions");
      const back = el("button", "ppai-secondary", "Change profile");
      back.type = "button";
      const submit = el("button", "ppai-primary", "Save profile & request plan");
      submit.type = "submit";
      actions.append(back, submit);
      form.append(contactSection, occupationSection, serviceSection, consent, websiteTrap, status, actions);
      planView.append(form);

      back.addEventListener("click", () => {
        planView.innerHTML = "";
        planView.append(planIntro, profileChoices);
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        status.className = "ppai-intake-status";
        const data = new FormData(form);
        const services = data.getAll("services");
        if (!services.length) {
          status.classList.add("error");
          status.textContent = "Please select at least one service.";
          serviceSection.scrollIntoView({ block: "start" });
          return;
        }
        const details = {};
        for (const [key, value] of data.entries()) {
          if (!["services", "consent", "website_confirm"].includes(key)) details[key] = String(value).trim();
        }
        submit.disabled = true;
        submit.textContent = "Saving…";
        try {
          const response = await fetch("/api/intake", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile_type: profile, services, details, consent: data.get("consent") === "on", website_confirm: data.get("website_confirm") || "" }),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.error || "Could not save your profile.");
          planView.innerHTML = "";
          const success = el("div", "ppai-success");
          success.append(el("strong", "", "Profile saved successfully"), el("p", "", `Thank you, ${details.full_name}. Reference: ${result.reference}. Prime Polo can contact you using the details provided.`));
          const askButton = el("button", "ppai-primary", "Ask the AI assistant");
          askButton.type = "button";
          askButton.addEventListener("click", () => switchView("chat"));
          success.append(askButton);
          planView.append(success);
        } catch (error) {
          status.classList.add("error");
          status.textContent = error.message;
          submit.disabled = false;
          submit.textContent = "Save profile & request plan";
        }
      });
    }

    profileChoices.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => renderIntake(button.dataset.profile)));
    chatTab.addEventListener("click", () => switchView("chat"));
    planTab.addEventListener("click", () => switchView("plan"));
    toggle.addEventListener("click", () => { panel.hidden = false; toggle.hidden = true; });
    close.addEventListener("click", () => { panel.hidden = true; toggle.hidden = false; });

    chatForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = chatInput.value.trim().slice(0, 800);
      if (!message || busy) return;
      addMessage("user", message);
      chatInput.value = "";
      busy = true;
      send.disabled = true;
      send.textContent = "…";
      let reply;
      try {
        const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, history: history.slice(-9, -1) }) });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.reply) throw new Error(result.error || "AI unavailable");
        reply = result.reply;
      } catch (error) {
        reply = fallback(message);
      } finally {
        busy = false;
        send.disabled = false;
        send.textContent = "Send";
      }
      addMessage("assistant", reply);
    });

    addMessage("assistant", "Welcome to Prime Polo. Ask me a question, or choose “Get a plan” to submit a detailed Influencer, Company, or Agency profile and select the services you need.");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
