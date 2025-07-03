"use client"

import { useState, useMemo,useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Filter,
  X,
  Plus,
  Minus,
  Search,
  TrendingUp,
  Zap,
  DollarSign,
  Sun,
  Moon,
  BarChart3,
  Users,
  Copy,
  GitCompare,
  Rabbit,
  Turtle,
  Coins,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/contexts/theme-context"
import { CompareModal } from "@/components/compare-modal"
import { ComparisonView } from "@/components/comparison-view"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { ChatWidget } from "@/components/chat-widget"
import { LoadingScreen } from "@/components/loading-screen"
import { useLoading } from "@/hooks/use-loading"
import toast from "react-hot-toast"
import type { BlockchainData } from "../api/fetch-chains"

type FilterState = {
  sortBy: 'tps' | 'tvl' | 'marketcap' | 'price' | 'volume' | 'supply' | null
  sortOrder: 'asc' | 'desc' | null
  search: string
  count: number
}

export default function DevPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedChains, setSelectedChains] = useState<BlockchainData[]>([])
  const { theme, toggleTheme } = useTheme()
  const [filters, setFilters] = useState<FilterState>({
    sortBy: null,
    sortOrder: null,
    search: "",
    count: 50,
  })

  const [blockchainData,setBlockchainData] = useState<BlockchainData[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [activeTab, setActiveTab] = useState("pro")


  const filteredBlockchains = useMemo(() => {
    let filtered = [...blockchainData]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (blockchain) =>
          blockchain.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
          blockchain.symbol?.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Sorting logic
    if (filters.sortBy && filters.sortOrder) {
      filtered.sort((a, b) => {
        let aValue: number, bValue: number
        
        switch (filters.sortBy) {
          case 'tps':
            aValue = a.tps || 0
            bValue = b.tps || 0
            break
          case 'tvl':
            aValue = a.tvl || 0
            bValue = b.tvl || 0
            break
          case 'marketcap':
            aValue = a.marketCap || 0
            bValue = b.marketCap || 0
            break
          case 'price':
            aValue = a.currentPrice || 0
            bValue = b.currentPrice || 0
            break
          case 'volume':
            aValue = a.volume24h || 0
            bValue = b.volume24h || 0
            break
          case 'supply':
            aValue = a.circulatingSupply || 0
            bValue = b.circulatingSupply || 0
            break
          default:
            return 0
        }
        
        return filters.sortOrder === 'desc' ? bValue - aValue : aValue - bValue
      })
    }

    return filtered.slice(0, filters.count)
  }, [filters, blockchainData])

  const isLoading = useLoading(2500)

  useEffect(()=>{
    const fetchData = async()=>{
      try {
        setIsLoadingData(true)
        const response = await fetch('/api/blockchain-data')
        if (response.ok) {
          const data = await response.json()
          setBlockchainData(data)
        }
      } catch (error) {
        console.error('Error loading blockchain data:', error)
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchData();
  },[])


  if (isLoading) {
    return <LoadingScreen />
  }

  const setSorting = (sortBy: 'tps' | 'tvl' | 'marketcap' | 'price' | 'volume' | 'supply', sortOrder: 'asc' | 'desc') => {
    setFilters((prev) => ({
      ...prev,
      sortBy: prev.sortBy === sortBy && prev.sortOrder === sortOrder ? null : sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === sortOrder ? null : sortOrder,
    }))
  }

  const clearFilters = () => {
    setFilters({
      sortBy: null,
      sortOrder: null,
      search: "",
      count: 50,
    })
  }

  const copyToClipboard = (text: string, type: 'RPC' | 'WSS' = 'RPC') => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} URL copied to clipboard!`, {
        icon: '📋',
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    }).catch(() => {
      toast.error(`Failed to copy ${type} URL`, {
        icon: '❌',
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    })
  }

  // Animated icon components
  const AnimatedRabbit = ({ isActive }: { isActive: boolean }) => (
    <motion.div
      animate={{
        x: isActive ? [0, 5, 0] : 0,
        rotate: isActive ? [0, -5, 5, 0] : 0,
      }}
      transition={{
        duration: 0.6,
        repeat: isActive ? Infinity : 0,
        repeatType: "loop",
      }}
    >
      <Rabbit className="w-4 h-4" />
    </motion.div>
  )

  const AnimatedTurtle = ({ isActive }: { isActive: boolean }) => (
    <motion.div
      animate={{
        x: isActive ? [0, 2, 0] : 0,
        y: isActive ? [0, -1, 0] : 0,
      }}
      transition={{
        duration: 2,
        repeat: isActive ? Infinity : 0,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    >
      <motion.div
        animate={{
          rotate: isActive ? [0, 2, -2, 0] : 0,
        }}
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          repeatType: "loop",
        }}
      >
      <Turtle className="w-4 h-4" />
      </motion.div>
    </motion.div>
  )

  const handleCompare = (chains: typeof blockchainData) => {
    setSelectedChains(chains)
    setCompareMode(true)
  }

  const exitCompareMode = () => {
    setCompareMode(false)
    setSelectedChains([])
  }

  if (compareMode) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <ComparisonView
              selectedChains={selectedChains}
              onAddMore={() => setShowCompareModal(true)}
              onExit={exitCompareMode}
            />
          </div>
        </div>

        <CompareModal
          isOpen={showCompareModal}
          onClose={() => setShowCompareModal(false)}
          onCompare={handleCompare}
          selectedChains={selectedChains}
          blockchainData={blockchainData}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Header */}
      <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white">Pro Deep Dive</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Advanced blockchain technical analysis</p>
          </div>

          {/* Filter Button - Top Right */}
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => setShowFilters(true)}
            className="p-3 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar and Compare Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex items-center space-x-4"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search blockchains..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={() => setShowCompareModal(true)}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare
            </Button>
          </motion.div>

          {/* Results Counter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-6">
            {isLoadingData ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Loading latest live blockchain data...
                </p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Showing {filteredBlockchains.length} of {blockchainData.length} blockchains
              </p>
            )}
          </motion.div>

          {/* Blockchain Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            <AnimatePresence>
              {isLoadingData ? (
                // Skeleton Loading Cards for Pro Page
                Array.from({ length: 12 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.4 
                    }}
                    className="group relative"
                  >
                    <div className="relative p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full flex flex-col">
                      {/* Header Skeleton */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          <div>
                            <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>

                      {/* Primary Metrics Skeleton */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-3 bg-white dark:bg-black rounded-lg">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                          <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-black rounded-lg">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="w-8 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                          <div className="w-14 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                        </div>
                      </div>

                      {/* Developer Metrics Skeleton */}
                      <div className="space-y-3 mb-4 flex-grow">
                        {Array.from({ length: 5 }).map((_, metricIndex) => (
                          <div key={metricIndex} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                              <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </div>
                            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>

                      {/* Network Endpoints Skeleton */}
                      <div className="space-y-2 mt-auto">
                        <div className="p-2 bg-white dark:bg-black rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        
                        <div className="p-2 bg-white dark:bg-black rounded">
                          <div className="flex items-center justify-between mb-1">
                            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                filteredBlockchains.map((blockchain, index) => (
                <motion.div
                  key={blockchain.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="group relative"
                >
                  <Link href={`/${blockchain.name?.toLowerCase().replace(/\s+/g, "-")}`} className="h-full">
                    <div className="relative p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img src={blockchain.logo} alt={blockchain.name} className="w-8 h-8" onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }} />
                          <div className="text-2xl hidden">{blockchain.name?.charAt(0)}</div>
                          <div>
                            <h3 className="font-semibold text-black dark:text-white">{blockchain.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{blockchain.symbol}</p>
                          </div>
                        </div>
                        <Badge className="text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 border-0">
                          Chain Id: {blockchain.id}
                        </Badge>
                      </div>

                      {/* Primary Metrics */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-3 bg-white dark:bg-black rounded-lg">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Market Cap</span>
                          </div>
                          <span className="text-lg font-bold text-green-500">${blockchain.marketCap}B</span>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-black rounded-lg">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">TVL</span>
                          </div>
                          <span className="text-lg font-bold text-blue-500">${blockchain.tvl}B</span>
                        </div>
                      </div>

                      {/* Developer Metrics */}
                      <div className="space-y-3 mb-4 flex-grow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">TPS</span>
                          </div>
                          <span className="text-sm font-medium text-orange-500">{blockchain.tps?.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Current Price</span>
                          </div>
                          <span className="text-sm font-medium text-yellow-500">${blockchain.currentPrice?.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className={`w-4 h-4 ${blockchain.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                            <span className="text-sm text-gray-600 dark:text-gray-400">24h Change</span>
                          </div>
                          <span className={`text-sm font-medium ${blockchain.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {blockchain.priceChange24h >= 0 ? '+' : ''}{blockchain.priceChange24h?.toFixed(2)}%
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">24h Volume</span>
                          </div>
                          <span className="text-sm font-medium text-indigo-500">${blockchain.volume24h}M</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Circulating Supply</span>
                          </div>
                          <span className="text-sm font-medium text-purple-500">{blockchain.circulatingSupply}M</span>
                        </div>
                      </div>

                      {/* Network Endpoints */}
                      <div className="space-y-2 mt-auto">
                        <div className="p-2 bg-white dark:bg-black rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">RPC Endpoint:</span>
                            {blockchain.rpc_node && blockchain.rpc_node.trim() !== '' ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.preventDefault()
                                  copyToClipboard(blockchain.rpc_node, 'RPC')
                                }}
                                className="p-1 h-6 w-6 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                title="Copy RPC URL"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            ) : (
                              <span className="text-xs text-gray-400 italic">N/A</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 break-all">
                            {blockchain.rpc_node && blockchain.rpc_node.trim() !== '' 
                              ? blockchain.rpc_node 
                              : 'Not available'
                            }
                          </span>
                        </div>
                        
                        <div className="p-2 bg-white dark:bg-black rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">WSS Endpoint:</span>
                            {blockchain.wss_rpc_node && blockchain.wss_rpc_node.trim() !== '' ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.preventDefault()
                                  copyToClipboard(blockchain.wss_rpc_node, 'WSS')
                                }}
                                className="p-1 h-6 w-6 hover:bg-green-100 dark:hover:bg-green-900/20"
                                title="Copy WSS URL"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            ) : (
                              <span className="text-xs text-gray-400 italic">N/A</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 break-all">
                            {blockchain.wss_rpc_node && blockchain.wss_rpc_node.trim() !== '' 
                              ? blockchain.wss_rpc_node 
                              : 'Not available'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

        {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-1 relative overflow-hidden">
          {/* Sliding Background */}
          <motion.div
            className="absolute inset-y-1 bg-black dark:bg-white rounded-full"
            animate={{
              x: activeTab === "noob" ? 4 : "calc(100% - 4px)",
              width: activeTab === "noob" ? "calc(50% - 4px)" : "calc(50% - 4px)",
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          />

          <Link href="/">

          <motion.button
            onClick={() => setActiveTab("noob")}
            className={`relative z-10 px-6 py-3 rounded-full font-medium transition-colors duration-300 ${
              activeTab === "noob" ? "text-white dark:text-black" : "text-black dark:text-white"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Noob
          </motion.button>
                    </Link>


         <motion.button
              onClick={() => setActiveTab("pro")}
              className={`relative z-10 px-9 py-3 rounded-full font-medium transition-colors duration-300 ${
                activeTab === "pro" ? "text-white dark:text-black" : "text-black dark:text-white"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Pro
            </motion.button>
        
        </div>
      </motion.nav>

      {/* Enhanced Filter Sidebar */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-black border-l border-gray-200 dark:border-gray-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-black dark:text-white">Advanced Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Theme Toggle */}
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</h3>

                  <div
                    onClick={toggleTheme}
                    className="w-16 h-8 flex items-center rounded-full px-1 cursor-pointer bg-gray-200 dark:bg-gray-700 relative"
                  >
                    {/* Thumb */}
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="w-6 h-6 rounded-full bg-white shadow-md z-10"
                      style={{ position: "absolute", left: theme === "dark" ? "calc(100% - 28px)" : "4px" }}
                    />

                    {/* Icons */}
                    <div className="w-full flex justify-between items-center z-20 px-1">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <Moon className="w-4 h-4 text-gray-800 dark:text-black" />
                    </div>
                  </div>
                </div>

                {/* Blockchain Count */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Display Count: {filters.count}
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFilters((prev) => ({ ...prev, count: Math.max(5, prev.count - 5) }))}
                      className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Slider
                      value={[filters.count]}
                      onValueChange={([value]) => setFilters((prev) => ({ ...prev, count: value }))}
                      max={50}
                      min={5}
                      step={5}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFilters((prev) => ({ ...prev, count: Math.min(40, prev.count + 5) }))}
                      className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Sort Categories */}
                <div className="space-y-6">
                  {/* TPS Sorting */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Speed (TPS)
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Button
                          variant={filters.sortBy === 'tps' && filters.sortOrder === 'desc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('tps', 'desc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'tps' && filters.sortOrder === 'desc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedRabbit isActive={filters.sortBy === 'tps' && filters.sortOrder === 'desc'} />
                          Fastest
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02, x: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Button
                          variant={filters.sortBy === 'tps' && filters.sortOrder === 'asc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('tps', 'asc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'tps' && filters.sortOrder === 'asc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedTurtle isActive={filters.sortBy === 'tps' && filters.sortOrder === 'asc'} />
                          Slowest
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* TVL Sorting */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Total Value Locked
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'tvl' && filters.sortOrder === 'desc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('tvl', 'desc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'tvl' && filters.sortOrder === 'desc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedRabbit isActive={filters.sortBy === 'tvl' && filters.sortOrder === 'desc'} />
                          Highest
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'tvl' && filters.sortOrder === 'asc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('tvl', 'asc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'tvl' && filters.sortOrder === 'asc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedTurtle isActive={filters.sortBy === 'tvl' && filters.sortOrder === 'asc'} />
                          Lowest
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Market Cap Sorting */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Market Cap
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'marketcap' && filters.sortOrder === 'desc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('marketcap', 'desc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'marketcap' && filters.sortOrder === 'desc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedRabbit isActive={filters.sortBy === 'marketcap' && filters.sortOrder === 'desc'} />
                          Highest
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'marketcap' && filters.sortOrder === 'asc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('marketcap', 'asc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'marketcap' && filters.sortOrder === 'asc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedTurtle isActive={filters.sortBy === 'marketcap' && filters.sortOrder === 'asc'} />
                          Lowest
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Current Price Sorting - Pro Feature */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Current Price
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'price' && filters.sortOrder === 'desc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('price', 'desc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'price' && filters.sortOrder === 'desc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedRabbit isActive={filters.sortBy === 'price' && filters.sortOrder === 'desc'} />
                          Highest
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'price' && filters.sortOrder === 'asc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('price', 'asc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'price' && filters.sortOrder === 'asc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedTurtle isActive={filters.sortBy === 'price' && filters.sortOrder === 'asc'} />
                          Lowest
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* 24h Volume Sorting - Pro Feature */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      24h Volume
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'volume' && filters.sortOrder === 'desc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('volume', 'desc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'volume' && filters.sortOrder === 'desc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedRabbit isActive={filters.sortBy === 'volume' && filters.sortOrder === 'desc'} />
                          Highest
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'volume' && filters.sortOrder === 'asc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('volume', 'asc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'volume' && filters.sortOrder === 'asc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedTurtle isActive={filters.sortBy === 'volume' && filters.sortOrder === 'asc'} />
                          Lowest
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Circulating Supply Sorting - Pro Feature */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Circulating Supply
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'supply' && filters.sortOrder === 'desc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('supply', 'desc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'supply' && filters.sortOrder === 'desc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedRabbit isActive={filters.sortBy === 'supply' && filters.sortOrder === 'desc'} />
                          Highest
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={filters.sortBy === 'supply' && filters.sortOrder === 'asc' ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSorting('supply', 'asc')}
                          className={`w-full justify-start gap-2 ${
                            filters.sortBy === 'supply' && filters.sortOrder === 'asc'
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          <AnimatedTurtle isActive={filters.sortBy === 'supply' && filters.sortOrder === 'asc'} />
                          Lowest
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full mt-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        onCompare={handleCompare}
        selectedChains={selectedChains}
        blockchainData={blockchainData}
      />

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
