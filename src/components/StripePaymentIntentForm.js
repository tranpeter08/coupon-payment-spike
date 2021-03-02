import {useState, useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import { useForm } from 'react-hook-form';
import styles from './StripePaymentIntentForm.module.css'
import axios from 'axios';
import {StripeContext, actions} from '../context/stripeContext';

export default function StripePaymentIntentForm() {
  const formDefaults = {
    email: 'a@a.com'
  };
  const {register, handleSubmit, watch, errors} = useForm({defaultValues: formDefaults});
  const [state, dispatch] = useContext(StripeContext);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData) {
    try {
      setLoading(true);

      const reqBody = {
        amount: formData.amount,
        email: formData.email
      }

      const {data} = await axios.post('/api/stripe/intent', reqBody);

      const payload = {
        clientToken: data.clientToken,
        amount: data.amount,
        option: formData.amount,
        email: formData.email
      };

      dispatch({type: actions.PAYMENT_INTENT_SUCCESS, payload});
      router.push(router.pathname + '/checkout');
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Payment Intent</h2>
      <label>Email
        <input type="email" name="email" ref={register} />
      </label>
      <br/>
      <label>Payment Options:
        {' '}
        <select name ="amount" ref={register}>
          <option value={1}>Monthly $20</option>
          <option value={6}>6 Months $100</option>
          <option value={12}>Annual $180</option>
        </select>
      </label>
      <br/>
      <button disabled={loading} type="submit">Checkout</button>
      {error && <div><p>An Error has occured</p></div>}
    </form>
  )
}