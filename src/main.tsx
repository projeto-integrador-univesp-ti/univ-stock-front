import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./router";

import "@radix-ui/themes/styles.css";
import { GlobalProvider } from "./contexts/GlobalContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalProvider>
      <Router />
    </GlobalProvider>
  </StrictMode>
);
