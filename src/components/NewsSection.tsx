import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useNews';

const NewsSection: React.FC = () => {
  const { getNewsByCategory, loading } = useNews();
  
  const politicaNews = getNewsByCategory('politica', 4);
  
  // Fallback para quando não há notícias de política
  const defaultMainArticle = {
    category: "Política",
    title: "Nova reforma tributária é aprovada no Congresso Nacional",
    summary: "Após meses de debates intensos, parlamentares chegam a consenso sobre mudanças que prometem simplificar o sistema tributário brasileiro e reduzir a carga fiscal para empresas de pequeno e médio porte.",
    image: "🏛️",
    color: "from-blue-600 to-indigo-700"
  };

  const mainArticle = politicaNews.length > 0 ? {
    category: "Política",
    title: politicaNews[0].title,
    summary: politicaNews[0].summary || "Resumo da notícia política em destaque.",
    image: politicaNews[0].image_url,
    color: "from-blue-600 to-indigo-700",
    slug: politicaNews[0].slug
  } : defaultMainArticle;

  // Fallback para notícias laterais
  const defaultSideArticles = [
    {
      title: "Inflação registra menor índice em 5 anos",
      image: "📊",
      color: "from-green-600 to-emerald-500"
    },
    {
      title: "Mercado financeiro reage positivamente",
      image: "💹",
      color: "from-purple-600 to-pink-500"
    },
    {
      title: "Empresas já planejam novos investimentos",
      image: "🏢",
      color: "from-orange-600 to-red-500"
    }
  ];

  const sideArticles = politicaNews.length > 1 ? 
    politicaNews
      .filter(news => news.title && news.title.length > 5 && !news.title.includes('teste'))
      .slice(1, 4)
      .map((news, index) => ({
        title: news.title,
        image: news.image_url,
        color: "from-green-600 to-emerald-500",
        slug: news.slug
      })) : defaultSideArticles;

  return (
    <section className="bg-white py-8">
      {/* Linha superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="h-px bg-gray-300"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Esquerda - Notícia principal com imagem grande */}
          <div className="border-r border-gray-300 pr-8">
            {mainArticle.slug ? (
              <Link to={`/noticia/${mainArticle.slug}`}>
                <article className="group cursor-pointer">
                  {/* Categoria */}
                  <div className="mb-4">
                    <span className="text-blue-600 text-sm font-medium uppercase tracking-wide">{mainArticle.category}</span>
                  </div>
                  
                  {/* Imagem grande */}
                  {mainArticle.image && mainArticle.image.startsWith('http') ? (
                    <div className="w-full h-64 mb-6 overflow-hidden">
                      <img 
                        src={mainArticle.image} 
                        alt={mainArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-full h-64 bg-gradient-to-r ${mainArticle.color} mb-6 flex items-center justify-center`}>
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">{mainArticle.image || "🏛️"}</div>
                        <p className="text-lg font-medium">Imagem da Notícia</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Título e resumo */}
                  <h2 className="news-title text-2xl text-gray-900 group-hover:text-blue-600 transition-colors mb-4 leading-tight">
                    {mainArticle.title}
                  </h2>
                  
                  <p className="news-body text-gray-600 leading-relaxed">
                    {mainArticle.summary}
                  </p>
                </article>
              </Link>
            ) : (
              <article className="group cursor-pointer">
                {/* Categoria */}
                <div className="mb-4">
                  <span className="text-blue-600 text-sm font-medium uppercase tracking-wide">{mainArticle.category}</span>
                </div>
                
                {/* Imagem grande */}
                {mainArticle.image && mainArticle.image.startsWith('http') ? (
                  <div className="w-full h-64 mb-6 overflow-hidden">
                    <img 
                      src={mainArticle.image} 
                      alt={mainArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-full h-64 bg-gradient-to-r ${mainArticle.color} mb-6 flex items-center justify-center`}>
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">{mainArticle.image || "🏛️"}</div>
                      <p className="text-lg font-medium">Imagem da Notícia</p>
                    </div>
                  </div>
                )}
                
                {/* Título e resumo */}
                <h2 className="news-title text-2xl text-gray-900 group-hover:text-blue-600 transition-colors mb-4 leading-tight">
                  {mainArticle.title}
                </h2>
                
                <p className="news-body text-gray-600 leading-relaxed">
                  {mainArticle.summary}
                </p>
              </article>
            )}
          </div>

          {/* Direita - 3 notícias com imagens menores */}
          <div className="space-y-8">
            {sideArticles.map((article, index) => (
              article.slug ? (
                <Link key={index} to={`/noticia/${article.slug}`}>
                  <article className="group cursor-pointer flex space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                    {/* Imagem à esquerda */}
                    {article.image && article.image.startsWith('http') ? (
                      <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-24 h-20 bg-gradient-to-r ${article.color} flex-shrink-0 flex items-center justify-center`}>
                        <span className="text-white text-2xl">{article.image || "📊"}</span>
                      </div>
                    )}
                    
                    {/* Título à direita */}
                    <div className="flex-1">
                      <h3 className="news-title text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {article.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ) : (
                <article key={index} className="group cursor-pointer flex space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                  {/* Imagem à esquerda */}
                  {article.image && article.image.startsWith('http') ? (
                    <div className="w-24 h-20 flex-shrink-0 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className={`w-24 h-20 bg-gradient-to-r ${article.color} flex-shrink-0 flex items-center justify-center`}>
                      <span className="text-white text-2xl">{article.image || "📊"}</span>
                    </div>
                  )}
                  
                  {/* Título à direita */}
                  <div className="flex-1">
                    <h3 className="news-title text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                      {article.title}
                    </h3>
                  </div>
                </article>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
