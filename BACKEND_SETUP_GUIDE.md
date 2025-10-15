# RevenueGuard AI - Backend Setup Guide

This guide will walk you through setting up the backend server and Stripe dashboard configuration.

## 📋 Prerequisites

- Node.js installed on your computer (download from nodejs.org)
- A Stripe account with your secret key
- A web hosting service (like Heroku, Vercel, or DigitalOcean)

## 🚀 Step 1: Install Backend Dependencies

1. **Open Terminal/Command Prompt** and navigate to your project folder:
   ```bash
   cd /Users/k1dm/airf.com/backend
   ```

2. **Install required packages**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp env-example.txt .env
   ```

## 🔑 Step 2: Get Your Stripe Keys

### A. Get Your Stripe Secret Key:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **"Developers"** in the left sidebar
3. Click **"API keys"**
4. Copy your **Secret key** (starts with `sk_live_`)
5. Paste it in your `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_live_your_actual_secret_key_here
   ```

### B. Get Your Webhook Secret (we'll set this up in Step 4)

## 🏗️ Step 3: Configure Products in Stripe Dashboard

### Create Products for Your Pricing Tiers:

1. **Go to Stripe Dashboard** → **Products**
2. **Click "Add Product"**

#### Product 1: Starter Plan
- **Name**: `RevenueGuard AI - Starter Plan`
- **Description**: `Complete website audit with 5 critical fixes`
- **Price**: `$525.00` (one-time)
- **Save Product**

#### Product 2: Professional Plan
- **Name**: `RevenueGuard AI - Professional Plan`
- **Description**: `Complete website audit with 15 critical fixes`
- **Price**: `$1,825.00` (one-time)
- **Save Product**

#### Product 3: Enterprise Plan
- **Name**: `RevenueGuard AI - Enterprise Plan`
- **Description**: `Complete website audit with unlimited fixes`
- **Price**: `$3,225.00` (one-time)
- **Save Product**

## 🔗 Step 4: Set Up Webhooks

### A. Create Webhook Endpoint:
1. **Go to Stripe Dashboard** → **Developers** → **Webhooks**
2. **Click "Add endpoint"**
3. **Endpoint URL**: `https://your-domain.com/webhook` (replace with your actual domain)
4. **Events to send**: Select `payment_intent.succeeded`
5. **Click "Add endpoint"**

### B. Get Webhook Secret:
1. **Click on your newly created webhook**
2. **Copy the "Signing secret"** (starts with `whsec_`)
3. **Add it to your `.env` file**:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## 🚀 Step 5: Deploy Your Backend

### Option A: Deploy to Heroku (Recommended for beginners)

1. **Install Heroku CLI** from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku app**:
   ```bash
   cd /Users/k1dm/airf.com/backend
   heroku create your-app-name
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set STRIPE_SECRET_KEY=sk_live_your_secret_key
   heroku config:set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

5. **Deploy**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **Your backend will be live at**: `https://your-app-name.herokuapp.com`

### Option B: Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /Users/k1dm/airf.com/backend
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

## 🔧 Step 6: Update Your Website

### Update the frontend to use your backend:

1. **Update your website's base URL** in `script.js` (if needed)
2. **Upload your website files** to your hosting provider
3. **Make sure your website is served over HTTPS**

## ✅ Step 7: Test Everything

### Test the Complete Flow:

1. **Visit your website**
2. **Enter a test website URL** and click "Scan"
3. **Select a pricing plan**
4. **Use Stripe test cards**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
5. **Complete the payment**
6. **Check your Stripe dashboard** for the successful payment

## 🎯 Step 8: Add Your Business Logic

In the `server.js` file, find the section that says "TODO: Add your business logic here" and add:

```javascript
// Example business logic:
// 1. Save customer to database
// 2. Send confirmation email
// 3. Trigger your revenue optimization service
// 4. Set up monthly billing

// Send confirmation email
await sendConfirmationEmail({
  email: customer.email,
  website: metadata.website,
  plan: metadata.plan
});

// Trigger optimization service
await triggerOptimizationService({
  website: metadata.website,
  plan: metadata.plan,
  customerId: customer.id
});
```

## 🔒 Security Checklist

- ✅ Use HTTPS for your website
- ✅ Never expose secret keys in frontend code
- ✅ Validate all inputs on the backend
- ✅ Use environment variables for sensitive data
- ✅ Enable webhook signature verification
- ✅ Implement rate limiting (optional)

## 📞 Support

If you run into issues:

1. **Check the logs**: Most hosting providers show error logs
2. **Test locally first**: Run `npm start` in the backend folder
3. **Verify Stripe keys**: Make sure they're correct in your `.env` file
4. **Check webhook URL**: Make sure it's accessible from the internet

## 🎉 You're Done!

Once everything is set up:
- Your website will process real payments
- Customers will be charged through Stripe
- You'll receive notifications when payments succeed
- You can add your own business logic to handle new customers

Your RevenueGuard AI platform is now ready for real customers and real revenue!
