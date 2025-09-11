import styles from "./styles.module.css";
import gameOfTheWeek from "../../assets/gameImage.png";

export default function BigCard({ onClick }) {
    return (
        <div className={styles.bigCard} onClick={onClick} style={{cursor: onClick ? 'pointer' : 'default'}}>
          <img className={styles.gameOfTheWeek} src={gameOfTheWeek} alt="Game of the Week" />
          <div className={styles.textOverlay}>
            Game of the week
          </div>
        </div>
    )
}