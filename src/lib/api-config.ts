export const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const AI_CONFIG = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview'
  },
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
    model: 'claude-3-opus-20240229'
  }
};