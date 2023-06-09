import { create } from 'zustand';
import {Message, Messages} from "@/model/Message";

type Store = {
    messages: Messages;
    message: Message
};

type Action = {
    setMessage: (messages: { recipientId: string | string[] | undefined; channelId: null; content: string }) => void;
    setMessages: (message: Messages) => void;
};

export const useMessageStore = create<Store & Action>()(set => ({
    messages: null,
    message: null,
    setMessages: (messages) => set(() => ({messages})),
    setMessage: (message) => set(() => ({ message }))
}));