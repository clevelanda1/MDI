import { supabase } from '../lib/supabase';

export async function analyzeImage(file: File): Promise<string[]> {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    // Resize and compress the image before sending to API
    const compressedImage = await compressImage(file, 1200, 0.8);

    // Convert file to base64
    const buffer = await compressedImage.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    // Simplified prompt for faster analysis
    const prompt = "Analyze this interior design image and list only the main furniture and decor items. Return a clean list with one item per line, no descriptions or explanations.";
    
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
          mimeType: compressedImage.type,
          data: base64
        },
        generationConfig: {
          temperature: 0.2, // Lower temperature for more focused results
          maxOutputTokens: 256, // Limit token count for faster response
          topP: 0.8,
          topK: 40
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

// Helper function to compress and resize images
async function compressImage(file: File, maxWidth: number, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions if needed
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and resize image on canvas
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with compression
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          // Create new file from blob
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
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
    
    // Simplified prompt for faster generation
    const prompt = `Generate 4 optimized search queries for the item "${item}":
2 for Amazon (focus on specific product features and brands)
2 for Etsy (focus on handmade, custom, and unique aspects)
Format as:
AMAZON:
[query 1]
[query 2]
ETSY:
[query 1]
[query 2]`;
    
    // Create a minimal 1x1 transparent PNG as base64 to satisfy the imageData requirement
    const transparentPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    // Call the Gemini API through our Edge Function with optimized parameters
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        prompt,
        imageData: {
          mimeType: 'image/png',
          data: transparentPng
        },
        generationConfig: {
          temperature: 0.2, // Lower temperature for more consistent results
          maxOutputTokens: 256, // Limit token count for faster response
          topP: 0.8,
          topK: 40
        }
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