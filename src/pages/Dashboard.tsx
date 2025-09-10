import React, { useState, useEffect } from 'react';
import { supabase, authService } from '../lib/supabase';
import Login from '../components/dashboard/Login';
import DashboardHome from '../components/dashboard/DashboardHome';
import CreateNews from '../components/dashboard/CreateNews';
import ManageBanners from '../components/dashboard/ManageBanners';
import NewsList from '../components/dashboard/NewsList';

type DashboardView = 'home' | 'create-news' | 'manage-news' | 'manage-banners';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<DashboardView>('home');

  useEffect(() => {
    // Verificar se usuário está logado
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setCurrentView('home');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostrar tela de login
  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  // Renderizar conteúdo baseado na view atual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'create-news':
        return <CreateNews onBack={() => setCurrentView('home')} />;
      case 'manage-news':
        return <NewsList onBack={() => setCurrentView('home')} />;
      case 'manage-banners':
        return <ManageBanners onBack={() => setCurrentView('home')} />;
      default:
        return <DashboardHome onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Dashboard */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('home')}
                className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                📰 Impacto Diário - Dashboard
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Dashboard;
