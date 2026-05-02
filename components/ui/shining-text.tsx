"use client" 

import * as React from "react"
import { motion } from "framer-motion"; // Note: Using framer-motion as it's already in package.json
 
export function ShiningText({ text }: { text: string }) {
  return (
    <motion.h1
      className="bg-[linear-gradient(110deg,#E63946,35%,#fff,50%,#E63946,75%,#E63946)] bg-[length:200%_100%] bg-clip-text text-transparent"
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.h1>
  );
}
