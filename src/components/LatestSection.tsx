import React from 'react';

const LatestSection: React.FC = () => {
  const latestArticles = [
    {
      title: "Empresários correm para hipotecas com taxas no menor nível em quase um ano",
      time: "45 minutos atrás"
    },
    {
      title: "Fabricante olímpico Novo Nordisk corta 9.000 empregos em meio à rigidez de peso",
      time: "1 hora atrás"
    },
    {
      title: "RFK Jr. mira tribunal federal de vacinas que protege fabricantes de vacinas",
      time: "1 hora atrás"
    },
    {
      title: "Os melhores programas de recompensas de companhias aéreas, segundo pontos",
      time: "6 horas atrás"
    },
    {
      title: "Quem define as taxas de hipoteca e como funcionam?",
      time: "6 horas atrás"
    }
  ];

  const centerArticles = [
    {
      title: "Ações da Oracle disparam 42% com receita recorde de $144 bilhões em IA",
      summary: "A CEO Safra Catz saudou um trimestre 'surpreendente' enquanto novos contratos de IA na nuvem impulsionam grandes ganhos no mercado.",
      image: "📊",
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "Evento do iPhone 17 da Apple aposta em reformulação do design",
      summary: "Cupertino entrega ritual com iPhone mais fino, AirPods com IA e Apple Watch renovado para manter interesse dos consumidores.",
      image: "📱",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Trump não pode demitir governadora do Fed Lisa Cook, decide juiz",
      summary: "A decisão chegou tarde na terça-feira e preserva o papel de Cook no banco central por enquanto, mas recurso é esperado.",
      image: "🏛️",
      color: "from-red-500 to-orange-500"
    },
    {
      title: "Klarna lidera nova onda de IPOs enquanto Wall Street espera",
      summary: "A fintech sueca lidera uma série de captações que animam quem vê meses otimistas à frente no mercado de ações.",
      image: "💼",
      color: "from-green-500 to-blue-500"
    }
  ];

  return (
    <section className="bg-white py-8">
      {/* Linha superior com margens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="h-px bg-gray-300"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Coluna Esquerda - Últimas */}
          <div className="lg:col-span-3">
            <div className="border-r border-gray-300 pr-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Últimas</h2>
              <div className="space-y-4">
                {latestArticles.map((article, index) => (
                  <article key={index} className="group cursor-pointer pb-4 border-b border-gray-200 last:border-b-0">
                    <h3 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                      {article.title}
                    </h3>
                    <time className="text-sm text-gray-500">{article.time}</time>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Central - 4 Notícias Verticais */}
          <div className="lg:col-span-6">
            <div className="border-r border-gray-300 pr-6">
              <div className="space-y-6">
                {centerArticles.map((article, index) => (
                  <article key={index} className="group cursor-pointer flex space-x-4 pb-6 border-b border-gray-200 last:border-b-0">
                    {/* Imagem à esquerda */}
                    <div className={`w-24 h-20 bg-gradient-to-r ${article.color} flex-shrink-0 flex items-center justify-center`}>
                      <span className="text-white text-xl">{article.image}</span>
                    </div>
                    
                    {/* Conteúdo à direita */}
                    <div className="flex-1">
                      <h3 className="news-title text-base text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                        {article.title}
                      </h3>
                      <p className="news-body text-sm text-gray-600 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Direita - Segurança */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Segurança</h2>
              
              {/* Imagem grande */}
              <article className="group cursor-pointer">
                <div className="w-full h-40 bg-gradient-to-r from-red-600 to-purple-600 mb-3 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl mb-1">🛡️</div>
                    <p className="text-sm">Segurança Digital</p>
                  </div>
                </div>
                <h3 className="news-title text-base text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  Novo ataque cibernético afeta milhões de usuários em todo o mundo
                </h3>
              </article>

              {/* Duas imagens menores */}
              <div className="space-y-4">
                <article className="group cursor-pointer">
                  <div className="flex space-x-3">
                    <div className="w-16 h-12 bg-gradient-to-r from-orange-500 to-red-500 flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-sm">🔒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        WhatsApp implementa nova camada de criptografia
                      </h4>
                    </div>
                  </div>
                </article>

                <article className="group cursor-pointer">
                  <div className="flex space-x-3">
                    <div className="w-16 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      <span className="text-white text-sm">⚠️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        Golpes por SMS aumentam 300% no último trimestre
                      </h4>
                    </div>
                  </div>
                </article>
              </div>
              
              {/* Banner de Publicidade */}
              <div className="mt-8">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 text-white text-center cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="mb-1">
                    <span className="text-xs uppercase tracking-wide opacity-80">Publicidade</span>
                  </div>
                  <div className="text-2xl mb-2">📢</div>
                  <h4 className="font-bold text-sm mb-1">Anuncie Aqui</h4>
                  <p className="text-orange-100 text-xs">
                    Espaço publicitário premium
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestSection;
