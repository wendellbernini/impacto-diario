import React, { useState, useEffect } from 'react'
import { useViews } from '../hooks/useViews'
import { supabase } from '../lib/supabase'
import { 
  Eye, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Clock,
  Target
} from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  averageViews: number
  viewsToday: number
  viewsThisWeek: number
  viewsThisMonth: number
  mostViewedNews: Array<{
    count: number
    news: {
      id: string
      title: string
      slug: string
      category: string
      image_url: string
      created_at: string
    }
  }>
  viewsByPeriod: { [key: string]: number }
  categoryStats: { [key: string]: number }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30' | '90'>('30')
  const { getViewStats, getMostViewedNews, getViewsByPeriod } = useViews()

  useEffect(() => {
    loadAnalytics()
  }, [selectedPeriod])

  const loadAnalytics = async () => {
    try {
      setLoading(true)

      const [viewStats, mostViewed, viewsByPeriod] = await Promise.all([
        getViewStats(),
        getMostViewedNews(10),
        getViewsByPeriod(parseInt(selectedPeriod))
      ])

      // Obter estatísticas por categoria
      const { data: newsData } = await supabase
        .from('news')
        .select('category')

      const categoryStats: { [key: string]: number } = {}
      newsData?.forEach(news => {
        categoryStats[news.category] = (categoryStats[news.category] || 0) + 1
      })

      setAnalytics({
        ...viewStats,
        mostViewedNews: mostViewed,
        viewsByPeriod,
        categoryStats
      })
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      'politica': 'Política',
      'economia': 'Economia',
      'seguranca': 'Segurança',
      'educacao': 'Educação',
      'ciencia': 'Ciência',
      'saude': 'Saúde'
    }
    return names[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'politica': 'bg-red-500',
      'economia': 'bg-green-500',
      'seguranca': 'bg-orange-500',
      'educacao': 'bg-blue-500',
      'ciencia': 'bg-purple-500',
      'saude': 'bg-pink-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado disponível</h3>
          <p className="text-gray-500">Ainda não há dados de visualização para exibir.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Acompanhe o desempenho do seu portal de notícias</p>
        </div>
        
        {/* Filtro de Período */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['7', '30', '90'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period} dias
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+{analytics.viewsToday} hoje</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média por Notícia</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageViews}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Target className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-blue-600 font-medium">por artigo</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.viewsThisWeek.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">últimos 7 dias</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.viewsThisMonth.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Activity className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-orange-600 font-medium">últimos 30 dias</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Visualizações por Período */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualizações por Período</h3>
          <div className="space-y-3">
            {Object.entries(analytics.viewsByPeriod)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .slice(-10)
              .map(([date, views]) => (
                <div key={date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{formatDate(date)}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (views / Math.max(...Object.values(analytics.viewsByPeriod))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{views}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Distribuição por Categoria */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notícias por Categoria</h3>
          <div className="space-y-3">
            {Object.entries(analytics.categoryStats)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)} mr-3`}></div>
                    <span className="text-sm text-gray-600">{getCategoryName(category)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Notícias Mais Visualizadas */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Notícias Mais Visualizadas</h3>
        </div>
        <div className="divide-y">
          {analytics.mostViewedNews.map((item, index) => (
            <div key={item.news.id} className="p-6 flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.news.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {getCategoryName(item.news.category)} • {formatDate(item.news.created_at)}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-sm font-medium text-gray-900">{item.count}</p>
                <p className="text-xs text-gray-500">visualizações</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
