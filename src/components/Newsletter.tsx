import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Quartz Daily Brief
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Get the day that's on everyone's minds delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          No spam, just the good stuff. You can unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;