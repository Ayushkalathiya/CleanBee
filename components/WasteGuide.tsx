"use client";
import { Battery, Info, Leaf, Recycle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const wasteCategories = {
    recyclable: {
      title: "Recyclables ♻️",
      items: [
        { emoji: "📰", name: "Paper", points: 5 },
        { emoji: "📦", name: "Cardboard", points: 5 },
        { emoji: "🥫", name: "Metal Cans", points: 10 },
        { emoji: "🍾", name: "Glass", points: 15 },
        { emoji: "🧃", name: "Tetra Pak", points: 10 },
      ],
      color: "bg-blue-100",
      icon: Recycle,
      description: "Clean and dry recyclable materials",
    },
    organic: {
      title: "Organic Waste 🌱",
      items: [
        { emoji: "🍌", name: "Food Scraps", points: 5 },
        { emoji: "🍂", name: "Yard Waste", points: 5 },
        { emoji: "🥬", name: "Vegetable Waste", points: 5 },
      ],
      color: "bg-green-100",
      icon: Leaf,
      description: "Compostable organic materials",
    },
    electronic: {
      title: "E-Waste 🔌",
      items: [
        { emoji: "💻", name: "Computers", points: 50 },
        { emoji: "📱", name: "Phones", points: 30 },
        { emoji: "🔋", name: "Batteries", points: 20 },
        { emoji: "🖨️", name: "Printers", points: 40 },
      ],
      color: "bg-yellow-100",
      icon: Battery,
      description: "Electronic devices and components",
    },
    hazardous: {
      title: "Hazardous ⚠️",
      items: [
        { emoji: "🛢️", name: "Oil", points: 25 },
        { emoji: "🧪", name: "Chemicals", points: 25 },
        { emoji: "💡", name: "Light Bulbs", points: 15 },
      ],
      color: "bg-red-100",
      icon: Info,
      description: "Materials requiring special handling",
    },
  };
  
  export default function WasteGuide() {
    const [selectedCategory, setSelectedCategory] = useState("recyclable");
  
    return (
      <Card className="w-full mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-6 w-6 text-green-600" />
            Waste Sorting Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recyclable" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              {Object.entries(wasteCategories).map(([category, categoryData]) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg cursor-pointer"
                >
                  {React.createElement(categoryData.icon, {
                    className: "h-4 w-4",
                  })}
                  <span className="hidden sm:inline">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
  
            {Object.entries(wasteCategories).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <div className={`p-6 rounded-lg ${category.color}`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {category.title}
                    <span className="text-sm font-normal text-gray-600">
                      ({category.description})
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {category.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.emoji}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-green-600 font-semibold">
                          +{item.points} pts
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Handling Tips:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {key === "recyclable" && (
                        <>
                          <li>Clean and dry all items before recycling</li>
                          <li>Remove caps and sort separately</li>
                          <li>Flatten cardboard boxes</li>
                        </>
                      )}
                      {key === "organic" && (
                        <>
                          <li>Keep meat and dairy products separate</li>
                          <li>Break down larger items</li>
                          <li>Store in a well-ventilated container</li>
                        </>
                      )}
                      {key === "electronic" && (
                        <>
                          <li>Remove batteries before disposal</li>
                          <li>Delete personal data from devices</li>
                          <li>Handle broken screens with care</li>
                        </>
                      )}
                      {key === "hazardous" && (
                        <>
                          <li>Keep in original containers when possible</li>
                          <li>Never mix different materials</li>
                          <li>Store in a cool, dry place</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    );
  }
  