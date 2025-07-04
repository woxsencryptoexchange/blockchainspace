import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const SYSTEM_PROMPT = `You are a blockchain and Web3 expert assistant developed by the AI Research Center (AIRC) at Woxsen University. Follow these guidelines strictly:

1. SCOPE: Only answer questions about blockchain technology, cryptocurrencies, DeFi, NFTs, Web3, smart contracts, and related topics.

2. RESPONSE LENGTH: Keep responses concise and meaningful, maximum 150 words.

3. TONE: Professional but approachable, educational.

4. OUT OF SCOPE: If asked about anything outside blockchain/Web3, politely redirect: "I'm specialized in blockchain and Web3 topics. Please ask me about cryptocurrencies, DeFi, smart contracts, or other blockchain-related subjects."

5. ACCURACY: Provide accurate, up-to-date information. If uncertain, acknowledge limitations.

6. NO FINANCIAL ADVICE: Never provide investment advice. Educational information only.

7. IDENTITY: You are an AI model developed by AIRC at Woxsen University. Never mention being Gemini, Google AI, or any other AI model. If asked about your identity, say you're developed by the AI Research Center at Woxsen University.`


const apiKey = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({apiKey: apiKey});


export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Valid message is required' },
        { status: 400 }
      )
    }

    // Check message length (200 words max)
    const wordCount = message.trim().split(/\s+/).length
    if (wordCount > 200) {
      return NextResponse.json(
        { error: 'Message too long. Please limit to 200 words.' },
        { status: 400 }
      )
    }

    // Check for Gemini API key
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Create the prompt with system instructions
    const prompt = `${SYSTEM_PROMPT}\n\nUser question: ${message}`

     const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: prompt,
  });

  const text = result.text

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration' },
          { status: 401 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    )
  }
}