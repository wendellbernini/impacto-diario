import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LatestSection from './components/LatestSection';
import CategorySection from './components/CategorySection';
import MarketData from './components/MarketData';
import NewsSection from './components/NewsSection';
import SecondNewsSection from './components/SecondNewsSection';
import FeaturedArticles from './components/FeaturedArticles';
import Footer from './components/Footer';
import AdminApp from './components/AdminApp';

function App() {
  // Verificar se está na rota admin
  const isAdminRoute = window.location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return <AdminApp />;
  }

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
}

export default App;