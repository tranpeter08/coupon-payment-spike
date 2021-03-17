import Link from 'next/link';
import {useRouter} from 'next/router';

export default function Stripe() {
  const router = useRouter();

  const paymentLinks = [
    ['/simple-payment','Simple Payment']
  ]

  const links = paymentLinks.map(link => {
    return (
      <li key={link[1]}>
        <Link href={router.pathname + link[0]}>
          <a>{link[1]}</a>
        </Link>
      </li>
    )
  })

  return (<div>
    <h1>Stripe</h1>
    <ul>
      {links}
    </ul>
  </div>)
}