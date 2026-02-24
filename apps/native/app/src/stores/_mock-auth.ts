import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  isLocked: boolean;
  hasOnboarded: boolean;
  login: () => void;
  logout: () => void;
  lock: () => void;
  unlock: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLocked: false,
  hasOnboarded: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, isLocked: false, hasOnboarded: false }),
  lock: () => set({ isLocked: true }),
  unlock: () => set({ isLocked: false }),
  completeOnboarding: () => set({ hasOnboarded: true }),
}));
