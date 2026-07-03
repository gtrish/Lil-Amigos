// src/pages/Home.jsx
import React from 'react';
import HeroGallery from '../components/HeroGallery';
import Tagline from '../components/Tagline';
import ProductGrid from '../components/ProductGrid';
import Categories from '../components/Categories';
import BrandPromise from '../components/BrandPromise';

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