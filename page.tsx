"use client";

import { useState, useEffect, useRef } from "react";

const demoConversations = [
  [
    { text: "Hi, I need help with my order", isBot: false },
    { text: "Of course! I'd be happy to help. What's your order number?", isBot: true },
    { text: "It's #ORD-12345", isBot: false },
    { text: "I found your order! It's being processed and will ship tomorrow. You'll receive a tracking link via email.", isBot: true },
  ],
  [
    { text: "What's your refund policy?", isBot: false },
    { text: "We offer full refunds within 30 days of purchase. Just provide your order number and I'll process it right away.", isBot: true },
    { text: "I bought something 2 weeks ago", isBot: false },
    { text: "Perfect! You're within the refund window. Give me your order number and I'll initiate the refund.", isBot: true },
  ],
  [
    { text: "Do you ship internationally?", isBot: false },
    { text: "Yes! We ship to over 50 countries worldwide. Shipping costs vary by location. Which country are you in?", isBot: true },
    { text: "I'm in Germany", isBot: false },
    { text: "Great! Shipping to Germany takes 5-7 business days and costs $12. Would you like me to check expedited options?", isBot: true },
  ],
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([]);
  const [currentConvIndex, setCurrentConvIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleJoinWaitlist = async () => {
    if (!email) return;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToastMessage(data.error || "Something went wrong");
      } else {
        setToastMessage("Thanks! We'll inform you when we launch.");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Something went wrong");
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  useEffect(() => {
    const currentConv = demoConversations[currentConvIndex];

    if (messageIndex === 0 && messages.length === 0) {
      const firstMsg = currentConv[0];
      setTimeout(() => {
        setMessages([firstMsg]);
        setMessageIndex(1);
      }, 800);
      return;
    }

    if (messageIndex >= currentConv.length) {
      const delay = setTimeout(() => {
        setCurrentConvIndex((prev) => (prev + 1) % demoConversations.length);
        setMessageIndex(0);
        setMessages([]);
      }, 4000);
      return;
    }

    setIsTyping(true);
    const botDelay = setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, currentConv[messageIndex]]);
      setMessageIndex((prev) => prev + 1);
    }, 1200);

    return () => clearTimeout(botDelay);
  }, [messageIndex, currentConvIndex, messages.length]);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 rounded-full bg-black px-6 py-3 text-sm text-white dark:bg-zinc-50 dark:text-black z-50">
          {toastMessage}
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-40 border-b border-black/[.08] bg-zinc-50/80 backdrop-blur-md dark:border-white/[.08] dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
              <svg className="h-5 w-5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-semibold text-black dark:text-white">OpenWebBot</span>
          </div>

        </div>
      </header>

      <main className="pt-16">
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-zinc-200/50 to-transparent blur-3xl dark:from-zinc-800/20" />
            <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-zinc-300/30 to-transparent blur-3xl dark:from-zinc-700/10" />
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl gap-16 px-6 py-20 lg:grid-cols-2 lg:py-32">
            <div className="flex flex-col justify-center space-y-8">
              {/* <div className="inline-flex items-center gap-2 rounded-full border border-black/[.08] bg-white px-4 py-1.5 text-sm dark:border-white/[.08] dark:bg-zinc-900">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">Waitlist filling up fast &gt;&gt;</span>
              </div> */}
              
              <h1 className="text-5xl font-semibold tracking-tight text-black dark:text-white sm:text-6xl lg:text-7xl leading-[1.1]">
                AI Agent for<br />
                <span className="text-zinc-500 dark:text-zinc-400">Customer Support</span>
              </h1>
              
              <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <span className="font-semibold text-black dark:text-white">Open source</span> web AI agent that handles customer queries 24/7. Deploy a intelligent chatbot on your website in minutes, not days.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-14 flex-1 rounded-full border border-black/[.08] bg-white px-6 text-base text-black placeholder:text-zinc-400 dark:border-white/[.08] dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
                />
                <button
                  onClick={handleJoinWaitlist}
                  className="h-14 shrink-0 rounded-full bg-black px-8 text-base font-medium text-white transition-transform hover:scale-105 cursor-pointer dark:bg-white dark:text-black"
                >
                  Join Waitlist
                </button>
              </div>

              {/* <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {["https://i.pravatar.cc/100?img=1", "https://i.pravatar.cc/100?img=2", "https://i.pravatar.cc/100?img=3"].map((src, i) => (
                    <img key={i} src={src} className="h-10 w-10 rounded-full border-2 border-white dark:border-black" alt="" />
                  ))}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-semibold text-black dark:text-white">500+</span> on the waitlist
                </div>
              </div> */}
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent dark:from-black dark:via-transparent dark:to-transparent lg:bg-gradient-to-r" />
              <div className="relative w-full max-w-md">
                <div className="rounded-3xl border border-black/[.08] bg-white shadow-2xl shadow-zinc-200/50 dark:border-white/[.08] dark:bg-zinc-900 dark:shadow-black/50">
                  <div className="flex items-center gap-3 border-b border-black/[.08] px-5 py-4 dark:border-white/[.08]">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">OpenWebBot</span>
                    <div className="ml-auto flex items-center gap-1.5 text-xs text-green-500">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                      Live
                    </div>
                  </div>
                  <div className="h-96 overflow-y-auto p-5 space-y-4">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                          msg.isBot 
                            ? "bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white" 
                            : "bg-black text-white dark:bg-white dark:text-black"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-1.5 rounded-2xl bg-zinc-100 px-5 py-4 dark:bg-zinc-800">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex items-center gap-3 border-t border-black/[.08] px-5 py-4 dark:border-white/[.08]">
                    <div className="flex h-10 w-full items-center rounded-full bg-zinc-100 px-5 text-sm text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                      Type a message...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-black/[.08] bg-white py-24 dark:border-white/[.08] dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 md:grid-cols-3">
              {[
                { title: "Instant Responses", desc: "AI-powered replies in milliseconds. No more waiting in queue.", icon: "⚡" },
                { title: "24/7 Availability", desc: "Handle customer queries round the clock, even on holidays.", icon: "🌙" },
                { title: "Easy Integration", desc: "Add to any website with a single script tag.", icon: "🔌" },
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-3xl p-8 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <div className="mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold text-black dark:text-white">{feature.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/[.08] py-8 dark:border-white/[.08]">
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-black dark:bg-white">
              <svg className="h-4 w-4 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">OpenWebBot</span>
          </div>

        </div>
      </footer>
    </div>
  );
}
