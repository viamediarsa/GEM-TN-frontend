import styles from "./styles.module.css";
import logo from "../../assets/gem.png";

export default function Card({ children, onClick }) {
  return (
    <>
      <div className={styles.card} onClick={onClick} style={{cursor: onClick ? 'pointer' : 'default'}}>{children}</div>
    </>
  );
}
