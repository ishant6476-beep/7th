(() => {
  "use strict";

  const KNOWLEDGE = [
    {
      match: /^(hi|hello|hey|good morning|good afternoon|good evening|namaste)\b/i,
      answer: "Hello! I’m Prime Intelligence. I can help with services, pricing, timelines, industries, case studies, or arranging a growth consultation. What would you like to know?",
    },
    {
      match: /who are you|what are you|are you (a )?(bot|human|ai)/i,
      answer: "I’m Prime Intelligence, Prime Polo’s website assistant. I can explain our growth, advertising, SEO, automation, branding, content, and web services, and help you choose the right next step.",
    },
    {
      match: /founder|ceo|shaurya|who (started|founded|runs|owns)/i,
      answer: "Prime Polo was founded in 2018 by Shaurya Kumar, Founder & CEO. The agency works with senior specialists across strategy, creative, technology, media, and growth.",
    },
    {
      match: /all services|^(what services|which services|services do you|what do you do|how can you help|capabilities)/i,
      answer: "Prime Polo offers growth strategy, paid media, SEO, social media, influencer marketing, marketing automation, brand strategy and identity, content and video production, conversion-focused websites, CRO, analytics, and lead generation. Tell me your goal and I’ll suggest the most relevant service.",
    },
    {
      match: /seo|search engine|organic (traffic|growth|ranking)|rank on google|keywords?/i,
      answer: "Our SEO work combines technical audits, keyword and competitor research, site architecture, on-page optimization, content strategy, authority building, and performance reporting. We tailor the plan to your market and current search visibility.",
    },
    {
      match: /google ads|meta ads|facebook ads|instagram ads|paid media|ppc|performance marketing|advertising/i,
      answer: "Our performance marketing covers Google, Meta, LinkedIn, display, and video. We manage strategy, targeting, creative testing, landing pages, conversion tracking, attribution, and ongoing optimization against CAC, ROAS, and pipeline—not vanity metrics.",
    },
    {
      match: /social media|instagram|linkedin|facebook|social strategy/i,
      answer: "We build always-on social systems covering channel strategy, content pillars, calendars, creative production, community engagement, and performance reporting. The goal is to turn attention into qualified demand and measurable growth.",
    },
    {
      match: /influencer|creator|influencers/i,
      answer: "Our influencer marketing service covers creator discovery, audience and brand-fit checks, outreach, negotiation, campaign concepts, content approvals, tracking, and performance analysis. Programs are designed for both cultural reach and attributable results.",
    },
    {
      match: /website|web design|web development|landing page|ux|ui|conversion rate|cro/i,
      answer: "We design and develop fast, distinctive, conversion-focused websites and landing pages. Engagements can include UX research, information architecture, UI design, development, analytics, technical SEO, and conversion-rate optimization.",
    },
    {
      match: /automation|crm|workflow|ai integration|chatbot|lead nurturing/i,
      answer: "We connect marketing, sales, and operations through CRM integrations, lead routing, nurturing sequences, data enrichment, reporting, and AI-assisted workflows. We begin by mapping the process and identifying the highest-value automation opportunities.",
    },
    {
      match: /brand|branding|identity|logo|positioning/i,
      answer: "Our brand practice covers research, positioning, messaging, visual identity, design systems, and rollout guidance. The goal is a distinctive brand platform that supports both recognition and commercial growth.",
    },
    {
      match: /content|video|production|copywriting|creative/i,
      answer: "We create strategy-led content and video for campaigns, social platforms, websites, and brand storytelling. Work can include concepts, scripts, copy, design, production, editing, and channel-specific adaptation.",
    },
    {
      match: /lead generation|generate leads|more leads|sales pipeline|customer acquisition/i,
      answer: "Our lead-generation programs connect offer strategy, paid and organic acquisition, landing pages, conversion tracking, CRM routing, and follow-up automation. We optimize for qualified pipeline and customer economics rather than raw lead volume.",
    },
    {
      match: /price|pricing|cost|budget|fee|retainer|how much/i,
      answer: "Engagements typically range from INR 2 lakh to INR 50 lakh or more per month, depending on scope, channels, production, and media spend. A short diagnostic call helps us recommend an appropriate plan and exact proposal.",
    },
    {
      match: /how long|timeline|when.*result|how quickly|time.*result|30.*60/i,
      answer: "Most partners see meaningful leading indicators within 30–60 days. SEO and brand-building usually compound over a longer period, while paid-media and conversion tests can produce learning sooner. A realistic timeline depends on your baseline and scope.",
    },
    {
      match: /process|how.*work|start|begin|onboarding|next step/i,
      answer: "Our five-stage process is Discovery, Strategy, Execution, Optimization, and Scale. We start with a growth diagnostic, define priorities and measurement, then execute in focused sprints and scale what proves effective.",
    },
    {
      match: /report|reporting|dashboard|transparent|measurement|analytics|attribution/i,
      answer: "Prime Polo uses live reporting and clear commercial KPIs. Depending on the engagement, dashboards can cover spend, leads, revenue, CAC, ROAS, conversion rates, pipeline, and experiment results, with regular senior-team reviews.",
    },
    {
      match: /industr|healthcare|education|real estate|hospitality|e-?commerce|startup|professional service|local business/i,
      answer: "We work across healthcare, education, real estate, hospitality, e-commerce, startups, professional services, and local businesses. Tell me your industry and objective, and I’ll point you toward the most relevant approach.",
    },
    {
      match: /case stud|portfolio|past work|client|example/i,
      answer: "Our featured work includes healthcare, education, and e-commerce growth engagements. The website’s Case Studies section summarizes selected challenges and outcomes. For examples closest to your category, request them at info@primepolomarketing.in.",
    },
    {
      match: /roas|result|performance|retention|numbers|metric/i,
      answer: "Prime Polo reports a 7.1× average ROAS and 94% client retention across its roster. These are portfolio benchmarks, not guarantees; expected performance depends on your offer, economics, market, data, and starting point.",
    },
    {
      match: /location|located|where.*based|delhi|office|address/i,
      answer: "Prime Polo is based in New Delhi, India and works with ambitious brands across markets. For meeting details, email info@primepolomarketing.in.",
    },
    {
      match: /hours|open|availability|working time|business time/i,
      answer: "Our listed business hours are Monday–Friday, 10:00–19:00 IST. You can email info@primepolomarketing.in at any time, and the team will respond during business hours.",
    },
    {
      match: /contact|email|call|phone|meeting|consultation|proposal|quote|book/i,
      answer: "Email info@primepolomarketing.in or use the website contact form to request a growth diagnostic. Include your company, website, main objective, approximate budget, and preferred timeline so the team can respond usefully.",
    },
    {
      match: /thank|thanks|helpful/i,
      answer: "You’re welcome! If you share your business type and primary growth goal, I can suggest the most relevant Prime Polo service or next step.",
    },
  ];

  function fallback(message, recentHistory = []) {
    const direct = KNOWLEDGE.find(({ match }) => match.test(message));
    if (direct) return direct.answer;

    if (/^(tell me more|more details|explain|how so|why)\??$/i.test(message.trim())) {
      const previous = [...recentHistory].reverse().find((item) => item.role === "user" && item.content !== message);
      if (previous) {
        const contextual = KNOWLEDGE.find(({ match }) => match.test(previous.content));
        if (contextual) return `${contextual.answer} For a recommendation tailored to your situation, share your industry, objective, current monthly leads or revenue, and approximate budget.`;
      }
    }

    return "I can answer questions about Prime Polo’s services, SEO, paid advertising, social media, influencer campaigns, websites, automation, branding, content, pricing, timelines, industries, results, and process. Ask about one of these topics, or email info@primepolomarketing.in for a tailored recommendation.";
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function boot() {
    // Disable the original React/Framer chatbot. This replacement is mounted
    // outside #root, so a chat update can never unmount or blank the website.
    document.querySelectorAll(".chatbot").forEach((node) => {
      node.style.setProperty("display", "none", "important");
    });

    const host = element("section", "ppai-host");
    host.setAttribute("aria-label", "Prime Intelligence chatbot");

    const panel = element("div", "ppai-panel");
    panel.hidden = true;

    const header = element("header", "ppai-header");
    const identity = element("div", "ppai-identity");
    const title = element("strong", "", "Prime Intelligence");
    const status = element("small", "", "● Online now");
    identity.append(title, status);
    const close = element("button", "ppai-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Close chat");
    header.append(identity, close);

    const messages = element("div", "ppai-messages");
    messages.setAttribute("aria-live", "polite");

    const form = element("form", "ppai-form");
    const input = element("input", "ppai-input");
    input.type = "text";
    input.maxLength = 800;
    input.autocomplete = "off";
    input.placeholder = "Ask about growth…";
    input.setAttribute("aria-label", "Chat message");
    const send = element("button", "ppai-send", "Send");
    send.type = "submit";
    form.append(input, send);

    const toggle = element("button", "ppai-toggle", "✦");
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open AI assistant");

    panel.append(header, messages, form);
    host.append(panel, toggle);
    document.body.append(host);

    const history = [];
    let busy = false;

    function addMessage(role, text) {
      const row = element("div", `ppai-message ppai-${role}`);
      const bubble = element("p", "", text);
      row.append(bubble);
      messages.append(row);
      messages.scrollTop = messages.scrollHeight;
      history.push({ role, content: text });
    }

    function setOpen(open) {
      panel.hidden = !open;
      toggle.hidden = open;
      toggle.setAttribute("aria-expanded", String(open));
      if (open) window.setTimeout(() => input.focus(), 0);
    }

    async function ask(rawMessage) {
      const message = rawMessage.trim().slice(0, 800);
      if (!message || busy) return;

      addMessage("user", message);
      input.value = "";
      busy = true;
      send.disabled = true;
      send.textContent = "…";

      let reply;
      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 18000);
        const response = await fetch("/api/chat", {
          method: "POST",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history: history.slice(-9, -1) }),
        });
        window.clearTimeout(timeout);
        const data = await response.json().catch(() => ({}));
        if (!response.ok || typeof data.reply !== "string" || !data.reply.trim()) {
          throw new Error(data.error || "AI unavailable");
        }
        reply = data.reply.trim();
      } catch (error) {
        console.warn("Prime Intelligence used its local fallback:", error);
        reply = fallback(message, history);
      } finally {
        busy = false;
        send.disabled = false;
        send.textContent = "Send";
      }

      addMessage("assistant", reply);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      ask(input.value);
      return false;
    });
    toggle.addEventListener("click", () => setOpen(true));
    close.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) setOpen(false);
    });

    addMessage("assistant", "Welcome to Prime Polo. What would you like to grow?");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
