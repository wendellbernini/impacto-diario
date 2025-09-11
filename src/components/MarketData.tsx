import React from 'react';
import { useBanners } from '../hooks/useBanners';
import BannerDisplay from './BannerDisplay';

const MarketData: React.FC = () => {
  const { getBanner } = useBanners();
  const bottomBanner = getBanner('homepage-bottom');
  
  return (
    <section className="py-6 mt-2">
      <div className="w-full">
        {bottomBanner ? (
          <div className="flex justify-center">
            <BannerDisplay banner={bottomBanner} />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-900 to-green-700 relative overflow-hidden" style={{ width: '728px', height: '90px' }}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"></div>
              </div>
              
              <div className="relative px-6 py-2 text-white text-center flex items-center justify-center h-full">
                <div>
                  <div className="mb-0.5">
                    <span className="text-xs uppercase tracking-wide opacity-80">Publicidade</span>
                  </div>
                  <div className="text-lg mb-0.5">🚀</div>
                  <h3 className="font-bold text-sm mb-0.5">Anuncie Aqui</h3>
                  <p className="text-blue-100 text-xs">
                   
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketData;