"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import "./globals.css";
// import 'leaflet/dist/leaflet.css'
import { getAvailableRewards, getUserByEmail } from "@/utils/db/action";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    const fetchTotalEarnings = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          const user = await getUserByEmail(userEmail);
          console.log("user from layout", user);

          if (user) {
            const availableRewards = (await getAvailableRewards(
              user.id
            )) ;
            console.log("availableRewards from layout", availableRewards);
            const total = availableRewards.reduce((sum, reward) => sum + reward.cost, 0);
            setTotalEarnings(total);
          }
        }
      } catch (error) {
        console.error("Error fetching total earnings:", error);
      }
    };

    fetchTotalEarnings();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" bg-gray-50 flex flex-col">
          <Header
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            totalEarnings={totalEarnings}
          />
          <div className="flex flex-1">
            <Sidebar open={sidebarOpen} />
            <main
              className={`flex-1 p-4 transition-all duration-300 ${
                sidebarOpen ? "blur-sm" : ""
              }`}
            >
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
