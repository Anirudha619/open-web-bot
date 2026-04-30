"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { LeftPanel } from "@/components/chat-builder/LeftPanel";
import { RightPanel } from "@/components/chat-builder/RightPanel";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function Home() {
  const [activeBot, setActiveBot] = useState<{ name: string; prompt: string; chatBotId: string } | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleChatbotCreate = (name: string, prompt: string, chatBotId: string) => {
    setActiveBot({ name, prompt, chatBotId });
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full bg-muted items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "280px",
        "--sidebar-width-icon": "80px",
      } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="h-screen overflow-hidden">
        <SiteHeader />
        <main className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden p-4">
          <div className="w-full lg:w-[450px] shrink-0 h-full border-r bg-card shadow-xl z-20 relative overflow-y-auto">
            <LeftPanel onChatbotCreate={handleChatbotCreate} />
          </div>

          <div className="flex-1 h-full relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>

            <div className="relative z-10 flex flex-col h-full w-full max-w-5xl mx-auto p-4 lg:p-8 items-center">
              <div className="w-full max-w-[420px] mb-4 hidden lg:block">
                <h2 className="text-xl font-medium text-card-foreground tracking-tight">Chatbot Live Preview</h2>
                <p className="text-sm text-muted-foreground">Test how your visitors will interact with the chatbot on your website.</p>
              </div>

              <div className="bg-card/60 backdrop-blur-md border shadow-2xl rounded-2xl overflow-hidden ring-1 ring-primary/10 w-full max-w-[420px] h-[min(700px,80vh)]">
                <RightPanel
                  botName={activeBot?.name || null}
                  systemPrompt={activeBot?.prompt || null}
                  chatBotId={activeBot?.chatBotId || null}
                />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}