export interface SavedChatbot {
    id: string;
    name: string;
    systemPrompt: string;
    createdAt: number;
}

const STORAGE_KEY = "chatbots_list";

export function getSavedChatbots(): SavedChatbot[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        return [];
    }
}

export function saveChatbot(chatbot: Omit<SavedChatbot, "createdAt">): SavedChatbot {
    const bots = getSavedChatbots();
    const newBot: SavedChatbot = {
        ...chatbot,
        createdAt: Date.now()
    };
    bots.push(newBot);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bots));
    return newBot;
}
