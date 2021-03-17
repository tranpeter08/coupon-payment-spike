'use strict';
const router = require('express').Router();
const { Client, Environment, ApiError } = require('square');

const subScriptionvalues = {
  1: 2000,
  6: 10000,
  12: 18000
}

const squareClient = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.API_SQUARE_ACCESS_TOKEN,
});

router.post('/payment', async (req, res, next) => {
  const {paymentsApi} = squareClient;
  const {body} = req;

  const payload = {
    sourceId: body.nonce,
    amountMoney: {
      amount: subScriptionvalues[body.option], // $1.00 charge
      currency: 'USD'
    },
    locationId: body.location_id,
    idempotencyKey: body.idempotency_key,
  };

  try {
    const response = await paymentsApi.createPayment(payload);
    const formatted = JSON.parse(JSON.stringify(response.result, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    ));

    res.json({result: formatted});
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

module.exports = router;