import {useEffect, useContext, useRef} from 'react';
import {useRouter} from 'next/router';
import StripePaymentIntentForm from '../../../components/StripePaymentIntentForm';
import {StripeContext} from '../../../context/stripeContext';

export default function StripeSimplePayment() {
  const [state, dispatch] = useContext(StripeContext);
  const router = useRouter();

  return (<>
    <StripePaymentIntentForm />
  </>)
}