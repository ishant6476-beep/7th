import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { sendBusinessEmail } from "../lib/email";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

interface Message {
  sender: "bot" | "user";
  text: string;
}

const suggestions = ["What services do you offer?", "How much does it cost?", "How do we start?"];

export function getBotResponse(message: string) {
  const input = message.toLowerCase();
  if (/price|pricing|cost|budget/.test(input)) return "Engagements typically range from INR 2L to INR 50L+ per month, depending on scope and media. A short diagnostic call lets us recommend the right model.";
  if (/service|offer|do you do|seo|ads|website/.test(input)) return "Prime Polo covers growth strategy, paid media, SEO, automation, social, creator marketing, brand systems, content and conversion-led websites.";
  if (/process|start|begin|work together/.test(input)) return "We move through five stages: Discovery, Strategy, Execution, Optimization and Scale. Start with a no-pressure growth diagnostic through the contact form.";
  if (/industr|health|education|real estate|e-commerce|startup/.test(input)) return "We have deep experience in healthcare, education, real estate, hospitality, e-commerce, startups, professional services and local business.";
  if (/contact|email|phone|hours|location|delhi/.test(input)) return "Reach us at primepolo03@gmail.com. We are based in New Delhi and available Monday-Friday, 10:00-19:00 IST.";
  if (/result|roas|performance|timeline/.test(input)) return "Partners commonly see leading indicators in 30-60 days. Across our roster, average ROAS is 7.1x and client retention is 94%.";
  return "That is a thoughtful question. Prime Polo builds AI-powered growth systems around your commercial goals. For a tailored answer, email primepolo03@gmail.com or begin a growth diagnostic below.";
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Welcome to Prime Polo. What would you like to grow?" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, typing]);

  const send = async (raw: string) => {
    const message = raw.trim().slice(0, 800);
    if (!message || typing) return;
    setMessages((items) => [...items, { sender: "user", text: message }]);
    setInput("");
    setTyping(true);
    const reply = getBotResponse(message);
    window.setTimeout(() => {
      setMessages((items) => [...items, { sender: "bot", text: reply }]);
      setTyping(false);
    }, 650);

    const tasks: Promise<unknown>[] = [
      sendBusinessEmail("Prime Polo chatbot exchange", `Visitor: ${message}\n\nAssistant: ${reply}`),
    ];
    if (isSupabaseConfigured) tasks.push(Promise.resolve(supabase.from("chat_logs").insert({ user_message: message, bot_reply: reply })));
    await Promise.allSettled(tasks);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <div className="chatbot">
      <AnimatePresence>
        {open && (
          <motion.div className="chat-window glass-elite" initial={{ opacity: 0, scale: 0.92, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 18 }}>
            <div className="chat-header">
              <span><Bot /></span>
              <div><strong>Prime Intelligence</strong><small><i /> Online now</small></div>
              <button onClick={() => setOpen(false)} aria-label="Close chat"><X /></button>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => <div key={`${message.text}-${index}`} className={`chat-message ${message.sender}`}>{message.sender === "bot" && <Sparkles />}<p>{message.text}</p></div>)}
              {typing && <div className="typing"><span /><span /><span /></div>}
              <div ref={bottomRef} />
            </div>
            {messages.length < 4 && <div className="quick-replies">{suggestions.map((item) => <button key={item} onClick={() => void send(item)}>{item}</button>)}</div>}
            <form onSubmit={submit} className="chat-form">
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about growth..." aria-label="Chat message" />
              <button type="submit" aria-label="Send message"><Send /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button className="chat-bubble" onClick={() => setOpen((value) => !value)} whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }} aria-label="Open AI assistant">
        {open ? <X /> : <MessageCircle />}
        {!open && <span />}
      </motion.button>
    </div>
  );
}