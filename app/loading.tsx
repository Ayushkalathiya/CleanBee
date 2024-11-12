'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

const wasteItems =  [
  // Food & Organic Waste
  "🍌", // banana peel
  "🥝", // fruit waste
  "🥬", // vegetable scraps
  "🥚", // eggshells
  "☕", // coffee grounds
  "🍞", // bread waste
  "🍖", // meat scraps
  "🥗", // food leftovers

  // Paper & Cardboard
  "📰", // newspaper
  "📦", // cardboard box
  "📅", // paper calendar
  "📑", // office paper
  "📚", // old books
  "🧻", // tissue paper
  "📨", // envelopes
  "📋", // paper receipts

  // Plastic Waste
  "🥤", // disposable cup
  "🧴", // plastic bottle
  "🛍️", // plastic bag
  "🧃", // juice box/tetra pak
  "🥡", // takeout container
  "💊", // medicine packaging
  "🧪", // plastic containers
  "🎨", // plastic packaging

  // Glass & Metal
  "🍾", // glass bottle
  "🥫", // canned food
  "🍶", // glass jars
  "🥄", // metal utensils
  "🔩", // metal scraps
  "💡", // light bulbs
  "🪞", // mirrors
  "🎨", // paint cans

  // Electronic Waste
  "💻", // laptop
  "📱", // mobile phone
  "🔋", // batteries
  "🖨️", // printer
  "📀", // CD/DVD
  "🎮", // gaming devices
  "🎧", // headphones
  "⌚", // watches/wearables

  // Hazardous Waste
  "🛢️", // oil/chemicals
  "🧪", // laboratory waste
  "💊", // expired medications
  "🔫", // aerosol cans
  "🖌️", // paint
  "🧴", // cleaning products
  "💅", // nail polish
  "🔦", // fluorescent tubes

  // Textile & Furniture
  "👕", // clothing
  "👟", // shoes
  "🧦", // socks
  "🧣", // accessories
  "🪑", // furniture
  "🛏️", // mattress
  "🧸", // toys
  "🧶", // fabric scraps

  // Garden & Outdoor
  "🌿", // yard waste
  "🍂", // leaves
  "🌳", // tree branches
  "🌺", // dead plants
  "🪴", // plant pots
  "🏺", // ceramic items
  "⚱️", // broken pottery
  "🧹", // outdoor debris
];
export default function LoadingPage() {
  const [windowWidth, setWindowWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }
  }, [])

  return (
    <div className={`${poppins.className} h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden`}>
      <motion.div
        className="relative w-32 h-32 mb-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500 opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 rounded-full bg-green-400 opacity-40"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
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
        <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-600" />
      </motion.div>

      <motion.h1
        className="text-4xl font-bold mb-4 text-green-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        CleanBee
      </motion.h1>

      <motion.p
        className="text-xl text-gray-600 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Loading your eco-friendly experience...
      </motion.p>

      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full bg-green-600"
            animate={{ y: ['0%', '-50%', '0%'] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.2 }}
          />
        ))}
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {wasteItems.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl"
            initial={{
              y: -50,
              x: Math.random() * windowWidth,
            }}
            animate={{
              y: windowHeight + 50,
              x: Math.random() * windowWidth,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
