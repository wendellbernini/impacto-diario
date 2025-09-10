import React, { useState, useEffect } from 'react'
import { supabase, NewsItem } from '../lib/supabase'
import BasicTextEditor from './BasicTextEditor'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Save,
  X,
  Upload,
  Star,
  AlertTriangle,
  Camera
} from 'lucide-react'

interface NewsManagerProps {
  onNewsChange?: () => void
}

export default function NewsManager({ onNewsChange }: NewsManagerProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'principal',
    image_url: '',
    image_credits: '',
    is_featured: false,
    is_breaking: false
  })

  const categories = [
    'principal', 'brasil', 'mundo', 'politica', 'economia', 'seguranca', 'educacao', 'ciencia', 'saude', 'ultimas'
  ]

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNews(data || [])
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      const newsData = {
        title: formData.title,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        image_url: formData.image_url,
        is_featured: formData.is_featured,
        is_breaking: formData.is_breaking,
        slug,
        updated_at: new Date().toISOString()
      }

      if (editingNews) {
        // Atualizar notícia existente
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', editingNews.id)

        if (error) throw error
      } else {
        // Criar nova notícia
        const { error } = await supabase
          .from('news')
          .insert([newsData])

        if (error) throw error
      }

      await loadNews()
      closeModal()
      
      // Notificar o dashboard para atualizar
      if (onNewsChange) {
        onNewsChange()
      }
    } catch (error: any) {
      console.error('Erro ao salvar notícia:', error)
      const errorMessage = error?.message || 'Erro desconhecido'
      alert(`Erro ao salvar notícia: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta notícia?')) return

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadNews()
      
      // Notificar o dashboard para atualizar
      if (onNewsChange) {
        onNewsChange()
      }
    } catch (error) {
      console.error('Erro ao deletar notícia:', error)
      alert('Erro ao deletar notícia.')
    }
  }

  const openModal = (newsItem?: NewsItem) => {
    if (newsItem) {
      setEditingNews(newsItem)
      setFormData({
        title: newsItem.title,
        summary: newsItem.summary || '',
        content: newsItem.content || '',
        category: newsItem.category,
        image_url: newsItem.image_url || '',
        image_credits: newsItem.image_credits || '',
        is_featured: newsItem.is_featured,
        is_breaking: newsItem.is_breaking
      })
    } else {
      setEditingNews(null)
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: 'principal',
        image_url: '',
        image_credits: '',
        is_featured: false,
        is_breaking: false
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingNews(null)
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Notícias</h1>
          <p className="text-gray-600">Crie, edite e gerencie todas as notícias do portal</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Nova Notícia
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredNews.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.title}
                      </h3>
                      {item.is_featured && (
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      )}
                      {item.is_breaking && (
                        <AlertTriangle className="h-5 w-5 text-red-500 fill-current" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.summary}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.views} visualizações
                      </span>
                      <span>
                        {new Date(item.published_at).toLocaleDateString()}
                      </span>
                      <span>
                        Por {item.author}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openModal(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma notícia encontrada</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal}></div>
            
            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingNews ? 'Editar Notícia' : 'Nova Notícia'}
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-4 max-h-[70vh] overflow-y-auto space-y-6">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite o título da notícia"
                    />
                  </div>

                  {/* Resumo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resumo
                    </label>
                    <textarea
                      value={formData.summary}
                      onChange={(e) => setFormData({...formData, summary: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Resumo da notícia (aparece na lista)"
                    />
                  </div>

                  {/* Conteúdo com Editor Rico */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conteúdo Completo *
                    </label>
                    <BasicTextEditor
                      content={formData.content}
                      onChange={(content) => setFormData({...formData, content})}
                      placeholder="Digite o conteúdo completo da notícia. Use a barra de ferramentas para formatar o texto, adicionar imagens, vídeos e links."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Use a barra de ferramentas para formatar texto com **negrito**, *itálico*, inserir imagens, vídeos do YouTube e links.
                    </p>
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Imagem Principal */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Camera className="h-5 w-5 text-gray-600 mr-2" />
                      <h4 className="text-sm font-medium text-gray-700">Imagem Principal da Notícia</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          URL da Imagem *
                        </label>
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Créditos da Imagem
                        </label>
                        <input
                          type="text"
                          value={formData.image_credits}
                          onChange={(e) => setFormData({...formData, image_credits: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Foto: João Silva/Agência Brasil"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Ex: "Foto: Nome do Fotógrafo/Agência" - Aparecerá abaixo da imagem na notícia
                        </p>
                      </div>
                    </div>

                    {/* Preview da Imagem */}
                    {formData.image_url && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                        <div className="relative">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                          {formData.image_credits && (
                            <div className="mt-1 text-xs text-gray-500 italic">
                              {formData.image_credits}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Notícia em Destaque</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_breaking}
                        onChange={(e) => setFormData({...formData, is_breaking: e.target.checked})}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Notícia Urgente</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
