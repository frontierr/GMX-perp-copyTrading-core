"use strict";

var ARBITRUM_RPC = ["https://arb-mainnet.g.alchemy.com/v2/demo", "https://endpoints.omniatech.io/v1/arbitrum/one/public", "https://arbitrum.blockpi.network/v1/rpc/public", "https://arbitrum-one.public.blastapi.io", "https://rpc.ankr.com/arbitrum", "https://arb1.arbitrum.io/rpc", "https://1rpc.io/arb", "https://arb-mainnet.g.alchemy.com/v2/".concat(process.env.ALCHEMY_KEY)];
var ARBITRUM_GOERLI_RPC = ["https://arb-goerli.g.alchemy.com/v2/demo", "https://arbitrum-goerli.public.blastapi.io", "https://endpoints.omniatech.io/v1/arbitrum/goerli/public", "https://goerli-rollup.arbitrum.io/rpc"];
module.exports = {
  ARBITRUM_RPC: ARBITRUM_RPC,
  ARBITRUM_GOERLI_RPC: ARBITRUM_GOERLI_RPC
};