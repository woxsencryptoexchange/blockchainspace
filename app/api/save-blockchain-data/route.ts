import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function POST(request: NextRequest) {
  let client: MongoClient | null = null;
  
  try {
    const data = await request.json();
    
    const mongoUrl = process.env.MONGO_DB_URL;
    if (!mongoUrl) {
      return NextResponse.json({ error: 'MongoDB connection string not configured' }, { status: 500 });
    }
    
    client = new MongoClient(mongoUrl);
    await client.connect();
    
    const db = client.db('Blockchainspace');
    const collection = db.collection('chainsData');
    
    const result = await collection.replaceOne(
      { type: 'blockchain-data' },
      {
        type: 'blockchain-data',
        chains: data,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      upserted: result.upsertedCount > 0,
      modified: result.modifiedCount > 0
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving blockchain data:', error);
    return NextResponse.json({ error: 'Failed to save blockchain data' }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}