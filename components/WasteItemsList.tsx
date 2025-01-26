'use client'

import React, { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { Input } from './ui/input'

const categories = {
  organicWaste: {
    icon: "🥬",
    title: "Organic Waste",
    items: [
      { emoji: "🍌", name: "Banana Peel" },
      { emoji: "🥝", name: "Fruit Waste" },
      { emoji: "🥬", name: "Vegetable Scraps" },
      { emoji: "🥚", name: "Eggshells" },
      { emoji: "☕", name: "Coffee Grounds" },
      { emoji: "🍞", name: "Bread Waste" },
      { emoji: "🍖", name: "Meat Scraps" },
      { emoji: "🥗", name: "Food Leftovers" }
    ]
  },
  paperWaste: {
    icon: "📰",
    title: "Paper & Cardboard",
    items: [
      { emoji: "📰", name: "Newspaper" },
      { emoji: "📦", name: "Cardboard Box" },
      { emoji: "📅", name: "Paper Calendar" },
      { emoji: "📑", name: "Office Paper" },
      { emoji: "📚", name: "Old Books" },
      { emoji: "🧻", name: "Tissue Paper" },
      { emoji: "📨", name: "Envelopes" },
      { emoji: "📋", name: "Paper Receipts" }
    ]
  },
  plasticWaste: {
    icon: "🧴",
    title: "Plastic Waste",
    items: [
      { emoji: "🥤", name: "Disposable Cup" },
      { emoji: "🧴", name: "Plastic Bottle" },
      { emoji: "🛍️", name: "Plastic Bag" },
      { emoji: "🧃", name: "Juice Box/Tetra Pak" },
      { emoji: "🥡", name: "Takeout Container" },
      { emoji: "💊", name: "Medicine Packaging" },
      { emoji: "🧪", name: "Plastic Containers" },
      { emoji: "🎨", name: "Plastic Packaging" }
    ]
  },
  glassAndMetal: {
    icon: "🍾",
    title: "Glass & Metal",
    items: [
      { emoji: "🍾", name: "Glass Bottle" },
      { emoji: "🥫", name: "Canned Food" },
      { emoji: "🍶", name: "Glass Jars" },
      { emoji: "🥄", name: "Metal Utensils" },
      { emoji: "🔩", name: "Metal Scraps" },
      { emoji: "💡", name: "Light Bulbs" },
      { emoji: "🪞", name: "Mirrors" },
      { emoji: "🎨", name: "Paint Cans" }
    ]
  },
  electronicWaste: {
    icon: "💻",
    title: "Electronic Waste",
    items: [
      { emoji: "💻", name: "Laptop" },
      { emoji: "📱", name: "Mobile Phone" },
      { emoji: "🔋", name: "Batteries" },
      { emoji: "🖨️", name: "Printer" },
      { emoji: "📀", name: "CD/DVD" },
      { emoji: "🎮", name: "Gaming Devices" },
      { emoji: "🎧", name: "Headphones" },
      { emoji: "⌚", name: "Watches/Wearables" }
    ]
  },
  hazardousWaste: {
    icon: "🛢️",
    title: "Hazardous Waste",
    items: [
      { emoji: "🛢️", name: "Oil/Chemicals" },
      { emoji: "🧪", name: "Laboratory Waste" },
      { emoji: "💊", name: "Expired Medications" },
      { emoji: "🔫", name: "Aerosol Cans" },
      { emoji: "🖌️", name: "Paint" },
      { emoji: "🧴", name: "Cleaning Products" },
      { emoji: "💅", name: "Nail Polish" },
      { emoji: "🔦", name: "Fluorescent Tubes" }
    ]
  },
  textileAndFurniture: {
    icon: "👕",
    title: "Textile & Furniture",
    items: [
      { emoji: "👕", name: "Clothing" },
      { emoji: "👟", name: "Shoes" },
      { emoji: "🧦", name: "Socks" },
      { emoji: "🧣", name: "Accessories" },
      { emoji: "🪑", name: "Furniture" },
      { emoji: "🛏️", name: "Mattress" },
      { emoji: "🧸", name: "Toys" },
      { emoji: "🧶", name: "Fabric Scraps" }
    ]
  },
  gardenWaste: {
    icon: "🌿",
    title: "Garden & Outdoor",
    items: [
      { emoji: "🌿", name: "Yard Waste" },
      { emoji: "🍂", name: "Leaves" },
      { emoji: "🌳", name: "Tree Branches" },
      { emoji: "🌺", name: "Dead Plants" },
      { emoji: "🪴", name: "Plant Pots" },
      { emoji: "🏺", name: "Ceramic Items" },
      { emoji: "⚱️", name: "Broken Pottery" },
      { emoji: "🧹", name: "Outdoor Debris" }
    ]
  }
}

export default function WasteClassification() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(new Set(Object.keys(categories)))

  const toggleCategory = (key: string) => {
    setExpandedCategory(expandedCategory === key ? null : key)
  }

  const toggleCategoryFilter = (key:string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setSelectedCategories(newSelected)
  }

  const filteredCategories = useMemo(() => {
    return Object.entries(categories)
      .filter(([key]) => selectedCategories.has(key))
      .filter(([, category]) => {
        const searchLower = searchQuery.toLowerCase()
        return (
          category.title.toLowerCase().includes(searchLower) ||
          category.items.some(item => 
            item.name.toLowerCase().includes(searchLower)
          )
        )
      })
  }, [searchQuery, selectedCategories])

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-green-800">Waste Classification Guide</CardTitle>
        <CardDescription className="text-lg text-gray-600 mt-2">
          Discover the proper category for any waste item
        </CardDescription>
        
        <div className="mt-6 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for waste items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(categories).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategories.has(key) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleCategoryFilter(key)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                <span className="hidden sm:inline">{category.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatePresence>
          {filteredCategories.map(([key, category]) => (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Button
                variant="ghost"
                onClick={() => toggleCategory(key)}
                className="w-full flex items-center justify-between p-4 hover:bg-green-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-label={category.title}>{category.icon}</span>
                  <h3 className="text-lg font-semibold text-green-800">{category.title}</h3>
                </div>
                {expandedCategory === key ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            
              <AnimatePresence>
                {expandedCategory === key && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-green-50/50">
                      {category.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-green-50"
                        >
                          <span className="text-2xl" role="img" aria-label={item.name}>{item.emoji}</span>
                          <span className="text-sm text-gray-700">{item.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            No matching waste items found. Try adjusting your search or filters.
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}