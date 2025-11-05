import { useEffect, useState, useRef } from "react";
import http from "../../../http.js";
import { getUserData } from "../../services/userService";
import styles from "./styles.module.css";
import filterImage from "../../assets/Filter.png";
import arrowImage from "../../assets/arrow.png";

export default function RewardsHistory() {
  const [rewardsColor, setRewardsColor] = useState("#FFD700");
  const [showAll, setShowAll] = useState(false);
  const [rewards, setRewards] = useState([]);
  const failureCountRef = useRef(0);
  const intervalRef = useRef(null);
  
  useEffect(() => {
    // Fetch completed chests data
    const fetchCompletedChests = async () => {
      try {
        const userData = await getUserData('27768399103', {
          completed_chests: true
        });
        console.log('📊 RewardsHistory - User data response:', userData);
        
        // Set rewards from weekly_chest array
        if (userData?.weekly_chest && Array.isArray(userData.weekly_chest)) {
          const formattedRewards = userData.weekly_chest.map(chest => ({
            name: `${chest.reward_value || ''} ${chest.reward_type || 'Reward'}`,
            date: chest.date || '',
            completed: chest.completed || false,
            image: chest.image || '',
            reward_type: chest.reward_type || '',
            reward_value: chest.reward_value || ''
          }));
          setRewards(formattedRewards);
        }
      } catch (error) {
        console.error('❌ RewardsHistory - Error fetching user data:', error);
      }
    };

    fetchCompletedChests();

    const MAX_FAILURES = 3;

    // Fetch color function
    const fetchColor = async () => {
      // Stop if we've exceeded max failures
      if (failureCountRef.current >= MAX_FAILURES) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      try {
        const res = await http.get("/api/frontend/rewards-color");
        const data = res?.data || {};
        const current = data.currentRewardsColor || data.currentColor || "#FFD700";
        failureCountRef.current = 0; // Reset on success
        setRewardsColor(prev => {
          if (prev !== current) {
            console.log("🎨 Rewards color updated:", current);
            return current;
          }
          return prev;
        });
      } catch (err) {
        // If 404, endpoint doesn't exist - stop immediately without logging
        if (err?.response?.status === 404) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
        
        failureCountRef.current++;
        if (failureCountRef.current <= MAX_FAILURES) {
          console.warn("Rewards color fetch failed (attempt " + failureCountRef.current + "/" + MAX_FAILURES + "):", err?.message || err);
        }
        // Stop polling after max failures
        if (failureCountRef.current >= MAX_FAILURES) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    };

    // Initial fetch
    fetchColor();

    // Poll for color updates every 10 minutes
    intervalRef.current = setInterval(fetchColor, 600000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {rewards.length > 0 ? rewards.map((reward, index) => {
          const isVisible = showAll || index < 3;
          return (
            <div 
              key={index} 
              className={`${styles.rewardItem} ${!isVisible ? styles.hidden : ''}`}
              style={{
                transitionDelay: isVisible ? `${index * 0.05}s` : `${(rewards.length - index - 1) * 0.05}s`
              }}
            >
              {reward.image && (
                <img 
                  src={reward.image} 
                  alt={reward.name} 
                  style={{ width: '24px', height: '24px', marginRight: '8px', objectFit: 'contain' }}
                />
              )}
              <span className={styles.rewardName}>{reward.name}</span>
              <span className={styles.rewardDate}>{reward.date}</span>
              {reward.completed && (
                <span style={{ marginLeft: '8px', color: '#10b981', fontSize: '12px' }}>✓</span>
              )}
            </div>
          );
        }) : (
          <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
            No rewards history available
          </div>
        )}
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
            Showing {showAll ? rewards.length : Math.min(3, rewards.length)} of {rewards.length}
          </span>
        </div>
      </div>
    </div>
  );
}