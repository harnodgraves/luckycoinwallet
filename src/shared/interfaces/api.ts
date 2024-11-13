export type ApiUTXO = {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
  hex: string;
};

export interface AccountBalanceResponse {
  address: string;
  chain_stats: ChainStats;
  mempool_stats: MempoolStats;
}

export interface ChainStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export interface MempoolStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export interface ITransaction {
  txid: string;
  version: number;
  locktime: number;
  vin: [
    {
      txid: string;
      vout: number;
      prevout: {
        scriptpubkey_address: string;
        value: number;
      };
      is_coinbase: boolean;
      sequence: number;
    }
  ];
  vout: [
    {
      scriptpubkey_address: string;
      value: number;
    },
    {
      scriptpubkey_address: string;
      value: number;
    }
  ];
  size: number;
  weight: number;
  sigops: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
}

export interface Prevout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address: string;
  value: number;
}

export interface Status {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export interface ITransactionInfo {
  _id: string;
  txid: string;
  network: string;
  chain: string;
  blockHeight: number;
  blockHash: string;
  blockTime: string;
  blockTimeNormalized: string;
  coinbase: boolean;
  locktime: number;
  inputCount: number;
  outputCount: number;
  size: number;
  fee: number;
  value: number;
  confirmations: number;
}

export interface ISend {
  toAddress: string;
  fromAddress: string;
  amount: number;
  feeAmount: number;
  includeFeeInAmount: boolean;
  hex: string;
}

export interface IAccountStats {
  balance: number;
  amount: number;
  count: number;
}
