import styles from "./styles.module.css";

export default function GemStorePage() {
  const renderCards = (count) => {
    return Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className={styles.Card}>
        <div className={styles.CardLogo}></div>
        <div className={styles.CardTitle}>A Product Name</div>
        <div className={styles.CardPrice}>50</div>
      </div>
    ));
  };

  return (
    <div className={styles.Page}>
      <h1 className={styles.PageTitle}>Gem Store</h1>

      <section className={styles.Section}>
        <div className={styles.SectionHeader}>
          <h2 className={styles.SectionTitle}>Vouchers</h2>
          <div className={styles.Badge}>Active</div>
        </div>
        <div className={styles.Carousel}>{renderCards(9)}</div>
      </section>

      <section className={styles.Section}>
        <div className={styles.SectionHeader}>
          <h2 className={styles.SectionTitle}>Data Bundles</h2>
          <div className={styles.Badge}>Active</div>
        </div>
        <div className={styles.Carousel}>{renderCards(9)}</div>
      </section>
    </div>
  );
}


