"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, X, Plus, Minus, Search, TrendingUp, Zap, DollarSign, Sun, Moon, GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/contexts/theme-context"
import { blockchainData } from "@/data/blockchains"
import Link from "next/link"
import { CompareModal } from "@/components/compare-modal"
import { ComparisonView } from "@/components/comparison-view"
import { Footer } from "@/components/footer"
import { ChatWidget } from "@/components/chat-widget"
import { LoadingScreen } from "@/components/loading-screen"
import { useLoading } from "@/hooks/use-loading"

type FilterState = {
  speed: string[]
  cost: string[]
  popularity: string[]
  performance: string[]
  search: string
  count: number
}

export default function BlockchainSpace() {
  const [activeTab, setActiveTab] = useState("noob")
  const [showFilters, setShowFilters] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [filters, setFilters] = useState<FilterState>({
    speed: [],
    cost: [],
    popularity: [],
    performance: [],
    search: "",
    count: 20,
  })

  const [showCompareModal, setShowCompareModal] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedChains, setSelectedChains] = useState<typeof blockchainData>([])
  const isLoading = useLoading(2500)

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

  if (isLoading) {
    return <LoadingScreen />
  }

  const toggleFilter = (category: keyof FilterState, value: string) => {
    // Only allow toggling for array-type categories
    if (["speed", "cost", "popularity", "performance"].includes(category)) {
      setFilters((prev) => {
        const arr = prev[category] as string[]
        return {
          ...prev,
          [category]: arr.includes(value)
            ? arr.filter((item: string) => item !== value)
            : [...arr, value],
        }
      })
    }
  }

  const clearFilters = () => {
    setFilters({
      speed: [],
      cost: [],
      popularity: [],
      performance: [],
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

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Header */}
      <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white">BlockchainSpace</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Comprehensive blockchain network analytics</p>
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
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                    <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="text-lg">{blockchain.logo}</div>
                          <div>
                            <h3 className="font-semibold text-sm text-black dark:text-white">{blockchain.name}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{blockchain.symbol}</p>
                          </div>
                        </div>
                        <Badge className={`${getSecurityColor(blockchain.security)} border-0 text-xs px-2 py-1`}>
                          {blockchain.security}
                        </Badge>
                      </div>

                      {/* Metrics */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Gas</span>
                          </div>
                          <span className="text-xs font-medium text-green-500">${blockchain.gasFee}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-blue-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">Time</span>
                          </div>
                          <span className="text-xs font-medium text-blue-500">{blockchain.blockTime}s</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-purple-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">TPS</span>
                          </div>
                          <span className="text-xs font-medium text-purple-500">{blockchain.tps.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Market Cap</span>
                          <span className="text-xs font-medium text-orange-500">${blockchain.marketCap}B</span>
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

      {/* Filter Sidebar */}
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
                  <h2 className="text-xl font-semibold text-black dark:text-white">Filters</h2>
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

                  {/* Cost Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cost</h3>
                    <div className="space-y-2">
                      {[
                        { value: "cheap", label: "Cheap (<$1)" },
                        { value: "expensive", label: "Expensive (≥$1)" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={filters.cost.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter("cost", option.value)}
                          className={`w-full justify-start ${
                            filters.cost.includes(option.value)
                              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                              : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Performance Filters */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Performance</h3>
                    <div className="space-y-2">
                      {[
                        { value: "high-tps", label: "High TPS (>5000)" },
                        { value: "low-latency", label: "Low Latency (<5s)" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={filters.performance.includes(option.value) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFilter("performance", option.value)}
                          className={`w-full justify-start ${
                            filters.performance.includes(option.value)
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
          <Link href="/pro">
            <motion.button
              onClick={() => setActiveTab("pro")}
              className={`relative z-10 px-6 py-3 rounded-full font-medium transition-colors duration-300 ${
                activeTab === "pro" ? "text-white dark:text-black" : "text-black dark:text-white"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Pro
            </motion.button>
          </Link>
        </div>
      </motion.nav>

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
