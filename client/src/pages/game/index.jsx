import styles from "./styles.module.css";
import Navbar from "../../components/navbar";
import LoadIn from "../../components/loadIn";
import { useState, useEffect } from "react";

export default function Game() {
  // Game state management
  const [playerGems, setPlayerGems] = useState(12); // Starting gems
  const [dailyPlays, setDailyPlays] = useState(0);
  const [maxDailyPlays] = useState(5);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [maxWeeklyProgress] = useState(7);
  
  // Game board state
  const [gameBoard, setGameBoard] = useState([]);
  const [flippedBlocks, setFlippedBlocks] = useState(new Set());
  const [gameStarted, setGameStarted] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [wonPrize, setWonPrize] = useState("");
  
  // Pre-game options
  const [showPreGameOptions, setShowPreGameOptions] = useState(true);
  const [tilesSwapped, setTilesSwapped] = useState(0);
  const [maxSwaps] = useState(3);
  const [swapCost] = useState(5); // gems per swap after free ones

  const prizes = [
    "10 Gems",
    "25 Gems",
    "5 Gems",
    "50 Gems",
    "JACKPOT!",
    "15 Gems",
    "30 Gems",
    "100 Gems",
    "20 Gems",
  ];

  // Initialize game board
  useEffect(() => {
    generateNewBoard();
  }, []);

  const generateNewBoard = () => {
    const shuffledPrizes = [...prizes].sort(() => Math.random() - 0.5);
    setGameBoard(shuffledPrizes);
  };

  const handleSwapTile = (index) => {
    if (tilesSwapped >= maxSwaps) return;
    
    // First click: flip to reveal the prize
    if (!flippedBlocks.has(index)) {
      setFlippedBlocks(prev => new Set([...prev, index]));
      return;
    }
    
    // Second click: swap the tile
    const cost = tilesSwapped < 1 ? 0 : swapCost; // First swap is free
    if (cost > 0 && playerGems < cost) return;
    
    // Generate new prize for this tile
    const newPrize = prizes[Math.floor(Math.random() * prizes.length)];
    setGameBoard(prev => {
      const newBoard = [...prev];
      newBoard[index] = newPrize;
      return newBoard;
    });
    
    setTilesSwapped(prev => prev + 1);
    if (cost > 0) {
      setPlayerGems(prev => prev - cost);
    }
  };

  const handlePurchasePlay = () => {
    const playCost = 10; // gems per additional play
    if (dailyPlays >= maxDailyPlays || playerGems < playCost) return;
    
    setPlayerGems(prev => prev - playCost);
    setDailyPlays(prev => prev + 1);
  };

  const startGame = () => {
    setShowPreGameOptions(false);
    setGameStarted(true);
  };

  const handleBlockClick = (index) => {
    if (!gameStarted) return;
    
    setFlippedBlocks((prev) => new Set([...prev, index]));

    // Show prize notification
    setWonPrize(gameBoard[index]);
    setShowPrize(true);
    
    // Add gems if prize contains gems
    const gemMatch = gameBoard[index].match(/(\d+)\s*Gems?/);
    if (gemMatch) {
      const gemAmount = parseInt(gemMatch[1]);
      setPlayerGems(prev => prev + gemAmount);
    }
    
    // Update weekly progress
    setWeeklyProgress(prev => Math.min(prev + 1, maxWeeklyProgress));
  };

  const resetGame = () => {
    setFlippedBlocks(new Set());
    setGameStarted(false);
    setShowPrize(false);
    setWonPrize("");
    setShowPreGameOptions(true);
    setTilesSwapped(0);
    generateNewBoard();
  };

  const closePrizeNotification = () => {
    setShowPrize(false);
  };

  const canPlay = dailyPlays < maxDailyPlays;
  const canSwap = tilesSwapped < maxSwaps;
  const swapCostForNext = tilesSwapped < 1 ? 0 : swapCost;

  return (
    <>
      <Navbar />
      <div className={styles.gameContainer}>

        {/* Pre-Game Options */}
        {showPreGameOptions && (
          
            <div className={styles.optionsContainer}>
              <div className={styles.swapSection}>
                <h3>Swap Tiles ({tilesSwapped}/{maxSwaps})</h3>
                <p>Click tiles to reveal prizes, then click again to swap them</p>
                <div className={styles.gameGrid}>
                  {gameBoard.map((prize, index) => (
                    <div
                      key={index}
                      className={`${styles.gameBlock} ${styles.swappable} ${
                        flippedBlocks.has(index) ? styles.flipped : ""
                      }`}
                      onClick={() => handleSwapTile(index)}
                    >
                      <div className={styles.blockFront}>
                        <span></span>
                      </div>
                      <div className={styles.blockBack}>
                        <span className={prize === "JACKPOT!" ? styles.jackpot : ""}>
                          {prize}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className={styles.swapInfo}>
                  {canSwap ? (
                    tilesSwapped < 1 ? 
                      "First swap is FREE!" : 
                      `Next swap costs ${swapCostForNext} gems`
                  ) : (
                    "No more swaps available"
                  )}
                </p>
              </div>
              
            </div>
         
        )}

        {/* Main Game */}
        {!showPreGameOptions && (
          <>
            <div className={styles.gameHeader}>
              <p>Click on blocks to reveal your prizes!</p>
            </div>

            <div className={styles.gameGrid}>
              {gameBoard.map((prize, index) => (
                <div
                  key={index}
                  className={`${styles.gameBlock} ${
                    flippedBlocks.has(index) ? styles.flipped : ""
                  }`}
                  onClick={() => handleBlockClick(index)}
                >
                  <div className={styles.blockFront}>
                    <span></span>
                  </div>
                  <div className={styles.blockBack}>
                    <span className={prize === "JACKPOT!" ? styles.jackpot : ""}>
                      {prize}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className={styles.gameControls}>
          <button className={styles.resetButton} onClick={resetGame}>
            {showPreGameOptions ? "New Game" : "Reset Game"}
          </button>
        </div>
      </div>

      <LoadIn
        isVisible={showPrize}
        prize={wonPrize}
        onClose={closePrizeNotification}
      />
    </>
  );
}
