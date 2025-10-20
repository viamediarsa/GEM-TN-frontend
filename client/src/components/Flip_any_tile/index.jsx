import styles from "./styles.module.css";
import { useMemo, useState } from "react";
import bino from "../../assets/game_assets/bino.png";
import rocket from "../../assets/game_assets/rocket.png";
import play from "../../assets/game_assets/play.png";
import gamelogo from "../../assets/game_assets/gamelogo.png";
import gem from "../../assets/gem.png";

export default function FlipAnyTile() {
  const prizes = useMemo(() => [
    { type: 'data', amount: '100MB', text: 'DATA', icon: null },
    { type: 'gems', amount: 'x5', text: 'Gems', icon: gem },
    { type: 'gems', amount: 'x5', text: 'Gems', icon: gem },
    { type: 'gems', amount: 'x5', text: 'Gems', icon: gem },
    { type: 'gems', amount: 'x5', text: 'Gems', icon: gem },
    { type: 'data', amount: '1GB', text: 'DATA', subtext: 'Youtube', icon: null },
    { type: 'gems', amount: 'x5', text: 'Gems', icon: gem },
    { type: 'calls', amount: '50MIN', text: 'ALL NET', subtext: '3 Days', icon: null },
    { type: 'gems', amount: 'x5', text: 'Gems', icon: gem }
  ], []);
  
  const [revealed, setRevealed] = useState(Array(9).fill(false));
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [highlightedTile, setHighlightedTile] = useState(-1);
  const [celebratingTile, setCelebratingTile] = useState(-1);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [modalPrize, setModalPrize] = useState(null);
  const [animatingToModal, setAnimatingToModal] = useState(false);

  const handleTileClick = (idx) => {
    if (!revealed[idx] && !isAnimating) {
      // Start animation sequence without flipping the tile
      setAnimatingToModal(true);
      setCelebratingTile(idx);
      
      // Pick prize but don't reveal it yet
      const picked = prizes[idx];
      setSelectedPrize(picked);
      
      // After animation, flip tile and show modal
      setTimeout(() => {
        setRevealed(prev => {
          const newRevealed = [...prev];
          newRevealed[idx] = true;
          return newRevealed;
        });
        setModalPrize(picked);
        setShowPrizeModal(true);
        setCelebratingTile(-1);
        setAnimatingToModal(false);
      }, 1500);
    }
  };

  const handleSneakPeak = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    // Show all tiles
    setRevealed(Array(9).fill(true));
    
    // After 3 seconds, flip them back
    setTimeout(() => {
      setRevealed(Array(9).fill(false));
      setIsAnimating(false);
    }, 3000);
  };

  const handlePickForMe = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setHighlightedTile(-1);
    
    // Get unflipped tiles
    const unflippedTiles = revealed.map((isRevealed, idx) => !isRevealed ? idx : -1).filter(idx => idx !== -1);
    
    if (unflippedTiles.length === 0) {
      setIsAnimating(false);
      return;
    }
    
    // Animate through tiles with yellow border
    let currentIndex = 0;
    const interval = setInterval(() => {
      setHighlightedTile(unflippedTiles[currentIndex]);
      currentIndex++;
      
      if (currentIndex >= unflippedTiles.length) {
        clearInterval(interval);
        
        // Select final tile after a brief pause
        setTimeout(() => {
          const finalTile = unflippedTiles[Math.floor(Math.random() * unflippedTiles.length)];
          setHighlightedTile(finalTile);
          
          // Start animation sequence without flipping the tile
          const picked = prizes[finalTile];
          setSelectedPrize(picked);
          setAnimatingToModal(true);
          setCelebratingTile(finalTile);
          
          // Clear highlight after flip
          setTimeout(() => {
            setHighlightedTile(-1);
            setIsAnimating(false);
          }, 500);
          
          // After animation, flip tile and show modal
          setTimeout(() => {
            setRevealed(prev => {
              const newRevealed = [...prev];
              newRevealed[finalTile] = true;
              return newRevealed;
            });
            setModalPrize(picked);
            setShowPrizeModal(true);
            setCelebratingTile(-1);
            setAnimatingToModal(false);
          }, 1500);
        }, 300);
      }
    }, 150);
  };

  return (
    <div className={styles.flip_any_tile}>
      <div className={styles.headerRow}>
        <div className={styles.title}>Flip Any Tile</div>
        <div className={styles.playsBadge}>
          <div className={styles.badgeTop}>
            <img src={play} alt="play" className={styles.badgeIcon} />
            <span className={styles.badgeText}>5</span>
          </div>
          <div className={styles.badgeSub}>Play(s) Available</div>
        </div>
      </div>
      <div className={styles.subtitle}>
        Tap tiles to reveal prizes, then click again to reset
      </div>

      <div className={styles.grid}>
        {revealed.map((isRevealed, i) => (
          <button
            key={i}
            className={`${styles.card} ${isRevealed ? styles.flipped : ""} ${highlightedTile === i ? styles.highlighted : ""} ${celebratingTile === i ? styles.celebrating : ""}`}
            onClick={() => handleTileClick(i)}
            aria-label={`Tile ${i + 1}`}
            style={highlightedTile === i ? { border: '3px solid yellow' } : {}}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <div className={styles.frontLogo}>MTN</div>
                <div className={styles.frontText}>Flip by</div>
              </div>
              <div className={styles.cardBack}>
                {prizes[i].icon && (
                  <img src={prizes[i].icon} alt="Prize" className={styles.prizeIcon} />
                )}
                <div className={styles.prizeAmount}>{prizes[i].amount}</div>
                <div className={styles.prizeText}>{prizes[i].text}</div>
                {prizes[i].subtext && (
                  <>
                    <div className={styles.prizeDivider}></div>
                    <div className={styles.prizeSubtext}>{prizes[i].subtext}</div>
                  </>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.actionsRow}>
        <button className={styles.primaryCta} onClick={handleSneakPeak}>
          <img src={bino} alt="Sneak Peak" className={styles.ctaIcon} />
          <span>Sneak Peak</span>
        </button>
        <button className={styles.secondaryCta} onClick={handlePickForMe}>
          <img src={rocket} alt="Pick For Me" className={styles.ctaIcon} />
          <span>Pick For Me</span>
        </button>
      </div>

      {/* Prize Modal */}
      {showPrizeModal && (
        <div className={styles.modalOverlay}>
          <button 
            className={styles.closeButton}
            onClick={() => {
              setShowPrizeModal(false);
              // Reset all tiles to unflipped state
              setRevealed(Array(9).fill(false));
              setSelectedPrize(null);
              setModalPrize(null);
            }}
          >
            ×
          </button>
          <div className={styles.modalContent}>
            <div className={styles.prizeDisplay}>
              {modalPrize.icon && (
                <img src={modalPrize.icon} alt="Prize" className={styles.prizeImage} />
              )}
              <h3 className={styles.prizeTitle}>Congratulations!</h3>
              <div className={styles.modalPrizeAmount}>{modalPrize.amount}</div>
              <div className={styles.modalPrizeText}>{modalPrize.text}</div>
              {modalPrize.subtext && (
                <div className={styles.modalPrizeSubtext}>{modalPrize.subtext}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}