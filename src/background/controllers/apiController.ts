import { API_URL, RPC_URL } from "@/shared/constant";

import type {
  ApiUTXO,
  IAccountStats,
  ITransaction,
} from "@/shared/interfaces/api";
import {
  ContentDetailedInscription,
  ContentInscriptionResopnse,
  FindInscriptionsByOutpointResponseItem,
} from "@/shared/interfaces/inscriptions";
import { IToken } from "@/shared/interfaces/token";
import { customFetch, fetchProps } from "@/shared/utils";
import { isValidTXID } from "@/ui/utils";

export interface UtxoQueryParams {
  hex?: boolean;
  amount?: number;
}

export interface IApiController {
  getUtxos(
    address: string,
    params?: UtxoQueryParams
  ): Promise<ApiUTXO[] | undefined>;
  pushTx(rawTx: string): Promise<{ txid?: string; error?: string }>;
  getTransactions(address: string): Promise<ITransaction[] | undefined>;
  getPaginatedTransactions(
    address: string,
    txid: string
  ): Promise<ITransaction[] | undefined>;
  getLKYPrice(): Promise<{ usd: number } | undefined>;
  getLastBlockLKY(): Promise<number | undefined>;
  getAccountStats(address: string): Promise<IAccountStats | undefined>;
  getTokens(address: string): Promise<IToken[] | undefined>;
  getTransactionHex(txid: string): Promise<string | undefined>;
  getTransaction(txid: string): Promise<ITransaction | undefined>;
  getUtxoValues(outpoints: string[]): Promise<number[] | undefined>;
  getContentPaginatedInscriptions(
    address: string,
    page: number
  ): Promise<ContentInscriptionResopnse | undefined>;
  searchContentInscriptionByInscriptionId(
    inscriptionId: string
  ): Promise<ContentDetailedInscription | undefined>;
  searchContentInscriptionByInscriptionNumber(
    address: string,
    number: number
  ): Promise<ContentInscriptionResopnse | undefined>;
  getLocationByInscriptionId(
    inscriptionId: string
  ): Promise<{ location: string; owner: string } | undefined>;
  findInscriptionsByOutpoint(data: {
    outpoint: string;
    address: string;
  }): Promise<FindInscriptionsByOutpointResponseItem[] | undefined>;
}

type FetchType = <T>(props: fetchProps) => Promise<T | undefined>;

class ApiController implements IApiController {
  private fetch: FetchType = async (p) => {
    try {
      return await customFetch({
        ...p,
      });
    } catch {
      return;
    }
  };

  async getUtxos(address: string, params?: UtxoQueryParams) {
    if (params?.amount) {
      const res = await fetch(
        `${RPC_URL}/utxos/fetch_by_address/${address}/${params.amount}`
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        return data;
      }
    }

    const res = await fetch(`${RPC_URL}/utxos/all_by_address/${address}`);

    const data = await res.json();

    if (Array.isArray(data)) {
      return data;
    }
  }

  async pushTx(rawTx: string) {
    const res = await fetch(`${RPC_URL}/transaction/broadcast`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ signedtxhex: rawTx }),
    });

    const data = await res.json();

    if (isValidTXID(data.txid) && data.txid) {
      return data;
    } else {
      return {
        error: data.error?.message ?? "unknown error",
      };
    }
  }

  async getTransactions(address: string): Promise<ITransaction[] | undefined> {
    try {
      const res = await fetch(
        `${API_URL}/ext/getaddresstxs/${address}/0/20` // 20 latest transactions
      );

      if (!res.ok) return undefined;

      const transactions = (await res.json()) as {
        timestamp: number;
        txid: string;
        sent: number;
        received: number;
        balance: number;
      }[];

      const transactionPromises = transactions.map(async (tx) => {
        const txRes = await fetch(`${API_URL}/ext/gettx/${tx.txid}`);

        if (!txRes.ok) return undefined;

        return (await txRes.json()) as ITransaction;
      });

      const resolvedTransactions = await Promise.all(transactionPromises);

      return resolvedTransactions.filter(
        (tx): tx is ITransaction => tx !== undefined
      );
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return undefined;
    }
  }

  async getPaginatedTransactions(
    address: string,
    txid: string
  ): Promise<ITransaction[] | undefined> {
    try {
      return await this.fetch<ITransaction[]>({
        path: `/address/${address}/txs/chain/${txid}`,
        service: "content",
      });
    } catch (e) {
      return undefined;
    }
  }

  async getLastBlockLKY() {
    const res = await fetch(`${API_URL}/api/getblockcount`);

    if (!res.ok) {
      return undefined;
    }

    return Number(await res.text());
  }

  async getLKYPrice() {
    const res = await fetch(
      `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/market-pairs/latest?slug=luckycoin&start=1&limit=10&category=spot&centerType=all&sort=cmc_rank_advanced&direction=desc&spotUntracked=true`
    );

    if (!res.ok) {
      return undefined;
    }

    const data = (await res.json()) as {
      data: {
        marketPairs: {
          price: number;
        }[];
      };
    };

    return {
      usd: data.data.marketPairs[0].price,
    };
  }

  async getAccountStats(address: string): Promise<IAccountStats | undefined> {
    try {
      const res = await fetch(`${API_URL}/ext/getaddress/${address}`);

      if (!res.ok) throw new Error("Failed to fetch account stats");

      const data = (await res.json()) as
        | {
            balance: number;
          }
        | {
            error: string;
          };

      if ("error" in data) throw new Error(data.error);

      return {
        amount: 0, // TODO: implement
        count: 0, // TODO: implement
        balance: data.balance,
      };
    } catch {
      return { amount: 0, count: 0, balance: 0 };
    }
  }

  async getTokens(address: string): Promise<IToken[] | undefined> {
    return await this.fetch<IToken[]>({
      path: `/address/${address}/tokens`,
      service: "content",
    });
  }

  async getTransaction(txid: string) {
    return await this.fetch<ITransaction>({
      path: "/tx/" + txid,
      service: "content",
    });
  }

  async getTransactionHex(txid: string) {
    return await this.fetch<string>({
      path: "/tx/" + txid + "/hex",
      json: false,
      service: "content",
    });
  }

  async getUtxoValues(outpoints: string[]) {
    const result = await this.fetch<{ values: number[] }>({
      path: "/prev",
      body: JSON.stringify({ locations: outpoints }),
      method: "POST",
      service: "content",
    });
    return result?.values;
  }

  async getContentPaginatedInscriptions(address: string, page: number) {
    return await this.fetch<ContentInscriptionResopnse>({
      path: `/search?account=${address}&page_size=6&page=${page}`,
      service: "content",
    });
  }

  async searchContentInscriptionByInscriptionId(inscriptionId: string) {
    return await this.fetch<ContentDetailedInscription>({
      path: `/${inscriptionId}/info`,
      service: "content",
    });
  }

  async searchContentInscriptionByInscriptionNumber(
    address: string,
    number: number
  ) {
    return await this.fetch<ContentInscriptionResopnse>({
      path: `/search?account=${address}&page_size=6&page=1&from=${number}&to=${number}`,
      service: "content",
    });
  }

  async getLocationByInscriptionId(inscriptionId: string) {
    return await this.fetch<{ location: string; owner: string }>({
      path: `/location/${inscriptionId}`,
      service: "content",
    });
  }

  async findInscriptionsByOutpoint(data: {
    outpoint: string;
    address: string;
  }) {
    return await this.fetch<FindInscriptionsByOutpointResponseItem[]>({
      path: `/find_meta/${data.outpoint}?address=${data.address}`,
      service: "content",
    });
  }
}

export default new ApiController();
