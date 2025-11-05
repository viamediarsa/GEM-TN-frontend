import { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";
import http from "../../../http.js";
import { getUserData } from "../../services/userService";


export default function PlayCounter({ count = 100, label = "today" }) {
  const [containerColor, setContainerColor] = useState("#ffffff");
  const [counterImage, setCounterImage] = useState(null);
  const colorFailureCountRef = useRef(0);
  const imageFailureCountRef = useRef(0);
  const colorIntervalRef = useRef(null);
  const imageIntervalRef = useRef(null);

   // Fetch initial image from API and play balance
  useEffect(() => {
    // Fetch play balance data
    const fetchPlayBalance = async () => {
      try {
        const userData = await getUserData('27768399103', {
          play_balance: true
        });
        console.log('📊 PlayCounter - User data response:', userData);
      } catch (error) {
        console.error('❌ PlayCounter - Error fetching user data:', error);
      }
    };

    fetchPlayBalance();

    const MAX_FAILURES = 3;

    // Fetch container color function
    const fetchContainerColor = async () => {
      // Stop if we've exceeded max failures
      if (colorFailureCountRef.current >= MAX_FAILURES) {
        if (colorIntervalRef.current) {
          clearInterval(colorIntervalRef.current);
          colorIntervalRef.current = null;
        }
        return;
      }

      try {
        const res = await http.get('/api/frontend/plays-container-color');
        const data = res?.data || {};
        const current = data.currentPlaysContainerColor || data.currentColor || "#ffffff";
        colorFailureCountRef.current = 0; // Reset on success
        setContainerColor(prev => {
          if (prev !== current) {
            console.log("🎨 Plays container color updated:", current);
            return current;
          }
          return prev;
        });
      } catch (err) {
        // If 404, endpoint doesn't exist - stop immediately without logging
        if (err?.response?.status === 404) {
          if (colorIntervalRef.current) {
            clearInterval(colorIntervalRef.current);
            colorIntervalRef.current = null;
          }
          return;
        }
        
        colorFailureCountRef.current++;
        if (colorFailureCountRef.current <= MAX_FAILURES) {
          console.warn("Plays container color fetch failed (attempt " + colorFailureCountRef.current + "/" + MAX_FAILURES + "):", err?.message || err);
        }
        // Stop polling after max failures
        if (colorFailureCountRef.current >= MAX_FAILURES) {
          if (colorIntervalRef.current) {
            clearInterval(colorIntervalRef.current);
            colorIntervalRef.current = null;
          }
        }
      }
    };

    // Fetch counter image function
    const fetchCounterImage = async () => {
      // Stop if we've exceeded max failures
      if (imageFailureCountRef.current >= MAX_FAILURES) {
        if (imageIntervalRef.current) {
          clearInterval(imageIntervalRef.current);
          imageIntervalRef.current = null;
        }
        return;
      }

      try {
        const response = await http.get('/api/frontend/plays-counter-image');
        if (response.data && response.data.currentPlaysCounterImage) {
          const image = response.data.currentPlaysCounterImage;
          imageFailureCountRef.current = 0; // Reset on success
          setCounterImage(prev => {
            if (prev !== image) {
              console.log("🖼️ Plays counter image updated");
              return image;
            }
            return prev;
          });
        }
      } catch (error) {
        // If 404, endpoint doesn't exist - stop immediately without logging
        if (error?.response?.status === 404) {
          if (imageIntervalRef.current) {
            clearInterval(imageIntervalRef.current);
            imageIntervalRef.current = null;
          }
          return;
        }
        
        imageFailureCountRef.current++;
        // Stop polling after max failures
        if (imageFailureCountRef.current >= MAX_FAILURES) {
          if (imageIntervalRef.current) {
            clearInterval(imageIntervalRef.current);
            imageIntervalRef.current = null;
          }
        }
      }
    };

    // Initial fetch
    fetchContainerColor();
    fetchCounterImage();

    // Poll for updates every 10 minutes
    colorIntervalRef.current = setInterval(fetchContainerColor, 600000);
    imageIntervalRef.current = setInterval(fetchCounterImage, 600000);

    // Cleanup on unmount
    return () => {
      if (colorIntervalRef.current) {
        clearInterval(colorIntervalRef.current);
        colorIntervalRef.current = null;
      }
      if (imageIntervalRef.current) {
        clearInterval(imageIntervalRef.current);
        imageIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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