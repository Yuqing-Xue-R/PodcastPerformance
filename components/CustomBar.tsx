import React from 'react';
import { motion } from 'framer-motion';

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  index?: number;
  payload?: any;
  animationType?: 'rise' | 'shutter';
  animSpeed?: number;
}

const CustomBar: React.FC<CustomBarProps> = (props) => {
  const { x, y, width, height, fill, index, animationType = 'rise', animSpeed = 0.05 } = props;

  if (x === undefined || y === undefined || width === undefined || height === undefined) {
    return null;
  }

  const isShutter = animationType === 'shutter';
  
  /**
   * Physics Engine:
   * SHUTTER: Explosive top-down reveal (scaleY) with easeOutExpo.
   * RISE: Heavy tactile spring with mass/stiffness logic.
   */
  const initial = isShutter 
    ? { scaleY: 0, opacity: 0, y, height } 
    : { height: 0, y: y + height, opacity: 1 };

  const animate = isShutter 
    ? { scaleY: 1, opacity: 1, y, height } 
    : { height: height, y: y, opacity: 1 };

  const transition: any = isShutter 
    ? {
        type: "tween",
        ease: [0.19, 1, 0.22, 1], // easeOutExpo approximation
        duration: 0.7,
        delay: (index || 0) * animSpeed,
      }
    : {
        type: "spring",
        stiffness: 50,
        damping: 12,
        mass: 8,
        delay: (index || 0) * animSpeed,
      };

  return (
    <motion.rect
      initial={initial}
      animate={animate}
      transition={transition}
      x={x}
      width={width}
      fill={fill}
      style={{ transformOrigin: "top" }}
      className="cursor-pointer transition-opacity duration-300 hover:opacity-75"
      rx={2}
      ry={2}
    />
  );
};

export default CustomBar;
