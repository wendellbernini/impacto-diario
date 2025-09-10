import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ContentSections from './components/ContentSections';
import MarketData from './components/MarketData';
import FeaturedArticles from './components/FeaturedArticles';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ContentSections />
        <MarketData />
        <FeaturedArticles />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;