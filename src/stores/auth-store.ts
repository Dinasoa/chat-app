import { User } from '../model';
import { create } from 'zustand';

type Store = {
    user: User | null;
};

type Action = {
    setUser: (user: User) => void;
};

export const useAuthStore = create<Store & Action>()(set => ({
    user: null,
    setUser: (user) => set(() => ({ user })),
}));