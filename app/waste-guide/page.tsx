"use client";
import React from 'react'
import { motion } from 'framer-motion'
import WasteClassification from '@/components/WasteItemsList'
import WasteGuide from '@/components/WasteGuide'

const page = () => {
  return (
    <div>
        {/* Add WasteGuide section before the Take Action section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <WasteGuide />
      </motion.section>

      {/* Add WasteItemsList section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <WasteClassification />
      </motion.section>

    </div>
  )
}

export default page