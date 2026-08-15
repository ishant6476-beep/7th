import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, BriefcaseBusiness, Headphones, LogIn, Menu, Moon, Sun, UserPlus, UserRound, Volume2, VolumeX, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { setAuthIntent } from "../lib/router";
import { cn } from "../utils/cn";

const links = [
  ["Solutions", "#solutions"],
  ["Industries", "#industries"],
  ["Results", "#results"],
  ["Case Studies", "#casestudies"],
  ["Process", "#process"],
  ["About", "#about"],
];

const mobileTabs = [
  ["Solutions", "#solutions", Zap],
  ["Results", "#results", BarChart3],
  ["Work", "#casestudies", BriefcaseBusiness],
  ["Contact", "#contact", Headphones],
  ["Account", "/dashboard", UserRound],
] as const;

export function Header({ theme, onTheme, sound, onSound, navigate }: { theme: "dark" | "light"; onTheme: () => void; sound: boolean; onSound: () => void; navigate: (path: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
      navigate(`/${href}`);
      return;
    }
    navigate(href);
  };

  const goAuth = (mode: "login" | "signup") => {
    setAuthIntent(mode);
    go("/dashboard");
  };

  return (
    <>
      <header className={cn("site-header", scrolled && "site-header-scrolled")}>
        <div className="container-elite header-inner">
          <button onClick={() => go("/")} className="brand" aria-label="Prime Polo home">
            <img className="brand-logo" src="/images/prime-polo-logo.webp" width="56" height="46" alt="Prime Polo - Rising with Trust" decoding="async" />
            <span><strong>PRIME POLO</strong><small>RISING <i /> WITH TRUST</small></span>
          </button>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {links.map(([label, href]) => <button key={href} onClick={() => go(href)}>{label}</button>)}
          </nav>
          <div className="header-actions">
            <button className="theme-toggle" onClick={onTheme} aria-label={`Use ${theme === "dark" ? "light" : "dark"} theme`}>
              <Sun size={13} />
              <Moon size={13} />
              <motion.span animate={{ x: theme === "dark" ? 22 : 0 }} transition={{ type: "spring", stiffness: 450, damping: 28 }}>
                {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
              </motion.span>
            </button>
            <button className="icon-button desktop-only" onClick={onSound} aria-label={sound ? "Mute sounds" : "Enable sounds"}>{sound ? <Volume2 /> : <VolumeX />}</button>
            <button className="btn-login desktop-only" onClick={() => goAuth("login")}><LogIn />Log In</button>
            <button className="icon-button mobile-account" onClick={() => goAuth("login")} aria-label="Log in or sign up"><UserRound /></button>
            <button className="btn-header desktop-only" onClick={() => go("#contact")}>Begin Journey</button>
            <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav className="mobile-menu glass-elite" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              {links.map(([label, href]) => <button key={href} onClick={() => go(href)}>{label}<span>0{links.findIndex((item) => item[0] === label) + 1}</span></button>)}
              <div className="mobile-auth">
                <button onClick={() => goAuth("login")}><LogIn /> Log In</button>
                <button className="accent" onClick={() => goAuth("signup")}><UserPlus /> Sign Up</button>
              </div>
              <div><button onClick={onSound}>{sound ? <Volume2 /> : <VolumeX />} Sound</button><button onClick={() => go("#contact")}><Zap /> Begin Journey</button></div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {mobileTabs.map(([label, href, Icon]) => <button key={label} onClick={() => go(href)}><Icon /><span>{label}</span></button>)}
      </nav>
      <button className="floating-mobile-cta" onClick={() => go("#contact")} aria-label="Begin your journey"><Zap /></button>
    </>
  );
}
