import React from 'react';

const SecondNewsSection: React.FC = () => {
  const mainArticle = {
    category: "Economia",
    title: "Banco Central anuncia nova política monetária para controlar inflação",
    summary: "Em decisão unânime, o Copom decidiu manter a taxa Selic em 10,75% ao ano, sinalizando cautela diante do cenário econômico atual e das pressões inflacionárias observadas nos últimos meses.",
    image: "🏦",
    color: "from-green-600 to-emerald-700"
  };

  const sideArticles = [
    {
      title: "Dólar atinge menor valor em 6 meses",
      category: "Mercado",
      image: "💵",
      color: "from-blue-600 to-cyan-500"
    },
    {
      title: "Startups brasileiras captam R$ 2 bi",
      category: "Inovação",
      image: "🚀",
      color: "from-purple-600 to-pink-500"
    },
    {
      title: "Exportações batem recorde histórico",
      category: "Comércio",
      image: "📦",
      color: "from-orange-600 to-red-500"
    },
    {
      title: "Bolsa registra maior alta do ano",
      category: "Investimentos",
      image: "📈",
      color: "from-indigo-600 to-purple-600"
    }
  ];

  return (
    <section className="bg-white py-8">
      {/* Linha superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="h-px bg-gray-300"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Esquerda - Notícia principal com imagem grande */}
          <div className="border-r border-gray-300 pr-8">
            <article className="group cursor-pointer">
              {/* Categoria */}
              <div className="mb-4">
                <span className="text-green-600 text-sm font-medium uppercase tracking-wide">{mainArticle.category}</span>
              </div>
              
              {/* Imagem grande */}
              <div className={`w-full h-64 bg-gradient-to-r ${mainArticle.color} mb-6 flex items-center justify-center`}>
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">{mainArticle.image}</div>
                  <p className="text-lg font-medium">Imagem da Notícia</p>
                </div>
              </div>
              
              {/* Título e resumo */}
              <h2 className="news-title text-2xl text-gray-900 group-hover:text-blue-600 transition-colors mb-4 leading-tight">
                {mainArticle.title}
              </h2>
              
              <p className="news-body text-gray-600 leading-relaxed">
                {mainArticle.summary}
              </p>
            </article>
          </div>

          {/* Direita - 4 notícias em grade 2x2 */}
          <div className="grid grid-cols-2 gap-6">
            {sideArticles.map((article, index) => (
              <article key={index} className="group cursor-pointer">
                {/* Imagem */}
                <div className={`w-full h-32 bg-gradient-to-r ${article.color} mb-3 flex items-center justify-center`}>
                  <span className="text-white text-2xl">{article.image}</span>
                </div>
                
                {/* Categoria */}
                <div className="mb-2">
                  <span className="text-blue-600 text-xs font-medium uppercase tracking-wide">{article.category}</span>
                </div>
                
                {/* Título */}
                <h3 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                  {article.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondNewsSection;
