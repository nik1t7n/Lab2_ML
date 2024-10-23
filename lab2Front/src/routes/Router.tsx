import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import StoresPage from "../pages/StoresPage";
import ProductsPage from "../pages/ProductsPage";
import AnalyticsPage from "../pages/AnalyticsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
    children: [
      { path: "", element: <HomePage /> },
      { path: "stores", element: <StoresPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "analytics", element: <AnalyticsPage /> }
    ],
  },
]);