import {useEffect, useContext, useState} from 'react';
import {useRouter} from 'next/router';
import SubscriptionForm from '../../../components/SubscriptionForm';
import {StripeContext, actions} from '../../../context/stripeContext';
import axios from 'axios';

export default function StripeSimplePayment() {
  const [ctx, dispatch] = useContext(StripeContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit({option, email}) {
    try {
      setLoading(true);

      const reqBody = {
        option,
        email
      }

      const {data} = await axios.post('/api/stripe/intent', reqBody);

      const payload = {
        clientToken: data.clientToken,
        amount: data.amount,
        option,
        email
      };

      router.push(router.pathname + '/checkout');

      dispatch(actions.submitPaymentIntent(payload));
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  }

  return (<>
    <h1>Stripe Simple Payment</h1>
    <SubscriptionForm 
      onSubmit={onSubmit}
      loading={loading}
      error={error}
    />
  </>)
}