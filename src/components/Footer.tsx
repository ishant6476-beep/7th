import { ArrowUp, Clock3, MapPin } from "lucide-react";
import { setAuthIntent } from "../lib/router";

const columns = [
  ["Solutions", ["Growth", "Advertising", "Automation", "Digital Experiences"]],
  ["Industries", ["Healthcare", "Education", "E-commerce", "Startups"]],
  ["Company", ["Our Story", "Process", "Case Studies", "Contact"]],
  ["Resources", ["Growth Calculator", "FAQ", "Client Login", "Create Account", "Privacy", "Terms"]],
];

export function Footer({ navigate }: { navigate: (path: string) => void }) {
  const handle = (item: string) => {
    if (item === "Privacy") return navigate("/privacy");
    if (item === "Terms") return navigate("/terms");
    if (item === "Client Login" || item === "Create Account") {
      setAuthIntent(item === "Create Account" ? "signup" : "login");
      return navigate("/dashboard");
    }
    const map: Record<string, string> = { "Our Story": "about", "Case Studies": "casestudies", "Growth Calculator": "calculator", FAQ: "faq", Contact: "contact", Process: "process" };
    const id = map[item] || item.toLowerCase().replace(/ /g, "");
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth" });
    else navigate(`/#${id}`);
  };

  return (
    <footer className="footer dot-grid">
      <div className="container-elite footer-grid">
        <div className="footer-brand">
          <img className="footer-logo" src="/images/prime-polo-logo.webp" width="96" height="79" alt="Prime Polo - Rising with Trust" loading="lazy" decoding="async" />
          <h3>PRIME POLO</h3>
          <p>Rising with Trust</p>
          <span><MapPin /> New Delhi, India</span>
          <span><Clock3 /> Mon-Fri, 10:00-19:00 IST</span>
        </div>
        {columns.map(([title, items]) => (
          <div className="footer-column" key={title as string}>
            <h4>{title}</h4>
            {(items as string[]).map((item) => <button key={item} onClick={() => handle(item)}>{item}</button>)}
          </div>
        ))}
      </div>
      <div className="separator-elite" />
      <div className="container-elite footer-bottom">
        <p>Copyright 2026 Prime Polo. All rights reserved.</p>
        <div><button onClick={() => navigate("/privacy")}>Privacy</button><button onClick={() => navigate("/terms")}>Terms</button><button onClick={() => navigate("/dashboard")}>My Account</button></div>
        <button className="icon-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top"><ArrowUp /></button>
      </div>
    </footer>
  );
}