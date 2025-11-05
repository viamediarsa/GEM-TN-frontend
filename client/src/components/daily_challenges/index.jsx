import { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import http from "../../../http.js";
import { getUserData } from "../../services/userService";

export default function DailyChallenges() {
  const [bgColor, setBgColor] = useState("#FFD014");
  const [dailyChallenges, setDailyChallenges] = useState([]);
  const failureCountRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch daily challenges data
    const fetchDailyChallenges = async () => {
      try {
        const userData = await getUserData('27768399103', {
          daily_challenges: true
        });
        console.log('📊 DailyChallenges - User data response:', userData);
        
        // Set daily challenges from API response
        if (userData?.daily_challenges && Array.isArray(userData.daily_challenges)) {
          setDailyChallenges(userData.daily_challenges);
        }
      } catch (error) {
        console.error('❌ DailyChallenges - Error fetching user data:', error);
      }
    };

    fetchDailyChallenges();

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
        const res = await http.get("/api/frontend/daily-challenges-color");
        const data = res?.data || {};
        const current = data.currentDailyChallengesColor || "#FFD014";
        failureCountRef.current = 0; // Reset on success
        setBgColor(prev => {
          if (prev !== current) {
            console.log("🎨 DailyChallenges color updated:", current);
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
          console.warn("DailyChallenges color fetch failed (attempt " + failureCountRef.current + "/" + MAX_FAILURES + "):", err?.message || err);
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
    <div id="daily-challenges" className={styles.dailyChallenges} style={{ backgroundColor: bgColor }}>
      <h2 style={{ margin: 0 }}>Daily Challenges</h2>
      {dailyChallenges.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          {dailyChallenges.map((challenge, index) => (
            <div key={index} style={{ 
              padding: '12px', 
              marginBottom: '8px', 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {challenge.image0 && (
                <img 
                  src={challenge.image0} 
                  alt={challenge.action || 'Challenge'} 
                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{challenge.action || 'Challenge'}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{challenge.date || ''}</div>
                {challenge.completed && (
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#10b981', 
                    fontWeight: '600' 
                  }}>✓ Completed</span>
                )}
              </div>
              {challenge.reward_type && challenge.reward_value && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>{challenge.reward_type}</div>
                  <div style={{ fontWeight: '600' }}>{challenge.reward_value}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}