import { DecryptedSecrets } from "@/background/services/storage/types";
import type { AddressType } from "luckycoinhdw/src/hd/types";
import { Network } from "luckycoinjs-lib";
import type { IAccount } from "./accounts";

export interface IWallet {
  id: number;
  accounts: IAccount[];
  name: string;
  addressType: AddressType;
  type: "simple" | "root";
  hideRoot?: boolean;
}

export interface IPrivateWallet extends IWallet {
  data: any;
  phrase?: string;
}

export interface IWalletStateBase {
  wallets: IWallet[];
  vaultIsEmpty: boolean;
  selectedWallet?: number;
  selectedAccount?: number;
}

export interface INewWalletProps {
  payload: string;
  walletType: "simple" | "root";
  addressType?: AddressType;
  name?: string;
  hideRoot?: boolean;
  restoreFrom?: "wif" | "hex";
  hdPath?: string;
  network: Network;
}

export interface DeleteWalletResult {
  wallets: IWallet[];
  selectedWallet?: number;
  selectedAccount: number;
}

export interface SaveWalletsPayload {
  phrases?: DecryptedSecrets;
  newPassword?: string;
  wallets?: IWallet[];
}
