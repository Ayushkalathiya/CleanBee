'use client'

import { useState, useEffect } from 'react'
import { getAllRewards, getUserByEmail } from '@/utils/db/action'
import { Loader, Award, User, Trophy, Crown, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Reward type
type Reward = {
  id: number
  userId: number
  points: number
  level: number
  createdAt: Date
  userName: string | null
}

export default function LeaderboardPage() {
  // State
  const [rewards, setRewards] = useState<Reward[]>([])
  const [filteredRewards, setFilteredRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showOnlyUser, setShowOnlyUser] = useState(false)
  const itemsPerPage = 10

  // Fetch rewards and user on mount
  useEffect(() => {
    const fetchRewardsAndUser = async () => {
      setLoading(true)
      try {
        const fetchedRewards = await getAllRewards()
        setRewards(fetchedRewards)
        setFilteredRewards(fetchedRewards)

        const userEmail = localStorage.getItem('userEmail')
        if (userEmail) {
          const fetchedUser = await getUserByEmail(userEmail)
          if (fetchedUser) {
            setUser(fetchedUser)
          } else {
            toast.error('User not found. Please log in again.')
          }
        } else {
          toast.error('User not logged in. Please log in.')
        }
      } catch (error) {
        console.error('Error fetching rewards and user:', error)
        toast.error('Failed to load leaderboard. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRewardsAndUser()
  }, [])

  // Filter rewards based on search term and show only user
  useEffect(() => {
    let result = rewards
    if (searchTerm) {
      result = rewards.filter(reward => 
        reward.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (showOnlyUser && user) {
      result = result.filter(reward => reward.userId === user.id)
    }
    setFilteredRewards(result)
    setCurrentPage(1)
  }, [searchTerm, showOnlyUser, rewards, user])

  // Pagination
  const pageCount = Math.ceil(filteredRewards.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRewards.slice(indexOfFirstItem, indexOfLastItem)

  // Render table rows
  const renderTableRows = () => {
    return currentItems.map((reward, index) => {
      const overallIndex = indexOfFirstItem + index
      return (
        <tr key={reward.id} className={`${user && user.id === reward.userId ? 'bg-indigo-50' : ''} hover:bg-gray-50 transition-colors duration-150 ease-in-out`}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              {overallIndex < 3 ? (
                <Crown className={`h-6 w-6 ${overallIndex === 0 ? 'text-yellow-400' : overallIndex === 1 ? 'text-gray-400' : 'text-yellow-600'}`} />
              ) : (
                <span className="text-sm font-medium text-gray-900">{overallIndex + 1}</span>
              )}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10">
                <User className="h-full w-full rounded-full bg-gray-200 text-gray-500 p-2" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{reward.userName}</div>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
              <Award className="h-5 w-5 text-indigo-500 mr-2" />
              <div className="text-sm font-semibold text-gray-900">{reward.points.toLocaleString()}</div>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
              Level {reward.level}
            </span>
          </td>
        </tr>
      )
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Leaderboard title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Leaderboard</h1>

      {/* Top performers card */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-600" />
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
            <div className="flex justify-between items-center text-white">
              <Trophy className="h-10 w-10" />
              <span className="text-2xl font-bold">Top Performers</span>
              <Award className="h-10 w-10" />
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-user"
                  checked={showOnlyUser}
                  onCheckedChange={setShowOnlyUser}
                />
                <Label htmlFor="show-user">Show only me</Label>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows()}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRewards.length)} of {filteredRewards.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {pageCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                  disabled={currentPage === pageCount}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}