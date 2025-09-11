import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '../lib/supabase';
import { NewsItem } from '../lib/supabase';

const HighlightsPage: React.FC = () => {
  const [highlightedNews, setHighlightedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlightedNews = async () => {
      try {
        // Buscar notícias em destaque (is_featured = true) ou notícias mais recentes
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .or('is_featured.eq.true,is_breaking.eq.true')
          .order('published_at', { ascending: false })
          .limit(12);

        if (!error && data && data.length > 0) {
          setHighlightedNews(data);
        } else {
          // Fallback: buscar notícias mais recentes se não houver destaque
          const { data: recentData, error: recentError } = await supabase
            .from('news')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(12);

          if (!recentError && recentData) {
            setHighlightedNews(recentData);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar notícias em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightedNews();
  }, []);

  // Função para converter data para formato relativo
  const getRelativeDate = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInMs = now.getTime() - published.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    // Se for hoje
    if (diffInDays === 0) {
      if (diffInHours < 1) {
        return 'há poucos minutos';
      } else if (diffInHours === 1) {
        return 'há 1 hora';
      } else {
        return `há ${diffInHours} horas`;
      }
    }

    // Se for ontem
    if (diffInDays === 1) {
      return 'ontem';
    }

    // Se for há 2 dias
    if (diffInDays === 2) {
      return 'anteontem';
    }

    // Se for na última semana
    if (diffInDays <= 7) {
      const dayNames = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
      const dayName = dayNames[published.getDay()];
      return `última ${dayName}`;
    }

    // Se for há mais de uma semana
    if (diffInDays <= 14) {
      return 'há 2 semanas';
    }

    if (diffInDays <= 21) {
      return 'há 3 semanas';
    }

    if (diffInDays <= 30) {
      return 'há 1 mês';
    }

    // Para datas mais antigas, usar formato tradicional
    return published.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'politica': 'Política',
      'economia': 'Economia',
      'educacao': 'Educação',
      'ciencia': 'Ciência',
      'saude': 'Saúde',
      'seguranca': 'Segurança',
      'tecnologia': 'Tecnologia'
    };
    return categoryMap[category] || category;
  };

  const getLocationDisplayName = (location: string) => {
    const locationMap: Record<string, string> = {
      'brasil': 'Brasil',
      'mundo': 'Mundo'
    };
    return locationMap[location] || location;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header hideTicker={true} hideNavigation={true} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título da Página */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Impacto Diário Destaque
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            As principais notícias selecionadas pelos nossos editores
          </p>
        </div>

        {/* Grid de Notícias em Destaque */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightedNews.map((news) => (
              <Link key={news.id} to={`/noticia/${news.slug}`} className="block group">
                <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                  {/* Header com categoria e data */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        {getCategoryDisplayName(news.category)}
                      </span>
                      {news.location && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs font-medium text-green-600 uppercase tracking-wide">
                            {getLocationDisplayName(news.location)}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getRelativeDate(news.published_at)}
                    </div>
                  </div>

                  {/* Título */}
                  <h2 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                    {news.title}
                  </h2>

                  {/* Resumo */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {news.summary}
                  </p>

                  {/* Indicador de seleção (simbolo) */}
                  <div className="flex items-center justify-end mt-4">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Mensagem quando não há notícias */}
        {!loading && highlightedNews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma notícia em destaque encontrada</p>
            <p className="text-gray-400 text-sm mt-2">Volte mais tarde para ver as principais notícias</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default HighlightsPage;
