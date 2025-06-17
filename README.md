# MDI - My Design Index

A platform that transforms interior design inspiration into actionable, shoppable experiences.

## Features

- AI-powered image analysis to detect furniture and decor items
- Product recommendations from Amazon and Etsy
- Vision board creation for design planning
- Sharing capabilities for collaboration
- Subscription tiers with varying feature sets

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Set up Supabase Edge Functions environment variables:

```bash
# Set Supabase project secrets
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
supabase secrets set AMAZON_RAPIDAPI_KEY=your_amazon_rapidapi_key
supabase secrets set ETSY_RAPIDAPI_KEY=your_etsy_rapidapi_key
supabase secrets set APIFY_API_TOKEN=your_apify_api_token
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

```bash
# Build for production
npm run build

# Deploy to Netlify
npx netlify deploy --prod
```

## Supabase Edge Functions

The application uses Supabase Edge Functions to securely handle API calls to third-party services:

- `amazon-search`: Handles Amazon product search API calls
- `etsy-search`: Handles Etsy product search API calls
- `gemini-api`: Handles Google Gemini AI API calls
- `apify-api`: Handles Apify API calls
- `stripe-checkout`: Creates Stripe checkout sessions
- `stripe-portal`: Creates Stripe customer portal sessions
- `stripe-webhook`: Processes Stripe webhook events

## Subscription Tiers

1. **Free**
   - 4 active projects
   - 40 Amazon searches/month
   - 25 Etsy searches/month
   - 1 active vision board

2. **Pro**
   - 25 active projects
   - 200 Amazon searches/month
   - 125 Etsy searches/month
   - 12 active vision boards
   - Vision board sharing
   - Ad-free experience

3. **Studio**
   - Unlimited projects
   - 1,200 Amazon searches/month
   - 750 Etsy searches/month
   - Unlimited vision boards
   - White label branding