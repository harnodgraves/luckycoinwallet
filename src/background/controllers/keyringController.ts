import type { IPrivateWallet } from "@/shared/interfaces";
import type { AddressType } from "luckycoinhdw";
import { Network, Psbt } from "luckycoinjs-lib";
import { keyringService } from "../services";
import type { Hex, SendLKY } from "../services/keyring/types";

export interface IKeyringController {
  init(password: string): Promise<IPrivateWallet[]>;
  newKeyring(
    type: "simple" | "root",
    payload: string,
    network: Network,
    hdPath?: string
  ): Promise<string | undefined>;
  exportAccount(address: Hex): Promise<string>;
  signTransaction(txHex: string): Promise<string>;
  signMessage(msgParams: { from: string; data: string }): Promise<string>;
  signPersonalMessage(msgParams: {
    from: string;
    data: string;
  }): Promise<string>;
  sendLKY(data: SendLKY): Promise<string>;
  // TODO: uncomment when inscription transactions are implemented
  // sendOrd(data: Omit<SendOrd, "amount">): Promise<string>;
  changeAddressType(
    walletIndex: number,
    addressType: AddressType
  ): Promise<string[]>;
  exportPublicKey(address: string): Promise<string>;
  serializeKeyringById(index: number): Promise<any>;
  // TODO: uncomment when inscription transactions are implemented
  // createSendMultiOrd(
  //   toAddress: string,
  //   feeRate: number,
  //   ordUtxos: OrdUTXO[],
  //   utxos: ApiUTXO[],
  //   network: Network
  // ): Promise<string>;
  signPsbtBase64(psbtBase64: string): Promise<string>;
}

class KeyringController implements IKeyringController {
  /**
   * Method should be called after user typed a password
   * @param {string} password Password that used on creating account
   * @returns {Promise<IPrivateWallet[]>} List of imported accounts that was initialized
   */
  async init(password: string): Promise<IPrivateWallet[]> {
    return await keyringService.init(password);
  }

  /**
   * Method should be called to create a new wallet from mnemonic
   * @param {"simple" | "root"} type Type of wallet that should be created
   * @param {string} payload Phrases string words separated by space that generated for wallet or private key hex format
   * @returns {Promise<string | undefined>} P2PWKH address of created wallet
   */
  async newKeyring(
    walletType: "simple" | "root",
    payload: string,
    network: Network,
    hdPath?: string
  ): Promise<string | undefined> {
    return keyringService.newKeyring({ walletType, payload, hdPath, network });
  }

  /**
   * Method exports private key of selected account
   * @param {Hex} address P2WPKH address of account
   * @returns {Promise<string>} WIF representation of private key
   */
  async exportAccount(address: Hex): Promise<string> {
    return keyringService.exportAccount(address);
  }

  /**
   * Method should be used to sign a new transaction before broadcasting it
   * @param {string} txHex Psbt builded transaction with inputs that should be signed and hexed
   * @returns {Promise<string>} Method mutate input transaction and with that returns nothing
   */
  async signTransaction(txHex: string): Promise<string> {
    const psbt = Psbt.fromHex(txHex);
    (psbt as any).__CACHE.__UNSAFE_SIGN_NONSEGWIT = true;
    keyringService.signPsbt(psbt);
    (psbt as any).__CACHE.__UNSAFE_SIGN_NONSEGWIT = false;
    return psbt.toHex();
  }

  async signPsbtBase64(
    psbtBase64: string,
    disableTweakSigner?: boolean
  ): Promise<string> {
    const psbt = Psbt.fromBase64(psbtBase64);
    keyringService.signPsbt(psbt, disableTweakSigner);
    return psbt.toBase64();
  }

  async signMessage(msgParams: { from: string; data: string }) {
    return keyringService.signMessage(msgParams);
  }

  async signPersonalMessage(msgParams: { from: string; data: string }) {
    return keyringService.signPersonalMessage(msgParams);
  }

  /**
   * Method should be used to create hex of transaction and sigs all inputs
   * @param {SendLKY} data Input data for the transaction
   * @returns {Promise<string>} Hex of transaction to push transaction to the blockchain with
   */
  async sendLKY(data: SendLKY): Promise<string> {
    return await keyringService.sendLKY(data);
  }

  // TODO: uncomment when inscription transactions are implemented
  // async sendOrd(data: Omit<SendOrd, "amount">): Promise<string> {
  //   return await keyringService.sendOrd(data);
  // }

  async exportPublicKey(address: string): Promise<string> {
    return keyringService.exportPublicKey(address);
  }

  async changeAddressType(
    walletIndex: number,
    addressType: AddressType
  ): Promise<string[]> {
    return keyringService.changeAddressType(walletIndex, addressType);
  }

  async serializeKeyringById(index: number) {
    return keyringService.serializeById(index);
  }

  // TODO: uncomment when inscription transactions are implemented
  // async createSendMultiOrd(
  //   toAddress: string,
  //   feeRate: number,
  //   ordUtxos: OrdUTXO[],
  //   utxos: ApiUTXO[]
  // ): Promise<string> {
  //   return keyringService.sendMultiOrd(toAddress, feeRate, ordUtxos, utxos);
  // }
}

export default new KeyringController();
