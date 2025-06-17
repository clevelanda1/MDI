import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { StripeService } from '../../services/stripeService';
import { STRIPE_PRODUCTS } from '../../stripe-config';

const StripeTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestCheckout = async (productKey: keyof typeof STRIPE_PRODUCTS) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const product = STRIPE_PRODUCTS[productKey];
      
      // Create a checkout session
      const { url } = await StripeService.createCheckoutSession({
        priceId: product.priceId,
        successUrl: `${window.location.origin}/account?success=true&plan=${productKey}`,
        cancelUrl: `${window.location.origin}/upgrade?canceled=true`,
        mode: 'subscription'
      });
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      console.error('Error starting checkout:', error);
      setError(error.message || 'Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCustomerPortal = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get customer portal URL
      const portalUrl = await StripeService.getCustomerPortalUrl(window.location.origin + '/account');
      
      // Redirect to customer portal
      window.location.href = portalUrl;
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      setError(error.message || 'Failed to open customer portal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Stripe Integration Test</h2>
        <p className="text-slate-600">Test your Stripe integration by creating a checkout session or accessing the customer portal.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Test Checkout</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              onClick={() => handleTestCheckout('pro')}
              disabled={isLoading}
              className="px-4 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
              <span>Test Pro Monthly</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleTestCheckout('studio')}
              disabled={isLoading}
              className="px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
              <span>Test Studio Monthly</span>
            </motion.button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Test Customer Portal</h3>
          <motion.button
            onClick={handleTestCustomerPortal}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
            <span>Open Customer Portal</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default StripeTest;