import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase, NewsItem } from '../lib/supabase';
import Header from './Header';
import Footer from './Footer';
import { useBanners } from '../hooks/useBanners';
import { useViews } from '../hooks/useViews';
import BannerDisplay from './BannerDisplay';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail,
  Link as LinkIcon,
  Calendar,
  User,
  Edit3
} from 'lucide-react';

const NewsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { getBanner } = useBanners();
  const { trackView } = useViews();
  const articleBanner = getBanner('news-article');
  const [error, setError] = useState<string | null>(null);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    if (slug) {
      setHasTrackedView(false); // Reset tracking state when slug changes
      loadNews();
    }
  }, [slug]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando notícia com slug:', slug);
      
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Erro ao buscar notícia:', error);
        throw error;
      }
      
      if (data) {
        console.log('Notícia encontrada:', data);
        setNews(data);
        
        // Registrar visualização apenas uma vez por sessão
        if (!hasTrackedView) {
          try {
            await trackView(data.id);
            setHasTrackedView(true);
            console.log('Visualização registrada para notícia:', data.id);
          } catch (viewError) {
            console.error('Erro ao registrar visualização:', viewError);
          }
        } else {
          console.log('Visualização já registrada para esta notícia nesta sessão');
        }
        
        // Carregar notícias relacionadas
        try {
          await loadRelatedNews(data.category, data.id);
        } catch (relatedError) {
          console.error('Erro ao carregar notícias relacionadas:', relatedError);
        }
      } else {
        console.log('Nenhuma notícia encontrada');
        setError('Notícia não encontrada');
      }
    } catch (err: any) {
      console.error('Erro geral:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedNews = async (category: string, currentNewsId: string) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('category', category)
        .neq('id', currentNewsId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRelatedNews(data || []);
    } catch (err) {
      console.error('Erro ao carregar notícias relacionadas:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const convertMarkdownToHtml = (markdown: string) => {
    if (!markdown) return '';
    
    try {
      let html = markdown
        // Negrito
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Itálico
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Títulos
        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 mt-6">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3 mt-5">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
        // Listas
        .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
        .replace(/^1\. (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
        // Quebras de linha
        .replace(/\n/g, '<br>')
        // Parágrafos (duas quebras de linha)
        .replace(/(<br>){2,}/g, '</p><p class="mb-6 text-xl leading-relaxed">')
        // Envolver em parágrafo
        .replace(/^(.*)$/gm, '<p class="mb-6 text-xl leading-relaxed">$1</p>')
        // Limpar parágrafos vazios
        .replace(/<p class="mb-6 text-xl leading-relaxed"><br><\/p>/g, '')
        .replace(/<p class="mb-6 text-xl leading-relaxed"><\/p>/g, '')

      // Adicionar banners de propaganda entre parágrafos (máximo 2 banners)
      const paragraphs = html.split('</p>').filter(p => p.trim())
      let result = ''
      let bannerCount = 0
      const maxBanners = 2
      
      // Se há poucos parágrafos, adicionar pelo menos 1 banner
      if (paragraphs.length <= 2) {
        result = paragraphs.join('</p>') + '</p>'
        result += articleBanner ? 
          (articleBanner.link_url ? 
            `<div class="my-8 text-center"><a href="${articleBanner.link_url}" target="_blank" rel="noopener noreferrer"><div style="width: 500px; height: 150px; margin: 0 auto; overflow: hidden;"><img src="${articleBanner.image_url}" alt="${articleBanner.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" /></div></a></div>` :
            `<div class="my-8 text-center"><div style="width: 500px; height: 150px; margin: 0 auto; overflow: hidden;"><img src="${articleBanner.image_url}" alt="${articleBanner.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" /></div></div>`
          ) :
          `<div class="my-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <div class="text-sm text-gray-500 mb-2">Publicidade</div>
            <div class="bg-blue-100 h-32 flex items-center justify-center rounded">
              <span class="text-gray-600 font-medium">Banner de Propaganda</span>
            </div>
          </div>`
      } else {
        // Para textos maiores, distribuir banners estrategicamente
        paragraphs.forEach((paragraph, index) => {
          result += paragraph + '</p>'
          
          // Adicionar banner no meio do texto (se ainda não atingiu o limite)
          if (bannerCount < maxBanners) {
            const shouldAddBanner = 
              (paragraphs.length >= 4 && index === Math.floor(paragraphs.length / 2) - 1) || // Meio do texto
              (paragraphs.length >= 6 && index === Math.floor(paragraphs.length * 0.75) - 1) // 3/4 do texto
            
            if (shouldAddBanner) {
              result += articleBanner ? 
                (articleBanner.link_url ? 
                  `<div class="my-8 text-center"><a href="${articleBanner.link_url}" target="_blank" rel="noopener noreferrer"><div style="width: 500px; height: 150px; margin: 0 auto; overflow: hidden;"><img src="${articleBanner.image_url}" alt="${articleBanner.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" /></div></a></div>` :
                  `<div class="my-8 text-center"><div style="width: 500px; height: 150px; margin: 0 auto; overflow: hidden;"><img src="${articleBanner.image_url}" alt="${articleBanner.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" /></div></div>`
                ) :
                `<div class="my-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <div class="text-sm text-gray-500 mb-2">Publicidade</div>
                  <div class="bg-blue-100 h-32 flex items-center justify-center rounded">
                    <span class="text-gray-600 font-medium">Banner de Propaganda</span>
                  </div>
                </div>`
              bannerCount++
            }
          }
        })
        
        // Se não adicionou nenhum banner, adicionar pelo menos 1 no meio
        if (bannerCount === 0) {
          const middleIndex = Math.floor(paragraphs.length / 2)
          const newResult = result.split('</p>')
          newResult.splice(middleIndex, 0, articleBanner ? 
            (articleBanner.link_url ? 
              `<div class="my-8 text-center"><a href="${articleBanner.link_url}" target="_blank" rel="noopener noreferrer"><div style="width: 500px; height: 150px; margin: 0 auto; overflow: hidden;"><img src="${articleBanner.image_url}" alt="${articleBanner.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" /></div></a></div>` :
              `<div class="my-8 text-center"><div style="width: 500px; height: 150px; margin: 0 auto; overflow: hidden;"><img src="${articleBanner.image_url}" alt="${articleBanner.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" /></div></div>`
            ) :
            `<div class="my-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <div class="text-sm text-gray-500 mb-2">Publicidade</div>
              <div class="bg-blue-100 h-32 flex items-center justify-center rounded">
                <span class="text-gray-600 font-medium">Banner de Propaganda</span>
              </div>
            </div>`
          )
          result = newResult.join('</p>')
        }
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao converter markdown:', error);
      return markdown; // Retorna o texto original em caso de erro
    }
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'brasil': 'Brasil',
      'mundo': 'Mundo',
      'politica': 'Política',
      'economia': 'Economia',
      'seguranca': 'Segurança',
      'educacao': 'Educação',
      'ciencia': 'Ciência',
      'saude': 'Saúde',
      'tecnologia': 'Tecnologia'
    };
    return categoryMap[category] || category;
  };

  const shareOnSocial = (platform: string) => {
    const url = window.location.href;
    const title = news?.title || '';
    const text = news?.summary || '';

    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\nLeia mais: ${url}`)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Aqui você pode adicionar uma notificação de sucesso
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar link:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Notícia não encontrada</h1>
          <p className="text-gray-600 mb-8">A notícia que você está procurando não existe ou foi removida.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header hideTicker={true} />
      
      <main className="w-full">
        {/* Container principal com largura do header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Linha azul com categoria centralizada */}
          <div className="relative w-full bg-blue-600 h-1 mb-12">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-3">
              <span className="inline-block bg-blue-600 text-white px-6 py-3 text-lg font-bold uppercase tracking-wide">
                {getCategoryDisplayName(news.category)}
              </span>
            </div>
          </div>

        {/* Título */}
        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {news.title}
        </h1>

        {/* Subtítulo/Resumo */}
        {news.summary && (
          <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
            {news.summary}
          </p>
        )}

        {/* Metadados */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600">
          {news.author && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>Por {news.author}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Publicado em {formatDate(news.published_at || news.created_at)}</span>
          </div>

          {news.updated_at && news.updated_at !== news.created_at && (
            <div className="flex items-center">
              <Edit3 className="h-4 w-4 mr-2" />
              <span>Atualizado em {formatDate(news.updated_at)}</span>
            </div>
          )}
        </div>

        {/* Botões de Compartilhamento */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">Compartilhar:</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => shareOnSocial('facebook')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Compartilhar no Facebook"
            >
              <Facebook className="h-5 w-5" />
            </button>
            <button
              onClick={() => shareOnSocial('twitter')}
              className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
              title="Compartilhar no Twitter"
            >
              <Twitter className="h-5 w-5" />
            </button>
            <button
              onClick={() => shareOnSocial('linkedin')}
              className="p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
              title="Compartilhar no LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </button>
            <button
              onClick={() => shareOnSocial('email')}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              title="Compartilhar por email"
            >
              <Mail className="h-5 w-5" />
            </button>
            <button
              onClick={copyLink}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              title="Copiar link"
            >
              <LinkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Imagem Principal */}
        {news.image_url && (
          <div className="mb-8 flex justify-center">
            <div className="w-full max-w-4xl h-96 lg:h-[500px] overflow-hidden rounded-lg">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Conteúdo da Notícia */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {news.image_credits && (
              <p className="text-sm text-gray-500 mb-4 italic">
                {news.image_credits}
              </p>
            )}
             <div className="prose prose-2xl max-w-none">
               {news.content ? (
                 <div 
                   className="text-gray-900 leading-relaxed text-xl"
                   dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(news.content) }}
                 />
               ) : (
                 <div className="text-gray-900 leading-relaxed text-xl">
                   <p>Conteúdo da notícia não disponível.</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* Tags/Etiquetas */}
        <div className="mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tags:</span>
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full">
                {getCategoryDisplayName(news.category)}
              </span>
              {news.is_breaking && (
                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 text-sm rounded-full">
                  Urgente
                </span>
              )}
              {news.is_featured && (
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full">
                  Destaque
                </span>
              )}
              {news.is_editor_choice && (
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 text-sm rounded-full">
                  Escolha do Editor
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notícias Relacionadas */}
        {relatedNews.length > 0 && (
          <div className="mt-16 mb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Times New Roman, serif' }}>
                Notícias Relacionadas
              </h2>
              <div className="space-y-6">
                {relatedNews.slice(0, 5).map((relatedNewsItem) => (
                  <Link
                    key={relatedNewsItem.id}
                    to={`/noticia/${relatedNewsItem.slug}`}
                    className="group block bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex">
                      {relatedNewsItem.image_url && (
                        <div className="w-64 h-40 overflow-hidden">
                          <img
                            src={relatedNewsItem.image_url}
                            alt={relatedNewsItem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 text-sm font-medium">
                            {getCategoryDisplayName(relatedNewsItem.category)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(relatedNewsItem.created_at)}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-3" style={{ fontFamily: 'Times New Roman, serif' }}>
                          {relatedNewsItem.title}
                        </h3>
                        {relatedNewsItem.summary && (
                          <p className="text-base text-gray-600 line-clamp-2" style={{ fontFamily: 'Times New Roman, serif' }}>
                            {relatedNewsItem.summary}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsPage;
