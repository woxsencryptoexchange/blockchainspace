"use client"

import { motion } from "framer-motion"

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
  <motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="mb-8"
>
  <div className="relative w-20 h-20 mx-auto">
    {/* Outer Ring */}
    {/* <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 border-4 border-gray-200 dark:border-gray-800 rounded-full"
    /> */}

    {/* Inner Ring */}
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="absolute inset-2 border-4 border-t-blue-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full"
    />

    {/* Center Icon */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">₿</span>
      </div>
    </div>
  </div>
</motion.div>


        {/* Loading Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-black dark:text-white mb-2">BlockchainSpace</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Loading blockchain data...</p>

          {/* Progress Dots */}
          <div className="flex items-center justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.2,
                }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>

        {/* Loading Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { label: "Blockchains", value: "40+" },
            { label: "Networks", value: "Live" },
            { label: "Data Points", value: "1000+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="text-lg font-bold text-black dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
