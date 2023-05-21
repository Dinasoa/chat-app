import { User } from '../model';
import { create } from 'zustand';
import {Channel} from "@/model/Channel";

type Store = {
    channel: Channel | null;
};

type Action = {
    setChannel: (channel: Channel) => void;
};

export const useChannelStore = create<Store & Action>()(set => ({
    channel: null,
    setChannel: (channel) => set(() => ({ channel })),
}));