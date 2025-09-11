import styles from "./styles.module.css";
import Navbar from "../../components/navbar";
import Card from "../../components/card";
import BigCard from "../../components/bigCard";
import gem from "../../assets/gem.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function dashboard() {
    const navigate = useNavigate();
    
    // Game stats state
    const [playerGems, setPlayerGems] = useState(12);
    const [dailyPlays, setDailyPlays] = useState(0);
    const [maxDailyPlays] = useState(5);
    const [weeklyProgress, setWeeklyProgress] = useState(0);
    const [maxWeeklyProgress] = useState(7);

  return (
    <>
      <Navbar />
      <div className={styles.dashboard}>
        {/* Game Stats Display */}
        <div className={styles.dashboardUserName}>Hey' Matt</div>
        <div className={styles.gameStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Plays Today:</span>
            <span className={styles.statValue}>{dailyPlays}/{maxDailyPlays}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Weekly Progress:</span>
            <div className={styles.weeklyProgress}>
              {Array.from({ length: maxWeeklyProgress }, (_, i) => (
                <div 
                  key={i} 
                  className={`${styles.progressDot} ${i < weeklyProgress ? styles.filled : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.dashboardTopCard}>
          <Card onClick={() => navigate("/earn")}>
            <div className={styles.cardContainer}>
              <img src={gem} alt="gem" />
              <h3>How to earn Gems</h3>
            </div>
          </Card>
          <Card onClick={() => navigate("/store")}>
            <div className={styles.cardContainer}>
              <h3>Spend the <br/>
              Gems</h3>
            </div>
          </Card>
        </div>
        <BigCard onClick={() => navigate("/game")}>
        </BigCard>
        <div className={styles.dashboardTopCard}>
          <Card onClick={() => navigate("/rewards")}>
          <div className={styles.cardContainer}>
              <h3>Rewards</h3>
            </div>
          </Card>
          <Card onClick={() => navigate("/history")}>
          <div className={styles.cardContainer}>
              <h3>MTN Vault</h3>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
