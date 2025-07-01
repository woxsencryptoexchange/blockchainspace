

export async function GetChains() {
  try {
    const res = await fetch("https://api.llama.fi/v2/chains");
    if (!res.ok) {
      return { error: "Failed to fetch data" };
    }
    let data: any = await res.json();

    // arrange chins by max to min tvl...
    data.sort((a: any, b: any) => {
      return b.tvl - a.tvl;
    });

    data = data.slice(0,53); // Limit to top 50 chains
    
    let blockchainData = data.map((chain: any) => ({
     id:chain.chainId,
     name:chain.name,
     symbol: chain.tokenSymbol,
     gecko_id: ["blast","base","morph","goat","bob","taiko"].includes(chain.name.toLowerCase()) ? chain.name.toLowerCase():chain.gecko_id,
     cmcId: chain.cmcId,
     image: `https://icons.llamao.fi/icons/chains/rsz_${chain.name.toLowerCase()}?w=48&h=48`,
     tvl:chain.tvl
    }));

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

      // Soneium -> mulit bridge token...
      // Lenia -> mulit bridge token...
      // unichain -> mulit bridge token...

    }

    blockchainData = blockchainData.filter((chain: any) => {
       return chain.gecko_id && chain.gecko_id !== "null" && chain.gecko_id !== "undefined";
    })

    return blockchainData;    
    
  } catch (error) {
    console.error("Error fetching chains:", error);
    return { error: "An Error Occured" };
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
