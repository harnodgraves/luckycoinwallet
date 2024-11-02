import { useGetCurrentAccount } from "@/ui/states/walletState";
import { TailSpin } from "react-loading-icons";
import AccountPanel from "./account-panel";
import s from "./styles.module.scss";
import TransactionList from "./transactions-list";
import WalletPanel from "./wallet-panel";

const Wallet = () => {
  const currentAccount = useGetCurrentAccount();

  if (!currentAccount) return <TailSpin className="animate-spin" />;

  return (
    <div className={s.walletDiv}>
      <WalletPanel />
      <AccountPanel />

      <TransactionList />
    </div>
  );
};

export default Wallet;
