'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Trash2, Recycle } from 'lucide-react'
import { AnimatedGlobe } from './page'

const poppins = Poppins({ 
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

const wasteItems = ['🍌', '📰', '🥫', '📦', '🥤', '💻', '🍽️', '🧴']

export default function NotFound() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-blue-50 ${poppins.className} p-4`}>
      <div className="text-center space-y-8 max-w-4xl w-full">
        <AnimatedGlobe />
        <motion.h1 
          className="text-6xl font-bold text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          404 - Page Not Found
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Oops! It seems this page has been recycled. Let's find you a greener path!
        </motion.p>
        <motion.div 
          className="flex flex-wrap justify-center gap-4 my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {wasteItems.map((item, index) => (
            <motion.div
              key={index}
              className="text-4xl cursor-pointer relative"
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setHoveredItem(item)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              {item}
              {hoveredItem === item && (
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-white rounded shadow text-sm text-gray-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Recycle me!
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-4 px-8 rounded-full font-medium transition-all duration-300 ease-in-out">
              Return Home <Home className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Remember, every piece of waste has a proper place. Let's keep our digital space clean too!
          </p>
        </motion.div>
      </div>
      <motion.div 
        className="fixed bottom-4 right-4 flex items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <Trash2 className="h-8 w-8 text-gray-400" />
        <Recycle className="h-8 w-8 text-green-500 animate-spin-slow" />
      </motion.div>
    </div>
  )
}