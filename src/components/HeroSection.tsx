import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useNews';

const HeroSection: React.FC = () => {
  const { getUrgentNews, getFeaturedNews, loading } = useNews();
  
  const urgentNews = getUrgentNews();
  const featuredNews = getFeaturedNews();
  

  // Fallback para quando não há notícia urgente
  const defaultNews = {
    title: "Klarna lidera nova onda de IPOs e Wall Street espera por uma temporada de outono promissora",
    summary: "A fintech sueca lidera uma série de captações que animam quem vê meses otimistas à frente, apesar dos alertas para ações menores.",
    category: "economia",
    image_url: null
  };

  const currentNews = urgentNews || defaultNews;

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main featured article */}
          <div className="lg:col-span-2 lg:border-r lg:border-gray-300 lg:pr-8">
            <Link to={`/noticia/${currentNews.slug}`}>
              <article className="group cursor-pointer">
              {/* Banner/Imagem da notícia principal */}
              {currentNews.image_url ? (
                <div className="w-full h-80 lg:h-96 mb-6 overflow-hidden">
                  <img 
                    src={currentNews.image_url} 
                    alt={currentNews.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-80 lg:h-96 bg-gradient-to-r from-blue-600 to-purple-600 mb-6 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">📰</div>
                    <p className="text-lg font-medium">Imagem da Notícia</p>
                    <p className="text-sm opacity-80">Banner temporário</p>
                  </div>
                </div>
              )}
              
              {/* Categoria da notícia - posicionada à esquerda */}
              <div className="mb-4">
                <span className="text-blue-600 text-sm font-medium uppercase tracking-wide">
                  {currentNews.category}
                </span>
              </div>
              
              <h1 className="news-title text-4xl lg:text-5xl text-gray-900 mb-6 leading-tight group-hover:text-gray-700 transition-colors">
                {currentNews.title}
              </h1>
              <p className="news-body text-gray-600 text-lg mb-4">
                {currentNews.summary}
              </p>
              </article>
            </Link>
          </div>

          {/* Side content */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6">
              <h3 className="font-bold text-lg mb-4">Destaques</h3>
              <div className="space-y-4">
                {loading ? (
                  // Loading state
                  <>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    </div>
                  </>
                ) : featuredNews.length > 0 ? (
                  // Primeiras 3 notícias em destaque do Supabase
                  featuredNews.slice(0, 3).map((news, index) => (
                    <Link key={news.id} to={`/noticia/${news.slug}`}>
                      <article className="group cursor-pointer mb-4">
                        <h4 className="news-subtitle text-gray-900 group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h4>
                      </article>
                    </Link>
                  ))
                ) : (
                  // Fallback quando não há notícias em destaque
                  <>
                    <article className="group cursor-pointer mb-4">
                      <h4 className="news-subtitle text-gray-900 group-hover:text-blue-600 transition-colors">
                        Os melhores programas de pesquisa online, segundo professores
                      </h4>
                    </article>
                    <article className="group cursor-pointer mb-4">
                      <h4 className="news-subtitle text-gray-900 group-hover:text-blue-600 transition-colors">
                        Quem consegue taxas de hipoteca e como funcionam?
                      </h4>
                    </article>
                    <article className="group cursor-pointer mb-4">
                      <h4 className="news-subtitle text-gray-900 group-hover:text-blue-600 transition-colors">
                        Os EUA consideram mudar planos comerciais rapidamente...
                      </h4>
                    </article>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                // Loading state
                <>
                  {[...Array(2)].map((_, index) => (
                    <div key={index} className="animate-pulse flex space-x-4">
                      <div className="w-16 h-16 bg-gray-300 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : featuredNews.length >= 4 ? (
                // 4º e 5º destaques do Supabase
                featuredNews.slice(3, 5).map((news, index) => (
                  <Link key={news.id} to={`/noticia/${news.slug}`}>
                    <article className="group cursor-pointer flex space-x-4 mb-4">
                      {news.image_url ? (
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden">
                          <img 
                            src={news.image_url} 
                            alt={news.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 flex-shrink-0"></div>
                      )}
                      <div>
                        <h4 className="news-subtitle text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {news.title}
                        </h4>
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                // Fallback
                <>
                  <article className="group cursor-pointer flex space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 flex-shrink-0"></div>
                    <div>
                      <h4 className="news-subtitle text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                        Macintosh pode colher o fim de...
                      </h4>
                    </div>
                  </article>
                  
                  <article className="group cursor-pointer flex space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 flex-shrink-0"></div>
                    <div>
                      <h4 className="news-subtitle text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                        Turquia pode levar a economia dos EUA à crise, em qualquer lugar...
                      </h4>
                    </div>
                  </article>
                </>
              )}
            </div>

            {/* Banner de Anúncio */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white text-center cursor-pointer hover:shadow-lg transition-shadow">
              <div className="mb-2">
                <span className="text-xs uppercase tracking-wide opacity-80">Publicidade</span>
              </div>
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-bold text-lg mb-2">Anuncie Aqui</h3>
              <p className="text-sm opacity-90">
                Alcance milhares de leitores diariamente
              </p>
              <div className="mt-4 text-xs opacity-70">
                Banner 300x250 - Espaço Publicitário
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;