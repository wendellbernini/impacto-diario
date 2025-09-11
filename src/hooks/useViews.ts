import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface ViewStats {
  totalViews: number
  averageViews: number
  viewsToday: number
  viewsThisWeek: number
  viewsThisMonth: number
}

interface NewsView {
  id: string
  news_id: string
  ip_address: string
  user_agent: string
  viewed_at: string
  session_id: string
  created_at: string
}

export const useViews = () => {
  const [loading, setLoading] = useState(false)

  // Função para registrar uma visualização
  const trackView = async (newsId: string) => {
    try {
      // Gerar um session_id único baseado no timestamp e random
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Verificar se já existe uma visualização recente para esta notícia (últimos 5 minutos)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      
      const { data: existingViews } = await supabase
        .from('news_views')
        .select('id')
        .eq('news_id', newsId)
        .gte('viewed_at', fiveMinutesAgo)
        .limit(1)

      // Se já existe uma visualização recente, não registrar novamente
      if (existingViews && existingViews.length > 0) {
        console.log('Visualização já registrada recentemente para esta notícia')
        return
      }
      
      const { error } = await supabase
        .from('news_views')
        .insert([
          {
            news_id: newsId,
            session_id: sessionId,
            viewed_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Erro ao registrar visualização:', error)
      } else {
        console.log('Visualização registrada com sucesso para notícia:', newsId)
      }
    } catch (error) {
      console.error('Erro ao registrar visualização:', error)
    }
  }

  // Função para obter estatísticas gerais
  const getViewStats = async (): Promise<ViewStats> => {
    try {
      setLoading(true)

      // Total de visualizações
      const { count: totalViews } = await supabase
        .from('news_views')
        .select('*', { count: 'exact', head: true })

      // Visualizações hoje
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: viewsToday } = await supabase
        .from('news_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', today.toISOString())

      // Visualizações desta semana
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const { count: viewsThisWeek } = await supabase
        .from('news_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', weekAgo.toISOString())

      // Visualizações deste mês
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      const { count: viewsThisMonth } = await supabase
        .from('news_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', monthAgo.toISOString())

      // Calcular média de visualizações por notícia
      const { data: newsCount } = await supabase
        .from('news')
        .select('*', { count: 'exact', head: true })

      const averageViews = newsCount && totalViews ? Math.round(totalViews / newsCount) : 0

      return {
        totalViews: totalViews || 0,
        averageViews,
        viewsToday: viewsToday || 0,
        viewsThisWeek: viewsThisWeek || 0,
        viewsThisMonth: viewsThisMonth || 0
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas de visualização:', error)
      return {
        totalViews: 0,
        averageViews: 0,
        viewsToday: 0,
        viewsThisWeek: 0,
        viewsThisMonth: 0
      }
    } finally {
      setLoading(false)
    }
  }

  // Função para obter visualizações por notícia
  const getViewsByNews = async (newsId: string): Promise<number> => {
    try {
      const { count } = await supabase
        .from('news_views')
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId)

      return count || 0
    } catch (error) {
      console.error('Erro ao obter visualizações da notícia:', error)
      return 0
    }
  }

  // Função para obter notícias mais visualizadas
  const getMostViewedNews = async (limit: number = 10) => {
    try {
      const { data, error } = await supabase
        .from('news_views')
        .select(`
          news_id,
          news:news_id (
            id,
            title,
            slug,
            category,
            image_url,
            created_at
          )
        `)

      if (error) throw error

      // Agrupar por news_id e contar visualizações
      const viewCounts: { [key: string]: { count: number; news: any } } = {}
      
      data?.forEach(view => {
        if (view.news) {
          if (!viewCounts[view.news_id]) {
            viewCounts[view.news_id] = { count: 0, news: view.news }
          }
          viewCounts[view.news_id].count++
        }
      })

      // Converter para array e ordenar por visualizações
      const sortedNews = Object.values(viewCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)

      return sortedNews
    } catch (error) {
      console.error('Erro ao obter notícias mais visualizadas:', error)
      return []
    }
  }

  // Função para obter estatísticas por período
  const getViewsByPeriod = async (days: number = 30) => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('news_views')
        .select('viewed_at')
        .gte('viewed_at', startDate.toISOString())
        .order('viewed_at', { ascending: true })

      if (error) throw error

      // Agrupar por dia
      const dailyViews: { [key: string]: number } = {}
      
      data?.forEach(view => {
        const date = new Date(view.viewed_at).toISOString().split('T')[0]
        dailyViews[date] = (dailyViews[date] || 0) + 1
      })

      return dailyViews
    } catch (error) {
      console.error('Erro ao obter visualizações por período:', error)
      return {}
    }
  }

  return {
    trackView,
    getViewStats,
    getViewsByNews,
    getMostViewedNews,
    getViewsByPeriod,
    loading
  }
}
