import Link from 'next/link';
import styles from './Header.module.css';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Header({ dict }: { dict: any }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Rene Cell
      </Link>
      
      <nav className={styles.nav}>
        <Link href="#products" className={styles.navLink}>{dict.header?.products || 'Products'}</Link>
        <Link href="#about" className={styles.navLink}>{dict.header?.about || 'About'}</Link>
        <Link href="#science" className={styles.navLink}>{dict.header?.science || 'Science'}</Link>
      </nav>

      <div className={styles.actions}>
        <LanguageSwitcher />
        <button className={`${styles.contactBtn} glow-on-hover`}>
          {dict.header?.contact || 'Contact Us'}
        </button>
      </div>
    </header>
  );
}
