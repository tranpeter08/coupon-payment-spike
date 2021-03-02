import React from 'react';
import Link from 'next/link';
import styles from './TopNav.module.css';

const links = [
  ['/', 'Home'],
  ['/stripe', 'Stripe']
]

export default function TopNav(props) {
  const linkElems = links.map((link) => {
    return (<li className={styles.link} key={link[0]}>
      <Link href={link[0]}>
        <a>
          {link[1]}
        </a>
      </Link>
    </li>)
  })

  return (
    <nav className={styles.nav}>
      <ul className={styles.linkCtnr}>
        {linkElems}
      </ul>
    </nav>
)};

export {links}