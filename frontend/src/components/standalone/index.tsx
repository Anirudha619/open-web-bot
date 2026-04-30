import React from "react";
import { createRoot } from "react-dom/client";
import { ChatPanel } from "./ChatPanelStandalone";

declare global {
  interface Window {
    ChatWidget: {
      init: (config: {
        container?: string;
        botName?: string;
        initialMessage?: string;
        apiEndpoint?: string;
      }) => void;
    };
  }
}

const style = document.createElement("style");
style.textContent = `
  .chat-widget-container { position: fixed; bottom: 20px; right: 20px; z-index: 999999; }
  .chat-widget-btn { width: 64px; height: 64px; border-radius: 50%; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; transition: transform 0.2s; padding: 0; }
  .chat-widget-btn:hover { transform: scale(1.05); }
  .chat-widget-btn svg { width: 100%; height: 100%; }
  .chat-widget-window { display: none; position: absolute; bottom: 80px; right: 0; width: 380px; height: min(700px, 80vh); background: #fff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; }
  .chat-widget-window.open { display: flex; flex-direction: column; }
  .chat-widget-close { position: absolute; top: 12px; right: 12px; background: none; border: none; color: #666; cursor: pointer; font-size: 24px; line-height: 1; }
  @media (max-width: 400px) { .chat-widget-window { width: 100vw; height: 100vh; max-height: 100vh; bottom: 0; right: 0; border-radius: 0; } }
`;
document.head.appendChild(style);

const container = document.createElement("div");
container.className = "chat-widget-container";
container.innerHTML = `
  <button class="chat-widget-btn">
    <svg viewBox="0 0 680 680">
      <circle cx="340" cy="340" r="300" fill="#1a1a1a"/>
      <path fill="#f5f5f5" d="M 210 255 Q 210 220 245 220 L 435 220 Q 470 220 470 255 L 470 400 Q 470 435 435 435 L 375 435 Q 365 435 358 445 L 340 470 L 322 445 Q 315 435 305 435 L 245 435 Q 210 435 210 400 Z"/>
    </svg>
  </button>
  <div class="chat-widget-window"></div>
`;
document.body.appendChild(container);

const btn = container.querySelector(".chat-widget-btn")!;
const window = container.querySelector(".chat-widget-window")!;
const closeBtn = document.createElement("button");
closeBtn.className = "chat-widget-close";
closeBtn.textContent = "×";
closeBtn.onclick = () => window.classList.remove("open");

const widgetRoot = createRoot(window);

function parseConfig() {
  const scripts = document.getElementsByTagName("script");
  for (const s of scripts) {
    if (s.src && s.src.includes("chat-widget")) {
      return {
        botName: s.getAttribute("data-bot-name"),
        initialMessage: s.getAttribute("data-initial-message"),
        apiEndpoint: s.getAttribute("data-api-endpoint") || "/chat"
      };
    }
  }
  return { botName: "Support Bot", initialMessage: undefined, apiEndpoint: "/chat" };
}

btn.onclick = () => {
  window.classList.toggle("open");
  if (window.classList.contains("open") && !window.querySelector(".chat-widget-close")) {
    window.prepend(closeBtn);
  }
};

const config = parseConfig();
widgetRoot.render(
  <ChatPanel
    botName={config.botName || "Support Bot"}
    initialMessage={config.initialMessage}
    apiEndpoint={config.apiEndpoint || "/chat"}
    botId="7april"
  />
);

window.ChatWidget = {
  init: (cfg) => {
    widgetRoot.render(
      <ChatPanel
        botName={cfg.botName}
        initialMessage={cfg.initialMessage}
        apiEndpoint={cfg.apiEndpoint || "/chat"}
        botId="7april"
      />
    );
  }
};

export { ChatPanel };
