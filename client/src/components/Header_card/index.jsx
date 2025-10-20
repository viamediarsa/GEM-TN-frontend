import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import HeaderImage from "../../assets/logo.png";
import Gems from "../../assets/Gems.png";

export default function HeaderCard() {
  const carouselRef = useRef(null);
  const stickyRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [stickyHeight, setStickyHeight] = useState(0);
  const spacerRef = useRef(null);
  const rafIdRef = useRef(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onMouseDown = (e) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    carouselRef.current.setAttribute("aria-grabbed", "true");
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const endDrag = () => {
    if (!carouselRef.current) return;
    isDraggingRef.current = false;
    carouselRef.current.setAttribute("aria-grabbed", "false");
  };

  const onMouseMove = (e) => {
    if (!carouselRef.current || !isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = x - startXRef.current;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onTouchStart = (e) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    carouselRef.current.setAttribute("aria-grabbed", "true");
    startXRef.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const onTouchMove = (e) => {
    if (!carouselRef.current || !isDraggingRef.current) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = x - startXRef.current;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onTouchEnd = () => {
    endDrag();
  };

  useEffect(() => {
    const collapseThreshold = 40; // px down before collapsing
    const expandThreshold = 8; // px from top before expanding

    const handleScroll = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        const y = window.scrollY || window.pageYOffset || 0;
        const shouldCollapse = isScrolled ? y > expandThreshold : y > collapseThreshold;
        const next = shouldCollapse;
        if (next !== isScrolled) setIsScrolled(next);
      });
    };
    const measure = () => {
      if (stickyRef.current) {
        const h = stickyRef.current.offsetHeight || 0;
        setStickyHeight(h);
        if (spacerRef.current) {
          spacerRef.current.style.height = h + "px";
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measure);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isScrolled]);

  // Re-measure header height whenever collapsed state changes to keep spacer in sync
  useEffect(() => {
    if (!stickyRef.current || !spacerRef.current) return;
    const h = stickyRef.current.offsetHeight || 0;
    setStickyHeight(h);
    spacerRef.current.style.height = h + "px";
  }, [isScrolled]);

  return (
    <div className={styles.header_card}>
      <div ref={stickyRef} className={`${styles.StickyHeader} ${isScrolled ? styles.StickyCollapsed : ""}`}>
        <div className={styles.HeaderImageContainer}>
        <img
          className={styles.HederImage}
          src={HeaderImage}
          alt="Header Image"
        />
        </div>
        <div className={styles.HeaderTextContainer}>
        <div className={styles.HeaderTextLeft}>
          <div className={styles.HeaderTextLeftTop}>
            <h1 className={styles.HeaderHeaderText}>Good Morning,</h1>
          </div>
          <div className={styles.HeaderTextLeftBottom}>
            <h1 className={styles.HeaderSubText}>John</h1>
          </div>
        </div>
        <div className={styles.HeaderImageRight}>
          <div className={styles.GemDiv}>
            <img src={Gems} className={styles.GemImage} />
          </div>
        </div>
        </div>
        {/* Weekly progress is inside header so it feels part of the card when at top */}
        <div className={`${styles.WeeklyProgress} ${isScrolled ? styles.HiddenOnScroll : ""}`}>
          <div className={styles.WeeklyProgressText}>Weekly Progress</div>
        </div>
        <div className={`${styles.WeeklyProgressContainer} ${isScrolled ? styles.HiddenOnScroll : ""}`}>
          {/* carousel */}
          <div
            className={styles.Carousel}
            ref={carouselRef}
            onMouseDown={onMouseDown}
            onMouseLeave={endDrag}
            onMouseUp={endDrag}
            onMouseMove={onMouseMove}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            aria-grabbed="false"
          >
            <div className={styles.CarouselItem}></div>
            <div className={styles.CarouselItem}></div>
            <div className={styles.CarouselItem}></div>
            <div className={styles.CarouselItem}></div>
            <div className={styles.CarouselItem}></div>
            <div className={styles.CarouselItem}></div>
            <div className={styles.CarouselItem}></div>
          </div>
        </div>
      </div>
      {/* spacer to offset fixed header height (animated via CSS) */}
      <div ref={spacerRef} className={styles.HeaderSpacer} style={{ height: stickyHeight }}></div>
    </div>
  );
}
