import { useRouter } from 'next/router';
import {useContext, useEffect, useState} from 'react';
import SquarePaymentForm from '../../components/SquarePaymentForm';
import { StripeContext } from '../../context/stripeContext';

export default function SquareCheckout(props) {
  const [loadingPaymentForm, setLoadingPaymentForm] = useState(true);
  const [ctx, dispatch] = useContext(StripeContext);
  const router = useRouter();

  // load the Square payment form script
  useEffect(() => {
    if (!ctx.option) {
      router.push('/square');
      return;
    }

    const squareScript = document.createElement('script');

    squareScript.src = 'https://js.squareupsandbox.com/v2/paymentform';
    squareScript.type = 'text/javascript';
    squareScript.async = true;

    squareScript.onload = () => {
      setLoadingPaymentForm(false);
    }

    document.head.appendChild(squareScript);

    return () => {
      // remove script when component unmounts
      document.head.removeChild(squareScript);
    }
  }, []);

  return (
    <>
      <h1>Square Checkout</h1>
      {loadingPaymentForm
        ? <div>loading script...</div> 
        : <SquarePaymentForm SqPaymentForm={window.SqPaymentForm} />}
    </>
)};