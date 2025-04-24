/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";

export const Scalings = ["90%", "95%", "100%", "105%", "110%"] as const;
export const Appearances = ["light", "dark"] as const;
export const PanelBackgrounds = ["solid", "translucent"] as const;
export const AccentColors = [
  "gray",
  "brown",
  "bronze",
  "ruby",
  "red",
  "crimson",
  "tomato",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "sky",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "mint",
  "lime",
  "gold",
  "amber",
  "orange",
  "yellow"
] as const;

type Scalings = (typeof Scalings)[number];
type Appearences = (typeof Appearances)[number];
type PanelBackgrounds = (typeof PanelBackgrounds)[number];
type AccentColors = (typeof AccentColors)[number];

type GlobalState = {
  scaling: Scalings;
  setScalign: (state: Scalings) => void;

  appearance: Appearences;
  setAppearance: (state: Appearences) => void;

  panelBg: PanelBackgrounds;
  setPanelBg: (scaling: PanelBackgrounds) => void;

  accentColors: AccentColors;
  setAccentColors: (scaling: AccentColors) => void;
};

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [scaling, setScalign] = useState<Scalings>("100%");
  const [appearance, setAppearance] = useState<Appearences>("dark");
  const [panelBg, setPanelBg] = useState<PanelBackgrounds>("translucent");
  const [accentColors, setAccentColors] = useState<AccentColors>("indigo");

  const value = {
    scaling,
    setScalign,
    appearance,
    setAppearance,
    panelBg,
    setPanelBg,
    accentColors,
    setAccentColors,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext deve ser usado dentro de GlobalProvider");
  return context;
};
