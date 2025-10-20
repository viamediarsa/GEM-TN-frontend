import styles from "./styles.module.css";
import { useMemo, useState } from "react";
import bino from "../../assets/game_assets/bino.png";
import rocket from "../../assets/game_assets/rocket.png";
import play from "../../assets/game_assets/play.png";
import gamelogo from "../../assets/game_assets/gamelogo.png";

export default function FlipAnyTile() {
  const icons = useMemo(() => [bino, rocket, play, gamelogo], []);
  const [revealed, setRevealed] = useState(Array(9).fill(false));
  const [backIcon, setBackIcon] = useState(() => icons[0]);
  const [allRevealed, setAllRevealed] = useState(false);

  const handleTileClick = (idx) => {
    if (!allRevealed) {
      const picked = icons[(Math.random() * icons.length) | 0];
      setBackIcon(picked); // 100% match: all tiles use same icon
      setRevealed(Array(9).fill(true));
      setAllRevealed(true);
    } else {
      // Reset board on next click
      setRevealed(Array(9).fill(false));
      setAllRevealed(false);
    }
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
            className={`${styles.card} ${isRevealed ? styles.flipped : ""}`}
            onClick={() => handleTileClick(i)}
            aria-label={`Tile ${i + 1}`}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <div className={styles.frontLogo}>MTN</div>
                <div className={styles.frontText}>Flip by</div>
              </div>
              <div
                className={styles.cardBack}
                style={{ backgroundImage: `url(${backIcon})` }}
              ></div>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.actionsRow}>
        <button className={styles.primaryCta} onClick={() => setAllRevealed(true)}>
          <img src={bino} alt="Sneak Peak" className={styles.ctaIcon} />
          <span>Sneak Peak</span>
        </button>
        <button className={styles.secondaryCta} onClick={() => setAllRevealed(false)}>
          <img src={rocket} alt="Pick For Me" className={styles.ctaIcon} />
          <span>Pick For Me</span>
        </button>
      </div>
    </div>
  );
}