import React, { useState } from 'react';
import Navbar from './Components/NavBar/Navbar.jsx'
import {BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import Footer from './Components/Footer.jsx';
import Home from './Pages/Home.jsx';
import ProductDetail from './Pages/ProductDetail.jsx';
import CategoryPage from './Pages/CategoryPage.jsx';
import { CartProvider } from './Context/CartContext.jsx';
import Cart from './Pages/Cart.jsx';
import NotFound from './Pages/NotFound.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import Checkout from './Components/Checkout.jsx';

// Wraps the routed page in the single page-level motion moment (see index.css).
// Keying on the pathname forces a remount on every navigation, which is what
// re-triggers the CSS animation each time.
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div className="page-transition" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/checkout" element={<Checkout />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  return(
    <div>
      <CartProvider>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </BrowserRouter>
      </CartProvider>
    </div>
  );
}
export default App;