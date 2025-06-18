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

// RapidAPI configuration
const RAPIDAPI_HOST = 'amazon-online-data-api.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

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
    const RAPIDAPI_KEY = Deno.env.get('AMAZON_RAPIDAPI_KEY');
    
    if (!RAPIDAPI_KEY) {
      throw new Error('AMAZON_RAPIDAPI_KEY environment variable is not set');
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

    // Get the request parameters
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const page = url.searchParams.get('page') || '1';
    const geo = url.searchParams.get('geo') || 'US';

    if (!query) {
      throw new Error('Query parameter is required');
    }

    // Check if the user has exceeded their API usage limit
    const { data: limitCheck, error: limitCheckError } = await supabase.rpc(
      'check_api_usage_limit',
      { api_name: 'amazon', user_id_param: user.id }
    );

    if (limitCheckError) {
      console.error('Error checking API usage limit:', limitCheckError);
      throw new Error('Failed to check API usage limit');
    }

    if (!limitCheck) {
      throw new Error('You have exceeded your Amazon API usage limit for this month');
    }

    // Increment the API usage counter
    await supabase.rpc(
      'increment_combined_api_usage',
      { api_name: 'amazon', user_id_param: user.id }
    );

    // Construct the URL with query parameters
    const searchParams = new URLSearchParams({
      query,
      page,
      geo,
    });
    const apiUrl = `${BASE_URL}/search?${searchParams.toString()}`;

    // Make the request to RapidAPI
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`RapidAPI request failed with status ${response.status}`);
    }

    const data = await response.json();

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