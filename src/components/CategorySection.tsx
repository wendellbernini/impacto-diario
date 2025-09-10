import React from 'react';

const CategorySection: React.FC = () => {
  const categories = [
    {
      title: "Economia",
      articles: [
        {
          title: "Inflação recua para 4,2% em dezembro e fica dentro da meta",
          image: "💰",
          color: "from-green-600 to-emerald-500"
        },
        {
          title: "Dólar fecha em queda após decisão do Banco Central",
          image: "💵",
          color: "from-blue-600 to-cyan-500"
        },
        {
          title: "PIB cresce 2,9% no último trimestre do ano",
          image: "📈",
          color: "from-purple-600 to-pink-500"
        }
      ]
    },
    {
      title: "Tecnologia",
      articles: [
        {
          title: "Apple lança novo iPhone 15 com recursos de IA avançada",
          image: "📱",
          color: "from-blue-500 to-indigo-600"
        },
        {
          title: "Google anuncia investimento de $10 bilhões em IA no Brasil",
          image: "🤖",
          color: "from-red-500 to-orange-500"
        },
        {
          title: "WhatsApp libera novos recursos de privacidade",
          image: "💬",
          color: "from-green-500 to-teal-500"
        }
      ]
    },
    {
      title: "Negócios",
      articles: [
        {
          title: "Petrobras anuncia maior lucro da história da empresa",
          image: "🏢",
          color: "from-yellow-600 to-orange-600"
        },
        {
          title: "Vale assina acordo de R$ 37 bilhões por Mariana",
          image: "⛏️",
          color: "from-gray-600 to-slate-700"
        },
        {
          title: "Magazine Luiza expande operações no Nordeste",
          image: "🛒",
          color: "from-pink-500 to-rose-600"
        }
      ]
    },
    {
      title: "Estilo de Vida",
      articles: [
        {
          title: "Tendências de moda para o verão 2024 já chegaram",
          image: "👗",
          color: "from-pink-500 to-purple-600"
        },
        {
          title: "Novos destinos turísticos ganham destaque no Brasil",
          image: "✈️",
          color: "from-sky-500 to-blue-600"
        },
        {
          title: "Alimentação saudável: 5 dicas para o ano novo",
          image: "🥗",
          color: "from-green-500 to-lime-500"
        }
      ]
    }
  ];

  return (
    <section className="bg-white py-6 mb-2">
      {/* Linha superior com margens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="h-px bg-gray-300"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className={`space-y-6 ${categoryIndex < 3 ? 'lg:border-r lg:border-gray-300 lg:pr-6' : ''}`}>
              {/* Título da categoria */}
              <h2 className="news-title text-xl text-gray-900 pb-3">
                {category.title}
              </h2>
              
              {/* 3 artigos verticais */}
              <div className="space-y-4">
                {category.articles.map((article, articleIndex) => (
                  <article key={articleIndex} className="group cursor-pointer flex space-x-3 pb-4 border-b border-gray-200 last:border-b-0">
                    {/* Imagem à esquerda */}
                    <div className={`w-16 h-12 bg-gradient-to-r ${article.color} flex-shrink-0 flex items-center justify-center`}>
                      <span className="text-white text-lg">{article.image}</span>
                    </div>
                    
                    {/* Título à direita */}
                    <div className="flex-1">
                      <h3 className="news-subtitle text-sm text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {article.title}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
