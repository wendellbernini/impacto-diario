import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '../lib/supabase';
import { NewsItem } from '../lib/supabase';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Carregar notícias recentes e pesquisas recentes ao montar o componente
  useEffect(() => {
    const fetchRecentNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          setRecentNews(data);
        }
      } catch (error) {
        console.error('Erro ao buscar notícias recentes:', error);
      }
    };

    const loadRecentSearches = () => {
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    };

    fetchRecentNews();
    loadRecentSearches();
  }, []);

  // Função de busca
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .or(`title.ilike.%${query}%, summary.ilike.%${query}%, content.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setSearchResults(data);
        
        // Salvar pesquisa recente
        const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 3);
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce da busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
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
      <Header hideTicker={true} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seção de Busca */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Buscar por</h1>
          
          {/* Input de Busca */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Digite sua pesquisa..."
                className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-transparent"
              />
              <Search className="absolute right-0 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Pesquisas Recentes */}
          {recentSearches.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Suas pesquisas recentes</span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600 ml-2"
                >
                  Limpar
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resultados da Busca ou Notícias Recentes */}
        <div className="space-y-8">
          {hasSearched ? (
            // Resultados da Busca
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {loading ? 'Buscando...' : `Resultados para "${searchQuery}"`}
              </h2>
              
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse flex space-x-4">
                      <div className="w-32 h-24 bg-gray-300 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.map((news) => (
                    <Link key={news.id} to={`/noticia/${news.slug}`} className="block group">
                      <article className="flex space-x-4 hover:bg-gray-50 p-4 rounded-lg transition-colors">
                        {/* Imagem */}
                        <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                          {news.image_url ? (
                            <img 
                              src={news.image_url} 
                              alt={news.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-white text-sm">📰</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Conteúdo */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
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
                          
                          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                            {news.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                            {news.summary}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Nenhum resultado encontrado para "{searchQuery}"</p>
                  <p className="text-gray-400 text-sm mt-2">Tente usar palavras-chave diferentes</p>
                </div>
              )}
            </div>
          ) : (
            // Notícias Recentes (quando não há busca)
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mais Recentes do Impacto Diário</h2>
              
              <div className="space-y-6">
                {recentNews.map((news) => (
                  <Link key={news.id} to={`/noticia/${news.slug}`} className="block group">
                    <article className="flex space-x-4 hover:bg-gray-50 p-4 rounded-lg transition-colors">
                      {/* Imagem */}
                      <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                        {news.image_url ? (
                          <img 
                            src={news.image_url} 
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-sm">📰</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Conteúdo */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
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
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {news.summary}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
