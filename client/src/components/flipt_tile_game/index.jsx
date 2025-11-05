import { useEffect, useState, useRef } from "react";
import http from "../../../http.js";
import { getUserData } from "../../services/userService";
import styles from "./styles.module.css";
import playIcon from "../../assets/game_assets/play.png";
import binoIcon from "../../assets/game_assets/bino.png";
import rocketIcon from "../../assets/game_assets/rocket.png";

export default function FlipTileGame() {
  const [color, setColor] = useState("#ffffff");
  const [tileColor, setTileColor] = useState("#ffffff"); 
  const [flippedTiles, setFlippedTiles] = useState(new Set());
  const [playsAvailable, setPlaysAvailable] = useState(0);
  const [sneakPeakActive, setSneakPeakActive] = useState(false);
  const colorFailureCountRef = useRef(0);
  const colorIntervalRef = useRef(null);

  useEffect(() => {
    // Fetch play balance data
    const fetchPlayBalance = async () => {
      try {
        const userData = await getUserData('27768399103', {
          play_balance: true
        });
        console.log('📊 FlipTileGame - User data response:', userData);
        
        // Set plays available from API response
        if (userData?.play_balance !== undefined) {
          setPlaysAvailable(userData.play_balance);
        }
      } catch (error) {
        console.error('❌ FlipTileGame - Error fetching user data:', error);
      }
    };

    fetchPlayBalance();

    const MAX_FAILURES = 3;

    // Fetch main color function (flip-tile-color is POST only, so we use main color endpoint)
    const fetchColor = async () => {
      // Stop if we've exceeded max failures
      if (colorFailureCountRef.current >= MAX_FAILURES) {
        if (colorIntervalRef.current) {
          clearInterval(colorIntervalRef.current);
          colorIntervalRef.current = null;
        }
        return;
      }

      try {
        const res = await http.get("/api/frontend/color");
        const data = res?.data || {};
        const current = data.currentColor || "#ffffff";
        colorFailureCountRef.current = 0; // Reset on success
        setColor(prev => {
          if (prev !== current) {
            console.log("🎨 Flip tile game color updated:", current);
            setTileColor(current); // Also update tile color
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
          console.warn("Flip tile game color fetch failed (attempt " + colorFailureCountRef.current + "/" + MAX_FAILURES + "):", err?.message || err);
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

    // Initial fetch
    fetchColor();

    // Poll for color updates every 10 minutes (flip-tile-color is POST only, so we only poll main color)
    colorIntervalRef.current = setInterval(fetchColor, 600000);

    return () => {
      if (colorIntervalRef.current) {
        clearInterval(colorIntervalRef.current);
        colorIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTileClick = (tileIndex) => {
    if (playsAvailable > 0 && !sneakPeakActive) {
      setFlippedTiles(prev => {
        const newFlipped = new Set(prev);
        if (newFlipped.has(tileIndex)) {
          newFlipped.delete(tileIndex);
        } else {
          newFlipped.add(tileIndex);
        }
        return newFlipped;
      });
      setPlaysAvailable(prev => prev - 1);
    }
  };

  const handleSneakPeak = () => {
    if (sneakPeakActive) return; // Prevent multiple sneak peeks
    
    console.log("Sneak Peak clicked");
    setSneakPeakActive(true);
    
    // Flip all 9 tiles
    setFlippedTiles(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]));
    
    // After 3 seconds, flip them back
    setTimeout(() => {
      setFlippedTiles(new Set());
      setSneakPeakActive(false);
    }, 3000);
  };

  const handlePickForMe = () => {
    if (playsAvailable > 0 && !sneakPeakActive) {
      console.log("Pick For Me clicked");
      
      // Get all unflipped tiles
      const unflippedTiles = [];
      for (let i = 0; i < 9; i++) {
        if (!flippedTiles.has(i)) {
          unflippedTiles.push(i);
        }
      }
      
      // If there are unflipped tiles, randomly select one
      if (unflippedTiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * unflippedTiles.length);
        const selectedTile = unflippedTiles[randomIndex];
        
        // Flip the selected tile
        setFlippedTiles(prev => new Set([...prev, selectedTile]));
        setPlaysAvailable(prev => prev - 1);
        
        console.log(`Randomly selected tile: ${selectedTile}`);
      } else {
        console.log("All tiles are already flipped");
      }
    }
  };

  return (
    <>
      <div
        id="flip-tile-game"
        className={styles.flipTileGameCard}
        style={{
          backgroundColor: tileColor,
        }}
      >
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Flip Any Tile</h1>
            <p className={styles.instructions}>Tap tiles to reveal prizes, then click again to swap them</p>
          </div>
          <div className={styles.playCounter}>
            <div className={styles.playButton}>
              <div className={styles.playButtonContent}>
              <img src={playIcon} alt="Play" className={styles.playIcon} />
              <span className={styles.playNumber}>{playsAvailable}</span>
              </div>
              <div className={styles.playText}>Play(s) Available</div>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className={styles.gameGrid}>
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className={`${styles.tile} ${flippedTiles.has(index) ? styles.flipped : ''}`}
              onClick={() => handleTileClick(index)}
            >
              <div className={styles.tileFront}>
              </div>
              <div className={styles.tileBack}>
                <span className={styles.prizeText}>Prize!</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Buttons */}
        <div className={styles.bottomButtons}>
          <button 
            className={`${styles.sneakPeakButton} ${sneakPeakActive ? styles.disabled : ''}`} 
            onClick={handleSneakPeak}
            disabled={sneakPeakActive}
          >
            <img src={binoIcon} alt="Sneak Peak" className={styles.buttonIcon} />
            <span>{sneakPeakActive ? 'Peeking...' : 'Sneak Peak'}</span>
          </button>
          <button 
            className={`${styles.pickForMeButton} ${(playsAvailable === 0 || sneakPeakActive) ? styles.disabled : ''}`} 
            onClick={handlePickForMe}
            disabled={playsAvailable === 0 || sneakPeakActive}
          >
            <img src={rocketIcon} alt="Pick For Me" className={styles.buttonIcon} />
            <span>Pick For Me</span>
          </button>
        </div>
      </div>  
    </>
  );
}