import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import http from "../../../http.js";
import styles from "./styles.module.css";
import playIcon from "../../assets/game_assets/play.png";
import binoIcon from "../../assets/game_assets/bino.png";
import rocketIcon from "../../assets/game_assets/rocket.png";

export default function FlipTileGame() {
  const [color, setColor] = useState("#ffffff");
  const [tileColor, setTileColor] = useState("#ffffff"); 
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [flippedTiles, setFlippedTiles] = useState(new Set());
  const [playsAvailable, setPlaysAvailable] = useState(5);
  const [sneakPeakActive, setSneakPeakActive] = useState(false);

  useEffect(() => {
    console.log("🔌 Connecting to:", http.defaults.baseURL);
    const socket = io(http.defaults.baseURL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setConnectionStatus("Connected");
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setConnectionStatus("Disconnected");
    });

    socket.on("connect_error", (error) => {
      console.log("❌ Connection error:", error);
      setConnectionStatus("Connection Error");
    });

    // Listen for main color
    socket.on("color", (newColor) => {
      console.log("🎨 Received main color:", newColor);
      setColor(newColor);
      setTileColor(newColor); // Also update tile color
    });

    // Listen for tile color
    socket.on("tile-color", (newTileColor) => {
      console.log("🎨 Received tile color:", newTileColor);
      setTileColor(newTileColor);
    });

    return () => {
      console.log("🧹 Cleaning up socket connection");
      socket.disconnect();
    };
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