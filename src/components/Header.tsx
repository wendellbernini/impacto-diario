import React, { useState } from 'react';
import { Search, Menu, Globe } from 'lucide-react';
import "@fontsource/josefin-sans/700.css";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white  pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 hidden sm:inline">Buscar</span>
            </div>
            
            {/* Linha sutil */}
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            
            <div className="hidden sm:block text-sm text-gray-600">
              Destaques
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <div className="flex flex-col items-center leading-none">
              <span className="text-3xl font-bold tracking-[0.18em] uppercase" style={{ fontFamily: 'Josefin Sans, sans-serif', letterSpacing: '0.18em' }}>IMPACTO</span>
              <span className="text-base font-semibold tracking-[0.18em] text-gray-500 mt-[-0.2em]" style={{ fontFamily: 'Josefin Sans, sans-serif', letterSpacing: '0.18em' }}>DIÁRIO</span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Idioma
              </button>
            </div>
            
            {/* Linha sutil */}
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <Menu className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Linha sutil mais leve acima do menu */}
        <div className="w-full mt-4">
          <div className="h-px bg-gray-200"></div>
        </div>

        {/* Navigation - Menu principal */}
        <nav className="flex justify-center py-4">
          <div className="flex space-x-8 lg:space-x-10">
            <a href="#" className="relative text-sm font-medium text-gray-700 hover:text-gray-900">
              <span className="bg-blue-600 text-white px-2 py-1 text-xs font-bold uppercase">PRINCIPAL</span>
            </a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">BRASIL</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">MUNDO</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">POLÍTICA</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">ECONOMIA</a>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">SEGURANÇA</a>
            <a href="#" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">EDUCAÇÃO</a>
            <a href="#" className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900">CIÊNCIA</a>
            <a href="#" className="hidden lg:block text-sm font-medium text-gray-700 hover:text-gray-900">SAÚDE</a>
            <a href="#" className="hidden lg:block text-sm font-medium text-gray-700 hover:text-gray-900">ÚLTIMAS</a>
          </div>
        </nav>

        {/* Ticker animado de cotações */}
        <Ticker />
      </div>
    </header>
  );
};  1

const Ticker: React.FC = () => {
  const cotacoes = [
    { sigla: 'PETR4', valor: 'R$ 37,12', variacao: '+1,25%' },
    { sigla: 'VALE3', valor: 'R$ 68,90', variacao: '-0,85%' },
    { sigla: 'ITUB4', valor: 'R$ 29,45', variacao: '+0,40%' },
    { sigla: 'BBDC4', valor: 'R$ 23,10', variacao: '+2,10%' },
    { sigla: 'MGLU3', valor: 'R$ 2,45', variacao: '-1,10%' },
    { sigla: 'BBAS3', valor: 'R$ 51,20', variacao: '+0,90%' },
    { sigla: 'ABEV3', valor: 'R$ 14,30', variacao: '+0,15%' },
    { sigla: 'WEGE3', valor: 'R$ 38,00', variacao: '-0,30%' },
  ];
  return (
    <div className="w-full overflow-hidden bg-white">
      <div className="whitespace-nowrap animate-ticker flex" style={{ animation: 'ticker 30s linear infinite' }}>
        {cotacoes.map((c, i) => (
          <div key={i} className="inline-block px-6 py-2 text-sm font-medium">
            <span className="font-bold">{c.sigla}</span> <span>{c.valor}</span> <span className={c.variacao.startsWith('+') ? 'text-green-600' : 'text-red-600'}>{c.variacao}</span>
          </div>
        ))}
        {/* Repete para loop infinito visual */}
        {cotacoes.map((c, i) => (
          <div key={cotacoes.length + i} className="inline-block px-6 py-2 text-sm font-medium opacity-70">
            <span className="font-bold">{c.sigla}</span> <span>{c.valor}</span> <span className={c.variacao.startsWith('+') ? 'text-green-600' : 'text-red-600'}>{c.variacao}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Header;