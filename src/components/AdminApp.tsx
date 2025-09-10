import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import AdminDashboard from './AdminDashboard'
import NewsManager from './NewsManager'

export default function AdminApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    // Verificar se usuário está logado
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Criar usuário admin se não existir (comentado por enquanto)
  // useEffect(() => {
  //   if (user) {
  //     createAdminUserIfNeeded()
  //   }
  // }, [user])

  // const createAdminUserIfNeeded = async () => {
  //   try {
  //     // Verificar se é o primeiro login
  //     const { data: profile } = await supabase
  //       .from('profiles')
  //       .select('*')
  //       .eq('id', user?.id)
  //       .single()

  //     if (!profile) {
  //       // Criar perfil do admin
  //       await supabase
  //         .from('profiles')
  //         .insert([
  //           {
  //             id: user?.id,
  //             email: user?.email,
  //             role: 'admin',
  //             created_at: new Date().toISOString()
  //           }
  //         ])
  //     }
  //   } catch (error) {
  //     // Tabela profiles pode não existir ainda, isso é normal
  //     console.log('Profile creation skipped:', error)
  //   }
  // }

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard key={refreshTrigger} onNavigate={setCurrentPage} />
      case 'news':
        return <NewsManager onNewsChange={handleRefresh} />
      case 'banners':
        return <div className="text-center py-12 text-gray-600">Gerenciamento de Banners (Em desenvolvimento)</div>
      case 'analytics':
        return <div className="text-center py-12 text-gray-600">Analytics (Em desenvolvimento)</div>
      case 'settings':
        return <div className="text-center py-12 text-gray-600">Configurações (Em desenvolvimento)</div>
      default:
        return <AdminDashboard key={refreshTrigger} onNavigate={setCurrentPage} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AdminLogin />
  }

  return (
    <AdminLayout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
    >
      {renderCurrentPage()}
    </AdminLayout>
  )
}
