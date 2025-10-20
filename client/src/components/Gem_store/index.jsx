import styles from "./styles.module.css"
import { useRef } from "react";

export default function GemStore (){
    const vouchersRef = useRef(null);
    const dataRef = useRef(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);
    const activeRef = useRef(null);

    const beginDrag = (e, ref) => {
        const el = ref.current;
        if (!el) return;
        isDraggingRef.current = true;
        activeRef.current = el;
        el.setAttribute("aria-grabbed", "true");
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        startXRef.current = pageX - el.offsetLeft;
        scrollLeftRef.current = el.scrollLeft;
    };
    const moveDrag = (e) => {
        const el = activeRef.current;
        if (!el || !isDraggingRef.current) return;
        const pageX = e.touches ? e.touches[0].pageX : e.pageX;
        const x = pageX - el.offsetLeft;
        const walk = x - startXRef.current;
        el.scrollLeft = scrollLeftRef.current - walk;
        if (!e.touches) e.preventDefault();
    };
    const endDrag = () => {
        const el = activeRef.current;
        if (!el) return;
        isDraggingRef.current = false;
        el.setAttribute("aria-grabbed", "false");
        activeRef.current = null;
    };
    return (
        <div className={styles.gem_store}>
            <div className={styles.gem_store_content}>
                <h2 className={styles.pageTitle}>Gem Store</h2>

                <section className={styles.section}
                    onMouseMove={moveDrag}
                    onMouseUp={endDrag}
                    onMouseLeave={endDrag}
                    onTouchMove={moveDrag}
                    onTouchEnd={endDrag}
                >
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Vouchers</h3>
                        <div className={styles.badge}>Active</div>
                    </div>
                    <div
                        className={styles.carousel}
                        role="region"
                        aria-label="Vouchers carousel"
                        ref={vouchersRef}
                        onMouseDown={(e)=>beginDrag(e, vouchersRef)}
                        onTouchStart={(e)=>beginDrag(e, vouchersRef)}
                        aria-grabbed="false"
                    >
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                    </div>
                </section>

                <section className={styles.section}
                    onMouseMove={moveDrag}
                    onMouseUp={endDrag}
                    onMouseLeave={endDrag}
                    onTouchMove={moveDrag}
                    onTouchEnd={endDrag}
                >
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionTitle}>Data Bundles</h3>
                        <div className={styles.badge}>Active</div>
                    </div>
                    <div
                        className={styles.carousel}
                        role="region"
                        aria-label="Data bundles carousel"
                        ref={dataRef}
                        onMouseDown={(e)=>beginDrag(e, dataRef)}
                        onTouchStart={(e)=>beginDrag(e, dataRef)}
                        aria-grabbed="false"
                    >
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                        <div className={styles.card}></div>
                    </div>
                </section>
            </div>
        </div>
    );
}