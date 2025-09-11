import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { supabase, NewsItem } from '../lib/supabase';

const MundoPage: React.FC = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [otherNews, setOtherNews] = useState<NewsItem[]>([]);
  const [subcategoryNews, setSubcategoryNews] = useState<Record<string, NewsItem[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMundoNews = async () => {
      try {
        // Buscar notícia em destaque do Mundo
        const { data: featured, error: featuredError } = await supabase
          .from('news')
          .select('*')
          .eq('location', 'mundo')
          .eq('is_featured', true)
          .order('published_at', { ascending: false })
          .limit(1);

        if (featuredError) throw featuredError;

        // Buscar outras notícias do Mundo
        const { data: other, error: otherError } = await supabase
          .from('news')
          .select('*')
          .eq('location', 'mundo')
          .order('published_at', { ascending: false })
          .limit(4);

        if (otherError) throw otherError;

        setFeaturedNews(featured?.[0] || null);
        setOtherNews(other || []);

        // Buscar notícias por subcategorias do Mundo
        const subcategories = ['politica', 'economia', 'educacao', 'ciencia', 'saude', 'seguranca'];
        const subcategoryData: Record<string, NewsItem[]> = {};

        for (const subcategory of subcategories) {
          const { data: subNews, error: subError } = await supabase
            .from('news')
            .select('*')
            .eq('location', 'mundo')
            .eq('category', subcategory)
            .order('published_at', { ascending: false })
            .limit(4);

          if (!subError && subNews && subNews.length > 0) {
            subcategoryData[subcategory] = subNews;
          }
        }

        setSubcategoryNews(subcategoryData);
      } catch (error) {
        console.error('Erro ao buscar notícias do Mundo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMundoNews();
  }, []);

  const subcategories = [
    'POLÍTICA',
    'ECONOMIA', 
    'SOCIEDADE',
    'EDUCAÇÃO',
    'SAÚDE',
    'TECNOLOGIA'
  ];

  const getSubcategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'politica': 'Política',
      'economia': 'Economia',
      'educacao': 'Educação',
      'ciencia': 'Ciência',
      'saude': 'Saúde',
      'seguranca': 'Segurança'
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen category-page-container">
        <Header hideTicker={true} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Carregando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen category-page-container">
      <Header hideTicker={true} />
      
      {/* Header da categoria */}
      <div className="text-center py-12">
        <h1 className="news-title text-5xl font-bold text-white mb-2">
          Notícias do Mundo
        </h1>
        <p className="news-body text-xl text-gray-100 mb-4 max-w-3xl mx-auto">
          Cobertura internacional dos principais acontecimentos globais.
        </p>
        
        {/* Subcategorias */}
        <div className="flex flex-wrap justify-center gap-4 text-white mb-8">
          {subcategories.map((sub, index) => (
            <React.Fragment key={sub}>
              <span className="news-body text-sm font-bold tracking-wide text-white">{sub}</span>
              {index < subcategories.length - 1 && (
                <span className="text-gray-400">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Container principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            {/* Card principal branco estilo jornal */}
            <div className="bg-white shadow-sm border border-gray-200">
            {/* Grid de notícias dentro do card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Notícia em destaque - lado esquerdo */}
              <div className="border-r border-gray-200">
                {featuredNews && (
                  <Link 
                    to={`/noticia/${featuredNews.slug}`}
                    className="block group hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-6">
                      {/* Imagem grande */}
                      <div className="w-full h-80 mb-4 overflow-hidden">
                        <img
                          src={featuredNews.image_url || '/placeholder-news.jpg'}
                          alt={featuredNews.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Título grande */}
                      <h2 className="news-title text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                        {featuredNews.title}
                      </h2>
                      
                      {/* Resumo */}
                      <p className="news-body text-gray-600 text-lg leading-relaxed mb-4">
                        {featuredNews.summary || 'Leia mais sobre esta importante notícia mundial...'}
                      </p>
                      
                      {/* Data e autor */}
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{new Date(featuredNews.published_at).toLocaleDateString('pt-BR')}</span>
                        {featuredNews.author && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{featuredNews.author}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              {/* Grid 2x2 de outras notícias - lado direito */}
              <div className="grid grid-cols-2 gap-0">
                {otherNews.map((news, index) => (
                  <div key={news.id} className="relative">
                    {/* Linha vertical entre as notícias (exceto a última) */}
                    {index < otherNews.length - 1 && (
                      <div ></div>
                    )}
                    <Link 
                      to={`/noticia/${news.slug}`}
                      className="block group hover:bg-gray-50 transition-colors border-b border-r border-gray-200 last:border-b-0 even:border-r-0"
                    >
                    <div className="p-4">
                      {/* Imagem */}
                      <div className="w-full h-40 mb-3 overflow-hidden">
                        <img
                          src={news.image_url || '/placeholder-news.jpg'}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Título */}
                      <h3 className="news-subtitle text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-3">
                        {news.title}
                      </h3>
                    </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Seções de subcategorias */}
            {Object.keys(subcategoryNews).length > 0 && (
              <div className="border-t border-gray-200">
                <div className="p-6">
                  {Object.entries(subcategoryNews).map(([category, news]) => (
                    <div key={category} className="mb-12 last:mb-0">
                      <h2 className="news-title text-2xl font-bold text-gray-900 mb-6">
                        {getSubcategoryDisplayName(category)}
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {news.map((newsItem, index) => (
                          <div key={newsItem.id} className="relative">
                            {/* Linha vertical entre as notícias (exceto a última) */}
                            {index < news.length - 1 && (
                              <div className="hidden lg:block absolute top-0 right-0 w-px h-3/4 bg-gray-200 -mr-3"></div>
                            )}
                            <Link 
                              to={`/noticia/${newsItem.slug}`}
                              className="block group hover:bg-gray-50 transition-colors p-4 rounded-lg"
                            >
                            <div className="aspect-video overflow-hidden mb-3">
                              <img
                                src={newsItem.image_url || '/placeholder-news.jpg'}
                                alt={newsItem.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <h3 className="news-subtitle text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                              {newsItem.title}
                            </h3>
                            <p className="news-body text-sm text-gray-600 line-clamp-2">
                              {newsItem.summary}
                            </p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seção de mais notícias */}
            <div className="border-t border-gray-200">
              <div className="p-6">
                <h2 className="news-title text-2xl font-bold text-gray-900 mb-6">
                  Mais Notícias do Mundo
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherNews.slice(4, 10).map((news) => (
                    <Link 
                      key={news.id}
                      to={`/noticia/${news.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md card-hover border border-gray-100">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={news.image_url || '/placeholder-news.jpg'}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="news-subtitle text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                            {news.title}
                          </h3>
                          <p className="news-body text-sm text-gray-600 line-clamp-2">
                            {news.summary}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

      <Footer />
    </div>
  );
};

export default MundoPage;
