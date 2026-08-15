import { Mail, ShieldCheck } from "lucide-react";
import { PageIntro, Reveal } from "../components/ui";

const termsSections = [
  ["Agreement to Terms", "By accessing or using the Prime Polo website, you agree to these Terms & Conditions. If you do not agree, please discontinue use of the website and its interactive features."],
  ["Who We Are", "Prime Polo is an AI-powered growth partner and digital marketing agency founded in 2018 and headquartered in New Delhi, India. References to “Prime Polo,” “we,” “us” or “our” refer to Prime Polo."],
  ["Use of the Website", "You may use this website for lawful informational and business purposes. You must not attempt to disrupt the website, access restricted systems, introduce malicious code, misrepresent your identity or use our content in a misleading or unlawful manner."],
  ["Contact Forms & AI Chatbot", "Information submitted through our contact forms and AI chatbot is transmitted to our service providers, stored in our business database and may be emailed to primepolo03@gmail.com so our team can respond. Chatbot answers are automated and are provided for general information, not as binding business advice."],
  ["Intellectual Property", "The Prime Polo name, PP monogram, design system, copy, graphics, strategy materials and website code are owned by Prime Polo or used under license. You may not reproduce, distribute, modify or create derivative works without prior written permission."],
  ["No Guarantee of Results", "Case studies, portfolio averages and calculator projections illustrate prior or modeled performance. Marketing outcomes vary by category, offer, market, budget, execution and other factors. We do not guarantee specific revenue, ROAS, lead volume or other results."],
  ["Third-Party Services", "The website may use or link to services operated by Supabase, EmailJS, Google and other third parties. Their services are governed by their own terms and privacy practices, and Prime Polo is not responsible for third-party availability or conduct."],
  ["Limitation of Liability", "To the maximum extent allowed by applicable law, Prime Polo will not be liable for indirect, incidental, special or consequential loss arising from website use, inability to use the website or reliance on its informational content."],
  ["Changes to Terms", "We may update these terms to reflect changes to our services, technology or legal obligations. Updated terms become effective when posted on this page. Continued website use after an update indicates acceptance."],
  ["Contact Information", "Questions about these terms may be sent to primepolo03@gmail.com. Our office is located in New Delhi, India, and business hours are Monday-Friday, 10:00-19:00 IST."],
];

const privacySections = [
  ["Information We Collect", "We collect information you submit, including your name, email, phone, company, project message, service interest and budget range. We may also collect basic device, browser and website interaction data through standard web technologies."],
  ["How We Use Information", "We use information to respond to inquiries, provide and improve services, manage customer relationships, secure accounts, measure website performance, operate internal analytics and comply with legal obligations."],
  ["AI Chatbot Data", "Messages sent to the AI chatbot and its automated replies are stored in our chat_logs database and emailed to our business inbox. Please do not submit passwords, financial account details, health records or other highly sensitive information in chat."],
  ["Account & Login Data", "Customer accounts use Supabase Auth. Email login stores your email and securely hashed authentication data with Supabase. Google OAuth shares account details permitted during consent, typically name, email, profile image and provider identifier. We never receive your Google password."],
  ["How Information Is Shared", "Information is shared only as needed with infrastructure and communication providers such as Supabase, EmailJS and Google, professional advisers, or authorities where legally required. We do not sell personal information."],
  ["Data Storage & Retention", "Account, lead and chat data is stored using Supabase-hosted infrastructure selected for the project. We retain data for as long as needed to serve the purpose collected, maintain business records, resolve disputes and satisfy legal obligations."],
  ["Cookies & Local Storage", "We use browser local storage for interface preferences such as light or dark theme and for legitimate Supabase authentication sessions. OAuth providers and hosting infrastructure may set cookies needed for security and authentication."],
  ["Your Choices", "You may decline optional form fields, mute interface sounds, change themes, unsubscribe from marketing communications and request access, correction or deletion of your information by emailing primepolo03@gmail.com."],
  ["Data Security", "We use encrypted transport, Supabase authentication, Row Level Security policies and role-based staff access. No internet system can be guaranteed completely secure, but we apply safeguards appropriate to the nature of the data."],
  ["Children's Privacy", "The website and our business services are not directed to children under 13. We do not knowingly collect personal information from children. Contact us if you believe a child has submitted information."],
  ["Policy Changes", "We may revise this policy when our services, providers or legal obligations change. The current version will be posted here with an updated effective date where appropriate."],
  ["Contact Information", "For privacy questions or rights requests, email primepolo03@gmail.com. Prime Polo is headquartered in New Delhi, India and operates Monday-Friday, 10:00-19:00 IST."],
];

export function LegalPage({ type }: { type: "terms" | "privacy" }) {
  const terms = type === "terms";
  const sections = terms ? termsSections : privacySections;
  return (
    <main className="legal-page">
      <PageIntro tag={terms ? "Legal / 01" : "Legal / 02"} title={terms ? "Terms & Conditions" : "Privacy Policy"} copy={terms ? "The clear terms that govern use of the Prime Polo website and digital services." : "How Prime Polo collects, uses and protects information across our website, accounts and AI assistant."} />
      <section className="section legal-content">
        <div className="container-elite legal-layout">
          <aside className="glass-gold"><ShieldCheck /><h2>{terms ? "Clear by design." : "Privacy by design."}</h2><p>Effective February 2026</p><a href="mailto:primepolo03@gmail.com"><Mail />Questions? Email us</a></aside>
          <div className="legal-sections">
            {sections.map(([title, content], index) => <Reveal key={title}><article><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{content}</p></div></article></Reveal>)}
          </div>
        </div>
      </section>
    </main>
  );
}