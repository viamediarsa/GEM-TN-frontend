import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styles from "./styles.module.css";
import http from "../../../http.js";

export default function DailyChallenges() {
  const [bgColor, setBgColor] = useState("#FFD014");
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Initial fetch to log and set current color
    http
      .get("/frontend/daily-challenges-color")
      .then((res) => {
        const data = res?.data || {};
        const current = data.currentDailyChallengesColor || "#FFD014";
        console.log("🎨 DailyChallenges initial color from API:", current);
        setBgColor(current);
      })
      .catch((err) => {
        console.error("DailyChallenges initial color fetch failed", err?.message || err);
      });

    const socket = io(http.defaults.baseURL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("🔌 DailyChallenges socket connected:", socket.id);
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ DailyChallenges socket disconnected");
      setSocketConnected(false);
    });

    socket.on("daily-challenges-color", (color) => {
      console.log("🎨 DailyChallenges received daily-challenges-color:", color);
      setBgColor(color || "#FFD014");
    });

    return () => {
      socket.off("daily-challenges-color");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, []);

  return (
    <div id="daily-challenges" className={styles.dailyChallenges} style={{ backgroundColor: bgColor }}>
      <h2 style={{ margin: 0 }}>Daily Challenges</h2>
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ fontSize: '12px', color: '#666' }}>
          Color: {bgColor} | Socket: {socketConnected ? '✅' : '❌'}
        </div>
      )}
    </div>
  );
}