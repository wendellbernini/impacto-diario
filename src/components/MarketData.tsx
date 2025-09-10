import React from 'react';

const MarketData: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-green-700 py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="text-center mb-8">
          <div className="text-6xl font-bold mb-2">3.112</div>
          <div className="text-xl font-medium">Impacto 250</div>
          <p className="text-blue-100 mt-4">
            Ranking das 250 maiores empresas de capital aberto do continente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold mb-2">Resultados Recentes</h4>
            <div className="space-y-2 text-sm">
              <div>Industry holdings Corp (DWTHS) divulga resultados</div>
              <div>Anglex Bangleton Holdings Inc. (ASBP) divulga resultados</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold mb-2">Atualizações do Mercado</h4>
            <div className="space-y-2 text-sm">
              <div>Nuvance Health Hospital Services (NVHS) divulga resultados</div>
              <div>Bezhaye Electrotex Inc. (BEI-A) divulga resultados</div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="font-semibold mb-2">Análises</h4>
            <div className="space-y-2 text-sm">
              <div>Departamento em DWTHS divulga resultados</div>
              <div>Volatilidade do mercado continua</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketData;