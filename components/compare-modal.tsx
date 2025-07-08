"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { BlockchainData } from "@/app/api/fetch-chains"


export function CompareModal({ isOpen, onClose, onCompare, selectedChains, blockchainData }: any) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selected, setSelected] = useState<BlockchainData[]>(selectedChains)

  // Sync selected state when selectedChains prop changes
  useEffect(() => {  
    setSelected(selectedChains)
  }, [selectedChains])

  const filteredChains = blockchainData?.filter(
    (chain: BlockchainData) =>
      chain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chain.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleSelection = (chain: BlockchainData) => {
    setSelected((prev: BlockchainData[]) => {
      const isSelected = prev.some((c: BlockchainData) => c.id === chain.id)
      if (isSelected) {
        return prev.filter((c: BlockchainData) => c.id !== chain.id)
      } else if (prev.length < 4) {
        return [...prev, chain]
      }
      return prev
    })
  }

  const handleCompare = () => {
    onCompare(selected)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black dark:text-white truncate pr-2">Compare Blockchains</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between">
                <Input
                  placeholder="Search blockchains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:max-w-md"
                />
                <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Selected: {selected.length}/4</span>
                  <Button
                    onClick={handleCompare}
                    disabled={selected.length < 2}
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-sm sm:text-base px-3 sm:px-4"
                  >
                    Compare ({selected.length})
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Chains */}
            {selected.length > 0 && (
              <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected for comparison:</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {selected.map((chain: BlockchainData,index:number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white py-1.5 sm:py-2 px-2 sm:px-3 dark:bg-black border-gray-200 dark:border-gray-800 text-black dark:text-white flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                    >
                      <img src={chain.logo} alt={chain.name} className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate max-w-[80px] sm:max-w-none">{chain.name}</span>
                      <button onClick={() => toggleSelection(chain)} className="ml-0.5 sm:ml-1 hover:text-red-500 flex-shrink-0">
                        <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Chain List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredChains?.map((chain: BlockchainData,index:number) => {
                  const isSelected = selected.some((c: BlockchainData) => c.id === chain.id)
                  const canSelect = selected.length < 4 || isSelected

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: canSelect ? 1.02 : 1 }}
                      className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-black dark:border-white bg-gray-100 dark:bg-gray-900"
                          : canSelect
                            ? "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700"
                            : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => canSelect && toggleSelection(chain)}
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <img src={chain.logo} alt={chain.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm sm:text-base text-black dark:text-white truncate">{chain.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{chain.symbol}</p>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isSelected ? (
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                          ) : canSelect ? (
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          ) : null}
                        </div>
                      </div>
                      
                      {/* Additional metrics for quick preview */}
                      <div className="space-y-0.5 sm:space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Market Cap:</span>
                          <span className="font-medium">${chain.marketCap}B</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TVL:</span>
                          <span className="font-medium">${chain.tvl}B</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TPS:</span>
                          <span className="font-medium">{chain.tps.toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
