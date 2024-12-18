import { create } from 'zustand';
import { saveUserProgress, getUserProgress, saveUserTokens, getUserTokens } from '../lib/firebase';

interface AuthState {
  user: any | null;
  tokens: number;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  currentLessonContent: string;
  completedLessons: string[];
  setUser: (user: any) => void;
  setTokens: (tokens: number) => Promise<void>;
  setAuthModalOpen: (isOpen: boolean) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  setCurrentLessonContent: (content: string) => void;
  completeLesson: (lessonId: string) => void;
  loadProgress: () => Promise<void>;
  resetProgress: () => void;
  loadTokens: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tokens: 0,
  isAuthModalOpen: false,
  authMode: 'login',
  currentLessonContent: '',
  completedLessons: [],
  
  setUser: (user) => set({ user }),
  
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  setAuthMode: (mode) => set({ authMode: mode }),
  
  setCurrentLessonContent: (content) => set({ currentLessonContent: content }),
  
  setTokens: async (tokens) => {
    const state = get();
    if (!state.user) return;
    
    const success = await saveUserTokens(state.user.uid, tokens);
    if (success) {
      set({ tokens });
    }
  },
  
  completeLesson: async (lessonId) => {
    const state = get();
    if (!state.user) return;

    const newCompletedLessons = [...state.completedLessons, lessonId];
    const success = await saveUserProgress(state.user.uid, newCompletedLessons);
    
    if (success) {
      set({ completedLessons: newCompletedLessons });
    }
  },
  
  loadProgress: async () => {
    const state = get();
    if (!state.user) return;

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const progress = await getUserProgress(state.user.uid);
      set({ completedLessons: progress });
    } catch (error) {
      console.error('Error loading progress:', error);
      // Не сбрасываем прогресс при ошибке загрузки
    }
  },
  
  loadTokens: async () => {
    const state = get();
    if (!state.user) return;

    try {
      const tokens = await getUserTokens(state.user.uid);
      set({ tokens });
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  },
  
  resetProgress: () => set({
    completedLessons: [],
    tokens: 0,
    currentLessonContent: '',
    user: null
  })
}));