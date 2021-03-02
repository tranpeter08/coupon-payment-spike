import {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import StripePaymentForm from '../../../components/StripePayment';
import {StripeContext} from '../../../context/stripeContext';

export default function Payment() {
  const {clientToken} = useContext(StripeContext);
  const router = useRouter();

  return (
    <>
      <StripePaymentForm />
    </>
  )
}