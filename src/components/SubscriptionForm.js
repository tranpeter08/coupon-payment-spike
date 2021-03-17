import {useState, useContext, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import styles from './SubscriptionForm.module.css'
import PropTypes from 'prop-types';
import {StripeContext, actions} from '../context/stripeContext';
import {useRouter} from 'next/router';
import subOptions from './helpers/subscriptionOptions';

export default function SubscriptionForm(props) {
  const router = useRouter();
  const formDefaults = {
    email: 'a@a.com'
  };
  const {register, handleSubmit} = useForm({defaultValues: formDefaults});

  const options = [];

  for (let option in subOptions) {
    const {title, cost} = subOptions[option];
    options.push(<option key={option} value={option}>{title} ${cost.toFixed(2)}</option>)
  }

  async function onSubmit(formData) {
    props.onSubmit(formData);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Payment Intent</h2>
      <label>Email
        <input type="email" name="email" ref={register} />
      </label>
      <br/>
      <label>Subscription Options:
        {' '}
        <select name ="option" ref={register}>
          {options}
        </select>
      </label>
      <br/>
      <button disabled={props.loading} type="submit">Checkout</button>
      {props.error && <div><p>An Error has occured: {props.error}</p></div>}
    </form>
  )
}

SubscriptionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}