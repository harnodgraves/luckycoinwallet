import i18n from "@/shared/locales/i18n";
import Tile from "@/ui/components/tile";
import { useAppState } from "@/ui/states/appState";
import { ss } from "@/ui/utils";
import s from "./styles.module.scss";

const Language = () => {
  const { updateAppState } = useAppState(ss(["updateAppState"]));

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await updateAppState({ language: lng });
    window.location.reload();
  };

  const newLanguage = (lng: string) => {
    return async () => {
      await changeLanguage(lng);
    };
  };

  return (
    <div className={s.languages}>
      <Tile label="English" onClick={newLanguage("en")} />
      <Tile label="Русский" onClick={newLanguage("ru")} />
      <Tile label="中文" onClick={newLanguage("ch")} />
      <Tile label="한국어" onClick={newLanguage("kr")} />
    </div>
  );
};

export default Language;
