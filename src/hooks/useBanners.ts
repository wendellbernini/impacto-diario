import { useState, useEffect } from 'react';
import { supabase, Banner } from '../lib/supabase';

export const useBanners = () => {
  const [banners, setBanners] = useState<Record<string, Banner | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('priority', { ascending: false });

      if (!error && data) {
        console.log('Banners carregados:', data);
        // Organizar banners por posição, pegando o de maior prioridade
        const bannersByPosition: Record<string, Banner | null> = {};
        
        data.forEach((banner) => {
          if (!bannersByPosition[banner.position] || 
              banner.priority > (bannersByPosition[banner.position]?.priority || 0)) {
            bannersByPosition[banner.position] = banner;
          }
        });

        console.log('Banners organizados por posição:', bannersByPosition);
        setBanners(bannersByPosition);
      } else if (error) {
        console.error('Erro ao buscar banners:', error);
      }
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBanner = (position: string): Banner | null => {
    return banners[position] || null;
  };

  const refreshBanners = () => {
    fetchBanners();
  };

  return {
    banners,
    loading,
    getBanner,
    refreshBanners
  };
};
