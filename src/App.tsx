import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Chatbot } from "./components/Chatbot";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { readPath, writePath } from "./lib/router";
import { playSound, setSoundEnabled } from "./lib/sound";
import { readStorage, writeStorage } from "./lib/storage";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LegalPage } from "./pages/LegalPage";

type Theme = "dark" | "light";

export default function App() {
  const [path, setPath] = useState(readPath);
  const [theme, setTheme] = useState<Theme>(() => (readStorage("prime-polo-theme") === "light" ? "light" : "dark"));
  const [sound, setSound] = useState(() => readStorage("prime-polo-sound") !== "muted");
  const [progress, setProgress] = useState(0);

  const navigate = useCallback((destination: string) => {
    const anchor = destination.split("#")[1];
    const nextPath = writePath(destination);
    setPath(nextPath);
    window.setTimeout(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 60);
  }, []);

  useEffect(() => {
    const sync = () => setPath(readPath());
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add(`theme-${theme}`);
    writeStorage("prime-polo-theme", theme);
  }, [theme]);

  useEffect(() => {
    setSoundEnabled(sound);
    writeStorage("prime-polo-sound", sound ? "on" : "muted");
  }, [sound]);

  useEffect(() => {
    const onScroll = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(range > 0 ? (window.scrollY / range) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  useEffect(() => {
    const hover = (event: Event) => {
      const pointerEvent = event as PointerEvent;
      if (pointerEvent.pointerType !== "mouse") return;
      const target = event.target as HTMLElement | null;
      const related = pointerEvent.relatedTarget as Node | null;
      const interactive = target?.closest("button, a");
      if (interactive && (!related || !interactive.contains(related))) playSound("hover");
    };
    const click = (event: Event) => {
      if ((event.target as HTMLElement).closest("button, a")) playSound("click");
    };
    document.addEventListener("pointerover", hover);
    document.addEventListener("click", click);
    return () => { document.removeEventListener("pointerover", hover); document.removeEventListener("click", click); };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && !hash.startsWith("#/") && path === "/") {
      window.setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 120);
    }
  }, [path]);

  const page = path === "/terms" ? <LegalPage type="terms" /> : path === "/privacy" ? <LegalPage type="privacy" /> : path === "/dashboard" ? <DashboardPage /> : path === "/admin" ? <AdminPage /> : <HomePage />;

  return (
    <div className="site-shell">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="noise-overlay" aria-hidden="true" />
      <Header theme={theme} onTheme={() => setTheme((value) => value === "dark" ? "light" : "dark")} sound={sound} onSound={() => setSound((value) => !value)} navigate={navigate} />
      {page}
      <Footer navigate={navigate} />
      <button className={`mobile-scroll-top ${progress > 12 ? "visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top"><ArrowUp /></button>
      <Chatbot />
    </div>
  );
}
