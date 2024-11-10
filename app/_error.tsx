'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, RefreshCcw, AlertTriangle, Send } from 'lucide-react'
import { AnimatedGlobe } from './page'

const poppins = Poppins({ 
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isReportSent, setIsReportSent] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  const handleReport = () => {
    // Here you would typically send the error report to your server
    // For this example, we'll just simulate the action
    setTimeout(() => {
      setIsReportSent(true)
    }, 1000)
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-red-50 to-green-50 ${poppins.className} p-4`}>
      <div className="text-center space-y-8 max-w-4xl w-full">
        <AnimatedGlobe />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h1>
          <p className="text-xl text-gray-600">Don't worry, even the best recycling systems have hiccups sometimes!</p>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Error Details</h2>
          <p className="text-gray-600 mb-2">Message: {error.message}</p>
          {error.digest && (
            <p className="text-gray-600 mb-2">Digest: {error.digest}</p>
          )}
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button onClick={reset} className="bg-green-600 hover:bg-green-700 text-white text-lg py-4 px-8 rounded-full font-medium transition-all duration-300 ease-in-out mr-4">
            Try Again <RefreshCcw className="ml-2 h-5 w-5" />
          </Button>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-4 px-8 rounded-full font-medium transition-all duration-300 ease-in-out">
              Return Home <Home className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <AnimatePresence>
            {!isReportSent ? (
              <motion.button
                className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                onClick={handleReport}
                exit={{ opacity: 0 }}
              >
                Report this issue <Send className="inline-block ml-1 h-4 w-4" />
              </motion.button>
            ) : (
              <motion.p
                className="text-green-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Thank you for reporting the issue. We'll look into it!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}