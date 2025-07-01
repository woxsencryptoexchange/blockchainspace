import fs from 'fs';
import path from 'path';

export interface BlockchainData {
  id: number;
  name: string;
  logo: string;
  symbol: string;
  marketCap: number;
  tvl: number;
  tps: number;
}

export function getBlockchainData(): BlockchainData[] {
  try {
    const filePath = path.join(process.cwd(), 'data', 'blockchain-data.json');
    
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading blockchain data:', error);
    return [];
  }
}