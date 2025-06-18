import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

// Create a Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Cache for storing recent responses to avoid duplicate API calls
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get the API key from environment variables
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // Verify the user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get the request body
    const requestData = await req.json();
    
    if (!requestData.prompt) {
      throw new Error('Missing required parameter: prompt');
    }

    // Generate a cache key based on the request data
    const cacheKey = JSON.stringify({
      prompt: requestData.prompt,
      imageData: requestData.imageData ? true : false, // Just store if image exists, not the full data
      generationConfig: requestData.generationConfig
    });

    // Check if we have a cached response
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && cachedResponse.timestamp > Date.now() - CACHE_TTL) {
      console.log('Using cached Gemini API response');
      return new Response(JSON.stringify(cachedResponse.data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      });
    }

    // Prepare the request body with optimized parameters
    const apiRequestBody = {
      contents: [
        {
          parts: [
            { text: requestData.prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 256,
        topP: 0.8,
        topK: 40,
        ...requestData.generationConfig
      },
      safetySettings: requestData.safetySettings || []
    };

    // Add image data if provided
    if (requestData.imageData) {
      apiRequestBody.contents[0].parts.push({
        inline_data: {
          mime_type: requestData.imageData.mimeType,
          data: requestData.imageData.data
        }
      });
    }

    // Forward the request to Google's Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();

    // Cache the response
    responseCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    // Clean up old cache entries
    for (const [key, value] of responseCache.entries()) {
      if (value.timestamp <= Date.now() - CACHE_TTL) {
        responseCache.delete(key);
      }
    }

    // Return the response
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message.includes('Unauthorized') ? 401 : 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});