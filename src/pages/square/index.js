import {useState, useContext} from 'react';
import SubscriptionForm from '../../components/SubscriptionForm';
import {useRouter} from 'next/router';
import {StripeContext, actions} from '../../context/stripeContext';

export default function Square() {
  const router = useRouter();
  const [ctx, dispatch] = useContext(StripeContext);

  function onSubmit(formData) {
    dispatch(actions.submitPaymentIntent(formData));
    router.push('/square/checkout');
  }

  return (
    <>
      <h1>Square</h1>
      <SubscriptionForm onSubmit={onSubmit} />
    </>
  )
}