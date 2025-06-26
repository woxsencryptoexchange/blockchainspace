"use client";

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
    

    data = data.slice(0, 50); // limit to 20 chains

    console.log("Fetched chains:", data);

    const blockchainData = data.map((chain: any) => ({
     id:chain.chainId,
     name:chain.name,
     symbol: chain.tokenSymbol,
     image: `https://icons.llamao.fi/icons/chains/rsz_${chain.name.toLowerCase()}?w=48&h=48`,
    }));

    console.log(blockchainData);
    
  } catch (error) {
    console.error("Error fetching chains:", error);
    return { error: "An Error Occured" };
  }
}

// chainId: 1;
// cmcId: "1027";
// gecko_id: "ethereum";
// name: "Ethereum";
// tokenSymbol: "ETH";
// tvl: 62320718362.34265; 


//⭐ get data by coingeko_id:  https://api.coingecko.com/api/v3/coins/polygon-ecosystem-token (description,images,categories,links,country_origin,price,MCAP,market_cap_rank,total_supply,tickers,24 or day or week volume data and all)




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

