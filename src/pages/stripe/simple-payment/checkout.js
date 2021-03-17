import {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import StripePaymentForm from '../../../components/StripePaymentForm';
import {StripeContext} from '../../../context/stripeContext';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);

export default function Payment() {
  const router = useRouter();
  const [ctx, dispatch] = useContext(StripeContext);

  useEffect(() => {
    if (!ctx.option) {
      router.push('/stripe');
    }
  }, [])

  if (!ctx.option) return null;

  return (
    <Elements stripe={stripePromise}>
      <h1>Stripe Checkout</h1>
      <StripePaymentForm />
    </Elements>
  )
}