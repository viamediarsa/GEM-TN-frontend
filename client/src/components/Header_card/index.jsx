import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import http from "../../../http.js";
import styles from "./styles.module.css";
import arrowImage from "../../assets/arrow.png";
import headerImage from "../../assets/logo.png";
import PlayCounter from "../play_counter";

export default function HeaderCard() {
  const [color, setColor] = useState("#ffffff");
  const [isManuallyCollapsed, setIsManuallyCollapsed] = useState(false);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 18) return "Good Afternoon,";
    return "Good Evening,";
  };
  
  useEffect(() => {
    console.log("Connecting to:", http.defaults.baseURL);
    const socket = io(http.defaults.baseURL, { 
      transports: ["websocket"],
      autoConnect: true 
    });

    socket.on("color", (newColor) => {
      console.log("Received color:", newColor);
      setColor(newColor);
    });

    return () => {
      socket.disconnect();
    };
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
                    Willie
                </span>
            </div>
            <PlayCounter count={100} label="today" />
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