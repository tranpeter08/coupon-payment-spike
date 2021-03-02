'use strict';
const router = require('express').Router();
const STRIPE_SECRET = 'sk_test_tEwBzR5jn9AGrF4Xty9eYf5H00qg0Rg8Fg';
const stripe = require('stripe')(STRIPE_SECRET);

const subScriptionvalues = {
  1: 2000,
  6: 10000,
  12: 18000
}

router.post('/intent', async (req, res, next) => {
  try {
    const customer = await stripe.customers.create();

    // save customer.id to database?

    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      setup_future_usage: 'off_session',
      amount: subScriptionvalues[req.body.amount],
      currency: 'usd',
      receipt_email: req.body.email
    });
  
    res.json({
      clientToken: paymentIntent.client_secret, 
      amount: paymentIntent.amount
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

router.post('/charge-customer', (req, res, next) => {
  
});

router.post('/create-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Monthly',
          },
          unit_amount: 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.json({ id: session.id });
});

module.exports = router;