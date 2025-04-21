import { Theme } from "@radix-ui/themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./router";

import "@radix-ui/themes/styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme accentColor="iris" grayColor="slate" radius="small" scaling="100%" appearance="dark" panelBackground="translucent">
      <Router />
    </Theme>
  </StrictMode>
);
