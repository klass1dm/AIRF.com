// Vercel Function for creating payment intents
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICING = {
  starter: 52500, // $525 in cents
  professional: 182500, // $1825 in cents
  enterprise: 322500 // $3225 in cents
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, email, website } = req.body;
    
    // Validate input
    if (!plan || !email || !website) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!PRICING[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }
    
    // Create customer in Stripe
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        website: website,
        plan: plan
      }
    });
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: PRICING[plan],
      currency: 'usd',
      customer: customer.id,
      metadata: {
        plan: plan,
        website: website,
        email: email
      },
      description: `RevenueGuard AI ${plan} plan for ${website}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id
    });
    
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
}
