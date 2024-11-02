import { EXPLORER_URL } from "@/shared/constant";
import { ITransaction } from "@/shared/interfaces/api";
import { browserTabsCreate } from "@/shared/utils/browser";
import { shortAddress } from "@/shared/utils/transactions";
import Modal from "@/ui/components/modal";
import { useControllersState } from "@/ui/states/controllerState";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { ss } from "@/ui/utils";
import { useTransactionManagerContext } from "@/ui/utils/tx-ctx";
import { LinkIcon } from "@heroicons/react/24/outline";
import cn from "classnames";
import { t } from "i18next";
import { FC, useEffect, useId, useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loading-icons";
import { useLocation, useParams } from "react-router-dom";
import s from "./styles.module.scss";

const TransactionInfo = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const currentAccount = useGetCurrentAccount();
  const { apiController } = useControllersState(ss(["apiController"]));

  const { state } = useLocation();
  const { txId } = useParams();
  const { transactions } = useTransactionManagerContext();
  const [tx, setTx] = useState(
    (state?.transaction as ITransaction | undefined) ??
      transactions?.find((i) => i.tx.txid === txId)
  );

  const onOpenExplorer = async () => {
    await browserTabsCreate({
      url: `${EXPLORER_URL}/tx/${txId}`,
      active: true,
    });
  };

  useEffect(() => {
    if (!state?.transaction && txId) {
      (async () => {
        const tx = await apiController.getTransaction(txId!);
        setTx(tx);
      })();
    }
  }, [state?.transaction, txId]);

  return (
    <div className={s.transactionInfoDiv}>
      {tx ? (
        <>
          <div className={s.transaction}>
            <div className={s.group}>
              <p className={s.transactionP}>{t("transaction_info.txid")}</p>

              <span>{tx.tx.txid}</span>
            </div>
            <div className={s.group}>
              <p className={s.transactionP}>
                {t("transaction_info.confirmations_label")}
              </p>
              <span>
                {tx.confirmations >= 0
                  ? `${tx.confirmations} Confirmations`
                  : "Unconfirmed"}
              </span>
            </div>
            <div className={s.group}>
              <p className={s.transactionP}>
                {t("transaction_info.value_label")}
              </p>
              <span>
                {tx.tx.vout.reduce((acc, cur) => cur.amount + acc, 0) / 10 ** 8}{" "}
                LKY
              </span>
            </div>

            <div className={s.summary} onClick={() => setOpenModal(true)}>
              <LinkIcon className="w-4 h-4" /> {t("transaction_info.details")}
            </div>

            <Modal
              onClose={() => setOpenModal(false)}
              open={openModal}
              title={t("transaction_info.details")}
            >
              <div className={s.tableContainer}>
                <TableItem
                  label={t("transaction_info.inputs")}
                  currentAddress={currentAccount?.address}
                  items={tx.tx.vin.map((i) => ({
                    scriptpubkey_address: i.addresses,
                    value: i.amount,
                  }))}
                />
                <TableItem
                  label={t("transaction_info.outputs")}
                  currentAddress={currentAccount?.address}
                  items={tx.tx.vout.map((i) => ({
                    scriptpubkey_address: i.addresses,
                    value: i.amount,
                  }))}
                />
              </div>
            </Modal>
          </div>
          <button className="bottom-btn" onClick={onOpenExplorer}>
            {t("transaction_info.open_in_explorer")}
          </button>
        </>
      ) : (
        <TailSpin className="animate-spin" />
      )}
    </div>
  );
};

interface ITableItem {
  items: {
    scriptpubkey_address: string;
    value: number;
  }[];
  currentAddress?: string;
  label: string;
}

const TableItem: FC<ITableItem> = ({ items, currentAddress, label }) => {
  const currentId = useId();

  const addressLength = (value: number) => {
    const newValue = (value / 10 ** 8).toFixed(2);
    if (newValue.length > 7) {
      return 9;
    }
    return 12;
  };

  return (
    <div className={s.table}>
      <h3>{label}:</h3>
      <div className={s.tableList}>
        {items.map((i, idx) => (
          <div
            key={`${currentId}${idx}`}
            className="border border-neutral-900 py-2 bg-neutral-950 rounded-xl px-3"
          >
            <div className={s.tableGroup}>
              <span>#{idx}</span>
              <span className={s.tableSecond}>
                {(i.value / 10 ** 8).toFixed(8)} LKY
              </span>
            </div>

            <div
              className={cn(s.address)}
              onClick={async () => {
                await navigator.clipboard.writeText(i.scriptpubkey_address);
                toast.success(t("transaction_info.copied"));
              }}
              title={i.scriptpubkey_address}
            >
              {i.scriptpubkey_address === currentAddress
                ? t("transaction_info.your_address")
                : shortAddress(i.scriptpubkey_address, addressLength(i.value))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionInfo;
