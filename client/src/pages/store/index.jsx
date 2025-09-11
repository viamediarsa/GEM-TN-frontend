import Navbar from "../../components/navbar";
import styles from "./styles.module.css";
import { useState, useRef } from "react";
import Footer from "../../components/footer";

export default function Store() {
    const [playerGems, setPlayerGems] = useState(12);
    const voucherCarouselRef = useRef(null);
    const dataCarouselRef = useRef(null);
    
    // Drag/swipe state
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    
    const restaurantVouchers = [
        { name: "KFC 20% Off", description: "Valid for any meal", cost: 25 },
        { name: "McDonald's 15% Off", description: "Valid for burgers", cost: 20 },
        { name: "Pizza Hut 25% Off", description: "Valid for pizzas", cost: 30 },
        { name: "Nando's 30% Off", description: "Valid for chicken", cost: 35 },
        { name: "Spur 20% Off", description: "Valid for steaks", cost: 25 },
        { name: "Wimpy 15% Off", description: "Valid for breakfast", cost: 20 },
        { name: "Debonairs 25% Off", description: "Valid for pizzas", cost: 30 },
        { name: "Steers 20% Off", description: "Valid for burgers", cost: 25 }
    ];
    
    const dataBundles = [
        { name: "1GB Data", description: "Valid for 30 days", cost: 50 },
        { name: "2GB Data", description: "Valid for 30 days", cost: 90 },
        { name: "5GB Data", description: "Valid for 30 days", cost: 200 },
        { name: "10GB Data", description: "Valid for 30 days", cost: 350 },
        { name: "20GB Data", description: "Valid for 30 days", cost: 600 },
        { name: "50GB Data", description: "Valid for 30 days", cost: 1200 },
        { name: "100GB Data", description: "Valid for 30 days", cost: 2000 },
        { name: "Unlimited Data", description: "Valid for 7 days", cost: 500 }
    ];
    
    const handlePurchase = (itemName, cost) => {
        if (playerGems >= cost) {
            setPlayerGems(prev => prev - cost);
            alert(`Purchased ${itemName} for ${cost} gems!`);
        } else {
            alert("Not enough gems!");
        }
    };
    
    // Touch handlers
    const handleTouchStart = (e, type) => {
        const container = type === 'voucher' ? voucherCarouselRef.current : dataCarouselRef.current;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - container.offsetLeft);
        setScrollLeft(container.scrollLeft);
    };

    const handleTouchMove = (e, type) => {
        if (!isDragging) return;
        e.preventDefault();
        const container = type === 'voucher' ? voucherCarouselRef.current : dataCarouselRef.current;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = (e, type) => {
        setIsDragging(false);
    };

    // Mouse handlers
    const handleMouseDown = (e, type) => {
        const container = type === 'voucher' ? voucherCarouselRef.current : dataCarouselRef.current;
        setIsDragging(true);
        setStartX(e.pageX - container.offsetLeft);
        setScrollLeft(container.scrollLeft);
        container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e, type) => {
        if (!isDragging) return;
        e.preventDefault();
        const container = type === 'voucher' ? voucherCarouselRef.current : dataCarouselRef.current;
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = (e, type) => {
        setIsDragging(false);
        const container = type === 'voucher' ? voucherCarouselRef.current : dataCarouselRef.current;
        container.style.cursor = 'grab';
    };

    return (
        <>
            <Navbar />
            <div className={styles.store}>
                {/* Discounted Vouchers Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Discounted Vouchers</h2>
                    <div 
                        className={styles.carousel} 
                        ref={voucherCarouselRef}
                        onTouchStart={(e) => handleTouchStart(e, 'voucher')}
                        onTouchMove={(e) => handleTouchMove(e, 'voucher')}
                        onTouchEnd={(e) => handleTouchEnd(e, 'voucher')}
                        onMouseDown={(e) => handleMouseDown(e, 'voucher')}
                        onMouseMove={(e) => handleMouseMove(e, 'voucher')}
                        onMouseUp={(e) => handleMouseUp(e, 'voucher')}
                        onMouseLeave={(e) => handleMouseUp(e, 'voucher')}
                    >
                        {restaurantVouchers.map((voucher, index) => (
                            <div 
                                key={index} 
                                className={styles.voucherCard}
                                onClick={() => handlePurchase(voucher.name, voucher.cost)}
                            >
                                <h3>{voucher.name}</h3>
                                <p>{voucher.description}</p>
                                <span className={styles.cost}>{voucher.cost} gems</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Bundles Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Data Bundles</h2>
                    <div 
                        className={styles.carousel} 
                        ref={dataCarouselRef}
                        onTouchStart={(e) => handleTouchStart(e, 'data')}
                        onTouchMove={(e) => handleTouchMove(e, 'data')}
                        onTouchEnd={(e) => handleTouchEnd(e, 'data')}
                        onMouseDown={(e) => handleMouseDown(e, 'data')}
                        onMouseMove={(e) => handleMouseMove(e, 'data')}
                        onMouseUp={(e) => handleMouseUp(e, 'data')}
                        onMouseLeave={(e) => handleMouseUp(e, 'data')}
                    >
                        {dataBundles.map((bundle, index) => (
                            <div 
                                key={index} 
                                className={styles.dataCard}
                                onClick={() => handlePurchase(bundle.name, bundle.cost)}
                            >
                                <h3>{bundle.name}</h3>
                                <p>{bundle.description}</p>
                                <span className={styles.cost}>{bundle.cost} gems</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}