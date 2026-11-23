"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

interface TabAnimatorProps {
  children: ReactNode;
  tabId: string;
}

const variants = {
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export function TabAnimator({ children, tabId }: TabAnimatorProps) {
  return (
    <motion.div
      key={tabId}
      initial={false}
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}