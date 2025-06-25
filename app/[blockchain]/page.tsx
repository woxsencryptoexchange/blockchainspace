"use client"

import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, DollarSign, Zap, Shield, Users, BarChart3, Globe, Code } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { blockchainData } from "@/data/blockchains"
import { useTheme } from "@/contexts/theme-context"
import { notFound } from "next/navigation"
import { Footer } from "@/components/footer"
import { ChatWidget } from "@/components/chat-widget"
import { LoadingScreen } from "@/components/loading-screen"
import { useLoading } from "@/hooks/use-loading" // Import useLoading hook

export default function BlockchainDetail({ params }: { params: { blockchain: string } }) {
  const { theme } = useTheme()
  const isLoading = useLoading(2000)

  // Find blockchain by converting URL param back to name
  const blockchainName = params.blockchain.replace(/-/g, " ")
  const blockchain = blockchainData.find((b) => b.name.toLowerCase() === blockchainName.toLowerCase())

  if (!blockchain) {
    notFound()
  }

  if (isLoading) {
    return <LoadingScreen />
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

  // Mock chart data for demonstration
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    price: Math.random() * 100 + 50,
    volume: Math.random() * 1000000,
  }))

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
              <div className="text-3xl">{blockchain.logo}</div>
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">{blockchain.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{blockchain.symbol}</p>
              </div>
            </div>
          </div>
          <Badge className={`${getSecurityColor(blockchain.security)} border-0 text-sm px-3 py-1`}>
            <Shield className="w-4 h-4 mr-1" />
            {blockchain.security} Security
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
                <p className="text-2xl font-bold text-green-500">${blockchain.marketCap}B</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">TVL</span>
                </div>
                <p className="text-2xl font-bold text-blue-500">${blockchain.tvl}B</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">TPS</span>
                </div>
                <p className="text-2xl font-bold text-purple-500">{blockchain.tps.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gas Fee</span>
                </div>
                <p className="text-2xl font-bold text-orange-500">${blockchain.gasFee}</p>
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
                  <CardTitle className="text-black dark:text-white">Price Chart (30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end space-x-1">
                    {chartData.map((data, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                        style={{ height: `${(data.price / 150) * 100}%` }}
                      />
                    ))}
                  </div>
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
              {/* Founder */}
              <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-black dark:text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Founder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{blockchain.founder}</p>
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
                    <span className="text-gray-600 dark:text-gray-400">Block Time</span>
                    <span className="font-medium text-black dark:text-white">{blockchain.blockTime}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Security Level</span>
                    <Badge className={`${getSecurityColor(blockchain.security)} border-0`}>{blockchain.security}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Layer 2 Solutions */}
              {blockchain.l2s.length > 0 && (
                <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-black dark:text-white flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      Layer 2 Solutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {blockchain.l2s.map((l2, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-black dark:text-white"
                        >
                          {l2}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
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
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Consensus</p>
                    <p className="font-medium text-black dark:text-white">
                      {blockchain.name === "Bitcoin"
                        ? "Proof of Work"
                        : blockchain.name === "Ethereum"
                          ? "Proof of Stake"
                          : "Proof of Stake"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Launch Year</p>
                    <p className="font-medium text-black dark:text-white">
                      {blockchain.name === "Bitcoin" ? "2009" : blockchain.name === "Ethereum" ? "2015" : "2020"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Programming Language</p>
                    <p className="font-medium text-black dark:text-white">
                      {blockchain.name === "Bitcoin"
                        ? "C++"
                        : blockchain.name === "Ethereum"
                          ? "Solidity"
                          : blockchain.name === "Solana"
                            ? "Rust"
                            : "Various"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Smart Contracts</p>
                    <p className="font-medium text-black dark:text-white">
                      {blockchain.name === "Bitcoin" ? "Limited" : "Yes"}
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
