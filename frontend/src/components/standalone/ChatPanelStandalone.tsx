"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatBotAvatar } from "./ChatBotAvatar";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  botName: string;
  initialMessage?: string;
  onSend?: (message: string) => Promise<string>;
  apiEndpoint?: string;
  botId?: string;
  className?: string;
  showHeader?: boolean;
}

function parseMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        result.push(<pre key={`code-${i}`} style={{ background: '#1f2937', color: '#e5e7eb', padding: '12px', borderRadius: '8px', overflow: 'auto', fontSize: '12px', marginTop: '8px' }}><code>{codeContent.trim()}</code></pre>);
        codeContent = '';
      } else {
        line.slice(3).trim();
      }
      inCodeBlock = !inCodeBlock;
    } else if (inCodeBlock) {
      codeContent += line + '\n';
    } else if (line.trim()) {
      const parts = line.split(/`([^`]+)`/);
      const rendered = parts.map((part, j) => 
        j % 2 === 1 ? <code key={j} style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>{part}</code> : part
      );
      result.push(<span key={i}>{rendered}</span>);
      result.push(<br key={`br-${i}`} />);
    }
  });

  return <>{result}</>;
}

const defaultStyles = `
  .chat-panel * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
  .chat-panel { display: flex; flex-direction: column; height: 100%; overflow: hidden; border-radius: 24px; border: 1px solid rgba(0,0,0,0.08); }
  .chat-panel-header { display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(0,0,0,0.08); padding: 16px 20px; background: #fff; }
  .chat-panel-avatar { width: 40px; height: 40px; background: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .chat-panel-info h3 { font-weight: 600; font-size: 14px; color: #333; }
  .chat-panel-info p { font-size: 12px; color: #22c55e; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .chat-panel-info p span { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .chat-panel-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; background: #fff; }
  .chat-panel-msg { max-width: 85%; padding: 12px 20px; border-radius: 20px; font-size: 14px; line-height: 1.5; word-wrap: break-word; }
  .chat-panel-msg.user { align-self: flex-end; background: #000; color: #fff; border-bottom-right-radius: 4px; border-bottom-left-radius: 20px; }
  .chat-panel-msg.bot { align-self: flex-start; background: #f4f4f5; color: #000; border-bottom-right-radius: 20px; border-bottom-left-radius: 4px; }
  .chat-panel-msg pre { background: #1f2937; color: #e5e7eb; padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 12px; margin-top: 8px; }
  .chat-panel-msg code { background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  .chat-panel-msg pre code { background: transparent; padding: 0; }
  .chat-panel-typing { display: flex; gap: 6px; padding: 12px 16px; background: #f4f4f5; align-self: flex-start; border-radius: 20px; border-bottom-left-radius: 4px; }
  .chat-panel-typing span { width: 8px; height: 8px; background: #71717a; border-radius: 50%; animation: bounce 1.4s infinite; }
  .chat-panel-typing span:nth-child(2) { animation-delay: 150ms; }
  .chat-panel-typing span:nth-child(3) { animation-delay: 300ms; }
  @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
  .chat-panel-input-area { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-top: 1px solid rgba(0,0,0,0.08); background: #fff; }
  .chat-panel-input-wrapper { flex: 1; display: flex; align-items: center; background: #f4f4f5; border-radius: 9999px; padding: 0 16px; height: 44px; border: 1px solid rgba(0,0,0,0.06); transition: border-color 0.2s, box-shadow 0.2s; }
  .chat-panel-input-wrapper:focus-within { border-color: rgba(0,0,0,0.15); box-shadow: 0 0 0 2px rgba(0,0,0,0.05); }
  .chat-panel-input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; color: #18181b; font-weight: 500; }
  .chat-panel-input::placeholder { color: #a1a1aa; }
  .chat-panel-send { width: 36px; height: 36px; border-radius: 50%; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #71717a; transition: color 0.2s; }
  .chat-panel-send:hover { color: #000; }
  .chat-panel-send:disabled { opacity: 0.5; cursor: not-allowed; }
  .chat-panel.dark { border-color: rgba(255,255,255,0.08); }
  .chat-panel.dark .chat-panel-header { border-color: rgba(255,255,255,0.08); background: #09090b; }
  .chat-panel.dark .chat-panel-info h3 { color: #fafafa; }
  .chat-panel.dark .chat-panel-messages { background: #09090b; }
  .chat-panel.dark .chat-panel-msg.bot { background: #27272a; color: #fafafa; }
  .chat-panel.dark .chat-panel-typing { background: #27272a; }
  .chat-panel.dark .chat-panel-typing span { background: #71717a; }
  .chat-panel.dark .chat-panel-input-area { border-color: rgba(255,255,255,0.08); background: #09090b; }
  .chat-panel.dark .chat-panel-input-wrapper { background: #18181b; border-color: rgba(255,255,255,0.1); }
  .chat-panel.dark .chat-panel-input-wrapper:focus-within { border-color: rgba(255,255,255,0.2); box-shadow: 0 0 0 2px rgba(255,255,255,0.05); }
  .chat-panel.dark .chat-panel-input { color: #fafafa; }
  .chat-panel.dark .chat-panel-input::placeholder { color: #71717a; }
  .chat-panel.dark .chat-panel-send { color: #a1a1aa; }
  .chat-panel.dark .chat-panel-send:hover { color: #fff; }
`;

export function ChatPanel({ 
  botName, 
  initialMessage,
  onSend,
  apiEndpoint = "/chat",
  botId,
  className = "",
  showHeader = true 
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: initialMessage || `Hello! I am ${botName}. How can I assist you?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let response: string;
      
      if (onSend) {
        response = await onSend(input);
      } else {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input, company_id: botId })
        });
        const data = await res.json();
        response = data.answer || data.response || "No response";
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{defaultStyles}</style>
      <div className={`chat-panel ${className}`}>
        {showHeader && (
          <div className="chat-panel-header">
            
            <ChatBotAvatar size={40} />
            <div className="chat-panel-info">
              <h3>{botName}</h3>
              <p><span />Online</p>
            </div>
          </div>
        )}

        <div className="chat-panel-messages">
          {messages.map((m, i) => (
            <div 
              key={i} 
              className={`chat-panel-msg ${m.role === 'user' ? 'user' : 'bot'}`}
            >
              {m.content === "..." ? (
                <div className="chat-panel-typing">
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                <div style={{ fontFamily: 'inherit' }}>
                  {parseMarkdown(m.content)}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-panel-input-area">
          <div className="chat-panel-input-wrapper">
            <input
              className="chat-panel-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>
          <button 
            className="chat-panel-send" 
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatPanel;
