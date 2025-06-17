import { supabase } from '../lib/supabase';

interface GenerateContentOptions {
  prompt: string;
  imageData?: {
    mimeType: string;
    data: string;
  };
  generationConfig?: Record<string, any>;
  safetySettings?: Array<Record<string, any>>;
}

class GeminiService {
  // Generate content using Gemini API through our Edge Function
  async generateContent(options: GenerateContentOptions): Promise<any> {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Call the Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Gemini API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      throw new Error(error.message || 'Failed to generate content with Gemini API');
    }
  }

  // Generate text content
  async generateText(prompt: string, generationConfig?: Record<string, any>): Promise<string> {
    try {
      const result = await this.generateContent({
        prompt,
        generationConfig
      });
      
      return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error: any) {
      console.error('Error generating text with Gemini:', error);
      throw new Error(error.message || 'Failed to generate text with Gemini API');
    }
  }

  // Analyze image
  async analyzeImage(prompt: string, imageData: { mimeType: string; data: string }): Promise<string> {
    try {
      const result = await this.generateContent({
        prompt,
        imageData
      });
      
      return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error: any) {
      console.error('Error analyzing image with Gemini:', error);
      throw new Error(error.message || 'Failed to analyze image with Gemini API');
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();