import {createContext, useReducer, useState} from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);
const StripeContext = createContext([]);

const initialState = {
  clientToken: null, 
  amount: null,
  paymentJSON: null
};

const actions = {
  PAYMENT_INTENT_SUCCESS: 'PAYMENT_INTENT_SUCCESS',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  RESET: 'RESET'
}

function reducer(state = initialState, action) {
  switch(action.type) {
    case 'PAYMENT_INTENT_SUCCESS':
      return {...state, ...action.payload};
    case 'PAYMENT_SUCCESS':
      return {...state, ...action.payload};
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function StripeDataProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider value={[state, dispatch]}>
        {props.children}
      </ StripeContext.Provider>
    </Elements>
  )
}

export {StripeDataProvider, StripeContext, actions};