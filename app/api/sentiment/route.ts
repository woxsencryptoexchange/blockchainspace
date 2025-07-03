import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: 'Symbol parameter is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://www.coingecko.com/sentiment_votes/voted_coin_today?api_symbol=${symbol}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      }
    );

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Info unavailable', 
        bullish: 0, 
        bearish: 0 
      }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Sentiment API error:', error);
    return NextResponse.json({ 
      error: 'Info unavailable', 
      bullish: 0, 
      bearish: 0 
    }, { status: 200 });
  }
}