import { useState, useEffect } from 'react'
import { supabase, NewsItem } from '../lib/supabase'

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao carregar notícias:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [])

  // Funções utilitárias para filtrar notícias
  const getUrgentNews = () => {
    return news.filter(item => item.is_breaking).slice(0, 1)[0]
  }

  const getFeaturedNews = () => {
    return news
      .filter(item => item.is_featured)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  }

  const getLatestNews = (limit: number = 5) => {
    return news.slice(0, limit)
  }

  const getNewsByCategory = (category: string, limit: number = 4) => {
    return news.filter(item => item.category === category).slice(0, limit)
  }

  const getNewsByLocation = (location: string, limit: number = 4) => {
    return news.filter(item => item.location === location).slice(0, limit)
  }

  const getPopularNews = (limit: number = 3) => {
    return news
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit)
  }

  const getEditorChoiceNews = (limit: number = 3) => {
    return news
      .filter(item => item.is_editor_choice)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  const getTrendingCategories = () => {
    const categoryViews = news.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + (item.views || 0)
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category)
  }

  return {
    news,
    loading,
    error,
    loadNews,
    getUrgentNews,
    getFeaturedNews,
    getLatestNews,
    getNewsByCategory,
    getNewsByLocation,
    getPopularNews,
    getEditorChoiceNews,
    getTrendingCategories
  }
}
