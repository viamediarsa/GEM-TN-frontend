import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import http from "../../../http.js";
import styles from "./styles.module.css";
import homeIcon from "../../assets/navbar_assets/home.png";
import rewardsIcon from "../../assets/navbar_assets/rewards.png";
import gemstore from "../../assets/navbar_assets/gemstore.png";
import chest from "../../assets/navbar_assets/chest.png";

export default function Navbar() {
  const [navbarColor, setNavbarColor] = useState("#ffffff");

  useEffect(() => {
    const socket = io(http.defaults.baseURL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    // Listen for navbar-color WebSocket event from API endpoint
    socket.on("navbar-color", (newNavbarColor) => {
      console.log("🎨 Navbar received navbar-color:", newNavbarColor);
      setNavbarColor(newNavbarColor);
    });

    return () => {
      socket.disconnect();
    };
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