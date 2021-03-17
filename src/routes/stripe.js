'use strict';
const router = require('express').Router();
const STRIPE_SECRET = process.env.API_STRIPE_SECRET;
const stripe = require('stripe')(STRIPE_SECRET);

const subScriptionvalues = {
  1: 2000,
  6: 10000,
  12: 18000
}

router.post('/intent', async (req, res, next) => {
  try {
    const customer = await stripe.customers.create({
      description: 'test customer',
      email: req.body.email
    });

    // save customer.id to database for future use?

    const paymentIntent = await stripe.paymentIntents.create({
      customer: customer.id,
      setup_future_usage: 'off_session',
      amount: subScriptionvalues[req.body.option],
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

module.exports = router;