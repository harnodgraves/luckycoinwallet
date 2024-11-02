import { shortAddress } from "@/shared/utils/transactions";
import CopyBtn from "@/ui/components/copy-btn";
import SplitWarn from "@/ui/components/split-warn";
import {
  useGetCurrentAccount,
  useGetCurrentWallet,
} from "@/ui/states/walletState";
import { useTransactionManagerContext } from "@/ui/utils/tx-ctx";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import cn from "classnames";
import { t } from "i18next";
import { Link } from "react-router-dom";
import s from "../styles.module.scss";

const AccountPanel = () => {
  const { currentPrice } = useTransactionManagerContext();
  const currentAccount = useGetCurrentAccount();
  const currentWallet = useGetCurrentWallet();

  const cardinalBalance = Number(currentAccount?.balance ?? 0);
  const cardinalBalanceStr = cardinalBalance.toFixed(5);
  const cardinalBalanceAfterDot = cardinalBalanceStr.split(".")[1];
  // const ordinalBalance = currentAccount?.inscriptionBalance ?? 0; // TODO: Implement inscription balance

  return (
    <div className={s.accPanel}>
      <div className="relative w-full flex">
        <div className={s.balance}>
          <div className="flex items-end justify-center gap-2">
            {currentAccount?.balance === undefined ? (
              <div className="pb-1">
                <div className="animate-pulse w-40 h-8 rounded-md bg-gray-600 bg-opacity-70" />
              </div>
            ) : (
              <div>
                <span>{Math.floor(cardinalBalance)}</span>
                <span className="text-2xl text-gray-400">
                  .{cardinalBalanceAfterDot}
                </span>
              </div>
            )}
            <span className="text-xl pb-0.5 text-slate-300">LKY</span>
          </div>
        </div>

        {currentAccount?.balance !== undefined ? (
          currentPrice !== undefined ? (
            <div className="text-gray-500 text-sm">
              ~{(cardinalBalance * currentPrice)?.toFixed(3)}$
            </div>
          ) : undefined
        ) : undefined}
      </div>

      <SplitWarn
        extraWidth
        message="Some of your coins are locked in UTXOs with inscriptions!"
      />

      <div className="flex gap-3 items-center">
        {currentWallet?.type === "root" ? (
          <Link to={"/pages/switch-account"}>
            <ListBulletIcon
              title={"Switch account"}
              className={s.accountsIcon}
            />
          </Link>
        ) : undefined}
        <div>
          <p>
            {currentAccount?.id === 0 &&
            !currentWallet?.hideRoot &&
            currentWallet?.type === "root"
              ? "Root account"
              : currentAccount?.name}
          </p>
          <CopyBtn
            title={currentAccount?.address}
            className={s.accPubAddress}
            label={shortAddress(currentAccount?.address, 9)}
            value={currentAccount?.address}
          />
        </div>
      </div>

      <div className={cn(s.receiveSendBtns)}>
        <Link to={"/pages/receive"} className={s.btn}>
          <ArrowDownLeftIcon className={s.icon} />
          <span>{t("wallet_page.receive")}</span>
        </Link>
        <Link to={"/pages/create-send"} className={s.btn}>
          <span>{t("wallet_page.send")}</span>
          <ArrowUpRightIcon className={s.icon} />
        </Link>
      </div>
    </div>
  );
};

export default AccountPanel;
