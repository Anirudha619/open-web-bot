"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, CheckCircle2, MessageSquare, ExternalLink, Copy } from "lucide-react";
import { saveChatbot, getSavedChatbots, SavedChatbot } from "@/lib/storage";
import toast from "react-hot-toast";

export function LeftPanel({ onChatbotCreate }: { onChatbotCreate: (name: string, systemPrompt: string, chatBotId: string) => void }) {
    const [botName, setBotName] = useState("");
    const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [savedBots, setSavedBots] = useState<SavedChatbot[]>([]);

    useEffect(() => {
        setSavedBots(getSavedChatbots());
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleCreate = async () => {
        if (!botName.trim() || files.length === 0) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            files.forEach((file) => formData.append("file", file));
            
            const res = await fetch(`/upload/${botName.trim()}`, {
                method: "POST",
                body: formData
            });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            if (data.status === "indexed") {
                const newBot = saveChatbot({
                    id: botName.trim(),
                    name: botName,
                    systemPrompt
                });
                setSavedBots(getSavedChatbots());
                onChatbotCreate(newBot.name, newBot.systemPrompt, newBot.id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6 p-6 bg-muted border-r">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Website Chatbot Builder</h1>
                <p className="text-muted-foreground mt-2 text-sm">Train a custom AI chatbot on your documents to support your website visitors.</p>
            </div>

            <Tabs defaultValue="create" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="create">Create Chatbot</TabsTrigger>
                    <TabsTrigger value="saved">My Chatbots</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="flex-1 flex flex-col space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bot Configuration</CardTitle>
                            <CardDescription>Basic settings for your website chatbot.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Chatbot Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Acme Support Bot"
                                    value={botName}
                                    onChange={(e) => setBotName(e.target.value)}
                                />
                            </div>
                            {/* <div className="space-y-2">
                                <Label htmlFor="prompt">System Prompt (Optional)</Label>
                                <Textarea
                                    id="prompt"
                                    placeholder="Instructions for how the bot should behave..."
                                    rows={4}
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                />
                            </div> */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Knowledge Base</CardTitle>
                            <CardDescription>Upload training documents for your bot.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4 bg-card">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <UploadCloud className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">TXT (max 10MB)</p>
                                </div>
                                <Input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    multiple
                                    accept=".txt"
                                    onChange={handleFileUpload}
                                />
                                <Label htmlFor="file-upload" className="cursor-pointer">
                                    <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                                        Select Files
                                    </Button>
                                </Label>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    <h4 className="text-sm font-medium">Uploaded Files</h4>
                                    <ul className="space-y-2">
                                        {files.map((file, idx) => (
                                            <li key={idx} className="flex items-center justify-between text-sm p-2 bg-secondary rounded-md">
                                                <span className="truncate max-w-[200px]">{file.name}</span>
                                                <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="mt-auto pt-4">
                        <Button
                            size="lg"
                            className="w-full shadow-lg"
                            onClick={handleCreate}
                            disabled={!botName.trim() || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Create Chatbot
                                </>
                            )}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="saved" className="flex-1 flex flex-col space-y-4">
                    {savedBots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center bg-card rounded-lg border border-dashed">
                            <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground font-medium">No Chatbots yet</p>
                            <p className="text-sm text-muted-foreground">Create one to see it here.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            {savedBots.map((bot) => (
                                <Card
                                    key={bot.id}
                                    className="cursor-pointer hover:border-primary transition-colors flex flex-col"
                                    onClick={() => onChatbotCreate(bot.name, bot.systemPrompt, bot.id)}
                                >
                                    <CardHeader className="p-4 pb-2">
                                        <CardTitle className="text-lg">{bot.name}</CardTitle>
                                        <CardDescription className="text-xs truncate">
                                            ID: {bot.id}
                                        </CardDescription>
                                    </CardHeader>
                                    <div className="px-4 pb-4 mt-auto flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = `${window.location.origin}/chatbot/${bot.id}`;
                                                navigator.clipboard.writeText(url);
                                                toast.success("Chatbot URL copied to clipboard.");
                                            }}
                                        >
                                            <Copy className="w-3 h-3 mr-1" />
                                            Copy Link
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`/chatbot/${bot.id}`, '_blank');
                                            }}
                                        >
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            View
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
