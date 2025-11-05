import { useEffect, useState, useRef } from "react";
import http from "../../../http.js";
import { getUserData } from "../../services/userService";
import styles from "./styles.module.css";

export default function GemStore() {
  const [gemStoreColor, setGemStoreColor] = useState("#ffffff");
  const [voucherCurrentSlide, setVoucherCurrentSlide] = useState(0);
  const [dataCurrentSlide, setDataCurrentSlide] = useState(0);
  const voucherCarouselRef = useRef(null);
  const dataCarouselRef = useRef(null);
  const failureCountRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Fetch gems data
    const fetchGemsData = async () => {
      try {
        const userData = await getUserData('27768399103', {
          gems: true
        });
        console.log('📊 GemStore - User data response:', userData);
      } catch (error) {
        console.error('❌ GemStore - Error fetching user data:', error);
      }
    };

    fetchGemsData();

    const MAX_FAILURES = 3;

    // Fetch color function
    const fetchColor = async () => {
      // Stop if we've exceeded max failures
      if (failureCountRef.current >= MAX_FAILURES) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      try {
        const res = await http.get("/api/frontend/gem-store-color");
        const data = res?.data || {};
        const current = data.currentGemStoreColor || data.currentColor || "#ffffff";
        failureCountRef.current = 0; // Reset on success
        setGemStoreColor(prev => {
          if (prev !== current) {
            console.log("🎨 Gem store color updated:", current);
            return current;
          }
          return prev;
        });
      } catch (err) {
        // If 404, endpoint doesn't exist - stop immediately without logging
        if (err?.response?.status === 404) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return;
        }
        
        failureCountRef.current++;
        if (failureCountRef.current <= MAX_FAILURES) {
          console.warn("Gem store color fetch failed (attempt " + failureCountRef.current + "/" + MAX_FAILURES + "):", err?.message || err);
        }
        // Stop polling after max failures
        if (failureCountRef.current >= MAX_FAILURES) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      }
    };

    // Initial fetch
    fetchColor();

    // Poll for color updates every 10 minutes
    intervalRef.current = setInterval(fetchColor, 600000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseDown = (e, carouselRef) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const startX = e.pageX - carousel.offsetLeft;
    const scrollLeft = carousel.scrollLeft;

    const handleMouseMove = (e) => {
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e, carouselRef) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const startX = e.touches[0].pageX - carousel.offsetLeft;
    const scrollLeft = carousel.scrollLeft;

    const handleTouchMove = (e) => {
      e.preventDefault();
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const scrollToSlide = (carouselRef, slideIndex, setCurrentSlide) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    console.log('Scrolling to slide:', slideIndex); // Debug log
    
    const cardWidth = 130; // card width
    const gap = 20; // gap between cards
    const slideWidth = cardWidth + gap;
    const scrollPosition = slideIndex * slideWidth;
    
    console.log('Scroll position:', scrollPosition); // Debug log
    
    carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    setCurrentSlide(slideIndex);
  };

  return (
    <>
      <div
        id="gem-store"
        className={styles.gemStoreCard}
        style={{
          backgroundColor: gemStoreColor,
        }}
      >
        <h1 className={styles.title}>Gem Store</h1>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Vouchers</h2>
          <div 
            className={styles.carousel}
            ref={voucherCarouselRef}
            onMouseDown={(e) => handleMouseDown(e, voucherCarouselRef)}
            onTouchStart={(e) => handleTouchStart(e, voucherCarouselRef)}
          >
            <div className={styles.card}>Voucher 1</div>
            <div className={styles.card}>Voucher 2</div>
            <div className={styles.card}>Voucher 3</div>
            <div className={styles.card}>Voucher 4</div>
            <div className={styles.card}>Voucher 5</div>
          </div>
          <div className={styles.dots}>
            <div 
              className={`${styles.dot} ${voucherCurrentSlide === 0 ? styles.active : ''}`}
              onClick={() => {
                console.log('Dot 0 clicked'); // Debug log
                scrollToSlide(voucherCarouselRef, 0, setVoucherCurrentSlide);
              }}
            ></div>
            <div 
              className={`${styles.dot} ${voucherCurrentSlide === 1 ? styles.active : ''}`}
              onClick={() => scrollToSlide(voucherCarouselRef, 1, setVoucherCurrentSlide)}
            ></div>
            <div 
              className={`${styles.dot} ${voucherCurrentSlide === 2 ? styles.active : ''}`}
              onClick={() => scrollToSlide(voucherCarouselRef, 2, setVoucherCurrentSlide)}
            ></div>
            <div 
              className={`${styles.dot} ${voucherCurrentSlide === 3 ? styles.active : ''}`}
              onClick={() => scrollToSlide(voucherCarouselRef, 3, setVoucherCurrentSlide)}
            ></div>
            <div 
              className={`${styles.dot} ${voucherCurrentSlide === 4 ? styles.active : ''}`}
              onClick={() => scrollToSlide(voucherCarouselRef, 4, setVoucherCurrentSlide)}
            ></div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Bundles</h2>
          <div 
            className={styles.carousel}
            ref={dataCarouselRef}
            onMouseDown={(e) => handleMouseDown(e, dataCarouselRef)}
            onTouchStart={(e) => handleTouchStart(e, dataCarouselRef)}
          >
            <div className={styles.card}>Data Bundle 1</div>
            <div className={styles.card}>Data Bundle 2</div>
            <div className={styles.card}>Data Bundle 3</div>
            <div className={styles.card}>Data Bundle 4</div>
            <div className={styles.card}>Data Bundle 5</div>
          </div>
          <div className={styles.dots}>
            <div 
              className={`${styles.dot} ${dataCurrentSlide === 0 ? styles.active : ''}`}
              onClick={() => scrollToSlide(dataCarouselRef, 0, setDataCurrentSlide)}
            ></div>
            <div 
              className={`${styles.dot} ${dataCurrentSlide === 1 ? styles.active : ''}`}
              onClick={() => scrollToSlide(dataCarouselRef, 1, setDataCurrentSlide)}
            ></div>
            <div 
              className={`${styles.dot} ${dataCurrentSlide === 2 ? styles.active : ''}`}
              onClick={() => scrollToSlide(dataCarouselRef, 2, setDataCurrentSlide)}
            ></div>
            <div 
              className={`${styles.dot} ${dataCurrentSlide === 3 ? styles.active : ''}`}
              onClick={() => scrollToSlide(dataCarouselRef, 3, setDataCurrentSlide)}
            ></div>
            <div 
              className={`${styles.dot} ${dataCurrentSlide === 4 ? styles.active : ''}`}
              onClick={() => scrollToSlide(dataCarouselRef, 4, setDataCurrentSlide)}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}