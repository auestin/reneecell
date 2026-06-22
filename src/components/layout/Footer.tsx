import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ dict }: { dict: any }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Rene Cell</h3>
          <p className={styles.link}>{dict.footer?.subtitle || 'Premium Skincare & Cosmetics'}</p>
          <p className={styles.link}>{dict.footer?.desc || 'Based on advanced dermatological science.'}</p>
        </div>
        
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{dict.footer?.explore || 'Explore'}</h3>
          <Link href="#products" className={styles.link}>{dict.header?.products || 'Products'}</Link>
          <Link href="#about" className={styles.link}>{dict.header?.about || 'About Us'}</Link>
          <Link href="#science" className={styles.link}>{dict.header?.science || 'Our Science'}</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>{dict.footer?.legal || 'Legal'}</h3>
          <Link href="/privacy" className={styles.link}>{dict.footer?.privacy || 'Privacy Policy'}</Link>
          <Link href="/terms" className={styles.link}>{dict.footer?.terms || 'Terms of Service'}</Link>
        </div>
      </div>
      
      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Rene Cell. All rights reserved.</p>
      </div>
    </footer>
  );
}
