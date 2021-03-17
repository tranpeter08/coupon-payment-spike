export default function sqPaymentFormConfig(setNonce, setError, setLoading) {
  return {
    // Initialize the payment form elements
    
    applicationId: process.env.NEXT_PUBLIC_SQUARE_AP_ID,
    inputClass: 'sq-input',
    autoBuild: false,
    // Customize the CSS for SqPaymentForm iframe elements
    inputStyles: [{
        fontSize: '16px',
        lineHeight: '24px',
        padding: '16px',
        placeholderColor: '#a0a0a0',
        backgroundColor: 'transparent',
        boxShadow: '0px 0px 10px grey'
    }],
    // Initialize the credit card placeholders
    cardNumber: {
        elementId: 'sq-card-number',
        placeholder: 'Card Number'
    },
    cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
    },
    expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
    },
    postalCode: {
        elementId: 'sq-postal-code',
        placeholder: 'Postal'
    },
    // SqPaymentForm callback functions
    callbacks: {
      /*
      * callback function: cardNonceResponseReceived
      * Triggered when: SqPaymentForm completes a card nonce request
      */
      cardNonceResponseReceived(errors, nonce, cardData) {
        if (errors) {
          // Log errors from nonce generation to the browser developer console.
          console.log(errors);
          setError(errors);
          return;
        }

        setNonce(nonce);
      },

      paymentFormLoaded() {
        setLoading(false);
      }
    }
  }
}