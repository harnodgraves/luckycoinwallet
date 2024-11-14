import { shortAddress } from "@/shared/utils/transactions";
import Modal from "@/ui/components/modal";
import { useAppState } from "@/ui/states/appState";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";

import { ss } from "@/ui/utils";
import { t } from "i18next";
import s from "./styles.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setAddress: (address: string) => void;
}

const AddressBookModal: FC<Props> = ({ isOpen, onClose, setAddress }) => {
  const { addressBook, updateAppState } = useAppState(
    ss(["addressBook", "updateAppState"])
  );
  const [newAddress, setNewAddress] = useState<string>("");

  const onRemove = async (address: string) => {
    await updateAppState({
      addressBook: addressBook.filter((i) => i !== address),
    });
  };

  const onAdd = async () => {
    if (newAddress && !addressBook.includes(newAddress)) {
      await updateAppState({
        addressBook: [...addressBook, newAddress],
      });
      setNewAddress("");
    }
  };

  const onSelect = (address: string) => {
    setAddress(address);
    onClose();
  };

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
      title={t("send.create_send.address_book.address_book")}
    >
      {!addressBook.length ? (
        <div className={s.empty}>
          {t("send.create_send.address_book.no_addresses")}
        </div>
      ) : undefined}
      <div className={s.items}>
        {addressBook.map((i, idx) => (
          <div
            key={`ab-${idx}`}
            className={s.item}
            style={{
              marginBottom: idx === addressBook.length - 1 ? "1.5rem" : "0rem",
            }}
          >
            <div onClick={() => onSelect(i)} className={s.address}>
              {shortAddress(i, 17)}
            </div>
            <div className={s.remove} onClick={() => onRemove(i)}>
              <MinusCircleIcon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder={t("send.create_send.address_book.enter_address")}
          className={s.enteraddress}
        />
        <button onClick={onAdd}>
          <PlusCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </Modal>
  );
};

export default AddressBookModal;
