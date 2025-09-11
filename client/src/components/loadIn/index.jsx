import styles from "./styles.module.css";
import gem from "../../assets/gem.png";
import { useNavigate } from "react-router-dom";

export default function LoadIn({ isVisible, prize, onClose }) {
  if (!isVisible) return null;
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.loadIn} onClick={(e) => e.stopPropagation()}>
          <div className={styles.prizeContent}>
            <div className={styles.gemIcon}>
              <img src={gem} alt="gem" />
            </div>
            <h2 className={styles.prizeTitle}>Congratulations!</h2>
            <p className={styles.prizeText}>You won:</p>
            <div className={styles.prizeAmount}>
              {prize}
            </div>
            <button className={styles.claimButton} onClick={onClose}>
              Play Again
            </button>
            <button onClick={() => navigate("/rewards")} className={styles.claimButton} >
              Rewards
            </button>
            <button className={styles.claimButton} onClick={() => navigate("/history")} >
              History
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
