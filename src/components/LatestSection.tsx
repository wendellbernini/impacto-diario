import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useNews';
import { useBanners } from '../hooks/useBanners';
import BannerDisplay from './BannerDisplay';

const LatestSection: React.FC = () => {
  const { getLatestNews, getNewsByCategory, loading } = useNews();
  const { getBanner } = useBanners();
  
  const latestNews = getLatestNews(5);
  const middleNews = getLatestNews(10).slice(5, 10); // 6ª, 7ª, 8ª, 9ª, 10ª
  const securityNews = getNewsByCategory('seguranca', 3);
  const sidebarBanner = getBanner('homepage-sidebar');

  // Fallback para quando não há notícias suficientes
  const defaultLatestArticles = [
    {
      title: "Empresários correm para hipotecas com taxas no menor nível em quase um ano",
      time: "45 minutos atrás"
    },
    {
      title: "Fabricante olímpico Novo Nordisk corta 9.000 empregos em meio à rigidez de peso",
      time: "1 hora atrás"
    },
    {
      title: "RFK Jr. mira tribunal federal de vacinas que protege fabricantes de vacinas",
      time: "1 hora atrás"
    },
    {
      title: "Os melhores programas de recompensas de companhias aéreas, segundo pontos",
      time: "6 horas atrás"
    },
    {
      title: "Quem define as taxas de hipoteca e como funcionam?",
      time: "6 horas atrás"
    }
  ];

  const centerArticles = [
    {
      title: "Ações da Oracle disparam 42% com receita recorde de $144 bilhões em IA",
      summary: "A CEO Safra Catz saudou um trimestre 'surpreendente' enquanto novos contratos de IA na nuvem impulsionam grandes ganhos no mercado.",
      image: "📊",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Evento do iPhone 17 da Apple aposta em reformulação do design",
      summary: "Cupertino entrega ritual com iPhone mais fino, AirPods com IA e Apple Watch renovado para manter interesse dos consumidores.",
      image: "📱",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Trump não pode demitir governadora do Fed Lisa Cook, decide juiz",
      summary: "A decisão chegou tarde na terça-feira e preserva o papel de Cook no banco central por enquanto, mas recurso é esperado.",
      image: "🏛️",
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Klarna lidera nova onda de IPOs enquanto Wall Street espera",
      summary: "A fintech sueca lidera uma série de captações que animam quem vê meses otimistas à frente no mercado de ações.",
      image: "💼",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "Tesla anuncia novo modelo de carro elétrico com autonomia de 500km",
      summary: "A montadora americana revela seu mais recente veículo com tecnologia de bateria de última geração.",
      image: "🚗",
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <section className="bg-white py-8">
      {/* Linha superior com margens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="h-px bg-gray-300"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Coluna Esquerda - Últimas */}
          <div className="lg:col-span-3">
            <div className="relative pr-6">
              {/* Linha vertical que se estende por toda a altura */}
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Últimas</h2>
              <div className="space-y-4">
                {loading ? (
                  // Loading state
                  <>
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="animate-pulse pb-4 border-b border-gray-200 last:border-b-0">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </>
                ) : latestNews.length > 0 ? (
                  // Notícias do Supabase
                  latestNews.map((news, index) => (
                    <Link key={news.id} to={`/noticia/${news.slug}`}>
                      <article className="group cursor-pointer pb-4 border-b border-gray-200 last:border-b-0">
                        <h3 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                          {news.title}
                        </h3>
                        <time className="text-sm text-gray-500">
                          {(() => {
                            const now = new Date();
                            const published = new Date(news.created_at);
                            const diffInMinutes = Math.floor((now.getTime() - published.getTime()) / (1000 * 60));
                            
                            if (diffInMinutes < 60) {
                              return `há ${diffInMinutes} minutos`;
                            } else {
                              const diffInHours = Math.floor(diffInMinutes / 60);
                              if (diffInHours === 1) {
                                return 'há 1 hora';
                              } else {
                                return `há ${diffInHours} horas`;
                              }
                            }
                          })()}
                        </time>
                      </article>
                    </Link>
                  ))
                ) : (
                  // Fallback
                  defaultLatestArticles.map((article, index) => (
                    <article key={index} className="group cursor-pointer pb-4 border-b border-gray-200 last:border-b-0">
                      <h3 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                        {article.title}
                      </h3>
                      <time className="text-sm text-gray-500">{article.time}</time>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Coluna Central - 5 Notícias Verticais */}
          <div className="lg:col-span-6">
            <div className="relative pr-6">
              {/* Linha vertical que se estende por toda a altura */}
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-300"></div>
              <div className="space-y-6">
                {loading ? (
                  // Loading state
                  <>
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="animate-pulse flex space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                        <div className="w-24 h-20 bg-gray-300 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : middleNews.length > 0 ? (
                  // Notícias 6ª, 7ª, 8ª, 9ª, 10ª do Supabase
                  middleNews.map((news, index) => (
                    <Link key={news.id} to={`/noticia/${news.slug}`}>
                      <article className="group cursor-pointer flex space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                        {/* Imagem à esquerda */}
                        {news.image_url ? (
                          <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                            <img 
                              src={news.image_url} 
                              alt={news.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-24 h-20 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0 flex items-center justify-center">
                            <span className="text-white text-xl">📰</span>
                          </div>
                        )}
                        
                        {/* Conteúdo à direita */}
                        <div className="flex-1">
                          <h3 className="news-title text-base text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                            {news.title}
                          </h3>
                          <p className="news-body text-sm text-gray-600 leading-relaxed">
                            {news.summary}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))
                ) : (
                  // Fallback
                  centerArticles.map((article, index) => (
                    <article key={index} className="group cursor-pointer flex space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                      {/* Imagem à esquerda */}
                      <div className={`w-24 h-20 bg-gradient-to-r ${article.color} flex-shrink-0 flex items-center justify-center`}>
                        <span className="text-white text-xl">{article.image}</span>
                      </div>
                      
                      {/* Conteúdo à direita */}
                      <div className="flex-1">
                        <h3 className="news-title text-base text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                          {article.title}
                        </h3>
                        <p className="news-body text-sm text-gray-600 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Segurança */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Segurança</h2>
              
              {/* Imagem grande */}
              {loading ? (
                <div className="animate-pulse">
                  <div className="w-full h-40 bg-gray-300 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ) : securityNews.length > 0 ? (
                <Link to={`/noticia/${securityNews[0].slug}`}>
                  <article className="group cursor-pointer">
                    {securityNews[0].image_url ? (
                      <div className="w-full h-40 mb-3 overflow-hidden">
                        <img 
                          src={securityNews[0].image_url} 
                          alt={securityNews[0].title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-r from-red-600 to-purple-600 mb-3 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-2xl mb-1">🛡️</div>
                          <p className="text-sm">Segurança Digital</p>
                        </div>
                      </div>
                    )}
                    <h3 className="news-title text-base text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {securityNews[0].title}
                    </h3>
                  </article>
                </Link>
              ) : (
                <article className="group cursor-pointer">
                  <div className="w-full h-40 bg-gradient-to-r from-red-600 to-purple-600 mb-3 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl mb-1">🛡️</div>
                      <p className="text-sm">Segurança Digital</p>
                    </div>
                  </div>
                  <h3 className="news-title text-base text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    Novo ataque cibernético afeta milhões de usuários em todo o mundo
                  </h3>
                </article>
              )}

              {/* Duas imagens menores */}
              <div className="space-y-4">
                {loading ? (
                  <>
                    {[...Array(2)].map((_, index) => (
                      <div key={index} className="animate-pulse flex space-x-3">
                        <div className="w-16 h-12 bg-gray-300 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : securityNews.length > 1 ? (
                  // Notícias de segurança do Supabase
                  securityNews.slice(1, 3).map((news, index) => (
                    <Link key={news.id} to={`/noticia/${news.slug}`}>
                      <article className="group cursor-pointer">
                        <div className="flex space-x-4">
                          {news.image_url ? (
                            <div className="w-20 h-16 flex-shrink-0 overflow-hidden">
                              <img 
                                src={news.image_url} 
                                alt={news.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-16 bg-gradient-to-r from-orange-500 to-red-500 flex-shrink-0 flex items-center justify-center">
                              <span className="text-white text-base">🔒</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {news.title}
                            </h4>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))
                ) : (
                  // Fallback
                  <>
                    <article className="group cursor-pointer">
                      <div className="flex space-x-4">
                        <div className="w-20 h-16 bg-gradient-to-r from-orange-500 to-red-500 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-base">🔒</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                            WhatsApp implementa nova camada de criptografia
                          </h4>
                        </div>
                      </div>
                    </article>

                    <article className="group cursor-pointer">
                      <div className="flex space-x-4">
                        <div className="w-20 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                          <span className="text-white text-base">⚠️</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                            Golpes por SMS aumentam 300% no último trimestre
                          </h4>
                        </div>
                      </div>
                    </article>
                  </>
                )}
              </div>
              
              {/* Banner de Publicidade */}
              <div className="mt-8">
                {sidebarBanner ? (
                  <BannerDisplay banner={sidebarBanner} />
                ) : (
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 text-white text-center cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="mb-1">
                      <span className="text-xs uppercase tracking-wide opacity-80">Publicidade</span>
                    </div>
                    <div className="text-2xl mb-2">📢</div>
                    <h4 className="font-bold text-sm mb-1">Anuncie Aqui</h4>
                    <p className="text-orange-100 text-xs">
                      Espaço publicitário premium
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestSection;
