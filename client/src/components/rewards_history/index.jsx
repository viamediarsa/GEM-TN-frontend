import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import http from "../../../http.js";
import styles from "./styles.module.css";
import filterImage from "../../assets/Filter.png";
import arrowImage from "../../assets/arrow.png";

export default function RewardsHistory() {
  const [rewardsColor, setRewardsColor] = useState("#FFD700");
  const [showAll, setShowAll] = useState(false);
  
  const rewards = [
    { name: "1gb Data Bundle", date: "2025-10-30" },
    { name: "100 Gems", date: "2025-10-30" },
    { name: "20% Discount Voucher", date: "2025-10-30" },
    { name: "Free SMS Bundle", date: "2025-10-29" },
    { name: "Premium Subscription", date: "2025-10-28" },
    { name: "Bonus Points", date: "2025-10-27" }
  ];
  
  useEffect(() => {
    const socket = io(http.defaults.baseURL, { 
      transports: ["websocket"],
      autoConnect: true 
    });

    socket.on("rewards-color", (newRewardsColor) => {
      setRewardsColor(newRewardsColor);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div 
      id="rewards-history"
      className={styles.rewardsHistory}
      style={{
        backgroundColor: rewardsColor,
      }}
    >
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Rewards History</h2>
        <div className={styles.activeButton}>
          <span className={styles.activeText}>Active</span>
          <img src={filterImage} alt="Filter" className={styles.filterIcon} />
        </div>
      </div>

      {/* Rewards List */}
      <div className={styles.rewardsList}>
        {rewards.map((reward, index) => {
          const isVisible = showAll || index < 3;
          return (
            <div 
              key={index} 
              className={`${styles.rewardItem} ${!isVisible ? styles.hidden : ''}`}
              style={{
                transitionDelay: isVisible ? `${index * 0.05}s` : `${(rewards.length - index - 1) * 0.05}s`
              }}
            >
              <span className={styles.rewardName}>{reward.name}</span>
              <span className={styles.rewardDate}>{reward.date}</span>
            </div>
          );
        })}
      </div>

      {/* Show More Footer */}
      <div className={styles.footer}>
        <div className={styles.showMoreButton} onClick={() => setShowAll(!showAll)}>
          <img 
            src={arrowImage} 
            alt="Arrow" 
            className={`${styles.arrowIcon} ${showAll ? styles.arrowUp : styles.arrowDown}`}
          />
          <span className={styles.showMoreText}>
            {showAll ? 'SHOW LESS' : 'SHOW MORE'}
          </span>
          <span className={styles.showingText}>
            Showing {showAll ? rewards.length : 3} of {rewards.length}
          </span>
        </div>
      </div>
    </div>
  );
}