import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "../utils/cn";

export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ tag, title, copy, align = "left" }: { tag: string; title: React.ReactNode; copy?: string; align?: "left" | "center" }) {
  return (
    <Reveal className={cn("section-heading", align === "center" && "mx-auto text-center")}>
      <span className="section-tag">{tag}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </Reveal>
  );
}

export function PrimaryButton({ children, className, href, onClick, type = "button", disabled }: { children: React.ReactNode; className?: string; href?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) {
  const classes = cn("btn-primary group", className);
  if (href) {
    return <a className={classes} href={href}>{children}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></a>;
  }
  return <button className={classes} onClick={onClick} type={type} disabled={disabled}>{children}<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>;
}

export function CountUp({ to, suffix = "", prefix = "", decimals = 0 }: { to: number; suffix?: string; prefix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const spring = useSpring(value, { duration: 1500, bounce: 0 });
  const display = useTransform(spring, (latest) => `${prefix}${latest.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (inView) value.set(to);
  }, [inView, to, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export function Aurora({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("aurora", compact && "aurora-compact")} aria-hidden="true">
      <span className="aurora-one" />
      <span className="aurora-two" />
      <span className="aurora-three" />
    </div>
  );
}

export function PageIntro({ tag, title, copy }: { tag: string; title: string; copy: string }) {
  return (
    <section className="page-intro dot-grid">
      <Aurora compact />
      <div className="container-elite relative z-10">
        <Reveal>
          <span className="section-tag">{tag}</span>
          <h1>{title}</h1>
          <p>{copy}</p>
        </Reveal>
      </div>
    </section>
  );
}