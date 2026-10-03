// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import HeroGallery from '../Components/HeroGallery';
import Tagline from '../Components/Tagline';
import ProductGrid from '../Components/ProductGrid';
import Categories from '../Components/Categories';
import BrandPromise from '../Components/BrandPromise';
import { useCart } from '../Context/CartContext';
const Home = () => {
  return (
    <>
      <HeroGallery />
      <Tagline />
      <ProductGrid />
      <Categories />
      <BrandPromise />
    </>
  );
};

export default Home;