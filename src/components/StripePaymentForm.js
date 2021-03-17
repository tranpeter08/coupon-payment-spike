import {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {StripeContext, actions} from '../context/stripeContext';
import styles from './SubscriptionForm.module.css';
import testValues from './helpers/testCardFieldValues';
import subOptns from './helpers/subscriptionOptions';
import copyToClipboard from './helpers/copyToClipboard';

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [ctx, dispatch] = useContext(StripeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const basePath = router.pathname.split('/').slice(0, -1).join('/');
  const amount = (ctx.amount / 100).toFixed(2);

  if (!ctx.clientToken) return null;

  useEffect(() => {
    if (ctx.paymentJSON) {
      router.push(basePath + '/success');
    }
  }, [ctx.paymentJSON]);

  async function handleSub(event) {
    try {
      event.preventDefault();
      const cardElement = elements.getElement(CardElement);

      setLoading(true);

      const result = await stripe.confirmCardPayment(
        ctx.clientToken, 
        {
          payment_method: {
            card: cardElement,
          },
          receipt_email: ctx.email
        }
      );

      if (!result.paymentIntent || result.paymentIntent.status !== 'succeeded') {
        setLoading(false);
        return;
      }

      dispatch(actions.submitPayment({paymentJSON: result.paymentIntent}));
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function copyTestValue(value) {
    return async function () {
      await copyToClipboard(value);
    }
  }

  function handleCardElemChange({error}) {
    setError(error ? error.message : '');
  }

  return (
    <form className={styles.form} onSubmit={handleSub}>
      <h1>Checkout</h1>
      <div><p>Amount: ${amount} ({subOptns[ctx.option].title})</p></div>
      <div className={styles.formRow}>
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            value: {postalCode: '12345'}
          }}

          onChange={handleCardElemChange}
        />
        </div>
        <div>
          <div>
            <span>Test Card: {testValues.card}</span>
            <button type='button' onClick={copyTestValue(testValues['card'])}>Copy</button>
          </div>
          <div>
            <span>Test Expiry: {testValues.expiry}</span>
            <button type='button' onClick={copyTestValue(testValues['expiry'])}>Copy</button>
          </div>
          <div>
            <span>Test CVV: {testValues.cvc}</span>
            <button type='button' onClick={copyTestValue(testValues['cvc'])}>Copy</button>
          </div>
        </div>
        <button disabled={loading}>SUBMIT</button>
      <div>{error && <p style={{color: 'red'}}>{error}</p>}</div>
    </form>
  )  
}