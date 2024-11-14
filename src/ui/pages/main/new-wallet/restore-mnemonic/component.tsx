import { ADDRESS_TYPES, DEFAULT_HD_PATH } from "@/shared/constant";
import SelectWithHint from "@/ui/components/select-hint/component";
import SwitchAddressType from "@/ui/components/switch-address-type";
import { useCreateNewWallet } from "@/ui/hooks/wallet";
import cn from "classnames";
import { t } from "i18next";
import { networks } from "luckycoinjs-lib";
import { useState } from "react";
import toast from "react-hot-toast";
import { TailSpin } from "react-loading-icons";
import { useNavigate } from "react-router-dom";
import s from "./styles.module.scss";

const RestoreMnemonic = () => {
  const [step, setStep] = useState(1);
  const [addressType, setAddressType] = useState(ADDRESS_TYPES[0].value);
  const [mnemonicPhrase, setMnemonicPhrase] = useState<(string | undefined)[]>(
    new Array(12).fill("")
  );
  const createNewWallet = useCreateNewWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const setMnemonic = (v: string, index: number) => {
    if (!v) {
      return;
    }
    const phrase = v.split(" ");
    if (phrase.length === 12) setMnemonicPhrase(phrase);
    else {
      setMnemonicPhrase((prev) => {
        prev[index] = v;
        return prev;
      });
    }
  };

  const onNextStep = () => {
    if (mnemonicPhrase.some((f) => !f))
      toast.error(t("new_wallet.restore_mnemonic.incomplete_phrase_error"));
    else setStep(2);
  };

  const onRestore = async () => {
    setLoading(true);
    try {
      await createNewWallet({
        payload: mnemonicPhrase.join(" "),
        walletType: "root",
        addressType,
        hideRoot: !false,
        network: networks.luckycoin,
        hdPath: DEFAULT_HD_PATH,
      });
      navigate("/home");
    } catch (e) {
      console.error(e);
      toast.error(t("new_wallet.restore_mnemonic.invalid_words_error"));
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <TailSpin className="animate-spin" />;

  return (
    <div className={s.restoreMnemonic}>
      <div className={s.stepTitle}>
        <p className={step === 1 ? s.active : ""}>{t("new_wallet.step_1")}</p>
        <p className={step === 2 ? s.active : ""}>{t("new_wallet.step_2")}</p>
      </div>
      {step === 1 ? (
        <div className={cn(s.step, "justify-between")}>
          <div className={s.phrase}>
            {new Array(12).fill("").map((_, index) => (
              <div key={index} className={s.word}>
                <p className="w-6">{index + 1}.</p>
                <SelectWithHint
                  selected={mnemonicPhrase[index]}
                  setSelected={(v) => setMnemonic(v, index)}
                />
              </div>
            ))}
          </div>
          <div>
            <button className="bottom-btn" onClick={onNextStep}>
              {t("new_wallet.continue")}
            </button>
          </div>
        </div>
      ) : (
        <div className={cn(s.step, "justify-between pb-2")}>
          <SwitchAddressType
            handler={setAddressType}
            selectedType={addressType}
          />

          <div className="h-11">
            <button onClick={onRestore} className="bottom-btn">
              {t("new_wallet.continue")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestoreMnemonic;
