import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { geckoId } = await req.json()

  if (!geckoId) {
    return NextResponse.json({ error: 'Missing geckoId' }, { status: 400 })
  }

  const url = `https://api.coingecko.com/api/v3/coins/${geckoId}/ohlc?vs_currency=usd&days=1`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`CoinGecko error: ${res.status}`)
    }

    const rawData: [number, number, number, number, number][] = await res.json()

    const chartData = rawData.map(([timestamp, open, high, low, close], index) => ({
      id: `${geckoId}-${index}`,
      timestamp,
      open: { value: open },
      high: { value: high },
      low: { value: low },
      close: { value: close },
    }))

    return NextResponse.json({ chart: chartData }, { status: 200 })
  } catch (error) {
    console.error('❌ Failed to fetch CoinGecko data:', error)
    return NextResponse.json({ error: 'Failed to fetch price chart' }, { status: 500 })
  }
}
