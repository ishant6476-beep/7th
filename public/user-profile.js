(() => {
  "use strict";

  const SERVICES = [
    "Growth Strategy", "Influencer Marketing", "Social Media Marketing",
    "Performance Advertising", "SEO", "Website Design & Development",
    "Content & Video Production", "Brand Strategy & Identity",
    "Lead Generation", "Marketing Automation", "CRM Integration",
    "AI Workflows & Chatbots", "Email Marketing", "Analytics & Reporting",
  ];

  const TYPE_FIELDS = {
    company: [
      ["company_name", "Company or brand name", "text", true],
      ["job_title", "Your role or job title", "text", true],
      ["industry", "Industry", "text", true],
      ["business_model", "Business model", "select", true, ["B2B", "B2C", "D2C", "SaaS", "Marketplace", "Services", "Nonprofit", "Other"]],
      ["company_size", "Company size", "select", true, ["1–5", "6–20", "21–50", "51–200", "201–500", "500+"]],
      ["company_website", "Company website", "url", false],
      ["headquarters", "Headquarters/location", "text", true],
      ["markets", "Cities or countries served", "text", true],
      ["products_services", "Main products or services", "textarea", true],
      ["target_audience", "Target customers", "textarea", true],
      ["marketing_channels", "Current marketing channels", "textarea", false],
      ["marketing_team", "Current marketing team/resources", "textarea", false],
      ["company_goal", "Primary business or marketing goal", "textarea", true],
      ["company_challenge", "Biggest current challenge", "textarea", true],
    ],
    influencer: [
      ["creator_name", "Creator or public name", "text", true],
      ["username", "Primary username/handle", "text", true],
      ["niche", "Content niche/category", "text", true],
      ["platforms", "Platforms", "multicheck", true, ["YouTube", "Instagram", "Facebook", "LinkedIn", "X / Twitter", "Twitch", "Podcast", "Blog", "Other"]],
      ["youtube_link", "YouTube channel link", "url", false],
      ["instagram_link", "Instagram profile link", "url", false],
      ["other_social_links", "Other social/profile links", "textarea", false],
      ["website", "Website or portfolio link", "url", false],
      ["audience_size", "Total followers/subscribers", "text", true],
      ["average_reach", "Average views or reach", "text", false],
      ["audience_details", "Audience demographics and locations", "textarea", true],
      ["content_languages", "Content languages", "text", true],
      ["content_formats", "Main content formats", "text", true],
      ["experience", "Years creating content", "text", false],
      ["brand_collaborations", "Previous brand collaborations", "textarea", false],
      ["creator_goal", "Main creator/business goal", "textarea", true],
      ["creator_challenge", "Biggest current challenge", "textarea", true],
    ],
    other: [
      ["occupation", "Occupation or professional title", "text", true],
      ["organization", "Organization/business name", "text", false],
      ["work_category", "Type of work", "text", true],
      ["work_description", "Describe your work", "textarea", true],
      ["website", "Website link", "url", false],
      ["portfolio_links", "Portfolio, social or reference links", "textarea", false],
      ["experience", "Years of experience", "text", false],
      ["location_markets", "Location and markets served", "text", true],
      ["audience_customers", "Audience, customers or people you serve", "textarea", false],
      ["work_goal", "What do you want to achieve?", "textarea", true],
      ["work_challenge", "What is your biggest challenge?", "textarea", true],
      ["extra_details", "Additional details about your occupation or needs", "textarea", true],
    ],
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function getSession() {
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index) || "";
        if (!key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;
        const parsed = JSON.parse(localStorage.getItem(key));
        const session = parsed?.currentSession || parsed?.session || parsed;
        if (session?.access_token && session?.user?.id) return session;
      }
    } catch (error) {
      console.warn("Could not read Supabase session", error);
    }
    return null;
  }

  function onDashboard() {
    return location.pathname === "/dashboard" || location.hash.startsWith("#/dashboard");
  }

  function makeField([name, title, type, required, options], value) {
    const label = el("label", "ppup-field");
    label.append(el("span", "", `${title}${required ? " *" : ""}`));
    if (type === "multicheck") {
      const group = el("div", "ppup-check-grid");
      const selected = Array.isArray(value) ? value : [];
      options.forEach((option) => {
        const item = el("label", "ppup-check");
        const box = el("input");
        box.type = "checkbox";
        box.name = name;
        box.value = option;
        box.checked = selected.includes(option);
        item.append(box, el("i", "", option));
        group.append(item);
      });
      label.append(group);
      return label;
    }
    let input;
    if (type === "textarea") {
      input = el("textarea", "ppup-control");
      input.rows = 3;
    } else if (type === "select") {
      input = el("select", "ppup-control");
      const empty = el("option", "", "Select an option");
      empty.value = "";
      input.append(empty);
      options.forEach((option) => {
        const item = el("option", "", option);
        item.value = option;
        input.append(item);
      });
    } else {
      input = el("input", "ppup-control");
      input.type = type;
    }
    input.name = name;
    input.required = required;
    input.maxLength = type === "textarea" ? 2000 : 300;
    input.value = value || "";
    label.append(input);
    return label;
  }

  let initializedForUser = null;

  async function initialize() {
    if (!onDashboard()) return;
    const session = getSession();
    if (!session || initializedForUser === session.user.id) return;
    initializedForUser = session.user.id;

    let existing = null;
    try {
      const response = await fetch("/api/user-profile", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!response.ok) throw new Error("Profile service unavailable");
      existing = (await response.json()).profile || null;
    } catch (error) {
      console.warn("Work profile could not be loaded", error);
      initializedForUser = null;
      return;
    }

    buildInterface(session, existing);
  }

  function buildInterface(session, existing) {
    document.querySelectorAll(".ppup-root").forEach((node) => node.remove());
    const root = el("div", "ppup-root");
    const reopen = el("button", "ppup-reopen", "Work profile");
    reopen.type = "button";
    const overlay = el("div", "ppup-overlay");
    const modal = el("section", "ppup-modal");
    const header = el("header", "ppup-header");
    header.append(el("div", "", "Prime Polo profile"));
    const close = el("button", "", "×");
    close.type = "button";
    header.append(close);
    const body = el("div", "ppup-body");
    modal.append(header, body);
    overlay.append(modal);
    root.append(reopen, overlay);
    document.body.append(root);

    function open() { overlay.hidden = false; }
    function hide() { overlay.hidden = true; }
    close.addEventListener("click", hide);
    reopen.addEventListener("click", open);

    function showTypes() {
      body.innerHTML = "";
      const intro = el("div", "ppup-intro");
      intro.append(el("small", "", existing ? "Update your profile" : "One final signup step"), el("h2", "", "What best describes you?"), el("p", "", "Select a profile type so Prime Polo can understand your work and recommend relevant services."));
      const choices = el("div", "ppup-types");
      [["company", "Company", "Business, brand, startup or institution"], ["influencer", "Influencer", "Creator, public figure or personal brand"], ["other", "Other", "Professional, freelancer, artist or another occupation"]].forEach(([type, title, description]) => {
        const button = el("button", existing?.profile_type === type ? "selected" : "");
        button.type = "button";
        button.append(el("strong", "", title), el("span", "", description));
        button.addEventListener("click", () => showForm(type));
        choices.append(button);
      });
      intro.append(choices);
      body.append(intro);
    }

    function showForm(type) {
      body.innerHTML = "";
      const savedData = existing?.profile_type === type ? existing.profile_data || {} : {};
      const form = el("form", "ppup-form");
      form.append(el("h2", "", `${type[0].toUpperCase()}${type.slice(1)} details`));
      form.append(el("p", "ppup-note", "Complete the required fields. You can update this profile later from your dashboard."));

      const contact = el("fieldset", "ppup-section");
      contact.append(el("legend", "", "Contact information"));
      [
        ["full_name", "Full name", "text", true],
        ["email", "Email", "email", true],
        ["phone", "Phone / WhatsApp with country code", "tel", true],
        ["location", "City and country", "text", true],
        ["preferred_contact", "Preferred contact method", "select", true, ["Email", "Phone", "WhatsApp"]],
      ].forEach((field) => contact.append(makeField(field, field[0] === "email" ? session.user.email : savedData[field[0]])));
      contact.querySelector('[name="email"]').readOnly = true;

      const work = el("fieldset", "ppup-section");
      work.append(el("legend", "", "Work details"));
      TYPE_FIELDS[type].forEach((field) => work.append(makeField(field, savedData[field[0]])));

      const services = el("fieldset", "ppup-section");
      services.append(el("legend", "", "Services you are interested in"));
      const serviceGrid = el("div", "ppup-check-grid");
      SERVICES.forEach((service) => {
        const item = el("label", "ppup-check");
        const box = el("input");
        box.type = "checkbox";
        box.name = "services_needed";
        box.value = service;
        box.checked = Array.isArray(savedData.services_needed) && savedData.services_needed.includes(service);
        item.append(box, el("i", "", service));
        serviceGrid.append(item);
      });
      services.append(serviceGrid);
      services.append(makeField(["service_notes", "Other service or additional requirements", "textarea", false], savedData.service_notes));

      const status = el("div", "ppup-status");
      const actions = el("div", "ppup-actions");
      const back = el("button", "ppup-secondary", "Back");
      back.type = "button";
      const save = el("button", "ppup-primary", "Save work profile");
      save.type = "submit";
      actions.append(back, save);
      form.append(contact, work, services, status, actions);
      body.append(form);
      back.addEventListener("click", showTypes);

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const profileData = {};
        for (const [key, value] of data.entries()) {
          if (key !== "services_needed" && key !== "platforms") profileData[key] = String(value).trim();
        }
        profileData.services_needed = data.getAll("services_needed");
        if (type === "influencer") profileData.platforms = data.getAll("platforms");
        if (!profileData.services_needed.length) {
          status.className = "ppup-status error";
          status.textContent = "Please select at least one service you are interested in.";
          return;
        }
        if (type === "influencer" && !profileData.platforms.length) {
          status.className = "ppup-status error";
          status.textContent = "Please select at least one platform.";
          return;
        }
        save.disabled = true;
        save.textContent = "Saving…";
        status.textContent = "";
        try {
          const response = await fetch("/api/user-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
            body: JSON.stringify({ profile_type: type, profile_data: profileData }),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.error || "Could not save profile");
          existing = result.profile;
          status.className = "ppup-status success";
          status.textContent = "Work profile saved successfully.";
          window.setTimeout(hide, 900);
        } catch (error) {
          status.className = "ppup-status error";
          status.textContent = error.message;
        } finally {
          save.disabled = false;
          save.textContent = "Save work profile";
        }
      });
    }

    showTypes();
    if (existing) hide();
  }

  window.setInterval(initialize, 1200);
  window.addEventListener("hashchange", initialize);
  window.addEventListener("popstate", initialize);
  initialize();
})();
