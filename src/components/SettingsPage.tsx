import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSettings } from '../hooks/useSettings'
import { 
  User, 
  Globe, 
  Shield, 
  Database, 
  Download,
  Save,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'

interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
    linkedin: string
    youtube: string
  }
  content: {
    autoApproveComments: boolean
    maxNewsPerDay: number
    defaultCategory: string
  }
}

export default function SettingsPage() {
  const { settings, setSettings, saveSettings, loading } = useSettings()
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  const handleSave = async () => {
    setMessage(null)
    const result = await saveSettings(settings)
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message })
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  const handleExport = async () => {
    try {
      // Exportar dados do site
      const { data: news } = await supabase.from('news').select('*')
      const { data: banners } = await supabase.from('banners').select('*')

      const exportData = {
        news,
        banners,
        settings,
        exportDate: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-impacto-diario-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage({ type: 'success', text: 'Backup exportado com sucesso!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao exportar backup' })
    }
  }

  const categories = [
    { value: 'politica', label: 'Política' },
    { value: 'economia', label: 'Economia' },
    { value: 'seguranca', label: 'Segurança' },
    { value: 'educacao', label: 'Educação' },
    { value: 'ciencia', label: 'Ciência' },
    { value: 'saude', label: 'Saúde' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do seu portal de notícias</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> :
           message.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2" /> :
           <Info className="h-5 w-5 mr-2" />}
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Informações do Site */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Informações do Site</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Site
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Site
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail de Contato
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <User className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Redes Sociais</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={settings.socialMedia.facebook}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialMedia: {...settings.socialMedia, facebook: e.target.value}
                })}
                placeholder="https://facebook.com/seu-perfil"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="url"
                value={settings.socialMedia.twitter}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialMedia: {...settings.socialMedia, twitter: e.target.value}
                })}
                placeholder="https://twitter.com/seu-perfil"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={settings.socialMedia.instagram}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialMedia: {...settings.socialMedia, instagram: e.target.value}
                })}
                placeholder="https://instagram.com/seu-perfil"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={settings.socialMedia.linkedin}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialMedia: {...settings.socialMedia, linkedin: e.target.value}
                })}
                placeholder="https://linkedin.com/company/sua-empresa"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube
              </label>
              <input
                type="url"
                value={settings.socialMedia.youtube}
                onChange={(e) => setSettings({
                  ...settings, 
                  socialMedia: {...settings.socialMedia, youtube: e.target.value}
                })}
                placeholder="https://youtube.com/@seu-canal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Configurações de Conteúdo */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Configurações de Conteúdo</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria Padrão
              </label>
              <select
                value={settings.content.defaultCategory}
                onChange={(e) => setSettings({
                  ...settings, 
                  content: {...settings.content, defaultCategory: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de Notícias por Dia
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.content.maxNewsPerDay}
                onChange={(e) => setSettings({
                  ...settings, 
                  content: {...settings.content, maxNewsPerDay: parseInt(e.target.value)}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Limite de notícias que podem ser publicadas por dia
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoApproveComments"
                checked={settings.content.autoApproveComments}
                onChange={(e) => setSettings({
                  ...settings, 
                  content: {...settings.content, autoApproveComments: e.target.checked}
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="autoApproveComments" className="ml-2 text-sm text-gray-700">
                Aprovar comentários automaticamente
              </label>
            </div>
          </div>
        </div>


        {/* Backup e Manutenção */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Backup e Manutenção</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">Backup Automático</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Seus dados são automaticamente salvos e protegidos. 
                    Você pode exportar um backup manual a qualquer momento.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Backup
            </button>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  )
}
