"use client";

import { useState, useEffect } from "react";
import { ChatPanel } from "../standalone/ChatPanelStandalone";
import { AlertCircle } from "lucide-react";

interface RightPanelProps {
    botName: string | null;
    systemPrompt: string | null;
    chatBotId: string | null;
}

export function RightPanel({ botName, systemPrompt, chatBotId }: RightPanelProps) {
    if (!botName) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-card">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">No Chatbot Configured</h2>
                <p className="text-muted-foreground max-w-md">
                    Configure your chatbot on the left panel, upload documents, and click "Create Chatbot" to preview it here.
                </p>
            </div>
        );
    }

    const handleSend = async (message: string): Promise<string> => {
        if (!chatBotId) throw new Error("No chatbot ID");

        const res = await fetch(`/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, company_id: chatBotId })
        });
        const data = await res.json();

        return data.answer || "No response";
    };

    return (
        <ChatPanel
            botName={botName}
            onSend={handleSend}
        />
    );
}
