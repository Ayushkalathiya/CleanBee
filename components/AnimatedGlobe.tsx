import { motion}from "framer-motion";
import { Leaf } from "lucide-react";
export function AnimatedGlobe() {
    return (
      <div className="relative w-24 h-24 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8">
        {/* Scaled-down globe on smaller screens */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500 opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-green-400 opacity-40"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full bg-green-300 opacity-60"
          animate={{ scale: [1, 0.9, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-6 rounded-full bg-green-200 opacity-80"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <Leaf className="absolute inset-0 m-auto h-12 w-12 sm:h-20 sm:w-20 text-green-600" />
      </div>
    );
  }