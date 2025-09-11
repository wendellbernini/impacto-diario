import React from 'react';
import { Link } from 'react-router-dom';
import { X, Mail, Headphones, Facebook, Twitter, Instagram, Youtube, Rss, Linkedin } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { getSocialMediaLinks } = useSettings();
  const socialMediaLinks = getSocialMediaLinks();

  if (!isOpen) return null;

  const navigationItems = [
    { path: '/', label: 'PRINCIPAL' },
    { path: '/brasil', label: 'BRASIL' },
    { path: '/mundo', label: 'MUNDO' },
    { path: '/politica', label: 'POLÍTICA' },
    { path: '/economia', label: 'ECONOMIA' },
    { path: '/seguranca', label: 'SEGURANÇA' },
    { path: '/educacao', label: 'EDUCAÇÃO' },
    { path: '/ciencia', label: 'CIÊNCIA' },
    { path: '/saude', label: 'SAÚDE' },
    { path: '/ultimas', label: 'ÚLTIMAS' }
  ];

  const infoLinks = [
    { label: 'Sobre', href: '/sobre' },
    { label: 'Termos de Serviço', href: '/termos' },
    { label: 'Política de Privacidade', href: '/privacidade' },
    { label: 'Publicidade', href: '/publicidade' },
    { label: 'Contato', href: '/contato' },
    { label: 'Ajuda', href: '/ajuda' }
  ];

  const socialLinks = [
    { icon: Facebook, href: socialMediaLinks.facebook, label: 'Facebook' },
    { icon: Twitter, href: socialMediaLinks.twitter, label: 'Twitter' },
    { icon: Instagram, href: socialMediaLinks.instagram, label: 'Instagram' },
    { icon: Linkedin, href: socialMediaLinks.linkedin, label: 'LinkedIn' },
    { icon: Youtube, href: socialMediaLinks.youtube, label: 'YouTube' },
    { icon: Rss, href: '#', label: 'RSS' }
  ].filter(link => link.href); // Só mostra links que têm URL

  return (
    <>
      {/* Overlay escurecido */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Menu sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header do menu */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Conteúdo do menu */}
          <div className="flex-1 overflow-y-auto">
            {/* Navegação principal */}
            <div className="p-6">
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className="block py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 rounded-md transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Linha divisória */}
            <div className="border-t border-gray-200 mx-6"></div>

            {/* Seção de idioma */}
            <div className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Idiomas
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">BR</span>
                </div>
                <span className="text-gray-700">Português (Brasil)</span>
              </div>
            </div>

            {/* Linha divisória */}
            <div className="border-t border-gray-200 mx-6"></div>

            {/* Links informativos */}
            <div className="p-6">
              <nav className="space-y-1">
                {infoLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Linha divisória */}
            <div className="border-t border-gray-200 mx-6"></div>

            {/* Redes sociais */}
            <div className="p-6">
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title={social.label}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
