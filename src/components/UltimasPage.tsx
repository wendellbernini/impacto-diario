import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { supabase, NewsItem } from '../lib/supabase';
import { useBanners } from '../hooks/useBanners';
import BannerDisplay from './BannerDisplay';

const UltimasPage: React.FC = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { getBanner } = useBanners();
  const ultimasBanner = getBanner('ultimas-sidebar');

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        // Buscar as 15 últimas notícias em ordem de publicação
        const { data: news, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(15);

        if (error) throw error;
        setLatestNews(news || []);
      } catch (error) {
        console.error('Erro ao buscar últimas notícias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  const getTimeAgo = (publishedAt: string) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Publicada há menos de 1 hora';
    } else if (diffInHours === 1) {
      return 'Publicada há 1 hora';
    } else if (diffInHours < 24) {
      return `Publicada há ${diffInHours} horas`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) {
        return 'Publicada há 1 dia';
      } else {
        return `Publicada há ${diffInDays} dias`;
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header hideTicker={true} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-gray-600 text-xl">Carregando...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header hideTicker={true} />
      
      {/* Container principal com layout 80/20 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Área de conteúdo - 80% */}
          <div className="w-full lg:w-4/5">
            <div className="mb-8">
              <h1 className="news-title text-4xl font-bold text-gray-900 mb-2">
                Últimas Notícias
              </h1>
              <p className="news-body text-lg text-gray-600">
                As notícias mais recentes em ordem de publicação
              </p>
            </div>

            {/* Lista vertical de notícias */}
            <div className="space-y-6">
              {latestNews.map((news, index) => (
                <div key={news.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <Link 
                    to={`/noticia/${news.slug}`}
                    className="block group hover:bg-gray-50 transition-colors p-4 rounded-lg"
                  >
                    <div className="flex gap-6">
                      {/* Imagem quadrada */}
                      <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                        <img
                          src={news.image_url || '/placeholder-news.jpg'}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Conteúdo da notícia */}
                      <div className="flex-1">
                        <h2 className="news-title text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h2>
                        
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          {news.author && (
                            <span className="news-body font-medium">{news.author}</span>
                          )}
                          <span className="news-body">{getTimeAgo(news.published_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Área de banner - 20% */}
          <div className="hidden lg:block w-1/5">
            <div className="sticky top-8">
              {ultimasBanner ? (
                <BannerDisplay banner={ultimasBanner} />
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-sm text-gray-500 mb-4">Publicidade</div>
                  <div className="bg-blue-100 h-96 flex items-center justify-center rounded">
                    <div className="text-center">
                      <div className="text-gray-600 font-medium mb-2">Banner de Propaganda</div>
                      <div className="text-xs text-gray-500">300x600</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UltimasPage;
