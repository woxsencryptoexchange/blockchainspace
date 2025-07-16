import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { geckoId } = await req.json()

  if (!geckoId) {
    return NextResponse.json({ error: 'Missing geckoId' }, { status: 400 })
  }

  console.log("🥲🥲🥲 🥲 : ",geckoId)

  const url = `https://api.coingecko.com/api/v3/coins/${geckoId}/market_chart?vs_currency=usd&days=30`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)

    const { prices } = await res.json()

    const grouped: Record<string, number[]> = {}

    prices.forEach(([timestamp, price]: [number, number]) => {
      const day = new Date(timestamp).toISOString().split('T')[0]
      if (!grouped[day]) grouped[day] = []
      grouped[day].push(price)
    })

    console.log("grouped is : ",grouped)

    const chartData = Object.entries(grouped).map(([day, prices], index) => {
      const timestamp = new Date(day).getTime()
      return {
        id: `${geckoId}-${index}`,
        timestamp,
        open: { value: prices[0] },
        high: { value: Math.max(...prices) },
        low: { value: Math.min(...prices) },
        close: { value: prices[prices.length - 1] }
      }
    })

    console.log("fucking chart data : ",chartData)

    return NextResponse.json({ chart: chartData }, { status: 200 })
  } catch (error) {
    console.error('❌ Error generating OHLC chart:', error)
    return NextResponse.json({ error: 'Failed to fetch price chart' }, { status: 500 })
  }
}
