import React, { useState } from 'react';
import { Search, Menu, X, User } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-md lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 hidden sm:inline">Buscar</span>
            </div>
            
            <div className="hidden sm:block text-sm text-gray-600">
              Newsletter gratuita
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <div className="flex flex-col items-center leading-none">
              <span className="text-2xl font-bold tracking-wider">Impacto</span>
              <span className="text-xs font-semibold tracking-widest text-gray-500" style={{ letterSpacing: '0.2em' }}>DIÁRIO</span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Membro
            </button>
            <User className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex justify-center py-3 border-t border-gray-100">
          <div className="flex space-x-8">
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">PRINCIPAL</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">ÚLTIMAS</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">NEGÓCIOS</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">MERCADO</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">TECNOLOGIA</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">VIDA</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">ESTILO DE VIDA</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">LIDERANÇA</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">EMAILS</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">PODCASTS</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;