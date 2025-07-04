"use client"

import { useState, useEffect } from "react"
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { format } from "date-fns"

interface OHLCData {
  id: string
  timestamp: number
  open: { value: number }
  high: { value: number }
  low: { value: number }
  close: { value: number }
}

interface ChartData {
  timestamp: number
  time: string
  open: number
  high: number
  low: number
  close: number
  isPositive: boolean
}

interface PriceChartProps {
  data: OHLCData[]
  tokenSymbol?: string
}

const CustomCandlestick = ({ payload, x, y, width, height }: any) => {
  if (!payload) return null
  
  const { open, high, low, close, isPositive } = payload
  const bodyHeight = Math.abs(close - open)
  const bodyY = Math.min(open, close)
  const wickColor = isPositive ? "#22c55e" : "#ef4444"
  const bodyColor = isPositive ? "#22c55e" : "#ef4444"
  
  // Convert price values to pixel positions
  const candleHeight = height || 200
  const priceRange = high - low
  const pixelPerPrice = candleHeight / priceRange
  
  const highY = y - ((high - low) * pixelPerPrice)
  const lowY = y
  const openY = y - ((open - low) * pixelPerPrice)
  const closeY = y - ((close - low) * pixelPerPrice)
  const bodyPixelHeight = Math.abs(closeY - openY)
  const bodyPixelY = Math.min(openY, closeY)
  
  const candleWidth = Math.max(width * 0.6, 2)
  const wickWidth = 1
  const candleX = x + (width - candleWidth) / 2
  const wickX = x + width / 2
  
  return (
    <g>
      {/* High-Low Wick */}
      <line
        x1={wickX}
        y1={highY}
        x2={wickX}
        y2={lowY}
        stroke={wickColor}
        strokeWidth={wickWidth}
      />
      
      {/* Open-Close Body */}
      <rect
        x={candleX}
        y={bodyPixelY}
        width={candleWidth}
        height={Math.max(bodyPixelHeight, 1)}
        fill={bodyColor}
        stroke={bodyColor}
        strokeWidth={1}
      />
    </g>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const time = format(new Date(data.timestamp * 1000), "MMM dd, HH:mm")
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{time}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Open:</span>
            <span className="text-sm font-medium">${data.open.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">High:</span>
            <span className="text-sm font-medium text-green-600">${data.high.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Low:</span>
            <span className="text-sm font-medium text-red-600">${data.low.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Close:</span>
            <span className={`text-sm font-medium ${data.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              ${data.close.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function PriceChart({ data, tokenSymbol = "ETH" }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0)

  useEffect(() => {
    if (data && data.length > 0) {
      // Transform OHLC data for chart
      const transformedData = data.map((item) => ({
        timestamp: item.timestamp,
        time: format(new Date(item.timestamp * 1000), "HH:mm"),
        open: item.open.value,
        high: item.high.value,
        low: item.low.value,
        close: item.close.value,
        isPositive: item.close.value >= item.open.value
      }))

      // Sort by timestamp
      transformedData.sort((a, b) => a.timestamp - b.timestamp)
      setChartData(transformedData)

      // Calculate current price and change
      if (transformedData.length > 1) {
        const latest = transformedData[transformedData.length - 1]
        const previous = transformedData[0]
        
        setCurrentPrice(latest.close)
        const change = latest.close - previous.close
        const changePercent = (change / previous.close) * 100
        
        setPriceChange(change)
        setPriceChangePercent(changePercent)
      }
    }
  }, [data])

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading chart data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Price Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-black dark:text-white">
            ${currentPrice.toFixed(2)}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">24h</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Latest {tokenSymbol} Price</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {format(new Date(chartData[chartData.length - 1]?.timestamp * 1000), "MMM dd, HH:mm")}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Price line connecting close prices */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
            />
            
            {/* Reference line for current price */}
            <ReferenceLine 
              y={currentPrice} 
              stroke="#6b7280" 
              strokeDasharray="3 3" 
              strokeOpacity={0.5}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Price Trend</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-1 bg-gray-400 rounded-full opacity-50"></div>
          <span>Current Price Level</span>
        </div>
      </div>
    </div>
  )
}