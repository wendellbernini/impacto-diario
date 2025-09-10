import React, { useState, useEffect } from 'react';
import { newsService } from '../../lib/supabase';

interface DashboardHomeProps {
  onNavigate: (view: 'home' | 'create-news' | 'manage-news' | 'manage-banners') => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    categories: {} as Record<string, number>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Buscar todas as notícias para estatísticas
        const allNews = await newsService.getPublishedNews();
        
        const published = allNews.filter(news => news.status === 'published').length;
        const draft = allNews.filter(news => news.status === 'draft').length;
        
        // Contar por categoria
        const categoryCounts: Record<string, number> = {};
        allNews.forEach(news => {
          categoryCounts[news.category] = (categoryCounts[news.category] || 0) + 1;
        });

        setStats({
          totalNews: allNews.length,
          publishedNews: published,
          draftNews: draft,
          categories: categoryCounts
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const menuItems = [
    {
      id: 'create-news',
      title: 'Criar Nova Notícia',
      description: 'Escreva e publique uma nova notícia',
      icon: '✍️',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => onNavigate('create-news')
    },
    {
      id: 'manage-news',
      title: 'Gerenciar Notícias',
      description: 'Edite, exclua ou altere status das notícias',
      icon: '📝',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => onNavigate('manage-news')
    },
    {
      id: 'manage-banners',
      title: 'Gerenciar Banners',
      description: 'Atualize os banners publicitários do site',
      icon: '🖼️',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => onNavigate('manage-banners')
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando estatísticas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Administrativo
        </h1>
        <p className="text-gray-600">
          Gerencie o conteúdo do Impacto Diário
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total de Notícias</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalNews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl mr-4">✅</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Publicadas</h3>
              <p className="text-3xl font-bold text-green-600">{stats.publishedNews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📝</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rascunhos</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.draftNews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu de Ações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`${item.color} text-white p-6 rounded-lg shadow-sm transition-colors text-left`}
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-sm opacity-90">{item.description}</p>
          </button>
        ))}
      </div>

      {/* Estatísticas por Categoria */}
      {Object.keys(stats.categories).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Notícias por Categoria
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.categories).map(([category, count]) => (
              <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-1">{category}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links Rápidos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          🔗 Links Rápidos
        </h3>
        <div className="space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-700 hover:text-blue-900 transition-colors"
          >
            → Ver site público
          </a>
          <a
            href="/supabase-config.md"
            className="block text-blue-700 hover:text-blue-900 transition-colors"
          >
            → Configuração do Supabase
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
