import {useContext, useEffect} from 'react';
import {useRouter} from 'next/router';
import {actions, StripeContext} from '../../../context/stripeContext';

export default function Success() {
  const [ctx, dispatch] = useContext(StripeContext);
  const json = JSON.stringify(ctx.paymentJSON, null, '\t');

  useEffect(() => () => {
    dispatch(({type: actions.RESET}));
  })

  return (
    <>
      <h1>Success!</h1>
      <textarea 
        style={{width: 800, height: 600, resize: 'none'}} 
        value={json}
        readOnly
      >

      </textarea>
    </>
  )
}