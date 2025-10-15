// Vercel Function for handling Stripe webhooks
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle successful payment
  if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object;
    
    console.log('Payment succeeded:', paymentIntent.id);
    
    // Extract customer information
    const customerId = paymentIntent.customer;
    const metadata = paymentIntent.metadata;
    
    try {
      // Get customer details
      const customer = await stripe.customers.retrieve(customerId);
      
      console.log('Customer details:', {
        email: customer.email,
        website: metadata.website,
        plan: metadata.plan
      });
      
      // TODO: Add your business logic here:
      // - Save to database
      // - Trigger optimization service
      // - Send emails
      // - Set up recurring billing
      
    } catch (error) {
      console.error('Error processing successful payment:', error);
    }
  }

  res.status(200).json({ received: true });
}
