import {useEffect, useState, useRef, useContext} from 'react';
import sqPaymentFormConfig from '../components/helpers/squarePaymentFormConfig';
import {v4 as uuidv4} from 'uuid';
import {StripeContext, actions} from '../context/stripeContext';
import testValues from './helpers/squareTestValues';
import copyToClipboard from './helpers/copyToClipboard';
import styles from './SquarePaymentForm.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import subOptns from '../components/helpers/subscriptionOptions';

export default function SquarePaymentForm(props) {
  const [sqForm, setSqForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [ctx, dispatch] = useContext(StripeContext);
  const router = useRouter();

  const hidden = loading ? styles.hidden : '';

  // load Square payment form elements
  useEffect(() => {
    const paymentForm = new props.SqPaymentForm(
      sqPaymentFormConfig(setNonce, setError, setLoading)
    );

    paymentForm.build();
    setSqForm(paymentForm);
    
    if (ctx.clientToken) {
      dispatch({type: actions.RESET});
    }

    return function() {
      paymentForm.destroy();
    }
    
  }, []);

  // set zipcode after square script and form are done loading
  if (sqForm && !loading) {
    sqForm.setPostalCode('12345');
  }

  function copy(value) {
    return async function () {
      await copyToClipboard(value);
    }
  }

  function onClick(e) {
    e.preventDefault();
    sqForm.requestCardNonce();
  }

  // once a token is set, make a request to api to process payment
  async function setNonce(nonce) {
    try {
      const payload = {
        nonce,
        idempotency_key: uuidv4(),
        location_id: 'LN3PD1EYSEMNV',
        option: ctx.option
      }

      setProcessing(true);

      const resp = await axios.post('/api/square/payment', payload);
      setProcessing(false);
      router.push('/square/success');
      dispatch(actions.submitPayment({
        clientToken: nonce, 
        paymentJSON: resp.data
      }));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className={hidden} id="form-container">
        <div>
          <p>
            Amount ${subOptns[ctx.option].cost} ({subOptns[ctx.option].title})
          </p>
        </div>
        <div id="sq-card-number"></div>
        <div className="third" id="sq-expiration-date"></div>
        <div className="third" id="sq-cvv"></div>
        <div className="third" id="sq-postal-code"></div>
        <button 
          id="sq-creditcard" 
          className="button-credit-card" 
          onClick={onClick}
          disabled={processing}
        >
          Submit Payment
        </button>

        <div>
          {error && error.map((err, i) => 
            <div key={i} style={{color: 'red'}}>{err.message}</div>
          )}
        </div>

        <div style={{marginTop: '20px'}}>
          <div>Test Card Number 
            <button 
              type="button" 
              onClick={copy(testValues.card)} 
            >
              Copy
            </button>
          </div>
          <div>Test Expiry 
            <button 
              type="button" 
              onClick={copy(testValues.expiry)} 
            >
              Copy
            </button>
          </div>
          <div>Test CVV
            <button 
              type="button" 
              onClick={copy(testValues.cvv)} 
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      {loading && <div>loading payment form...</div>}
   </>
)};