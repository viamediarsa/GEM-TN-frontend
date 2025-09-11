import Navbar from "../../components/navbar";
import styles from "./styles.module.css";
import Footer from "../../components/footer";

export default function Rewards() {
    const rewardsData = [
        { reward: "50 Gems", date: "2024-01-15" },
        { reward: "1GB Data Bundle", date: "2024-01-12" },
        { reward: "100 Gems", date: "2024-01-10" },
        { reward: "20% Discount Voucher", date: "2024-01-08" },
        { reward: "25 Gems", date: "2024-01-05" },
        { reward: "500MB Data Bundle", date: "2024-01-03" },
        { reward: "75 Gems", date: "2024-01-01" },
        { reward: "15% Discount Voucher", date: "2023-12-28" },
       
        
    ];

    return (
       <>
        <Navbar />
        <div className={styles.history}>
            <div className={styles.rewards}>
                <div className={styles.rewardsList}>
                    {rewardsData.map((item, index) => (
                        <div key={index}>
                            <div className={styles.rewardItem}>
                                <span className={styles.rewardName}>{item.reward}</span>
                                <span className={styles.rewardDate}>{item.date}</span>
                            </div>
                            {index < rewardsData.length - 1 && <div className={styles.line}></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <Footer />
        </>
    )
}