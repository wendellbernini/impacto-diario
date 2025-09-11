import { useState, useEffect } from 'react'

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

const defaultSettings: SiteSettings = {
  siteName: 'Impacto Diário',
  siteDescription: 'Portal de notícias com foco em informações relevantes e atualizadas',
  contactEmail: 'contato@impactodiario.com',
  socialMedia: {
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  },
  content: {
    autoApproveComments: false,
    maxNewsPerDay: 10,
    defaultCategory: 'politica'
  }
}

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('site-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const saveSettings = async (newSettings: SiteSettings) => {
    try {
      setLoading(true)
      
      // Salvar no localStorage por enquanto
      localStorage.setItem('site-settings', JSON.stringify(newSettings))
      setSettings(newSettings)
      
      return { success: true, message: 'Configurações salvas com sucesso!' }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      return { success: false, message: 'Erro ao salvar configurações' }
    } finally {
      setLoading(false)
    }
  }

  const getSocialMediaLinks = () => {
    return settings.socialMedia
  }

  const getSiteInfo = () => {
    return {
      name: settings.siteName,
      description: settings.siteDescription,
      contactEmail: settings.contactEmail
    }
  }

  return {
    settings,
    setSettings,
    saveSettings,
    getSocialMediaLinks,
    getSiteInfo,
    loading
  }
}
