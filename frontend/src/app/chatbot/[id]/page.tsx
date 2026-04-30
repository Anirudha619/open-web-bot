"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RightPanel } from "@/components/chat-builder/RightPanel";
import { getSavedChatbots, SavedChatbot } from "@/lib/storage";

export default function ChatbotPage() {
    const params = useParams();
    const id = params.id as string;

    const [bot, setBot] = useState<SavedChatbot | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const bots = getSavedChatbots();
            const foundBot = bots.find(b => b.id === id);
            setBot(foundBot || null);
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!bot) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">Chatbot Not Found</h1>
                <p className="text-muted-foreground">The requested chatbot ID ({id}) does not exist in your local storage.</p>
            </div>
        );
    }

    return (
        <main className="flex h-screen w-full bg-background overflow-hidden items-center justify-center p-4 lg:p-12 relative">
            {/* Decorative background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>

            <div className="w-full h-full max-w-4xl bg-card/60 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden ring-1 ring-primary/10 flex flex-col z-10">
                <RightPanel
                    botName={bot.name}
                    systemPrompt={bot.systemPrompt}
                    chatBotId={bot.id}
                />
            </div>
        </main>
    );
}
