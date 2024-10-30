import {
  getTransactionValue,
  isIncomeTx,
  shortAddress,
} from "@/shared/utils/transactions";
import DateComponent from "@/ui/components/date";
import { useGetCurrentAccount } from "@/ui/states/walletState";
import { useTransactionManagerContext } from "@/ui/utils/tx-ctx";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import cn from "classnames";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import LoadingIcons, { TailSpin } from "react-loading-icons";
import { Link } from "react-router-dom";
import s from "../styles.module.scss";

const TransactionList = () => {
  const { transactions, loadMoreTransactions, currentPrice } =
    useTransactionManagerContext();
  const currentAccount = useGetCurrentAccount();
  const { ref, inView } = useInView();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inView) {
      setLoading(true);
      loadMoreTransactions().then(() => setLoading(false));
    }
  }, [inView, loadMoreTransactions]);

  if (!transactions || !currentAccount || !currentAccount.address)
    return (
      <div className="min-h-[50vh] w-full flex justify-center items-center">
        <TailSpin className="animate-spin" />
      </div>
    );

  if (!transactions.length)
    return (
      <p className={s.noTransactions}>{t("wallet_page.no_transactions")}</p>
    );

  return (
    <div className={s.transactionsDiv}>
      {Object.entries(
        Object.groupBy(transactions, (i) => {
          if (!i.tx.timestamp) {
            return "0";
          }
          const date = new Date(i.tx.timestamp * 1000);

          date.setHours(0, 0, 0, 0);

          return String(date.getTime());
        })
      ).map(([key, txs]) => {
        const isMempool = key === "0";

        if (!txs) return;

        return (
          <div className="w-full" key={key}>
            <div className="my-2 px-4 py-1.5 rounded-xl border border-neutral-700 font-medium uppercase sticky top-0 bg-neutral-900/50 backdrop-blur-sm z-10 w-max">
              {isMempool ? "Unconfirmed" : <DateComponent date={Number(key)} />}
            </div>

            {txs.map((t, txidx) => {
              const isIncome = isIncomeTx(t, currentAccount.address ?? "");
              const value = getTransactionValue(
                t,
                currentAccount.address ?? ""
              );
              const isConfirmed = t.confirmations >= 0;

              return (
                <Link
                  className={s.transaction}
                  key={key + ":" + txidx}
                  to={`/pages/transaction-info/${t.tx.txid}`}
                  state={{
                    transaction: t,
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <div
                      className={cn(
                        "rounded-full size-9 text-bg flex items-center justify-center relative",
                        {
                          "bg-gradient-to-r from-green-500/75 to-emerald-600/75":
                            isConfirmed,
                          "bg-gradient-to-r from-gray-500/75 to-gray-600/75":
                            !isConfirmed,
                        }
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          {
                            "text-green-200": isConfirmed,
                            "text-white": !isConfirmed,
                          }
                        )}
                      >
                        {isConfirmed ? (
                          !isIncome ? (
                            <ArrowUpIcon className="size-5" />
                          ) : (
                            <ArrowDownIcon className="size-5" />
                          )
                        ) : t.confirmations >= 0 ? (
                          <span className="text-base font-medium leading-3">
                            {t.confirmations} Confirmations
                          </span>
                        ) : (
                          <span className="text-base font-medium leading-3">
                            Unconfirmed
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-mono text-opacity-80 pt-1">
                      {shortAddress(t.tx.txid)}
                    </div>
                  </div>
                  <div>
                    <div
                      className={cn(s.value, {
                        "text-green-500": isIncome && isConfirmed,
                        "text-red-400": !isIncome && isConfirmed,
                        "text-gray-400": !isConfirmed,
                      })}
                    >
                      {isIncome ? "+ " : "- "}
                      {value} LKY
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      {parseFloat((currentPrice! * Number(value)).toFixed(6))} $
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}
      <div ref={ref} className="w-full py-1 ">
        {loading && <LoadingIcons.TailSpin className="w-6 h-6 mx-auto" />}
      </div>
    </div>
  );
};

export default TransactionList;
