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
    const APIFY_API_TOKEN = Deno.env.get('APIFY_API_TOKEN');
    
    if (!APIFY_API_TOKEN) {
      throw new Error('APIFY_API_TOKEN environment variable is not set');
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

    // Get the request data
    const url = new URL(req.url);
    const endpoint = url.searchParams.get('endpoint');
    const method = url.searchParams.get('method') || 'GET';
    
    if (!endpoint) {
      throw new Error('Missing endpoint parameter');
    }

    // Prepare the request to Apify
    const apifyUrl = `https://api.apify.com/v2/${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${APIFY_API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    // Forward the request to Apify
    const requestOptions = {
      method,
      headers,
    };

    // Add body for POST/PUT requests
    if (method === 'POST' || method === 'PUT') {
      requestOptions.body = await req.text();
    }

    const response = await fetch(apifyUrl, requestOptions);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Apify API error: ${response.status} ${errorData}`);
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