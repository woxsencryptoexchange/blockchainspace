"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Plus, Copy, TrendingUp, DollarSign, Zap, BarChart3, Globe, Activity, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import type { BlockchainData } from "@/app/api/fetch-chains"

interface ComparisonViewProps {
  selectedChains: any
  onAddMore: () => void
  onExit: () => void
}

export function ComparisonView({ selectedChains, onAddMore, onExit }: ComparisonViewProps) {
  const [chainsWithSentiment, setChainsWithSentiment] = useState<BlockchainData[]>(selectedChains)
  const [loadingSentiment, setLoadingSentiment] = useState(false)

  // Fetch sentiment data for selected chains
  useEffect(() => {
    const fetchSentimentData = async () => {
      setLoadingSentiment(true)
      
      try {
        const updatedChains = await Promise.all(
          selectedChains.map(async (chain: BlockchainData) => {
            try {
              const response = await fetch(`/api/sentiment?symbol=${chain.gecko_id || chain.symbol}`)
              const sentimentData = await response.json()
              
              if (sentimentData && sentimentData.error) {
                // Handle "Info unavailable" case
                return {
                  ...chain,
                  sentiment: "neutral",
                  sentimentVotesUp: 0,
                  sentimentVotesDown: 0,
                  sentimentPercentage: 50
                }
              } else if (sentimentData && sentimentData.percentage) {
                // Handle the actual API response format
                const positivePercentage = sentimentData.percentage.positive || 0
                const negativePercentage = sentimentData.percentage.negative || 0
                
                // Calculate votes from percentages (assuming 100 total votes for display)
                const totalVotes = 100
                const bullishVotes = Math.round((positivePercentage / 100) * totalVotes)
                const bearishVotes = Math.round((negativePercentage / 100) * totalVotes)
                
                let sentiment = "neutral"
                
                if (positivePercentage >= 70) {
                  sentiment = "bullish"
                } else if (positivePercentage <= 30) {
                  sentiment = "bearish"
                } else {
                  sentiment = "neutral"
                }
                
                return {
                  ...chain,
                  sentiment,
                  sentimentVotesUp: bullishVotes,
                  sentimentVotesDown: bearishVotes,
                  sentimentPercentage: Math.round(positivePercentage * 100) / 100
                }
              } else if (sentimentData && sentimentData.bullish !== undefined && sentimentData.bearish !== undefined) {
                // Fallback for old format
                const bullishVotes = sentimentData.bullish || 0
                const bearishVotes = sentimentData.bearish || 0
                const totalVotes = bullishVotes + bearishVotes
                
                let sentiment = "neutral"
                let sentimentPercentage = 50
                
                if (totalVotes > 0) {
                  const bullishPercentage = (bullishVotes / totalVotes) * 100
                  sentimentPercentage = Math.round(bullishPercentage * 100) / 100
                  
                  if (bullishPercentage >= 70) {
                    sentiment = "bullish"
                  } else if (bullishPercentage <= 30) {
                    sentiment = "bearish"
                  } else {
                    sentiment = "neutral"
                  }
                } else {
                  // Fallback to price-based sentiment if no votes
                  const priceChange = chain.priceChange24h
                  if (priceChange > 5) {
                    sentiment = "bullish"
                  } else if (priceChange < -5) {
                    sentiment = "bearish"
                  } else {
                    sentiment = "neutral"
                  }
                }
                
                return {
                  ...chain,
                  sentiment,
                  sentimentVotesUp: bullishVotes,
                  sentimentVotesDown: bearishVotes,
                  sentimentPercentage
                }
              }
              
              return chain
            } catch (error) {
              console.warn(`Failed to fetch sentiment for ${chain.symbol}:`, error)
              return {
                ...chain,
                sentiment: "neutral",
                sentimentVotesUp: 0,
                sentimentVotesDown: 0,
                sentimentPercentage: 50
              }
            }
          })
        )
        
        setChainsWithSentiment(updatedChains)
      } catch (error) {
        console.error('Error fetching sentiment data:', error)
        setChainsWithSentiment(selectedChains)
      } finally {
        setLoadingSentiment(false)
      }
    }
    
    fetchSentimentData()
  }, [selectedChains])

  const copyToClipboard = (text: string, type: 'RPC' | 'WSS' = 'RPC') => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} URL copied to clipboard!`, {
        icon: '📋',
        duration: 3000,
      })
    }).catch(() => {
      toast.error(`Failed to copy ${type} URL`, {
        icon: '❌',
        duration: 3000,
      })
    })
  }

  const metrics = [
    { key: "marketCap", label: "Market Cap", icon: DollarSign, color: "text-green-500", prefix: "$", suffix: "B" },
    { key: "tvl", label: "TVL", icon: BarChart3, color: "text-blue-500", prefix: "$", suffix: "B" },
    { key: "currentPrice", label: "Current Price", icon: Coins, color: "text-yellow-500", prefix: "$", suffix: "" },
    { key: "priceChange24h", label: "24h Change", icon: Activity, color: "text-purple-500", prefix: "", suffix: "%" },
    { key: "volume24h", label: "24h Volume", icon: TrendingUp, color: "text-indigo-500", prefix: "$", suffix: "M" },
    { key: "tps", label: "TPS", icon: Zap, color: "text-orange-500", prefix: "", suffix: "" },
    { key: "circulatingSupply", label: "Circulating Supply", icon: Coins, color: "text-cyan-500", prefix: "", suffix: "M" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Blockchain Comparison</h2>
          <p className="text-gray-600 dark:text-gray-400">Comparing {chainsWithSentiment.length} blockchains</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={onAddMore}
            variant="outline"
            disabled={chainsWithSentiment.length >= 4}
            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add More
          </Button>
          <Button
            onClick={onExit}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Compare
          </Button>
        </div>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="overflow-x-auto"
      >
        <div className="min-w-full">
          {/* Chain Headers */}
          <div
            className="grid gap-4 mb-6"
            style={{ gridTemplateColumns: `200px repeat(${chainsWithSentiment.length}, 1fr)` }}
          >
            <div></div>
            {chainsWithSentiment.map((chain: BlockchainData) => (
              <Card key={chain.id} className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                   <img src={chain.logo} alt={chain.name} className="w-20 h-20" onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }} />
                  <h3 className="font-bold text-black dark:text-white">{chain.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{chain.symbol}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Metrics Comparison */}
          <div className="space-y-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.key}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="grid gap-4"
                style={{ gridTemplateColumns: `200px repeat(${chainsWithSentiment.length}, 1fr)` }}
              >
                <div className="flex items-center space-x-2 p-4">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="font-medium text-black dark:text-white">{metric.label}</span>
                </div>
                {chainsWithSentiment.map((chain: BlockchainData) => (
                  <Card
                    key={`${chain.id}-${metric.key}`}
                    className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                  >
                    <CardContent className="p-4 text-center">
                      <span 
                        className={`font-bold ${
                          metric.key === 'priceChange24h' 
                            ? chain[metric.key] >= 0 
                              ? 'text-green-500' 
                              : 'text-red-500'
                            : metric.color
                        }`}
                      >
                        {metric.prefix || ""}
                        {metric.key === 'priceChange24h' && chain[metric.key] >= 0 ? '+' : ''}
                        {typeof chain[metric.key as keyof typeof chain] === "number"
                          ? (chain[metric.key as keyof typeof chain] as number).toLocaleString()
                          : chain[metric.key as keyof typeof chain]}
                        {metric.suffix || ""}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ))}

            {/* Market Sentiment */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `200px repeat(${chainsWithSentiment.length}, 1fr)` }}
            >
              <div className="flex items-center space-x-2 p-4">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-black dark:text-white">Market Sentiment</span>
              </div>
              {chainsWithSentiment.map((chain: BlockchainData) => (
                <Card
                  key={`${chain.id}-sentiment`}
                  className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                >
                  <CardContent className="p-4 text-center space-y-2">
                    {loadingSentiment ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        <span className="ml-2 text-xs text-gray-500">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <Badge 
                          className={`${
                            chain.sentiment === 'bullish' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800'
                              : chain.sentiment === 'bearish'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                          } border-0 capitalize mb-2`}
                        >
                          {chain.sentiment}
                        </Badge>
                        
                        {/* Vote Information */}
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <div className="flex justify-between">
                            <span>👍 Bullish:</span>
                            <span>{chain.sentimentVotesUp || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>👎 Bearish:</span>
                            <span>{chain.sentimentVotesDown || 0}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Bullish %:</span>
                            <span className={`${
                              (chain.sentimentPercentage || 0) >= 70 ? 'text-green-500' :
                              (chain.sentimentPercentage || 0) <= 30 ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {(chain.sentimentPercentage || 0).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Smart Contract Languages */}
            {/* <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `200px repeat(${chainsWithSentiment.length}, 1fr)` }}
            >
              <div className="flex items-center space-x-2 p-4">
                <Code className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-black dark:text-white">Languages</span>
              </div>
              {chainsWithSentiment.map((chain: BlockchainData) => (
                <Card
                  key={`${chain.id}-languages`}
                  className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {chain.smartContractLanguages?.map((lang:any, index:number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div> */}

            {/* RPC Endpoints */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `200px repeat(${chainsWithSentiment.length}, 1fr)` }}
            >
              <div className="flex items-center space-x-2 p-4">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-black dark:text-white">RPC Endpoint</span>
              </div>
              {chainsWithSentiment.map((chain: BlockchainData) => (
                <Card
                  key={`${chain.id}-rpc`}
                  className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
                        {chain.rpc_node}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(chain.rpc_node, 'RPC')}
                        className="p-1 h-6 w-6 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        title="Copy RPC URL"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* WSS Endpoints */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `200px repeat(${chainsWithSentiment.length}, 1fr)` }}
            >
              <div className="flex items-center space-x-2 p-4">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="font-medium text-black dark:text-white">WSS Endpoint</span>
              </div>
              {chainsWithSentiment.map((chain: BlockchainData) => (
                <Card
                  key={`${chain.id}-wss`}
                  className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
                        {chain.wss_rpc_node}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(chain.wss_rpc_node, 'WSS')}
                        className="p-1 h-6 w-6 hover:bg-green-100 dark:hover:bg-green-900/20"
                        title="Copy WSS URL"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
