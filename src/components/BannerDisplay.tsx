import React from 'react';
import { Banner } from '../lib/supabase';

interface BannerDisplayProps {
  banner: Banner;
  className?: string;
}

const BannerDisplay: React.FC<BannerDisplayProps> = ({ banner, className = '' }) => {
  // Dimensões específicas para cada posição
  const getBannerDimensions = (position: string) => {
    const dimensions: Record<string, { width: number; height: number }> = {
      'homepage-hero': { width: 400, height: 200 },
      'homepage-sidebar': { width: 350, height: 180 },
      'homepage-bottom': { width: 728, height: 90 },
      'news-article': { width: 500, height: 150 },
      'ultimas-sidebar': { width: 300, height: 600 }
    };
    
    return dimensions[position] || { width: 300, height: 250 };
  };

  const dimensions = getBannerDimensions(banner.position);
  
  const bannerContent = (
    <div 
      className={`overflow-hidden ${className}`}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        maxWidth: '100%'
      }}
    >
      <img 
        src={banner.image_url} 
        alt={banner.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block'
        }}
        onError={(e) => {
          // Fallback em caso de erro na imagem
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div style="
                width: 100%; 
                height: 100%; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                text-align: center; 
                padding: 1rem;
              ">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📢</div>
                <div style="font-weight: bold; font-size: 1.125rem; margin-bottom: 0.25rem;">Anuncie Aqui</div>
                <div style="font-size: 0.875rem; opacity: 0.9;">Espaço Publicitário</div>
              </div>
            `;
          }
        }}
      />
    </div>
  );

  if (banner.link_url) {
    return (
      <a 
        href={banner.link_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="cursor-pointer block"
      >
        {bannerContent}
      </a>
    );
  }

  return (
    <div className="cursor-pointer">
      {bannerContent}
    </div>
  );
};

export default BannerDisplay;
