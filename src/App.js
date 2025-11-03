import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Admin from "./admin/Admin";
import Product from "./pages/Product";
import FAQ from "./pages/FAQ";
import OrderFAQ from "./pages/FAQ_category/OrderFAQ";
import PaymentFAQ from "./pages/FAQ_category/PaymentFAQ";
import DeliveryFAQ from "./pages/FAQ_category/DeliveryFAQ";
import ReturnsFAQ from "./pages/FAQ_category/ReturnsFAQ";
import LoginForm from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import { CartProvider } from "./CartContext"; // Import CartProvider
import { FavouriteProvider } from "./Favourite";

function App() {
  const username = localStorage.getItem("username");
  const location = useLocation();
  const hideNavbarFooter = location.pathname === "/" || location.pathname === "/login";

  return (
    <div>
      {/* Conditionally render the Navbar */}
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/product"
          element={username === "Admin" ? <Admin /> : <Product />}
        />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/order-faq" element={<OrderFAQ />} />
        <Route path="/payment-faq" element={<PaymentFAQ />} />
        <Route path="/delivery-faq" element={<DeliveryFAQ />} />
        <Route path="/returns-faq" element={<ReturnsFAQ />} />
      </Routes>
      {/* Conditionally render the Footer */}
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

// Wrap the App component in CartProvider and Router for context and routing
function AppWrapper() {
  return (
    <FavouriteProvider>
    <CartProvider>
      <Router>
        <App />
      </Router>
    </CartProvider>
    </FavouriteProvider>
  );
}

export default AppWrapper;
