import styles from "./styles.module.css";
import Navbar from "../../components/navbar";
import gem from "../../assets/gem.png";

export default function Earn() {
    return (
        <>
            <Navbar />
            <div className={styles.earnPage}>  
                <div className={styles.earnContent}>
                    <div className={styles.earnSection}>
                        <h2>Play Games</h2>
                        <p>Complete daily game challenges and win gems! The more you play, the more gems you earn.</p>
                    </div>
                    
                    <div className={styles.earnSection}>
                        <h2>Buy Airtime</h2>
                        <p>Purchase airtime bundles to get game plays:</p>
                        <ul>
                            <li>R50 airtime = 10 game plays = 100 gems</li>
                            <li>R100 airtime = 25 game plays = 250 gems</li>
                        </ul>
                    </div>
                    
                    <div className={styles.earnSection}>
                        <h2>Use Gems in Store</h2>
                        <p>Spend your earned gems in the gem store to buy:</p>
                        <ul>
                            <li>More airtime</li>
                            <li>Game bonuses</li>
                            <li>Special rewards</li>
                            <li>Premium features</li>
                        </ul>
                    </div>
                    
                    <div className={styles.earnSection}>
                        <h2>Refer Friends</h2>
                        <p>Invite friends to join and earn bonus gems when they sign up and start playing!</p>
                    </div>
                </div>
            </div>
        </>
    )
}