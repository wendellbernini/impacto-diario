import React from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useNews';

const CategorySection: React.FC = () => {
  const { getNewsByCategory, getNewsByLocation, loading } = useNews();
  
  // Buscar notícias por localidade e categoria
  const brasilNews = getNewsByLocation('brasil', 3);
  const educacaoNews = getNewsByCategory('educacao', 3);
  const economiaNews = getNewsByCategory('economia', 3);
  const tecnologiaNews = getNewsByCategory('tecnologia', 3);

  // Fallback para quando não há notícias suficientes
  const defaultCategories = [
    {
      title: "Brasil",
      articles: [
        {
          title: "Inflação recua para 4,2% em dezembro e fica dentro da meta",
          image: "🇧🇷",
          color: "from-green-600 to-emerald-500"
        },
        {
          title: "PIB cresce 2,9% no último trimestre do ano",
          image: "📈",
          color: "from-blue-600 to-cyan-500"
        },
        {
          title: "Desemprego cai para menor patamar em 8 anos",
          image: "💼",
          color: "from-purple-600 to-pink-500"
        }
      ]
    },
    {
      title: "Educação",
      articles: [
        {
          title: "MEC anuncia investimento de R$ 5 bilhões em educação básica",
          image: "🎓",
          color: "from-blue-500 to-indigo-600"
        },
        {
          title: "Enem 2024 registra recorde de inscrições",
          image: "📚",
          color: "from-green-500 to-teal-500"
        },
        {
          title: "Universidades públicas ampliam vagas para 2025",
          image: "🏫",
          color: "from-purple-500 to-pink-500"
        }
      ]
    },
    {
      title: "Economia",
      articles: [
        {
          title: "Dólar fecha em queda após decisão do Banco Central",
          image: "💵",
          color: "from-yellow-600 to-orange-600"
        },
        {
          title: "Petrobras anuncia maior lucro da história da empresa",
          image: "🏢",
          color: "from-gray-600 to-slate-700"
        },
        {
          title: "Vale assina acordo de R$ 37 bilhões por Mariana",
          image: "⛏️",
          color: "from-pink-500 to-rose-600"
        }
      ]
    },
    {
      title: "Tecnologia",
      articles: [
        {
          title: "Apple lança novo iPhone 15 com recursos de IA avançada",
          image: "📱",
          color: "from-blue-500 to-indigo-600"
        },
        {
          title: "Google anuncia investimento de $10 bilhões em IA no Brasil",
          image: "🤖",
          color: "from-red-500 to-orange-500"
        },
        {
          title: "WhatsApp libera novos recursos de privacidade",
          image: "💬",
          color: "from-green-500 to-teal-500"
        }
      ]
    }
  ];

  // Criar categorias dinâmicas
  const categories = [
    {
      title: "Brasil",
      articles: brasilNews.length > 0 ? brasilNews
        .filter(news => news.title && news.title.length > 5 && !news.title.includes('teste'))
        .map((news, index) => ({
          title: news.title,
          image: news.image_url || "🇧🇷",
          color: "from-green-600 to-emerald-500",
          isImage: !!news.image_url
        })) : defaultCategories[0].articles
    },
    {
      title: "Educação",
      articles: educacaoNews.length > 0 ? educacaoNews
        .filter(news => news.title && news.title.length > 5 && !news.title.includes('teste'))
        .map((news, index) => ({
          title: news.title,
          image: news.image_url || "🎓",
          color: "from-blue-500 to-indigo-600",
          isImage: !!news.image_url
        })) : defaultCategories[1].articles
    },
    {
      title: "Economia",
      articles: economiaNews.length > 0 ? economiaNews
        .filter(news => news.title && news.title.length > 5 && !news.title.includes('teste'))
        .map((news, index) => ({
          title: news.title,
          image: news.image_url || "💵",
          color: "from-yellow-600 to-orange-600",
          isImage: !!news.image_url
        })) : defaultCategories[2].articles
    },
    {
      title: "Tecnologia",
      articles: tecnologiaNews.length > 0 ? tecnologiaNews
        .filter(news => news.title && news.title.length > 5 && !news.title.includes('teste'))
        .map((news, index) => ({
          title: news.title,
          image: news.image_url || "📱",
          color: "from-blue-500 to-indigo-600",
          isImage: !!news.image_url
        })) : defaultCategories[3].articles
    }
  ];

  return (
    <section className="bg-white py-6 mb-2">
      {/* Linha superior com margens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="h-px bg-gray-300"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className={`space-y-6 ${categoryIndex < 3 ? 'lg:border-r lg:border-gray-300 lg:pr-6' : ''}`}>
              {/* Título da categoria */}
              <h2 className="news-title text-xl text-gray-900 pb-3">
                {category.title}
              </h2>
              
              {/* 3 artigos verticais */}
              <div className="space-y-4">
                {category.articles.map((article, articleIndex) => {
                  // Verificar se é uma notícia real do Supabase
                  const isRealNews = categoryIndex === 0 ? brasilNews[articleIndex] : 
                                   categoryIndex === 1 ? educacaoNews[articleIndex] :
                                   categoryIndex === 2 ? economiaNews[articleIndex] :
                                   tecnologiaNews[articleIndex];
                  
                  if (isRealNews && isRealNews.slug) {
                    return (
                      <Link key={articleIndex} to={`/noticia/${isRealNews.slug}`}>
                        <article className="group cursor-pointer flex space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                          {/* Imagem à esquerda */}
                          {isRealNews.image_url ? (
                            <div className="w-24 h-18 flex-shrink-0 overflow-hidden">
                              <img 
                                src={isRealNews.image_url} 
                                alt={isRealNews.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className={`w-24 h-18 bg-gradient-to-r ${article.color} flex-shrink-0 flex items-center justify-center`}>
                              <span className="text-white text-xl">{article.image}</span>
                            </div>
                          )}
                          
                          {/* Título à direita */}
                          <div className="flex-1">
                            <h3 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {isRealNews.title}
                            </h3>
                          </div>
                        </article>
                      </Link>
                    );
                  }
                  
                  // Fallback para artigos sem slug
                  return (
                    <article key={articleIndex} className="group cursor-pointer flex space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                      {/* Imagem à esquerda */}
                      {article.isImage && article.image.startsWith('http') ? (
                        <div className="w-24 h-18 flex-shrink-0 overflow-hidden">
                          <img 
                            src={article.image} 
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`w-24 h-18 bg-gradient-to-r ${article.color} flex-shrink-0 flex items-center justify-center`}>
                          <span className="text-white text-xl">{article.image}</span>
                        </div>
                      )}
                      
                      {/* Título à direita */}
                      <div className="flex-1">
                        <h3 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {article.title}
                        </h3>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
