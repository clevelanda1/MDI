import { supabase } from '../lib/supabase';

export async function analyzeImage(file: File): Promise<string[]> {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    const prompt = "Analyze this interior design image and list the main furniture and decor items. Return a clean list of items, one per line, without any additional text or formatting. Example output format:\nArmchair\nCoffee Table\nPendant Light";
    
    // Call the Gemini API through our Edge Function
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        prompt,
        imageData: {
          mimeType: file.type,
          data: base64
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze image');
    }
    
    const result = await response.json();
    
    // Extract the text from the response
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No analysis results returned');
    }
    
    // Parse the items from the text
    const items = text
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0 && item !== 'null' && item !== 'undefined');

    return items;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

export async function generateDualSearchQueries(item: string): Promise<{
  amazonQueries: string[];
  etsyQueries: string[];
}> {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }
    
    const prompt = `You are an expert e-commerce search optimization specialist for an AI-powered interior design application. Based on the detected item "${item}" from an uploaded room image, generate highly optimized search queries for two major home goods marketplaces.

CONTEXT: This item was detected through AI image analysis of a real room photo. The queries must be precision-tuned for each platform's unique search algorithms and user behavior patterns.

Generate 4 search queries total:

**AMAZON-OPTIMIZED QUERIES (2):**
- Leverage Amazon's broad product catalog with brand-agnostic terms
- Include specific colors, materials, dimensions, and functional features
- Use terms that capture Amazon's search algorithm preferences (keywords customers actually search for)
- Focus on product specifications and practical benefits
- Include alternative product names/synonyms

**ETSY-OPTIMIZED QUERIES (2):**
- Utilize handmade, vintage, and artisanal terminology
- Incorporate design style descriptors (modern, rustic, bohemian, etc.)
- Include room context where the item would be placed
- Focus on aesthetic appeal and unique design-focused language
- Use Etsy's craft-centric and artisanal vocabulary

Each query should be:
- Highly specific and actionable for shopping and searching on the respective marketplace
- Different from the others (no repetitive variations)
- Optimized for the target marketplace's search behavior
- Designed to return the most relevant product matches

Format response exactly as:
AMAZON:
[query 1]
[query 2]

ETSY:
[query 1]
[query 2]`;
    
    // Call the Gemini API through our Edge Function
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        prompt,
        imageData: null // No image needed for this request
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate search queries');
    }
    
    const result = await response.json();
    
    // Extract the text from the response
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No query results returned');
    }
    
    // Parse the response to extract Amazon and Etsy queries
    const amazonSection = text.match(/AMAZON:\s*([\s\S]*?)(?=ETSY:|$)/i);
    const etsySection = text.match(/ETSY:\s*([\s\S]*?)$/i);
    
    const amazonQueries = amazonSection 
      ? amazonSection[1].split('\n').map(q => q.trim()).filter(q => q.length > 0).slice(0, 2)
      : [`${item} furniture`, `modern ${item.toLowerCase()}`];
      
    const etsyQueries = etsySection 
      ? etsySection[1].split('\n').map(q => q.trim()).filter(q => q.length > 0).slice(0, 2)
      : [`handmade ${item.toLowerCase()}`, `custom ${item.toLowerCase()} decor`];
    
    // Ensure we have exactly 2 queries for each platform
    while (amazonQueries.length < 2) {
      amazonQueries.push(`${item} ${['premium', 'luxury', 'modern', 'classic'][amazonQueries.length]}`);
    }
    
    while (etsyQueries.length < 2) {
      etsyQueries.push(`${item} ${['handmade', 'custom', 'unique', 'artisan'][etsyQueries.length]}`);
    }
    
    return {
      amazonQueries: amazonQueries.slice(0, 2),
      etsyQueries: etsyQueries.slice(0, 2)
    };
  } catch (error) {
    console.error('Error generating dual search queries:', error);
    // Fallback queries if AI generation fails
    return {
      amazonQueries: [
        `${item} furniture`,
        `modern ${item.toLowerCase()}`
      ],
      etsyQueries: [
        `handmade ${item} decor`,
        `custom ${item.toLowerCase()} artisan`
      ]
    };
  }
}

// Keep the old function for backward compatibility
export async function generateSearchQueries(item: string): Promise<string[]> {
  const dualQueries = await generateDualSearchQueries(item);
  return [...dualQueries.amazonQueries, ...dualQueries.etsyQueries];
}