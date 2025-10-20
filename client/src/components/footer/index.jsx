import styles from "./styles.module.css";
import messages from "../../assets/navbar_assets/messages.png";
import chest from "../../assets/navbar_assets/chest.png";
import home from "../../assets/navbar_assets/home.png";
import gemstore from "../../assets/navbar_assets/gemstore.png";
import settings from "../../assets/navbar_assets/settings.png";

export default function Footer() {
  return (
    <div className={styles.Footer}>
      <nav className={styles.Nav}>
        <button className={styles.NavItem}>
          <img src={messages} alt="Messages" />
        </button>
        <button className={styles.NavItem}>
          <img src={chest} alt="Chest" />
        </button>
        <button className={styles.NavItem}>
          <img src={home} alt="Home" />
        </button>
        <button className={styles.NavItem}>
          <img src={gemstore} alt="Gem Store" />
        </button>
        <button className={styles.NavItem}>
          <img src={settings} alt="Settings" />
        </button>
      </nav>
    </div>
  );
}