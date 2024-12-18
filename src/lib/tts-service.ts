import { ELEVENLABS_API_KEY } from './api-config';

export class TTSService {
  private static instance: TTSService;
  private constructor() {}

  static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  async synthesizeSpeech(text: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(
        'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
            'Accept-Encoding': 'gzip, deflate, br'
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2", 
            voice_settings: {
              stability: 0.7,
              similarity_boost: 0.75,
              use_speaker_boost: true
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to synthesize speech: ${response.status} ${errorText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('TTS Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  }
}