import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";

const LottieRobot = ({ className, style }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Try to fetch robot animations from various sources
    const fetchAnimation = async () => {
      const animationUrls = [
        // Robot saying hi animation (similar to the LottieFiles one)
        "https://assets3.lottiefiles.com/packages/lf20_V9t630.json",
        // Backup robot animation
        "https://assets1.lottiefiles.com/packages/lf20_kxsd2ytq.json",
        // Another robot animation
        "https://assets9.lottiefiles.com/packages/lf20_abqysclq.json",
      ];

      for (const url of animationUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setAnimationData(data);
            return;
          }
        } catch (error) {
          console.log(`Failed to load animation from ${url}:`, error);
        }
      }

      // If all fail, we'll just show the emoji fallback
      console.error("All animation sources failed");
    };

    fetchAnimation();
  }, []);

  if (!animationData) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
        }}
      >
        🤖
      </div>
    );
  }

  return (
    <Lottie
      animationData={animationData}
      className={className}
      style={style}
      loop={true}
      autoplay={true}
    />
  );
};

export default LottieRobot;
