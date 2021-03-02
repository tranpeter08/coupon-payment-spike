import '../styles/global.css'
import {StripeDataProvider} from '../context/stripeContext';
import MainLayout from '../layouts/MainLayout';

function Application({ Component, pageProps }) {
  return (
    <MainLayout>
      <StripeDataProvider>
        <Component {...pageProps} />
      </StripeDataProvider>
    </MainLayout>
  )
}

export default Application