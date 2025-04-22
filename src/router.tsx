import { Theme } from "@radix-ui/themes";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "@radix-ui/themes/styles.css";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { PrincipalTemplate } from "./template/PrincipalTemplate";

enum Path {
  Login = "/login",
  Dashboard = "/stock/dashboard",
  PointOfSale = "/stock/point-of-sale",
  NotFound = "/not-found",
}

const Router = () => {
  return (
    <BrowserRouter>
      <Theme>
        <Routes>
          <Route path="/" element={<Navigate to={Path.Login} replace />} />
          <Route path={Path.Login} element={<Login />} />

          <Route path="/stock" element={<PrincipalTemplate />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="point-of-sale" element={<p>PDV</p>} />
          </Route>

          <Route path={Path.NotFound} element={<NotFound />} />
          <Route path="*" element={<Navigate to={Path.NotFound} replace />} />
        </Routes>
      </Theme>
    </BrowserRouter>
  );
};

export { Path, Router };
