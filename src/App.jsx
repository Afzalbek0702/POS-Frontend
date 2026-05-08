import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import { getToken } from "./services/authService";

// Pages (uncomment as you build them)
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
// import Staff from "./pages/Staff";
// import Inventory from "./pages/Inventory";
// import Reports from "./pages/Reports";
// import Orders from "./pages/Orders";
// import Reservations from "./pages/Reservations";

function ProtectedRoute({ children }) {
  // joyiga qaytarib qoyaman Login iwlab ketgandan keyin. O'CHIR VORMENG!!
  // return getToken() ? children : <Navigate to="/login" replace />;
  return children;
}

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Standalone — no sidebar */}
      <Route
        path="/login"
        element={<LoginPage onLoginSuccess={() => navigate("/")} />}
      />

      {/* Protected — with sidebar layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        {/* biritilgandan keyin hammasi kommentdan ciqadi: */}
        <Route path="/menu" element={<Menu />} />
        {/* <Route path="/staff" element={<Staff />} /> */}
        {/* <Route path="/inventory" element={<Inventory />} /> */}
        {/* <Route path="/reports" element={<Reports />} /> */}
        {/* <Route path="/orders" element={<Orders />} /> */}
        {/* <Route path="/reservations" element={<Reservations />} /> */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
