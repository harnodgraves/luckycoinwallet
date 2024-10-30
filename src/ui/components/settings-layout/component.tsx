import { LUCKYCOINURL } from "@/shared/constant";
import { browserTabsCreate } from "@/shared/utils/browser";
import { FC, ReactNode } from "react";
import config from "../../../../package.json";
import s from "./styles.module.scss";

interface SettingsLayoutProps {
  children: ReactNode;
}

const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <div className={s.wrapper}>
      <div className={s.settings}>{children}</div>
      <div className={s.version}>
        Version <span>{config.version}</span> | By{" "}
        <a
          href="#"
          onClick={async () => {
            await browserTabsCreate({
              url: LUCKYCOINURL,
              active: true,
            });
          }}
        >
          LuckyCoin team
        </a>
      </div>
    </div>
  );
};

export default SettingsLayout;
