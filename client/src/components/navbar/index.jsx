import { useEffect, useState, useRef } from "react";
import http from "../../../http.js";
import { getUserData } from "../../services/userService";
import styles from "./styles.module.css";
import homeIcon from "../../assets/navbar_assets/home.png";
import rewardsIcon from "../../assets/navbar_assets/rewards.png";
import gemstore from "../../assets/navbar_assets/gemstore.png";
import chest from "../../assets/navbar_assets/chest.png";

export default function Navbar() {
  const [navbarColor, setNavbarColor] = useState("#ffffff");
  const failureCountRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch gems and weekly chest data
    const fetchNavbarData = async () => {
      try {
        const userData = await getUserData('27768399103', {
          gems: true,
          weekly_chest: true
        });
        console.log('📊 Navbar - User data response:', userData);
      } catch (error) {
        console.error('❌ Navbar - Error fetching user data:', error);
      }
    };

    fetchNavbarData();

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
        const res = await http.get("/api/frontend/navbar-color");
        const data = res?.data || {};
        const current = data.currentColor || data.currentNavbarColor || "#ffffff";
        failureCountRef.current = 0; // Reset on success
        setNavbarColor(prev => {
          if (prev !== current) {
            console.log("🎨 Navbar color updated:", current);
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
          console.warn("Navbar color fetch failed (attempt " + failureCountRef.current + "/" + MAX_FAILURES + "):", err?.message || err);
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <>
      <div
        className={styles.navbar}
        style={{
          backgroundColor: navbarColor,
        }}
      >
        <div className={styles.navbarItems}>
            <div 
              className={styles.navbarButton}
              onClick={() => scrollToSection('header-card')}
              title="Home"
            >
              <img src={homeIcon} alt="Home" />
            </div>
            
            <div
              className={styles.navbarButton}
              onClick={() => scrollToSection('rewards-history')}
              title="Rewards"
            >
              <img src={rewardsIcon} alt="Rewards" />
            </div>
            
            <div
              className={styles.navbarButton}
              onClick={() => scrollToSection('gem-store')}
              title="Gem Store"
            >
              <img src={gemstore} alt="Gem Store" />
            </div>
            
            <div
              className={styles.navbarButton}
              onClick={() => scrollToSection('flip-tile-game')}
              title="Game"
            >
              <img src={chest} alt="Game" />
            </div>
        </div>
      </div>
    </>
  );
}