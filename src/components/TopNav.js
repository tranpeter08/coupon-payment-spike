import React from 'react';
import Link from 'next/link';
import styles from './TopNav.module.css';

class LinkProps {
  constructor(path, title) {
    this.path = path;
    this.title = title;
  }
}

const links = [
  new LinkProps('/', 'Home'),
  new LinkProps('/stripe', 'Stripe'),
  new LinkProps('/square', 'Square')
]

export default function TopNav(props) {
  const linkElems = links.map((link) => {
    return (<li className={styles.link} key={link.title}>
      <Link href={link.path}>
        <a>
          {link.title}
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