import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import LoginPage from "./auth/Login_page";
import RegisterPage from "./auth/Register_page";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import DashboardPage from "./pages/DashboardPage";
import AdminRoute from "./components/AdminRoute";
// Pages that should NOT show the site header (auth screens + dashboard go full-bleed).
const HIDE_HEADER_ON = ["/login", "/register", "/dashboard"];

function App() {
  const location = useLocation();
  const showHeader = !HIDE_HEADER_ON.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
<Route path="/" element={<HomePage />} />       
 <Route path="/menu" element={<MenuPage />} />
 <Route path="/cart" element={<CartPage />} />
 <Route path="/checkout" element={<CheckoutPage />} />
 <Route
   path="/dashboard"
   element={
     <AdminRoute>
       <DashboardPage />
     </AdminRoute>
   }
 />
 <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;