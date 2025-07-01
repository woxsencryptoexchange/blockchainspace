import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  let client: MongoClient | null = null;
  
  try {
    const mongoUrl = process.env.MONGO_DB_URL;
    if (!mongoUrl) {
      return NextResponse.json({ error: 'MongoDB connection string not configured' }, { status: 500 });
    }
    
    client = new MongoClient(mongoUrl);
    await client.connect();
    
    const db = client.db('Blockchainspace');
    const collection = db.collection('chainsData');
    
    const document = await collection.findOne({ type: 'blockchain-data' });
    
    if (!document || !document.chains) {
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(document.chains, { status: 200 });
  } catch (error) {
    console.error('Error reading blockchain data:', error);
    return NextResponse.json({ error: 'Failed to load blockchain data' }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}