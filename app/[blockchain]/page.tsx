"use client"

import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, DollarSign, Zap, Shield, Users, BarChart3, Globe, Code } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { blockchainData } from "@/data/blockchains"
import { Footer } from "@/components/footer"
import { ChatWidget } from "@/components/chat-widget"
import { LoadingScreen } from "@/components/loading-screen"
import { useLoading } from "@/hooks/use-loading"
import { PriceChart } from "@/components/price-chart"

interface OHLCData {
  id: string
  timestamp: number
  open: { value: number }
  high: { value: number }
  low: { value: number }
  close: { value: number }
}

export default function BlockchainDetail({ params }: { params: { blockchain: string } }) {
  const isLoading = useLoading(2000)
  const searchParams = useSearchParams()
  const [chartData, setChartData] = useState<OHLCData[]>([])
  const [isLoadingChart, setIsLoadingChart] = useState(true)
  const [blockchain, setBlockchain] = useState<any>(null)
  const [loadingSentiment, setLoadingSentiment] = useState(false)
  const [blockchainWithSentiment, setBlockchainWithSentiment] = useState<any>(null)

  // Get blockchain data from URL params or fallback to local data
  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const blockchainFromParams = JSON.parse(decodeURIComponent(dataParam))
        setBlockchain(blockchainFromParams)
      } catch (error) {
        console.error('Error parsing blockchain data from URL:', error)
        // Fallback to local data
        const blockchainName = params.blockchain.replace(/-/g, " ")
        const fallbackBlockchain = blockchainData.find((b) => b.name.toLowerCase() === blockchainName.toLowerCase())
        setBlockchain(fallbackBlockchain)
      }
    } else {
      // Fallback to local data
      const blockchainName = params.blockchain.replace(/-/g, " ")
      const fallbackBlockchain = blockchainData.find((b) => b.name.toLowerCase() === blockchainName.toLowerCase())
      setBlockchain(fallbackBlockchain)
    }
  }, [params.blockchain, searchParams])

  // Fetch sentiment data when blockchain changes
  useEffect(() => {
    if (blockchain) {
      fetchSentimentData(blockchain).then(setBlockchainWithSentiment)
    }
  }, [blockchain])

  // Function to fetch sentiment data
  const fetchSentimentData = async (blockchainData: any) => {
    if (!blockchainData) return blockchainData
    
    setLoadingSentiment(true)
    
    try {
      const response = await fetch(`/api/sentiment?symbol=${blockchainData.gecko_id || blockchainData.symbol}`)
      const sentimentData = await response.json()
      
      if (sentimentData && sentimentData.error) {
        // Handle "Info unavailable" case
        return {
          ...blockchainData,
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
          ...blockchainData,
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
          const priceChange = blockchainData.priceChange24h
          if (priceChange > 5) {
            sentiment = "bullish"
          } else if (priceChange < -5) {
            sentiment = "bearish"
          } else {
            sentiment = "neutral"
          }
        }
        
        return {
          ...blockchainData,
          sentiment,
          sentimentVotesUp: bullishVotes,
          sentimentVotesDown: bearishVotes,
          sentimentPercentage
        }
      }
      
      return blockchainData
    } catch (error) {
      console.warn(`Failed to fetch sentiment for ${blockchainData.symbol}:`, error)
      return {
        ...blockchainData,
        sentiment: "neutral",
        sentimentVotesUp: 0,
        sentimentVotesDown: 0,
        sentimentPercentage: 50
      }
    } finally {
      setLoadingSentiment(false)
    }
  }

  // Function to fetch Uniswap price data
 const fetchPriceData = async()=>{

  try{

    setIsLoadingChart(true);

    const response = await fetch('/api/graph',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({geckoId:displayBlockchain.gecko_id})
    })

    if(response.status != 200){
      setIsLoadingChart(false);
      return;
    }

    const data = await response.json();
    console.log('data  : ',data.chart)
    setIsLoadingChart(false);
    setChartData(data.chart); 



  }catch(e){
    setIsLoadingChart(false);
    console.log('Error with fetchPriceData : ',e)
  }

 }

  // Use blockchain with sentiment data if available, otherwise use original blockchain
  const displayBlockchain = blockchainWithSentiment || blockchain


    // Fetch price data on component mount
  useEffect(() => {

    if(displayBlockchain?.gecko_id){
      // console.log('displayBlockchain : ',displayBlockchain)
      fetchPriceData();
    }
    
  }, [displayBlockchain])

  if (!displayBlockchain) {
    return <LoadingScreen />
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Header */}
      <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
                <img
                src={displayBlockchain.logo}
                alt={`${displayBlockchain.name} logo`}
                className="w-10 h-10 object-contain rounded"
                />
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">{displayBlockchain.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{displayBlockchain.symbol}</p>
              </div>
            </div>
          </div>
          <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-0 text-sm px-3 py-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            {displayBlockchain.priceChange24h > 0 ? '+' : ''}{displayBlockchain.priceChange24h?.toFixed(2)}%
          </Badge>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Key Metrics */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
                </div>
                <p className="text-2xl font-bold text-green-500">${displayBlockchain.marketCap}B</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">TVL</span>
                </div>
                <p className="text-2xl font-bold text-blue-500">${displayBlockchain.tvl}B</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">TPS</span>
                </div>
                <p className="text-2xl font-bold text-purple-500">{displayBlockchain.tps.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Price</span>
                </div>
                <p className="text-2xl font-bold text-orange-500">${displayBlockchain.currentPrice?.toFixed(4)}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Price Chart */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white">
                    {displayBlockchain.name} Price Chart (24H)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingChart ? (
                    <div className="h-80 flex items-center justify-center">
                      <div className="text-gray-500 dark:text-gray-400">Loading live price data...</div>
                    </div>
                  ) : (
                    <PriceChart 
                      data={chartData} 
                      tokenSymbol={displayBlockchain.symbol}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Blockchain Info */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Volume & Supply */}
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Volume & Supply
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">24h Volume</span>
                    <span className="font-medium text-black dark:text-white">${displayBlockchain.volume24h}M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Circulating Supply</span>
                    <span className="font-medium text-black dark:text-white">{displayBlockchain.circulatingSupply}M</span>
                  </div>
                </CardContent>
              </Card>

              {/* Network Details */}
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Network Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Chain ID</span>
                    <span className="font-medium text-black dark:text-white">{displayBlockchain.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gecko ID</span>
                    <span className="font-medium text-black dark:text-white">{displayBlockchain.gecko_id}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Data */}
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loadingSentiment ? (
                    <div className="flex items-center justify-center p-4">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      <span className="ml-2 text-sm text-gray-500">Loading sentiment...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Sentiment</span>
                        <Badge className={`border-0 capitalize ${
                          displayBlockchain.sentiment === 'bullish' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : displayBlockchain.sentiment === 'bearish'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {displayBlockchain.sentiment || 'Neutral'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">👍 Bullish</span>
                        <span className="font-medium text-green-600">{displayBlockchain.sentimentVotesUp || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">👎 Bearish</span>
                        <span className="font-medium text-red-600">{displayBlockchain.sentimentVotesDown || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bullish %</span>
                        <span className={`font-medium ${
                          (displayBlockchain.sentimentPercentage || 0) >= 70 ? 'text-green-500' :
                          (displayBlockchain.sentimentPercentage || 0) <= 30 ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {(displayBlockchain.sentimentPercentage || 0).toFixed(1)}%
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Stats */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">RPC Node</p>
                    <p className="font-medium text-black dark:text-white text-xs truncate">
                      {displayBlockchain.rpc_node ? displayBlockchain.rpc_node.slice(0, 30) + '...' : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">WSS RPC</p>
                    <p className="font-medium text-black dark:text-white text-xs truncate">
                      {displayBlockchain.wss_rpc_node ? displayBlockchain.wss_rpc_node.slice(0, 30) + '...' : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sentiment %</p>
                    <p className="font-medium text-black dark:text-white">
                      {displayBlockchain.sentimentPercentage || 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price Change</p>
                    <p className={`font-medium ${displayBlockchain.priceChange24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {displayBlockchain.priceChange24h > 0 ? '+' : ''}{displayBlockchain.priceChange24h?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
