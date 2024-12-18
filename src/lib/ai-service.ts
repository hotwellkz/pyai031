import { AI_CONFIG } from './ai-config';

interface AIResponse {
  content: string;
  source: 'openai' | 'anthropic';
}

export class AIService {
  private static instance: AIService;
  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async askOpenAI(prompt: string): Promise<string> {
    try {
      if (!AI_CONFIG.openai.apiKey) {
        console.error('OpenAI API key not configured');
        throw new Error('Сервис временно недоступен');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
        },
        body: JSON.stringify({
          model: AI_CONFIG.openai.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status);
        throw new Error('Сервис временно недоступен');
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI');
      }
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Error:', error instanceof Error ? error.message : error);
      throw new Error('Сервис временно недоступен');
      throw error;
    }
  }

  async askAnthropic(prompt: string): Promise<string> {
    try {
      if (!AI_CONFIG.anthropic.apiKey) {
        console.error('Anthropic API key not configured');
        throw new Error('Сервис временно недоступен');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': AI_CONFIG.anthropic.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: AI_CONFIG.anthropic.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        console.error('Anthropic API error:', response.status);
        throw new Error('Сервис временно недоступен');
      }

      const data = await response.json();
      if (!data.content?.[0]?.text) {
        throw new Error('Invalid response format from Anthropic');
      }
      return data.content[0].text;
    } catch (error) {
      console.error('Anthropic Error:', error instanceof Error ? error.message : error);
      throw new Error('Сервис временно недоступен');
      throw error;
    }
  }

  async getAIResponse(prompt: string, preferredAI?: 'openai' | 'anthropic'): Promise<AIResponse> {
    try {
      // Проверяем наличие хотя бы одного API ключа
      if (!AI_CONFIG.openai.apiKey && !AI_CONFIG.anthropic.apiKey) {
        throw new Error('Не настроены API ключи для AI сервисов');
      }

      if (preferredAI === 'openai') {
        const content = await this.askOpenAI(prompt);
        return { content, source: 'openai' };
      } else if (preferredAI === 'anthropic') {
        const content = await this.askAnthropic(prompt);
        return { content, source: 'anthropic' };
      }

      // Если AI не указан, пробуем сначала OpenAI, затем Anthropic
      try {
        const content = await this.askOpenAI(prompt);
        return { content, source: 'openai' };
      } catch (error) {
        const content = await this.askAnthropic(prompt);
        return { content, source: 'anthropic' };
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }
}