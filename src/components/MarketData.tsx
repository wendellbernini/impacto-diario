import React from 'react';

const MarketData: React.FC = () => {
  return (
    <section className="py-6 mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-green-700 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"></div>
          </div>
          
          <div className="relative px-8 py-8 text-white text-center">
            <div className="mb-2">
              <span className="text-xs uppercase tracking-wide opacity-80">Publicidade</span>
            </div>
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-bold text-2xl mb-3">Anuncie Aqui</h3>
            <p className="text-blue-100 text-lg mb-4">
              Alcance milhares de leitores diariamente
            </p>
            <p className="text-blue-200 text-sm">
              Espaço premium para sua marca no jornal digital mais confiável
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketData;