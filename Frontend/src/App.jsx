import React, { useState } from 'react';
import Navbar from './Components/NavBar/Navbar.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Footer from './Components/Footer.jsx';
import Home from './Pages/Home.jsx';
import ProductDetail from './Pages/ProductDetail.jsx';
import CategoryPage from './Pages/CategoryPage.jsx';
import { CartProvider } from './Context/CartContext.jsx';
import Cart from './Pages/Cart.jsx';
import NotFound from './Pages/NotFound.jsx';
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  return(
    <div>
      <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
         <Route path="/product/:id" element={<ProductDetail />} /> 
        <Route path="/category/:categoryName" element={<CategoryPage />} /> 
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} /> 
        </Routes>
        <Footer />
      </BrowserRouter>
      </CartProvider>
    </div>
  );
}
export default App;