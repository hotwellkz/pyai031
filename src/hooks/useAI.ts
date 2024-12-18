import { useState } from 'react';
import { AIService } from '../lib/ai-service';
import { useAuthStore } from '../store/authStore';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setTokens = useAuthStore((state) => state.setTokens);
  const tokens = useAuthStore((state) => state.tokens);
  const aiService = AIService.getInstance();

  const askAI = async (prompt: string, preferredAI?: 'openai' | 'anthropic') => {
    setIsLoading(true);
    setError(null);

    if (!prompt.trim()) {
      setError('Пожалуйста, введите текст запроса');
      setIsLoading(false);
      return null;
    }

    if (tokens <= 0) {
      setError('Недостаточно токенов');
      setIsLoading(false);
      return null;
    }

    try {
      const response = await aiService.getAIResponse(prompt, preferredAI);
      if (response) {
        setTokens(tokens - 5);
      }
      return response;
    } catch (err) {
      console.error('AI Error:', err);
      setError('Произошла ошибка при запросе к ИИ. Пожалуйста, попробуйте позже.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    askAI,
    isLoading,
    error
  };
}