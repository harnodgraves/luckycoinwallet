import { AddressType } from "luckycoinhdw/src/hd/types";

export const KEYRING_TYPE = {
  HdKeyring: "HD Key Tree",
  SimpleKeyring: "Simple Key Pair",
  Empty: "Empty",
};

export const IS_CHROME = /Chrome\//i.test(navigator.userAgent);

export const IS_LINUX = /linux/i.test(navigator.userAgent);

export const IS_WINDOWS = /windows/i.test(navigator.userAgent);

export const ADDRESS_TYPES: {
  value: AddressType;
  label: string;
  name: string;
  hdPath: string;
}[] = [
  {
    value: AddressType.P2PKH,
    label: "P2PKH",
    name: "Legacy (P2PKH)",
    hdPath: "m/44'/0'/0'/0",
  },
];

export const EVENTS = {
  broadcastToUI: "broadcastToUI",
  broadcastToBackground: "broadcastToBackground",
  SIGN_FINISHED: "SIGN_FINISHED",
  WALLETCONNECT: {
    STATUS_CHANGED: "WALLETCONNECT_STATUS_CHANGED",
    INIT: "WALLETCONNECT_INIT",
    INITED: "WALLETCONNECT_INITED",
  },
};

const CONTENT_URL =
  process.env.CONTENT_URL ?? "https://content.nintondo.io/api/pub";
const HISTORY_URL =
  process.env.HISTORY_URL ?? "https://history.nintondo.io/pub";

export const API_URL = "https://luckycoinexplorer.com";
export const EXPLORER_URL = "https://luckycoinexplorer.com";

export const RPC_URL = "https://feelinglucky.satsignal.io";

export const LUCKYCOIN_URL = "https://luckycoinfoundation.org";
export const SPLITTER_URL = LUCKYCOIN_URL + "/belinals/splitter";

export const getContentUrl = () => CONTENT_URL;

export const getHistoryUrl = () => HISTORY_URL;

export const DEFAULT_FEES = {
  fast: 20000,
  slow: 10000,
};

export const DEFAULT_SERVICE_FEE = 1_000_000;

export const DEFAULT_HD_PATH = ADDRESS_TYPES[0].hdPath;
