import {
  Routes,
  Route,
  Link,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import {
  useDispatch,
} from "react-redux";

import LoginPage from "./pages/LoginPage.jsx";

import HomePage from "./pages/HomePage.jsx";

import CartPage from "./pages/CartPage.jsx";

import OrdersPage from "./pages/OrdersPage.jsx";

import AdminDashboard
  from "./pages/admin/AdminDashboard.jsx";

import AdminProductsPage
  from "./pages/admin/AdminProductsPage.jsx";

import AdminOrdersPage
  from "./pages/admin/AdminOrdersPage.jsx";

import ProtectedRoute
  from "./routes/ProtectedRoute.jsx";

import AdminRoute
  from "./routes/AdminRoute.jsx";

import {
  setCredentials,
} from "./features/auth/authSlice.js";

import {
  getCurrentUser,
} from "./features/auth/authAPI.js";


const App = () => {

  const dispatch =
    useDispatch();

  // ==============================
  // Auth Hydration
  // ==============================

  useEffect(() => {

    const loadUser =
      async () => {

        try {

          const user =
            await getCurrentUser();

          dispatch(
            setCredentials(user)
          );

        } catch (error) {

          console.log(
            "No active session"
          );
        }
      };

    loadUser();

  }, [dispatch]);

  return (

    <div>

      {/* =========================
          Navbar
      ========================== */}

      <nav
        className="
          flex
          justify-between
          items-center
          p-4
          border-b
        "
      >

        <div
          className="
            flex
            gap-4
          "
        >

          <Link to="/">
            Home
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/orders">
            Orders
          </Link>

          <Link to="/admin">
            Admin
          </Link>

        </div>

      </nav>

      {/* =========================
          Routes
      ========================== */}

      <Routes>

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* =====================
            Protected Routes
        ====================== */}

        <Route
          path="/cart"

          element={
            <ProtectedRoute>

              <CartPage />

            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"

          element={
            <ProtectedRoute>

              <OrdersPage />

            </ProtectedRoute>
          }
        />

        {/* =====================
            Admin Routes
        ====================== */}

        <Route
          path="/admin"

          element={
            <AdminRoute>

              <AdminDashboard />

            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"

          element={
            <AdminRoute>

              <AdminProductsPage />

            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"

          element={
            <AdminRoute>

              <AdminOrdersPage />

            </AdminRoute>
          }
        />

      </Routes>

    </div>
  );
};

export default App;