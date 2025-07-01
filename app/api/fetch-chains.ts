

export interface BlockchainData {
  id: number;
  name: string;
  logo: string;
  symbol: string;
  marketCap: number;
  tvl: number;
  tps: number;
}

export async function GetChains() {
  try {
    // Fetch chains data from DeFiLlama
    const chainsRes = await fetch("https://api.llama.fi/v2/chains");
    if (!chainsRes.ok) {
      return { error: "Failed to fetch chains data" };
    }
    let chainsData: any = await chainsRes.json();

    // Sort chains by TVL (max to min)
    chainsData.sort((a: any, b: any) => b.tvl - a.tvl);
    chainsData = chainsData.slice(0, 53); // Limit to top 53 chains

    // Map to initial structure
    let blockchainData = chainsData.map((chain: any) => ({
      id: chain.chainId,
      name: chain.name,
      symbol: chain.tokenSymbol,
      gecko_id: ["blast","base","morph","goat","bob","taiko"].includes(chain.name.toLowerCase()) ? chain.name.toLowerCase() : chain.gecko_id,
      logo: `https://icons.llamao.fi/icons/chains/rsz_${chain.name.toLowerCase()}?w=48&h=48`,
      tvl: chain.tvl,
      marketCap: 0,
      tps: 0
    }));


    // Handle special gecko_id cases
    for(let i = 0; i < blockchainData.length; i++) {
      if(blockchainData[i].name == "BSquared") {
        blockchainData[i].gecko_id = "bsquared-network";
      }
      if(blockchainData[i].name == "Hemi"){
        blockchainData[i].gecko_id = "hemis";
      }
      if(blockchainData[i].name == "Bitlayer"){
        blockchainData[i].gecko_id = "bitlayer-bitvm";
      }
      if(blockchainData[i].name == "AILayer"){
        blockchainData[i].gecko_id = "ailayer-token";
      }

      if(blockchainData[i].name == "PulseChain"){
          blockchainData[i].id = 369;
       }

      if(blockchainData[i].name == "Flare"){
        blockchainData[i].id = 14;
      }

    }

    // Filter out chains without valid gecko_id
    blockchainData = blockchainData.filter((chain: any) => {
       return chain.gecko_id && chain.gecko_id !== "null" && chain.gecko_id !== "undefined";
    });

    // ALL TOP 50 TOKENS RECEIVED WITH BASIC DATA [id,name,symbol,gecko_id,logo,tvl,marketCap,tps]

    // Fetch market cap data from CoinGecko
    const geckoIds = blockchainData.map((chain: any) => chain.gecko_id).join(',');
    try {
      const marketRes = await fetch(`https://api.coingecko.com/api/v3/coins/markets?ids=${geckoIds}&vs_currency=usd&order=market_cap_desc&per_page=250&page=1`);
      if (marketRes.ok) {
        const marketData = await marketRes.json();
        
        // Update market cap data
        blockchainData.forEach((chain: any) => {
          const marketInfo = marketData.find((market: any) => market.id === chain.gecko_id);
          if (marketInfo) {
            chain.marketCap = marketInfo.market_cap ? Math.round(marketInfo.market_cap / 1000000000 * 100) / 100 : 0; // Convert to billions
            chain.logo = marketInfo.image ? marketInfo.image : chain.logo; 
            console.log(`Updated ${chain.name} images : $${chain.logo}`);
          }
        });
      }
    } catch (error) {
      console.warn("Failed to fetch market cap data:", error);
    }

    // Add estimated TPS data (since this varies greatly and real-time data is hard to get)
    const tpsData: {[key: string]: number} = {
      'ethereum': 15,
      'bitcoin': 7,
      'binancecoin': 160,
      'solana': 65000,
      'cardano': 250,
      'matic-network': 7000,
      'avalanche-2': 4500,
      'polkadot': 1000,
      'near': 100000,
      'fantom': 25000,
      'harmony': 2000,
      'hedera-hashgraph': 10000,
      'internet-computer': 11500,
      'arbitrum': 40000,
      'optimism': 2000,
      'aptos': 160000,
      'sui': 120000,
      'cosmos': 10000,
      'algorand': 1000,
      'tezos': 40,
      'stellar': 3000,
      'vechain': 10000,
      'injective-protocol': 10000,
      'thorchain': 1000,
      'zilliqa': 2828,
      'elrond-erd-2': 15000,
      'waves': 100,
      'iota': 1000,
      'nano': 1000,
      'mina-protocol': 1000
    };

    // Update TPS data
    blockchainData.forEach((chain: any) => {
      chain.tps = tpsData[chain.gecko_id] || 100; // Default TPS if not found
    });

    // Create final clean data structure
    const finalData: BlockchainData[] = blockchainData.map((chain: any, index: number) => ({
      id: chain.id || index + 1,
      name: chain.name,
      logo: chain.logo,
      symbol: chain.symbol || 'N/A',
      marketCap: chain.marketCap,
      tvl: Math.round(chain.tvl / 1000000000 * 100) / 100, // Convert to billions
      tps: chain.tps
    }));

    // Save to JSON file via API route
    try {
      await fetch('/api/save-blockchain-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      console.log('💯💯💯💯 Blockchain data saved successfully');
      
    } catch (error) {
      console.warn('Failed to save data to file:', error);
    }
    
    return finalData;
    
  } catch (error) {
    console.error("Error fetching chains:", error);
    return { error: "An Error Occurred" };
  }
}

// https://api.llama.fi/v2/chains
// chainId: 1;
// cmcId: "1027";
// gecko_id: "ethereum";
// name: "Ethereum";
// tokenSymbol: "ETH";
// tvl: 62320718362.34265; 


//⭐ get data by coingeko_id:  https://api.coingecko.com/api/v3/coins/polygon-ecosystem-token (description,images,categories,links,country_origin,price,MCAP,market_cap_rank,total_supply,tickers,24 or day or week volume data and all)
//⭐ MULTI  https://api.coingecko.com/api/v3/coins/markets?ids=bitcoin%2Cethereum%2Cbinancecoin%2Cripple%2Ccardano&locale=en&source=geckowidgets&vs_currency=usd

// MARKET SENTEMENT: https://www.coingecko.com/sentiment_votes/voted_coin_today?api_symbol=ethereum

// https://api.llama.fi/overview/options/ethereum?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyPremiumVolume

// "total24h": 14347,
//   "total48hto24h": 21593,
//   "total7d": 116416,
//   "total14dto7d": 358777,
//   "total60dto30d": 1267881,
//   "total30d": 1392973,
//   "total1y": 40280655,
//   "change_1d": -33.56,
//   "change_7d": -1.78,
//   "change_1m": 28.71,
//   "change_7dover7d": -67.55,
//   "change_30dover30d": 9.87,
//   "total7DaysAgo": 14607,
//   "total30DaysAgo": 11147,
//   "totalAllTime": 211987529,


// IMAGE : https://icons.llamao.fi/icons/chains/rsz_polygon?w=48&h=48


// https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
// {
//   "ethereum": {
//     "usd": 2472.19
//   }
// }


    // gas price ... // https://api.blocknative.com/gasprices/blockprices?chainid=8453



// Detailed Discription: https://api.coinpaprika.com/v1/coins/sol-solana 

// https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true


// FREE GAS PRICE API:

// https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=7T4VWK94B8IK5Q8BWYM8BW6WXAAM2SUNX4
// https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YKVKNKRSR5IT5VM1W27MDZ5NX7KG2HGS2Q
