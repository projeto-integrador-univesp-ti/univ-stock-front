import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PointOfSales from "./pages/PointOfSales";
import ProductManagement from "./pages/ProductManagement";
import { PrincipalTemplate } from "./template/PrincipalTemplate";
import { Settings } from "./pages/Settings";
import { useGlobalContext } from "./contexts/GlobalContext";

enum Path {
  Login = "/login",
  Dashboard = "/dashboard",
  ProductManagement = "/product-management",
  PointOfSale = "/point-of-sale",
  Settings = "/settings",
  NotFound = "/not-found",
}

const Router = () => {
  const { scaling, appearance, panelBg, accentColors } = useGlobalContext();

  return (
    <BrowserRouter>
      <Theme
        style={{ background: "var(--slate-3)" }}
        accentColor={accentColors}
        radius="small"
        scaling={scaling}
        appearance={appearance}
        panelBackground={panelBg}
      >
        <Routes>
          <Route path="/" element={<Navigate to={Path.Login} replace />} />
          <Route path={Path.Login} element={<Login />} />

          <Route path="/" element={<PrincipalTemplate />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="point-of-sale" element={<PointOfSales />} />
            <Route path="product-management" element={<ProductManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path={Path.NotFound} element={<NotFound />} />
          <Route path="*" element={<Navigate to={Path.NotFound} replace />} />
        </Routes>
      </Theme>
    </BrowserRouter>
  );
};

export { Path, Router };
