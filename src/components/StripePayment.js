import {useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {StripeContext, actions} from '../context/stripeContext';
import styles from './StripePaymentIntentForm.module.css';

export default function StripePayment() {
  const stripe = useStripe();
  const elements = useElements();
  const [ctx, dispatch] = useContext(StripeContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const basePath = router.pathname.split('/').slice(0, -1).join('/');
  const amount = (ctx.amount / 100).toFixed(2);

  if (!stripe || !elements || !ctx.clientToken) return null;

  const testValues = {
    card: '4242 4242 4242 4242',
    expiry: '01/24',
    cvc: '123'
  }

  function amountDisplay(amount) {
    const values = {
      1: 'Monthly',
      6: '6 Months',
      12: 'Annually'
    }

    return values[amount];
  }

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
            billing_details: {
              name: 'Jenny Rosen',
            }
          },
          receipt_email: ctx.email
        }
      );

      if (!result.paymentIntent || result.paymentIntent.status !== 'succeeded') {
        setLoading(false);
        return;
      }

      console.log(result);

      dispatch({
        type: actions.PAYMENT_SUCCESS, 
        payload: {paymentJSON: result.paymentIntent}
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function copyTestValue(type) {
    return async function() {
      try {
        await navigator.clipboard.writeText(testValues[type]);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function handleCardElemChange({error}) {
    setError(error ? error.message : '');
  }

  useEffect(() => {
    if (ctx.paymentJSON) {
      router.push(basePath + '/success');
    }
  }, [ctx.paymentJSON])

  return (
    <form className={styles.form} onSubmit={handleSub}>
      <h1>Checkout</h1>
      <div><p>Amount: ${amount} ({amountDisplay(ctx.option)})</p></div>
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
        <span>Test Card: {testValues.card}</span>
        <button type='button' onClick={copyTestValue('card')}>Copy</button>
      </div>
      <div>
        <span>Test Expiry: {testValues.expiry}</span>
        <button type='button' onClick={copyTestValue('expiry')}>Copy</button>
      </div>
      <div>
        <span>Test CVC: {testValues.cvc}</span>
        <button type='button' onClick={copyTestValue('cvc')}>Copy</button>
      </div>
      <button disabled={loading}>SUBMIT</button>
      <div>{error && <p style={{color: 'red'}}>{error}</p>}</div>
    </form>
  )
}