import HeaderCard from "../../components/header_card";
import styles from "./styles.module.css"; 
import FlipTileGame from "../../components/flipt_tile_game";
import GemStore from "../../components/gem_store";
import RewardsHistory from "../../components/rewards_history";
import Navbar from "../../components/navbar";
import DailyChallenges from "../../components/daily_challenges";

export default function Dashboard() {


  return (
    <>
    <div className={styles.dashboard}>
  
    <HeaderCard />
    <FlipTileGame />
    <DailyChallenges />
    <GemStore />
    <RewardsHistory />
    <Navbar /> 
    </div>
    </>
  );
}