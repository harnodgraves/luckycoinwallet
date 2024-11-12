import { ITransferToken } from "@/shared/interfaces/token";
import { inscribe } from "bells-inscriber";
import { ApiUTXO } from "bells-inscriber/lib/types";
import { t } from "i18next";
import { networks } from "luckycoinjs-lib";
import toast from "react-hot-toast";
import { useControllersState } from "../states/controllerState";
import { useGetCurrentAccount } from "../states/walletState";
import { isValidTXID, ss } from "../utils";

export const useInscribeTransferToken = () => {
  const { apiController, keyringController } = useControllersState(
    ss(["apiController", "keyringController"])
  );
  const currentAccount = useGetCurrentAccount();

  const getUtxos = async (): Promise<ApiUTXO[]> => {
    return ((await apiController.getUtxos(currentAccount!.address!)) ?? []).map(
      (f) => ({
        ...f,
        hex: f.hex,
        value: f.value,
      })
    );
  };

  return async (data: ITransferToken, feeRate: number) => {
    if (!currentAccount || !currentAccount.address) return;

    const txs = await inscribe({
      toAddress: currentAccount.address,
      fromAddress: currentAccount.address,
      data: Buffer.from(JSON.stringify(data)),
      feeRate,
      contentType: "application/json; charset=utf-8",
      publicKey: Buffer.from(
        await keyringController.exportPublicKey(currentAccount.address),
        "hex"
      ),
      signPsbt: keyringController.signPsbtBase64,
      getUtxos,
      network: networks.luckycoin,
    });

    const txIds: string[] = [];

    for (const i of txs) {
      txIds.push((await apiController.pushTx(i))?.txid ?? "");
    }

    if (txIds.every(isValidTXID))
      toast.success(t("inscriptions.transfer_inscribed"));
    else toast.error(t("inscriptions.failed_inscribe_transfer"));
  };
};
