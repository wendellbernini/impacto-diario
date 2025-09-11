import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    Empresa: ['Sobre', 'Carreiras', 'Termos de Serviço', 'Política de Privacidade', 'Publicidade'],
    Conteúdo: ['Últimas', 'Mais Lidas', 'Newsletters', 'Podcasts', 'Resumo Diário Impacto'],
    Temas: ['Negócios', 'Economia', 'Tecnologia', 'Liderança', 'Inovação'],
    'Conecte-se': ['Contato', 'Ajuda', 'Feedback', 'Imprensa', 'Parcerias']
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div className="flex flex-col items-start leading-none">
              <span className="text-2xl font-bold tracking-wider">Impacto</span>
              <span className="text-xs font-semibold tracking-widest text-gray-400" style={{ letterSpacing: '0.2em' }}>DIÁRIO</span>
            </div>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <p className="text-gray-400 text-sm">
            © 2025 Impacto Diário. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;