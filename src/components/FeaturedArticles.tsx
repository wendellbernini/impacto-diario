import React from 'react';

const FeaturedArticles: React.FC = () => {
  const articles = [
    {
      category: "Trabalho",
      title: "Os 5 estados brasileiros com maior crescimento econômico — e os 5 com menor",
      excerpt: "Mercado imobiliário apresenta sinais de recuperação com construção civil em retomada."
    },
    {
      category: "Investimentos Inteligentes", 
      title: "Geração I.A.",
      excerpt: "Como navegar pelo mundo dos investimentos em inteligência artificial."
    },
    {
      category: "Liderança",
      title: "iPhone deve ganhar design clássico, mas história maior da Apple com IA ainda não foi revelada",
      excerpt: "Apple vai integrar IA em sua linha de produtos principais este ano."
    }
  ];

  const insights = [
    "Os 5 estados com maior crescimento econômico no Brasil e os 5 com menor desempenho",
    "Tendências e oportunidades de investimento na Geração I.A.",
    "Regras de investimento inteligente que nunca saem de moda",
    "Como tecnologias emergentes e ambições revolucionárias enfrentam crescimento lento e regulamentações finais"
  ];

  return (
    <section className="bg-white py-8">
      {/* Linha superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="h-px bg-gray-300"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Featured Articles */}
          <div className="lg:col-span-2 border-r border-gray-300 pr-8">
            <h2 className="news-title text-2xl text-gray-900 mb-8">Histórias Mais Populares</h2>
            <div className="space-y-8">
              {articles.map((article, index) => (
                <article key={index} className="group cursor-pointer border-b border-gray-200 pb-8 last:border-b-0">
                  <div className="text-sm text-blue-600 font-medium mb-2 uppercase tracking-wide">{article.category}</div>
                  <h3 className="news-title text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="news-body text-gray-600 leading-relaxed">{article.excerpt}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-blue-50 p-6">
              <h3 className="news-title text-lg mb-4 text-gray-900">Tópicos em Alta</h3>
              <div className="space-y-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 text-sm">Revolução da IA</span>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 text-sm ml-2">Análise de Mercado</span>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 text-sm">Futuro do Trabalho</span>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 text-sm ml-2">Tecnologia Verde</span>
              </div>
            </div>

            <div>
              <h3 className="news-title text-lg mb-4 text-gray-900">Escolhas do Editor</h3>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <article key={index} className="group cursor-pointer pb-4 border-b border-gray-200 last:border-b-0">
                    <h4 className="news-subtitle text-sm text-gray-700 group-hover:text-blue-600 transition-colors leading-relaxed">
                      {insight}
                    </h4>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;