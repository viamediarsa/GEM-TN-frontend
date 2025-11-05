import { useEffect, useState, useRef } from "react";
import http from "../../../http.js";
import { getUserData } from "../../services/userService";
import styles from "./styles.module.css";
import arrowImage from "../../assets/arrow.png";
import headerImage from "../../assets/logo.png";
import PlayCounter from "../play_counter";

export default function HeaderCard() {
  const [color, setColor] = useState("#ffffff");
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [userName, setUserName] = useState("");
  const failureCountRef = useRef(0);
  const intervalRef = useRef(null);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 18) return "Good Afternoon,";
    return "Good Evening,";
  };
  
  useEffect(() => {
    // Fetch user data for header (msisdn for username, play_balance for play counter)
    const fetchUserData = async () => {
      try {
        const userData = await getUserData('27768399103', {
          msisdn: true,
          play_balance: true
        });
        console.log('📊 Header_card - User data response:', userData);
        
        // Set play count from API response
        if (userData?.play_balance !== undefined) {
          setPlayCount(userData.play_balance);
        }
        
        // Set username from msisdn
        if (userData?.msisdn) {
          setUserName(userData.msisdn);
        }
      } catch (error) {
        console.error('❌ Header_card - Error fetching user data:', error);
      }
    };

    fetchUserData();

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
        const res = await http.get("/api/frontend/color");
        const data = res?.data || {};
        const current = data.currentColor || "#ffffff";
        failureCountRef.current = 0; // Reset on success
        setColor(prev => {
          if (prev !== current) {
            console.log("🎨 Header card color updated:", current);
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
          console.warn("Header card color fetch failed (attempt " + failureCountRef.current + "/" + MAX_FAILURES + "):", err?.message || err);
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

  const toggleCollapse = () => {
    setIsManuallyCollapsed(!isManuallyCollapsed);
  };

  const isCollapsed = isManuallyCollapsed;

  return (
    <>
      <div 
        id="header-card"
        className={`${styles.headerCardNavbar} ${isCollapsed ? styles.shrunk : ''}`}
        style={{
          backgroundColor: color,
        }}
      >
        <div className={styles.headerContent}>
         <div className={styles.headerImageContainer}>
            <img className={styles.headerImage} src={headerImage} alt="Header" />
         </div>
          <div className={styles.headerTextContainer}>
            <div className={styles.headerText}>
                <span className={styles.headerTextTitle}>
                    {getGreeting()}
                </span>
                <br/>
                <span className={styles.headerTextSubtitle}>
                    {userName || "User"}
                </span>
            </div>
            <PlayCounter count={playCount} label="today" />
          </div>
        </div>
        
        <div
          className={styles.collapseButton}
          onClick={toggleCollapse}
          aria-label={isManuallyCollapsed ? "Expand" : "Collapse"}
        >
          <img 
            src={arrowImage} 
            alt="Toggle" 
            className={`${styles.arrow} ${isManuallyCollapsed ? styles.arrowUp : styles.arrowDown}`}
          />
        </div>
      </div>
    </>
  );
}