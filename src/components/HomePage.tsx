import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import LatestSection from './LatestSection';
import CategorySection from './CategorySection';
import MarketData from './MarketData';
import NewsSection from './NewsSection';
import SecondNewsSection from './SecondNewsSection';
import FeaturedArticles from './FeaturedArticles';
import Footer from './Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <LatestSection />
        <CategorySection />
        <MarketData />
        <NewsSection />
        <SecondNewsSection />
        <FeaturedArticles />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
