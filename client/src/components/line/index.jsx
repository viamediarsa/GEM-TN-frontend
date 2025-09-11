import styles from "./styles.module.css";

export default function Line() {
    return (
        <div className={styles.HeaderLineContainer}>
            <div className={styles.HeaderLineTOP}></div>
            <div className={styles.HeaderLineBOTTOM}></div>
        </div>
    )
}