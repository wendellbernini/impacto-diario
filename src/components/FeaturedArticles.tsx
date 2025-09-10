import React from 'react';

const FeaturedArticles: React.FC = () => {
  const articles = [
    {
      category: "Work",
      title: "The 5 states with the highest consumers since in America — and the 5 with the lowest",
      excerpt: "Housing markets finally look bad with construction starting to pawn."
    },
    {
      category: "Smart Investing", 
      title: "Generation A.I.",
      excerpt: "How to navigate the world of artificial intelligence investing."
    },
    {
      category: "Leadership",
      title: "The iPhone is reportedly going classic, but Apple's bigger AI story still hangs undisclosed",
      excerpt: "Apple will integrate AI into its flagship product lineup this year."
    }
  ];

  const insights = [
    "The 5 states with the highest consumers since in America — and the 5 with the lowest",
    "Generation A.I. investing trends and opportunities",
    "Smart investing rules that never goes out of style",
    "How emerging tech and breakthrough ambitions amid capital-slow growth and final regulations, disrupted sectors"
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Featured Articles */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Most Popular Stories</h2>
            <div className="space-y-8">
              {articles.map((article, index) => (
                <article key={index} className="group cursor-pointer border-b border-gray-100 pb-8">
                  <div className="text-sm text-blue-600 font-medium mb-2">{article.category}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{article.excerpt}</p>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Trending Topics</h3>
              <div className="space-y-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">AI Revolution</span>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm ml-2">Market Analysis</span>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Future of Work</span>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm ml-2">Climate Tech</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Editor's Picks</h3>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <article key={index} className="group cursor-pointer">
                    <h4 className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors leading-relaxed">
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