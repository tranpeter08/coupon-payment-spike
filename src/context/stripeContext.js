import {createContext, useReducer, useState} from 'react';
const StripeContext = createContext([]);

const initialState = {
  clientToken: null, 
  amount: null,
  paymentJSON: null
};

const actionTypes = {
  PAYMENT_INTENT_SUCCESS: 'PAYMENT_INTENT_SUCCESS',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  RESET: 'RESET'
}

class Action {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }
}

const actions = {
  submitPaymentIntent(payload) {
    return new Action(actionTypes.PAYMENT_INTENT_SUCCESS, payload);
  },
  submitPayment(payload) {
    return new Action(actionTypes.PAYMENT_SUCCESS, payload);
  }
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
    <StripeContext.Provider value={[state, dispatch]}>
      {props.children}
    </ StripeContext.Provider>
  )
}

export {StripeDataProvider, StripeContext, actions};