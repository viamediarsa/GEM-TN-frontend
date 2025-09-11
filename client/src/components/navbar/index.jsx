import styles from "./styles.module.css";
import logo from "../../assets/gem.png";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/earn':
        return 'Earn Gems';
      case '/store':
        return 'Gem Store';
      case '/game':
        return 'Game';
      case '/rewards':
        return 'Rewards';
      case '/history':
        return 'MTN Vault';
      default:
        return 'Mtn Gem';
    }
  };

  const showBackArrow = location.pathname !== '/' && location.pathname !== '/dashboard';

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navbarHeader}>
          {showBackArrow && (
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <h1 className={styles.navbarHeaderText}>{getPageTitle()}</h1>
        
        </div>
        <div className={styles.navbarLogo}>
          <img className={styles.navbarLogoImage} src={logo} alt="logo" />
          <span className={styles.navbarLogoNumber}>12</span>
        </div>
      </div>
    </>
  );
}
