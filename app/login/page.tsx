'use client'

import { useEffect, useState } from 'react'
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import LoadingPage from '@/app/loading'
import { createUser } from '@/utils/db/action'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Coins, Users, LucideIcon, Shield, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Web3Auth Configuration
const clientId = 'BJKdDFkNtkWX87XqkuWrDu4rbkSvWyQZ5lswS0ucINxxcN0inRVW8zzKAywPPzgiOHP7_3PcfFwfpvcQvSdaLRs'

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
  displayName: 'Ethereum Sepolia Testnet',
  ticker: 'ETH',
  tickerName: 'Ethereum',
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
  privateKeyProvider,
})

function AnimatedGlobe() {
  return (
    <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-8">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-20"
        animate={{ scale: [1, 1.1, 1], rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 opacity-40"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-r from-green-300 to-emerald-300 opacity-60"
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-6 rounded-full bg-gradient-to-r from-green-200 to-emerald-200 opacity-80"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <Leaf className="absolute inset-0 m-auto h-16 w-16 sm:h-24 sm:w-24 text-green-600 drop-shadow-lg" />
    </div>
  )
}

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group cursor-pointer"
    >
      <Card className="bg-white/50 backdrop-blur-sm border-none shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
        <CardContent className="pt-6">
          <div className="rounded-full bg-green-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <Icon className="text-green-600 w-8 h-8 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{title}</h3>
          <p className="text-gray-600 text-sm text-center">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Connecting...</span>
    </div>
  )
}

export default function LoginPage() {
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal()
        setProvider(web3auth.provider)

        if (web3auth.connected) {
          setLoggedIn(true)
          const user = await web3auth.getUserInfo()
          setUserInfo(user)
          if (user.email) {
            localStorage.setItem('userEmail', user.email)
            await createUser(user.email, user.name || 'Anonymous User')
            router.push('/')
          }
        }
      } catch (error) {
        console.error('Error initializing Web3Auth:', error)
        setError('Failed to initialize Web3Auth. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [router])

  const login = async () => {
    setIsLoggingIn(true)
    setError(null)
    try {
      const web3authProvider = await web3auth.connect()
      setProvider(web3authProvider)
      setLoggedIn(true)
      const user = await web3auth.getUserInfo()
      setUserInfo(user)
      if (user.email) {
        localStorage.setItem('userEmail', user.email)
        await createUser(user.email, user.name || 'Anonymous User')
        router.push('/')
      }
    } catch (error) {
      console.error('Error during login:', error)
      setError('Failed to login. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = async () => {
    try {
      await web3auth.logout()
      setProvider(null)
      setLoggedIn(false)
      setUserInfo(null)
      localStorage.removeItem('userEmail')
      router.push('/')
    } catch (error) {
      console.error('Error during logout:', error)
      setError('Failed to logout. Please try again.')
    }
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <AnimatedGlobe />
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          CleanBee
        </h1>
        <p className="text-xl text-gray-600 font-light">Join the Movement for a Cleaner Tomorrow</p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md mb-4"
          >
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {loggedIn ? 'Welcome Back!' : 'Login to CleanBee'}
          </CardTitle>
          <CardDescription className="text-center">
            {loggedIn
              ? `Glad to see you again, ${userInfo?.name || 'User'}!`
              : 'Connect with Web3Auth to start your journey'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!loggedIn ? (
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white space-x-2"
            >
              {isLoggingIn ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Connect with Web3Auth</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={logout}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl px-4">
        <FeatureCard
          icon={Leaf}
          title="Eco-Friendly Impact"
          description="Make a real difference by reporting and cleaning up waste in your community."
          delay={0.2}
        />
        <FeatureCard
          icon={Coins}
          title="Earn Green Rewards"
          description="Get rewarded with tokens for your environmental contributions."
          delay={0.4}
        />
        <FeatureCard
          icon={Users}
          title="Join the Movement"
          description="Be part of a growing community dedicated to environmental change."
          delay={0.6}
        />
      </div>
    </div>
  )
}