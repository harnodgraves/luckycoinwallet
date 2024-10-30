import Tile from "@/ui/components/tile";
import { TileProps } from "@/ui/components/tile/component";
import { KeyIcon } from "@heroicons/react/24/outline";

import SettingsLayout from "@/ui/components/settings-layout";
import { t } from "i18next";

const ICON_SIZE = 8;
const ICON_CN = `w-${ICON_SIZE} h-${ICON_SIZE}`;

const Security = () => {
  const items: TileProps[] = [
    {
      icon: <KeyIcon className={ICON_CN} />,
      label: t("components.layout.change_password"),
      link: "/pages/change-password",
    },
  ];

  return (
    <SettingsLayout>
      {items.map((i) => (
        <Tile key={i.label} {...i} />
      ))}
    </SettingsLayout>
  );
};

export default Security;
