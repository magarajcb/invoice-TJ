import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import CustomersPage from "../features/customers/pages/CustomersPage";
import ProductsPage from "../features/products/pages/ProductsPage";
import InvoicesPage from "../features/invoices/pages/InvoicesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "customers", element: <CustomersPage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "invoices", element: <InvoicesPage /> },
    ],
  },
]);

export default router;