import { ADDRESS_TYPES } from "@/shared/constant";
import { AddressType } from "luckycoinhdw";
import { FC } from "react";
import Tile from "../tile";
import s from "./styles.module.scss";

interface Props {
  handler: (type: AddressType) => void;
  selectedType: AddressType;
}

const SwitchAddressType: FC<Props> = ({ handler, selectedType }) => {
  return (
    <div className={s.allTypes}>
      {ADDRESS_TYPES.map((i) => (
        <Tile
          key={i.value}
          label={i.name.replace(/ \(.*\)$/, "")}
          description={i.label}
          onClick={() => handler(i.value)}
          selected={selectedType === i.value}
        />
      ))}
    </div>
  );
};

export default SwitchAddressType;
