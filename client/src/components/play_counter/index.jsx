import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styles from "./styles.module.css";
import http from "../../../http.js";


export default function PlayCounter({ count = 100, label = "today" }) {
  const [containerColor, setContainerColor] = useState("#ffffff");
  const [counterImage, setCounterImage] = useState(null);

   // Fetch initial image from API
  useEffect(() => {
    const fetchCounterImage = async () => {
      try {
        const response = await http.get('/frontend/plays-counter-image');
        if (response.data && response.data.currentPlaysCounterImage) {
          setCounterImage(response.data.currentPlaysCounterImage);
        }
      } catch (error) {
        console.log("API endpoint not available");
      }
    };

    fetchCounterImage();

    console.log("Connecting to:", http.defaults.baseURL);
    const socket = io(http.defaults.baseURL, { 
      transports: ["websocket"],
      autoConnect: true 
    });

    // Listen for plays-container-color updates
    socket.on("plays-container-color", (color) => {
      console.log("🎨 Received plays container color:", color);
      setContainerColor(color);
    });

    // Listen for plays-counter-image updates
    socket.on("plays-counter-image", (image) => {
      if (image) {
        setCounterImage(image);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("plays-container-color");
      socket.off("plays-counter-image");
      socket.disconnect();
    };
  }, []);

  return (
    <div 
      className={styles.playsCounterContainer}
      style={{ backgroundColor: containerColor }}
    >
      {counterImage && (
        <img className={styles.playsCounterImage} src={counterImage} alt="Plays Counter" />
      )}
      <span className={styles.playsCounterText}>
        <span className={styles.playsCounterTextNumber}>{count}</span>
        <br/>
        <span className={styles.playsCounterTextLabel}>
          {label}
        </span>
      </span>
    </div>
  );
}