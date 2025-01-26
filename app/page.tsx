"use client";

import { AnimatedGlobe } from "@/components/AnimatedGlobe";
import {
  CommunityHighlights,
  HowItWorks,
  UpcomingEvents,
} from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import {
  getAllRewards,
  getRecentReports,
  getWasteCollectionTasks,
} from "@/utils/db/action";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Leaf,
  LucideIcon,
  MapPin,
  Recycle,
  Users,
} from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const poppins = Poppins({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const wasteItems = [
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



function FallingWaste() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {wasteItems.map((item, index) => (
          <motion.div
          key={index}
          initial={{ y: -50, x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0 }}
          animate={{ y: typeof window !== "undefined" ? window.innerHeight + 50 : 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {item}
        </motion.div>  
        
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0,
  });

  const Router = useRouter();

  useEffect(() => {
    async function fetchImpactData() {
      try {
        const reports = await getRecentReports(100);
        const rewards = await getAllRewards();
        const tasks = await getWasteCollectionTasks(100);

        const wasteCollected = tasks.reduce((total, task) => {
          const match = task.amount.match(/(\d+(\.\d+)?)/);
          const amount = match ? parseFloat(match[0]) : 0;
          return total + amount;
        }, 0);

        const reportsSubmitted = reports.length;
        const tokensEarned = rewards.reduce(
          (total, reward) => total + (reward.points || 0),
          0
        );
        const co2Offset = wasteCollected * 0.5;

        setImpactData({
          wasteCollected: Math.round(wasteCollected * 10) / 10,
          reportsSubmitted,
          tokensEarned,
          co2Offset: Math.round(co2Offset * 10) / 10,
        });
      } catch (error) {
        console.error("Error fetching impact data:", error);
        setImpactData({
          wasteCollected: 0,
          reportsSubmitted: 0,
          tokensEarned: 0,
          co2Offset: 0,
        });
      }
    }

    fetchImpactData();
  }, []);

  const login = () => {
    setLoggedIn(true);
  };

  return (
    <div
      className={`container mx-auto px-4 sm:px-6 py-8 sm:py-16 ${poppins.className} relative`}
    >
      <FallingWaste />
      <section className="text-center mb-12 sm:mb-20 relative z-10">
        <AnimatedGlobe />
        <motion.h1
          className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-6 text-gray-800 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          CleanBee<span className="text-green-600">Waste Management</span>
          <FallingWaste />
        </motion.h1>
        <motion.p
          className="text-base sm:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join our community in making waste management more efficient and
          rewarding!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {!loggedIn ? (
            <Button
              onClick={login}
              className="bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg py-4 sm:py-6 px-8 sm:px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          ) : (
            <Link href="/report">
              <Button className="bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg py-4 sm:py-6 px-8 sm:px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
                Report Waste
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
            </Link>
          )}
        </motion.div>
      </section>
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 mb-12 sm:mb-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <FeatureCard
          icon={Leaf}
          title="Eco-Friendly"
          description="Contribute to a cleaner environment by reporting and collecting waste."
        />
        <FeatureCard
          icon={Coins}
          title="Earn Rewards"
          description="Get tokens for your contributions to waste management efforts."
        />
        <FeatureCard
          icon={Users}
          title="Community-Driven"
          description="Be part of a growing community committed to sustainable practices."
        />
      </motion.section>
      <motion.section
        className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg mb-12 sm:mb-20 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-gray-800">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
          <ImpactCard
            title="Waste Collected"
            value={`${impactData.wasteCollected} kg`}
            icon={Recycle}
          />
          <ImpactCard
            title="Reports Submitted"
            value={impactData.reportsSubmitted.toString()}
            icon={MapPin}
          />
          <ImpactCard
            title="Tokens Earned"
            value={impactData.tokensEarned.toString()}
            icon={Coins}
          />
          <ImpactCard
            title="CO₂ Offset"
            value={`${impactData.co2Offset} kg`}
            icon={Leaf}
          />
        </div>
      </motion.section>

      {/* Dashboard section */}

      <CommunityHighlights />
      <HowItWorks />
      <UpcomingEvents />
      <motion.section
        className="text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10 text-gray-800">
          Take Action Today
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto mb-8 sm:mb-12">
          CleanBee empowers you to make a positive impact on the environment.
          Start reporting waste today, earn rewards, and help us build a cleaner
          world!
        </p>
        <Button
          onClick={() => {
            Router.push("/report");
          }}
          className="bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg py-4 sm:py-6 px-8 sm:px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Start Reporting
          <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
        </Button>
      </motion.section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center transition-all duration-200 transform hover:scale-105">
      <Icon className="text-green-600 w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-4" />
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base">{description}</p>
    </div>
  );
}

function ImpactCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="text-center bg-green-100 rounded-lg py-6 sm:py-8 px-4 sm:px-6 shadow-md transition-all duration-200 transform hover:scale-105">
      <Icon className="text-green-600 w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
        {title}
      </h3>
      <p className="text-2xl sm:text-3xl font-bold text-green-700">{value}</p>
    </div>
  );
}
