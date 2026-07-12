import React from 'react';
import { motion } from 'framer-motion';

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0B1220]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      
      {/* Floating Blob 1 - Emerald */}
      <motion.div
        animate={{
          x: [0, 80, -60, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.15, 0.9, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[10%] left-[15%] w-[450px] h-[450px] rounded-full neon-glow-green opacity-40"
      />
      
      {/* Floating Blob 2 - Teal */}
      <motion.div
        animate={{
          x: [0, -90, 80, 0],
          y: [0, 80, -90, 0],
          scale: [1, 0.9, 1.15, 1]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] rounded-full neon-glow-teal opacity-35"
      />

      {/* Floating Blob 3 - Amber */}
      <motion.div
        animate={{
          x: [0, 50, -40, 0],
          y: [0, 60, -80, 0],
          scale: [1, 1.1, 0.85, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full neon-glow-amber opacity-25"
      />

      {/* Low-Opacity Floating Spark Particles */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Particle 1 */}
        <motion.circle
          cx="20%"
          cy="80%"
          r="2.5"
          fill="#10B981"
          opacity="0.12"
          animate={{
            y: [0, -400],
            x: [0, 40, -20, 0],
            opacity: [0.12, 0.25, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Particle 2 */}
        <motion.circle
          cx="60%"
          cy="90%"
          r="1.8"
          fill="#14B8A6"
          opacity="0.1"
          animate={{
            y: [0, -500],
            x: [0, -50, 30, 0],
            opacity: [0.1, 0.2, 0]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        {/* Particle 3 */}
        <motion.circle
          cx="45%"
          cy="75%"
          r="3"
          fill="#F59E0B"
          opacity="0.08"
          animate={{
            y: [0, -350],
            x: [0, 30, -30, 0],
            opacity: [0.08, 0.18, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        {/* Particle 4 */}
        <motion.circle
          cx="80%"
          cy="85%"
          r="2.2"
          fill="#10B981"
          opacity="0.1"
          animate={{
            y: [0, -450],
            x: [0, -30, 20, 0],
            opacity: [0.1, 0.22, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        {/* Particle 5 */}
        <motion.circle
          cx="10%"
          cy="65%"
          r="2"
          fill="#14B8A6"
          opacity="0.09"
          animate={{
            y: [0, -380],
            x: [0, 20, -10, 0],
            opacity: [0.09, 0.18, 0]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        {/* Particle 6 */}
        <motion.circle
          cx="85%"
          cy="40%"
          r="2.5"
          fill="#F59E0B"
          opacity="0.08"
          animate={{
            y: [0, -300],
            x: [0, -25, 25, 0],
            opacity: [0.08, 0.15, 0]
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </svg>
    </div>
  );
}
