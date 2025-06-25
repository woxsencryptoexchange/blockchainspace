"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Plus, Copy, TrendingUp, DollarSign, Zap, Shield, BarChart3, Users, Code, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { blockchainData } from "@/data/blockchains"

interface ComparisonViewProps {
  selectedChains: typeof blockchainData
  onAddMore: () => void
  onExit: () => void
}

export function ComparisonView({ selectedChains, onAddMore, onExit }: ComparisonViewProps) {
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

  const metrics = [
    { key: "marketCap", label: "Market Cap", icon: DollarSign, color: "text-green-500", suffix: "B" },
    { key: "tvl", label: "TVL", icon: BarChart3, color: "text-blue-500", suffix: "B" },
    { key: "totalStakeVolume", label: "Staked", icon: Shield, color: "text-purple-500", suffix: "B" },
    { key: "tps", label: "TPS", icon: TrendingUp, color: "text-orange-500", suffix: "" },
    { key: "gasFee", label: "Gas Fee", icon: Zap, color: "text-red-500", prefix: "$" },
    { key: "blockTime", label: "Block Time", icon: Globe, color: "text-cyan-500", suffix: "s" },
    { key: "activeAddresses", label: "Active Addresses", icon: Users, color: "text-pink-500", suffix: "K" },
    { key: "dexVolume24h", label: "24h DEX Volume", icon: BarChart3, color: "text-indigo-500", suffix: "M" },
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
          <p className="text-gray-600 dark:text-gray-400">Comparing {selectedChains.length} blockchains</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={onAddMore}
            variant="outline"
            disabled={selectedChains.length >= 4}
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
            style={{ gridTemplateColumns: `200px repeat(${selectedChains.length}, 1fr)` }}
          >
            <div></div>
            {selectedChains.map((chain) => (
              <Card key={chain.id} className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{chain.logo}</div>
                  <h3 className="font-bold text-black dark:text-white">{chain.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{chain.symbol}</p>
                  <Badge className={`${getSecurityColor(chain.security)} border-0 mt-2`}>{chain.security}</Badge>
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
                style={{ gridTemplateColumns: `200px repeat(${selectedChains.length}, 1fr)` }}
              >
                <div className="flex items-center space-x-2 p-4">
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="font-medium text-black dark:text-white">{metric.label}</span>
                </div>
                {selectedChains.map((chain) => (
                  <Card
                    key={`${chain.id}-${metric.key}`}
                    className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                  >
                    <CardContent className="p-4 text-center">
                      <span className={`font-bold ${metric.color}`}>
                        {metric.prefix || ""}
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

            {/* Smart Contract Languages */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `200px repeat(${selectedChains.length}, 1fr)` }}
            >
              <div className="flex items-center space-x-2 p-4">
                <Code className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-black dark:text-white">Languages</span>
              </div>
              {selectedChains.map((chain) => (
                <Card
                  key={`${chain.id}-languages`}
                  className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {chain.smartContractLanguages?.map((lang, index) => (
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
            </motion.div>

            {/* RPC Endpoints */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="grid gap-4"
              style={{ gridTemplateColumns: `200px repeat(${selectedChains.length}, 1fr)` }}
            >
              <div className="flex items-center space-x-2 p-4">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-black dark:text-white">RPC Endpoint</span>
              </div>
              {selectedChains.map((chain) => (
                <Card
                  key={`${chain.id}-rpc`}
                  className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
                        {chain.rpcEndpoint}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(chain.rpcEndpoint)}
                        className="p-1 h-6 w-6"
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
              style={{ gridTemplateColumns: `200px repeat(${selectedChains.length}, 1fr)` }}
            >
              <div className="flex items-center space-x-2 p-4">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="font-medium text-black dark:text-white">WSS Endpoint</span>
              </div>
              {selectedChains.map((chain) => (
                <Card
                  key={`${chain.id}-wss`}
                  className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate mr-2">
                        {chain.wssEndpoint}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(chain.wssEndpoint)}
                        className="p-1 h-6 w-6"
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
