import styles from "./styles.module.css";
import HeaderCard from "../../components/Header_card";
import FlipAnyTile from "../../components/Flip_any_tile";
import GemStore from "../../components/Gem_store";
import Footer from "../../components/footer";

export default function Dashboard() {
  return (
    <>
      <HeaderCard />
      <FlipAnyTile />
      <GemStore />


      <Footer/>
    </>
  );
}
