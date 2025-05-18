import { createRoot } from "react-dom/client";
import { Router } from "./router";

import "@radix-ui/themes/styles.css";
import "@radix-ui/themes/tokens/base.css";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalProvider } from "./contexts/GlobalContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <GlobalProvider>
    <Router />
  </GlobalProvider>
);
