import React, { useState, useEffect } from 'react'
import { supabase, NewsItem, Banner } from '../lib/supabase'
import { 
  FileText, 
  Image, 
  Eye, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3,
  AlertCircle
} from 'lucide-react'

interface DashboardStats {
  totalNews: number
  featuredNews: number
  totalBanners: number
  activeBanners: number
  totalViews: number
  todayNews: number
}

interface AdminDashboardProps {
  onNavigate?: (page: string) => void
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    featuredNews: 0,
    totalBanners: 0,
    activeBanners: 0,
    totalViews: 0,
    todayNews: 0
  })
  const [recentNews, setRecentNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Carregar estatísticas
      const [newsResult, bannersResult] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('banners').select('*')
      ])

      if (newsResult.data && bannersResult.data) {
        const news = newsResult.data
        const banners = bannersResult.data

        const today = new Date().toISOString().split('T')[0]
        const todayNews = news.filter(n => n.created_at.startsWith(today))

        setStats({
          totalNews: news.length,
          featuredNews: news.filter(n => n.is_featured).length,
          totalBanners: banners.length,
          activeBanners: banners.filter(b => b.is_active).length,
          totalViews: news.reduce((sum, n) => sum + (n.views || 0), 0),
          todayNews: todayNews.length
        })

        // Pegar as 5 notícias mais recentes
        setRecentNews(news.slice(0, 5))
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }: {
    icon: any
    title: string
    value: number | string
    subtitle?: string
    color?: string
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-100',
      green: 'bg-green-500 text-green-100',
      yellow: 'bg-yellow-500 text-yellow-100',
      purple: 'bg-purple-500 text-purple-100',
      red: 'bg-red-500 text-red-100'
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo ao Painel Administrativo! 👋</h1>
        <p className="text-blue-100">
          Gerencie suas notícias, banners e acompanhe as estatísticas do seu portal.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={FileText}
          title="Total de Notícias"
          value={stats.totalNews}
          subtitle={`${stats.featuredNews} em destaque`}
          color="blue"
        />
        <StatCard
          icon={Image}
          title="Banners"
          value={stats.totalBanners}
          subtitle={`${stats.activeBanners} ativos`}
          color="green"
        />
        <StatCard
          icon={Eye}
          title="Total de Visualizações"
          value={stats.totalViews.toLocaleString()}
          color="purple"
        />
        <StatCard
          icon={Calendar}
          title="Notícias Hoje"
          value={stats.todayNews}
          color="yellow"
        />
        <StatCard
          icon={TrendingUp}
          title="Taxa de Destaque"
          value={`${stats.totalNews > 0 ? Math.round((stats.featuredNews / stats.totalNews) * 100) : 0}%`}
          color="red"
        />
        <StatCard
          icon={BarChart3}
          title="Média de Views"
          value={stats.totalNews > 0 ? Math.round(stats.totalViews / stats.totalNews) : 0}
          subtitle="por notícia"
        />
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Notícias Recentes</h2>
        </div>
        <div className="p-6">
          {recentNews.length > 0 ? (
            <div className="space-y-4">
              {recentNews.map((news) => (
                <div key={news.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  {news.image_url && (
                    <img
                      src={news.image_url}
                      alt={news.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{news.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{news.summary}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="capitalize">{news.category}</span>
                      <span>{news.views} visualizações</span>
                      <span>{new Date(news.published_at).toLocaleDateString()}</span>
                      {news.is_featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Destaque</span>
                      )}
                      {news.is_breaking && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Urgente</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Nenhuma notícia encontrada</p>
              <button 
                onClick={() => onNavigate?.('news')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Criar Primeira Notícia
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate?.('news')}
              className="w-full text-left p-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <FileText className="inline h-5 w-5 mr-3" />
              Criar Nova Notícia
            </button>
            <button 
              onClick={() => onNavigate?.('banners')}
              className="w-full text-left p-3 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              <Image className="inline h-5 w-5 mr-3" />
              Adicionar Banner
            </button>
            <button 
              onClick={() => onNavigate?.('analytics')}
              className="w-full text-left p-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <BarChart3 className="inline h-5 w-5 mr-3" />
              Ver Analytics
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dicas do Sistema</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Use imagens de alta qualidade para melhor engajamento</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Mantenha os títulos concisos e atrativos</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Configure banners com datas de expiração</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
