import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gray-600 text-lg">Estilo de Vida</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main featured article */}
          <div className="lg:col-span-2">
            <article className="group cursor-pointer">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-gray-700 transition-colors">
                Klarna lidera nova onda de IPOs e Wall Street espera por uma temporada de outono promissora
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                A fintech sueca lidera uma série de captações que animam quem vê meses otimistas à frente, apesar dos alertas para ações menores.
              </p>
            </article>
          </div>

          {/* Side content */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4">Destaques</h3>
              <div className="space-y-4">
                <article className="group cursor-pointer">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Os melhores programas de pesquisa online, segundo professores
                  </h4>
                </article>
                <article className="group cursor-pointer">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Quem consegue taxas de hipoteca e como funcionam?
                  </h4>
                </article>
                <article className="group cursor-pointer">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Os EUA consideram mudar planos comerciais rapidamente...
                  </h4>
                </article>
              </div>
            </div>

            <div className="space-y-4">
              <article className="group cursor-pointer flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                    Macintosh pode colher o fim de...
                  </h4>
                </div>
              </article>
              
              <article className="group cursor-pointer flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                    Turquia pode levar a economia dos EUA à crise, em qualquer lugar...
                  </h4>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;