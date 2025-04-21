import { Theme } from "@radix-ui/themes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@radix-ui/themes/styles.css";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

enum Path {
  Login = "/login",
  NotFound = "/not-found",
}

const Router = () => {
  return (
    <BrowserRouter>
      <Theme>
        <Routes>
          <Route path="/" element={<Navigate to={Path.Login} replace />} />
          <Route path={Path.Login} element={<Login />} />
          <Route path={Path.NotFound} element={<NotFound />} />
          <Route path="*" element={<Navigate to={Path.NotFound} replace />} />
        </Routes>
      </Theme>
    </BrowserRouter>
  );
};

export { Path, Router };

