import React from 'react';

const ContentSections: React.FC = () => {
  const sections = [
    {
      title: "Mercado",
      articles: [
        "Os melhores programas de pesquisa online, segundo professores",
        "Quem consegue taxas de hipoteca e como funcionam?",
        "Os EUA consideram mudar planos comerciais rapidamente...",
        "5 dicas para aproveitar o outono e ver oportunidades"
      ]
    },
    {
      title: "Tecnologia", 
      articles: [
        "Apple lança novo iPhone 15",
        "Avanço em IA promete novas possibilidades",
        "Mercado cripto passa por grandes mudanças",
        "Gigantes de tecnologia divulgam lucros fortes"
      ]
    },
    {
      title: "Negócios",
      articles: [
        "Principais IPOs anunciados nesta semana",
        "Disrupções na cadeia de suprimentos continuam",
        "Setor de energia mostra crescimento",
        "Inovações em saúde ganham destaque"
      ]
    },
    {
      title: "Liderança",
      articles: [
        "Estratégias de CEOs para trabalho remoto",
        "Construindo ambientes inclusivos", 
        "O futuro da gestão",
        "Lições de liderança em tempos de crise"
      ]
    }
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg mb-6 text-gray-900">{section.title}</h3>
              <div className="space-y-4">
                {section.articles.map((article, articleIndex) => (
                  <article key={articleIndex} className="group cursor-pointer">
                    <h4 className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors leading-relaxed">
                      {article}
                    </h4>
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

export default ContentSections;