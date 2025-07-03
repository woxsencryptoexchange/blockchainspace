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
  Shield,
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
import type { BlockchainData } from "../api/fetch-chains"

type FilterState = {
  speed: string[]
  cost: string[]
  performance: string[]
  tvl: string[]
  stake: string[]
  dexVolume: string[]
  activeAddresses: string[]
  languages: string[]
  search: string
  count: number
}

export default function DevPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedChains, setSelectedChains] = useState<typeof blockchainData>([])
  const { theme, toggleTheme } = useTheme()
  const [filters, setFilters] = useState<FilterState>({
    speed: [],
    cost: [],
    performance: [],
    tvl: [],
    stake: [],
    dexVolume: [],
    activeAddresses: [],
    languages: [],
    search: "",
    count: 20,
  })

  const [blockchainData,setBlockchainData] = useState<BlockchainData[]>([])

    const [activeTab, setActiveTab] = useState("pro")


  const filteredBlockchains = useMemo(() => {
    let filtered = [...blockchainData]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(
        (blockchain) =>
          blockchain.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          blockchain.symbol.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Speed filters
    if (filters.speed.length > 0) {
      filtered = filtered.filter((blockchain) => {
        if (filters.speed.includes("fast") && blockchain.tps > 1000) return true
        if (filters.speed.includes("slow") && blockchain.tps <= 1000) return true
        return false
      })
    }

    // Cost filters
    if (filters.cost.length > 0) {
      filtered = filtered.filter((blockchain) => {
        if (filters.cost.includes("cheap") && blockchain.gasFee < 1) return true
        if (filters.cost.includes("expensive") && blockchain.gasFee >= 1) return true
        return false
      })
    }

    // TVL filters
    if (filters.tvl.length > 0) {
      filtered = filtered.filter((blockchain) => {
        if (filters.tvl.includes("high") && blockchain.tvl > 1) return true
        if (filters.tvl.includes("low") && blockchain.tvl <= 1) return true
        return false
      })
    }

    // Stake filters
    if (filters.stake.length > 0) {
      filtered = filtered.filter((blockchain) => {
        if (filters.stake.includes("high") && blockchain.totalStakeVolume > 10) return true
        if (filters.stake.includes("low") && blockchain.totalStakeVolume <= 10) return true
        return false
      })
    }

    // DEX Volume filters
    if (filters.dexVolume.length > 0) {
      filtered = filtered.filter((blockchain) => {
        if (filters.dexVolume.includes("high") && blockchain.volume24h > 100) return true
        if (filters.dexVolume.includes("low") && blockchain.volume24h <= 100) return true
        return false
      })
    }

    // Active Addresses filters
    if (filters.activeAddresses.length > 0) {
      filtered = filtered.filter((blockchain) => {
        if (filters.activeAddresses.includes("high") && blockchain.activeAddresses > 200) return true
        if (filters.activeAddresses.includes("low") && blockchain.activeAddresses <= 200) return true
        return false
      })
    }

    // Language filters
    if (filters.languages.length > 0) {
      filtered = filtered.filter((blockchain) =>
        filters.languages.some((lang) =>
          blockchain.smartContractLanguages?.some((chainLang) => chainLang.toLowerCase().includes(lang.toLowerCase())),
        ),
      )
    }

    // Performance filters
    if (filters.performance.length > 0) {
      filtered = filtered.filter((blockchain) => {
        if (filters.performance.includes("high-tps") && blockchain.tps > 5000) return true
        if (filters.performance.includes("low-latency") && blockchain.blockTime < 5) return true
        return false
      })
    }

    return filtered.slice(0, filters.count)
  }, [filters])

  const isLoading = useLoading(2500)

  if (isLoading) {
    return <LoadingScreen />
  }

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      // Only apply filter logic to array fields, not 'count' or 'search'
      if (
        category === "speed" ||
        category === "cost" ||
        category === "performance" ||
        category === "tvl" ||
        category === "stake" ||
        category === "dexVolume" ||
        category === "activeAddresses" ||
        category === "languages"
      ) {
        const arr = prev[category] as string[]
        return {
          ...prev,
          [category]: arr.includes(value)
            ? arr.filter((item: string) => item !== value)
            : [...arr, value],
        }
      }
      // For non-array fields, just return prev
      return prev
    })
  }

  const clearFilters = () => {
    setFilters({
      speed: [],
      cost: [],
      performance: [],
      tvl: [],
      stake: [],
      dexVolume: [],
      activeAddresses: [],
      languages: [],
      search: "",
      count: 20,
    })
  }

  const getSecurityColor = (security: string) => {
    switch (security) {
      case "High":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20"
      case "Low":
        return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

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
        />
      </div>
    )
  }

  useEffect(()=>{

    const fetchData = async()=>{
      const response = await fetch('/api/blockchain-data')
      if (response.ok) {
        const data = await response.json()
        setBlockchainData(data)
      }
    }

    fetchData();

  },[])

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
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredBlockchains.length} of {blockchainData.length} blockchains
            </p>
          </motion.div>

          {/* Blockchain Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBlockchains.map((blockchain, index) => (
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
                  <Link href={`/${blockchain.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="relative p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{blockchain.logo}</div>
                          <div>
                            <h3 className="font-semibold text-black dark:text-white">{blockchain.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{blockchain.symbol}</p>
                          </div>
                        </div>
                        <Badge className={`${getSecurityColor(blockchain.security)} border-0`}>
                          <Shield className="w-3 h-3 mr-1" />
                          {blockchain.security}
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

                      {/* Secondary Metrics */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Staked</span>
                          </div>
                          <span className="text-sm font-medium text-purple-500">${blockchain.totalStakeVolume}B</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">TPS</span>
                          </div>
                          <span className="text-sm font-medium text-orange-500">{blockchain.tps.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Gas Fee</span>
                          </div>
                          <span className="text-sm font-medium text-red-500">${blockchain.gasFee}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-pink-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Active Addresses</span>
                          </div>
                          <span className="text-sm font-medium text-pink-500">{blockchain.activeAddresses}K</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">24h DEX Volume</span>
                          </div>
                          <span className="text-sm font-medium text-indigo-500">${blockchain.dexVolume24h}M</span>
                        </div>
                      </div>

                      {/* Smart Contract Languages */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Smart Contract Languages:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {blockchain.smartContractLanguages?.map((lang, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                            >
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* RPC/WSS Endpoints */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white dark:bg-black rounded">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">RPC:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                              {blockchain.rpcEndpoint.replace("https://", "")}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.preventDefault()
                                copyToClipboard(blockchain.rpcEndpoint)
                              }}
                              className="p-1 h-6 w-6"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white dark:bg-black rounded">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">WSS:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                              {blockchain.wssEndpoint.replace("wss://", "")}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.preventDefault()
                                copyToClipboard(blockchain.wssEndpoint)
                              }}
                              className="p-1 h-6 w-6"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
                  <Button
                    onClick={toggleTheme}
                    variant="outline"
                    className="w-full justify-start bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
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
                      onClick={() => setFilters((prev) => ({ ...prev, count: Math.max(10, prev.count - 5) }))}
                      className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Slider
                      value={[filters.count]}
                      onValueChange={([value]) => setFilters((prev) => ({ ...prev, count: value }))}
                      max={40}
                      min={10}
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

                {/* Filter Categories */}
                <div className="space-y-6">
                  {/* Speed Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Speed</h3>
                    <div className="space-y-2">
                      {[
                        { value: "fast", label: "Fast (>1000 TPS)" },
                        { value: "slow", label: "Slow (≤1000 TPS)" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={filters.speed.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter("speed", option.value)}
                          className={`w-full justify-start ${
                            filters.speed.includes(option.value)
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* TVL Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">TVL</h3>
                    <div className="space-y-2">
                      {[
                        { value: "high", label: "High TVL (>$1B)" },
                        { value: "low", label: "Low TVL (≤$1B)" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={filters.tvl.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter("tvl", option.value)}
                          className={`w-full justify-start ${
                            filters.tvl.includes(option.value)
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Staking Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Staking</h3>
                    <div className="space-y-2">
                      {[
                        { value: "high", label: "High Staked (>$10B)" },
                        { value: "low", label: "Low Staked (≤$10B)" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={filters.stake.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter("stake", option.value)}
                          className={`w-full justify-start ${
                            filters.stake.includes(option.value)
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* DEX Volume Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">24h DEX Volume</h3>
                    <div className="space-y-2">
                      {[
                        { value: "high", label: "High Volume (>$100M)" },
                        { value: "low", label: "Low Volume (≤$100M)" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={filters.dexVolume.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter("dexVolume", option.value)}
                          className={`w-full justify-start ${
                            filters.dexVolume.includes(option.value)
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Active Addresses Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Active Addresses</h3>
                    <div className="space-y-2">
                      {[
                        { value: "high", label: "High Activity (>200K)" },
                        { value: "low", label: "Low Activity (≤200K)" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={filters.activeAddresses.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter("activeAddresses", option.value)}
                          className={`w-full justify-start ${
                            filters.activeAddresses.includes(option.value)
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Smart Contract Languages */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Languages</h3>
                    <div className="space-y-2">
                      {[
                        { value: "solidity", label: "Solidity" },
                        { value: "rust", label: "Rust" },
                        { value: "vyper", label: "Vyper" },
                        { value: "move", label: "Move" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={filters.languages.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter("languages", option.value)}
                          className={`w-full justify-start ${
                            filters.languages.includes(option.value)
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full mt-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Clear All Filters
                </Button>
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
      />

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
