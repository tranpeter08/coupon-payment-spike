import {useStripe} from '@stripe/react-stripe-js';
import axios from 'axios';

export default function SessionPayment() {
  const stripe = useStripe();

  async function checkout() {
    try {
      const resp = await axios.post('/api/stripe/create-session');
      console.log(resp);

    } catch (error) {
      console.log(error);
    }
  }
  return (<>
    <div>Test</div>
    <button disabled onClick={checkout}>Checkout</button>
  </>)
}