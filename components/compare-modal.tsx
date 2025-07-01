"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { blockchainData } from "@/data/blockchains"

interface CompareModalProps {
  isOpen: boolean
  onClose: () => void
  onCompare: (selectedChains: typeof blockchainData) => void
  selectedChains: any
}

export function CompareModal({ isOpen, onClose, onCompare, selectedChains }: CompareModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selected, setSelected] = useState<typeof blockchainData>(selectedChains)

  const filteredChains = blockchainData.filter(
    (chain) =>
      chain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chain.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleSelection = (chain: (typeof blockchainData)[0]) => {
    setSelected((prev) => {
      const isSelected = prev.some((c) => c.id === chain.id)
      if (isSelected) {
        return prev.filter((c) => c.id !== chain.id)
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
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white">Compare Blockchains</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Input
                  placeholder="Search blockchains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Selected: {selected.length}/4</span>
                  <Button
                    onClick={handleCompare}
                    disabled={selected.length < 2}
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    Compare ({selected.length})
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Chains */}
            {selected.length > 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected for comparison:</p>
                <div className="flex flex-wrap gap-2">
                  {selected.map((chain) => (
                    <Badge
                      key={chain.id}
                      variant="outline"
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-black dark:text-white"
                    >
                      {chain.logo} {chain.name}
                      <button onClick={() => toggleSelection(chain)} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Chain List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChains.map((chain) => {
                  const isSelected = selected.some((c) => c.id === chain.id)
                  const canSelect = selected.length < 4 || isSelected

                  return (
                    <motion.div
                      key={chain.id}
                      whileHover={{ scale: canSelect ? 1.02 : 1 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-black dark:border-white bg-gray-100 dark:bg-gray-900"
                          : canSelect
                            ? "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700"
                            : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => canSelect && toggleSelection(chain)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-xl">{chain.logo}</div>
                          <div>
                            <h3 className="font-semibold text-black dark:text-white">{chain.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{chain.symbol}</p>
                          </div>
                        </div>
                        {isSelected ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : canSelect ? (
                          <Plus className="w-5 h-5 text-gray-400" />
                        ) : null}
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
