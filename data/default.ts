export const tpsData: { [key: string]: number } = {
  ethereum: 15,
  solana: 65000,
  bitcoin: 7,
  binancecoin: 160,            // BNB Chain
  tron: 144,                   // ~143.7 real-time :contentReference[oaicite:1]{index=1}
  base: 115,                   // ~114.7 real-time :contentReference[oaicite:2]{index=2}
  arbitrum: 21,                // ~21 real-time (Chainspect typical)
  hyperliquid: 20000,          // ~20k ops/sec :contentReference[oaicite:3]{index=3}
  sui: 27.6,                   // ~27.55 real-time :contentReference[oaicite:4]{index=4}
  "avalanche-2": 4500,
  "polygon-ecosystem-token": 7000, // Polygon
  aptos: 160000,
  "berachain-bera": 0,         // TPS data not available
  "sei-network": 61.2,         // ~61.16 real-time :contentReference[oaicite:5]{index=5}
  "sonic-3": 0,                // no data
  "bsquared-network": 0,       // no data :contentReference[oaicite:6]{index=6}
  coredaoorg: 0,               // no data :contentReference[oaicite:7]{index=7}
  "crypto-com-chain": 0,       // no data
  hemis: 0,
  optimism: 13,                // ~12.9 real-time
  taiko: 0,
  "bitlayer-bitvm": 0,
  rootstock: 0,
  gnosis: 0,
  pulsechain: 0,
  cardano: 250,
  "dydx-chain": 0,
  mantle: 0,
  eos: 0,
  "katana-inu": 0,
  "flare-networks": 0,
  "the-open-network": 0,
  kava: 0,
  near: 100000,
  bob: 0,
  hydradx: 0,
  plume: 0,
  goat: 0,
  blockstack: 0,              // Stacks
  mixin: 0,
  blast: 0,
  scroll: 0,
  "ailayer-token": 0,
  starknet: 0,
  stellar: 3000,
  flow: 0,
  morph: 0,
  "hedera-hashgraph": 10000,
  movement: 0,
  thorchain: 1000
};


export const rpcData: { [key: string]: [string, string] } = {
  ethereum: [
    "https://ethereum-rpc.publicnode.com",
    "wss://ethereum-rpc.publicnode.com"
  ],
  solana: [
    "https://api.mainnet-beta.solana.com",
    "wss://api.mainnet-beta.solana.com"
  ],
  bitcoin: [
    "https://bitcoin-rpc.publicnode.com",
    " "
  ],
  binancecoin: [
    "https://bsc-dataseed.binance.org/",
    "wss://bsc-ws-node.nariox.org:443"
  ],
  tron: [
    "https://api.trongrid.io",
    "wss://api.trongrid.io/wss"
  ],
  base: [
    "https://mainnet.base.org",
    "wss://mainnet.base.org/ws"
  ],
  arbitrum: [
    "https://arb1.arbitrum.io/rpc",
    "wss://arb1.arbitrum.io/ws"
  ],
  hyperliquid: [
    "https://rpc.hyperliquid.com",
    "wss://rpc.hyperliquid.com/ws"
  ],
  sui: [
    "https://fullnode.mainnet.sui.io",
    "wss://fullnode.mainnet.sui.io/ws"
  ],
  "avalanche-2": [
    "https://api.avax.network/ext/bc/C/rpc",
    "wss://api.avax.network/ext/bc/C/ws"
  ],
  "polygon-ecosystem-token": [
    "https://polygon-rpc.com",
    "wss://polygon-rpc.com/ws"
  ],
  aptos: [
    "https://fullnode.mainnet.aptoslabs.com",
    "wss://fullnode.mainnet.aptoslabs.com/ws"
  ],
  "berachain-bera": ["https://berachain-rpc.publicnode.com", "wss://berachain-rpc.publicnode.com"],
  "sei-network": [
    "https://sei-api.mainnet.sei.io",
    "wss://sei-ws.mainnet.sei.io"
  ],
  "sonic-3": ["https://sonic-rpc.publicnode.com:443", "wss://sonic-rpc.publicnode.com:443"],
  "bsquared-network": ["https://mainnet.b2-rpc.com", ""],
  coredaoorg: ["https://rpc.ankr.com/core", "wss://core.drpc.org"],
  "crypto-com-chain": ["https://cronos-evm-rpc.publicnode.com", "wss://cronos.drpc.org"],
  hemis: ["", ""],
  optimism: [
    "https://mainnet.optimism.io",
    "wss://mainnet.optimism.io/ws"
  ],
  taiko: ["", ""],
  "bitlayer-bitvm": ["", ""],
  rootstock: [
    "https://public-node.rsk.co",
    "wss://public-node.rsk.co/ws"
  ],
  gnosis: [
    "https://rpc.gnosischain.com",
    "wss://rpc.gnosischain.com/wss"
  ],
  pulsechain: ["", ""],
  cardano: [
    "https://cardano-mainnet.blockfrost.io/api/v0",
    ""
  ],
  "dydx-chain": ["https://dydx-rpc.publicnode.com:443", "wss://dydx-rpc.publicnode.com:443/websocket"],
  mantle: ["https://mantle-rpc.publicnode.com", "wss://mantle-rpc.publicnode.com"],
  eos: [
    "https://eos.greymass.com",
    "wss://eos.greymass.com/ws"
  ],
  "katana-inu": ["", ""],
  "flare-networks": ["", ""],
  "the-open-network": ["", ""],
  kava: [
    "https://evm.kava.io",
    "wss://evm.kava.io/ws"
  ],
  near: [
    "https://rpc.mainnet.near.org",
    "wss://rpc.mainnet.near.org/ws"
  ],
  bob: ["", ""],
  hydradx: ["", ""],
  plume: ["", ""],
  goat: ["", ""],
  blockstack: [
    "https://stacks-node-api.mainnet.stacks.co",
    "wss://stacks-node-api.mainnet.stacks.co/ws"
  ],
  mixin: ["", ""],
  blast: ["", ""],
  scroll: [
    "https://scroll.io/rpc",
    "wss://scroll.io/ws"
  ],
  "ailayer-token": ["", ""],
  starknet: [
    "https://starknet.io/rpc",
    "wss://starknet.io/ws"
  ],
  stellar: [
    "https://horizon.stellar.org",
    "wss://horizon.stellar.org"
  ],
  flow: [
    "https://access.mainnet.nodes.onflow.org",
    "wss://access.mainnet.nodes.onflow.org"
  ],
  morph: ["", ""],
  "hedera-hashgraph": [
    "https://hedera.api.onflow.org",
    "wss://hedera.api.onflow.org/ws"
  ],
  movement: ["", ""],
  thorchain: [
    "https://thorchain.net/rpc",
    "wss://thorchain.net/ws"
  ]
};
