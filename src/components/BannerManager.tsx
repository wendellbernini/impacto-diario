import React, { useState, useEffect, useRef } from 'react';
import { supabase, Banner } from '../lib/supabase';
import { useImageUpload } from '../hooks/useImageUpload';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Image as ImageIcon, ExternalLink, Upload, X } from 'lucide-react';

interface BannerManagerProps {
  onBack?: () => void;
}

interface BannerType {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  position: string;
  locations: string[];
}

const BannerManager: React.FC<BannerManagerProps> = ({ onBack }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    position: '',
    priority: 1,
    is_active: true,
    expires_at: '',
    banner_type: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, deleteImage, uploading } = useImageUpload();

  // Tipos de banner com dimensões específicas
  const bannerTypes: BannerType[] = [
    {
      id: 'homepage-hero',
      name: 'Homepage - Hero Section',
      description: 'Banner principal na seção hero da homepage',
      width: 400,
      height: 200,
      position: 'homepage-hero',
      locations: ['Homepage']
    },
    {
      id: 'homepage-sidebar',
      name: 'Homepage - Sidebar',
      description: 'Banner na sidebar da homepage',
      width: 350,
      height: 180,
      position: 'homepage-sidebar',
      locations: ['Homepage']
    },
    {
      id: 'homepage-bottom',
      name: 'Homepage - Rodapé',
      description: 'Banner no rodapé da homepage',
      width: 728,
      height: 90,
      position: 'homepage-bottom',
      locations: ['Homepage']
    },
    {
      id: 'news-article',
      name: 'Artigo de Notícia',
      description: 'Banner entre parágrafos em artigos individuais',
      width: 500,
      height: 150,
      position: 'news-article',
      locations: ['Páginas de Notícias']
    },
    {
      id: 'ultimas-sidebar',
      name: 'Últimas - Sidebar',
      description: 'Banner sticky na sidebar da página Últimas',
      width: 300,
      height: 600,
      position: 'ultimas-sidebar',
      locations: ['Página Últimas']
    },
  ];

  useEffect(() => {
    fetchBanners();
  }, []);


  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('priority', { ascending: false });

      if (error) {
        console.error('Erro ao buscar banners:', error);
        alert(`Erro ao carregar banners: ${error.message}`);
        return;
      }

      if (data) {
        setBanners(data);
      }
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
      alert('Erro ao carregar banners. Verifique se a tabela existe.');
    } finally {
      setLoading(false);
    }
  };

  // Funções para upload de imagem
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar campos obrigatórios
      if (!formData.title.trim()) {
        alert('Título é obrigatório');
        return;
      }
      if (!imageFile && !formData.image_url.trim()) {
        alert('URL da imagem ou upload de arquivo é obrigatório');
        return;
      }
      if (!formData.position) {
        alert('Tipo de banner é obrigatório');
        return;
      }

      let imageUrl = formData.image_url.trim();

      // Se há um arquivo selecionado, fazer upload
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'banners');
        if (!imageUrl) {
          alert('Erro ao fazer upload da imagem');
          return;
        }
      }

      // Preparar dados do banner
      const bannerData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image_url: imageUrl,
        link_url: formData.link_url.trim() || null,
        position: formData.position,
        priority: parseInt(formData.priority.toString()) || 1,
        is_active: formData.is_active
      };

      // Tratar data de expiração
      if (formData.expires_at && formData.expires_at.trim()) {
        // Converter data para formato ISO
        const date = new Date(formData.expires_at);
        if (isNaN(date.getTime())) {
          alert('Data de expiração inválida');
          return;
        }
        bannerData.expires_at = date.toISOString();
      } else {
        bannerData.expires_at = null;
      }

      console.log('Dados do banner:', bannerData);

      if (editingBanner) {
        console.log('Atualizando banner ID:', editingBanner.id);
        const { data, error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingBanner.id)
          .select();
        
        if (error) {
          console.error('Erro do Supabase:', error);
          throw error;
        }
        console.log('Banner atualizado:', data);
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);
        
        if (error) {
          console.error('Erro do Supabase:', error);
          throw error;
        }
      }

      setShowModal(false);
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      console.error('Erro ao salvar banner:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      alert(`Erro ao salvar banner: ${errorMessage}`);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      image_url: banner.image_url || '',
      link_url: banner.link_url || '',
      position: banner.position || '',
      priority: banner.priority || 1,
      is_active: banner.is_active || false,
      expires_at: banner.expires_at ? banner.expires_at.split('T')[0] : '',
      banner_type: banner.position || ''
    });
    // Limpar estados de upload para edição
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      alert('Erro ao excluir banner. Tente novamente.');
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !banner.is_active })
        .eq('id', banner.id);

      if (error) throw error;
      fetchBanners();
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      position: '',
      priority: 1,
      is_active: true,
      expires_at: '',
      banner_type: ''
    });
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openModal = () => {
    resetForm();
    setEditingBanner(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    resetForm();
  };

  const getBannerTypeInfo = (position: string) => {
    return bannerTypes.find(type => type.id === position);
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
            >
              ← Voltar
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Banners</h1>
          <p className="text-gray-600 mt-2">
            Gerencie os banners publicitários do site com dimensões específicas para cada posição
          </p>
        </div>

        {/* Tipos de Banner */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tipos de Banner Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bannerTypes.map((type) => (
              <div key={type.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{type.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                <div className="bg-blue-50 rounded p-2 mb-2">
                  <div className="text-sm font-medium text-blue-800">
                    Dimensões: {type.width} x {type.height}px
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <strong>Localização:</strong> {type.locations.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Adicionar */}
        <div className="mb-6">
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Banner
          </button>
        </div>

        {/* Lista de Banners */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Banners Cadastrados</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum banner cadastrado</p>
              <p className="text-sm">Clique em "Adicionar Banner" para começar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioridade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {banners.map((banner) => {
                    const typeInfo = getBannerTypeInfo(banner.position);
                    const expired = isExpired(banner.expires_at);
                    
                    return (
                      <tr key={banner.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {banner.image_url ? (
                              <img
                                src={banner.image_url}
                                alt={banner.title}
                                className="h-12 w-16 object-cover rounded"
                              />
                            ) : (
                              <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {banner.title || 'Sem título'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {banner.description || 'Sem descrição'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {typeInfo?.name || banner.position}
                          </div>
                          {typeInfo && (
                            <div className="text-xs text-gray-500">
                              {typeInfo.width} x {typeInfo.height}px
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleActive(banner)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                banner.is_active && !expired
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {banner.is_active && !expired ? (
                                <Eye className="h-3 w-3" />
                              ) : (
                                <EyeOff className="h-3 w-3" />
                              )}
                              {banner.is_active && !expired ? 'Ativo' : 'Inativo'}
                            </button>
                            {expired && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                Expirado
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {banner.expires_at ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(banner.expires_at).toLocaleDateString('pt-BR')}
                            </div>
                          ) : (
                            'Sem expiração'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {banner.priority}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(banner)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(banner.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            {banner.link_url && (
                              <a
                                href={banner.link_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingBanner ? 'Editar Banner' : 'Adicionar Banner'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Tipo de Banner */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Banner *
                  </label>
                  <select
                    value={formData.banner_type}
                    onChange={(e) => {
                      const selectedType = bannerTypes.find(type => type.id === e.target.value);
                      setFormData({
                        ...formData,
                        banner_type: e.target.value,
                        position: e.target.value
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione o tipo de banner</option>
                    {bannerTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.width}x{type.height}px)
                      </option>
                    ))}
                  </select>
                  {formData.banner_type && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Dimensões necessárias:</strong> {getBannerTypeInfo(formData.banner_type)?.width} x {getBannerTypeInfo(formData.banner_type)?.height}px
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {getBannerTypeInfo(formData.banner_type)?.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Imagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Banner *
                  </label>
                  
                  {/* Opção 1: Upload de arquivo */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Upload de arquivo
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {imageFile ? 'Alterar Arquivo' : 'Selecionar Arquivo'}
                      </button>
                      {imageFile && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {imageFile && (
                      <p className="text-sm text-gray-600 mt-1">
                        Arquivo selecionado: {imageFile.name}
                      </p>
                    )}
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-20 w-auto rounded border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Separador */}
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">ou</span>
                    </div>
                  </div>

                  {/* Opção 2: URL da imagem */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.image_url && (
                      <div className="mt-2">
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="h-20 w-auto rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* URL de Destino */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Destino
                  </label>
                  <input
                    type="url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemplo.com"
                  />
                </div>

                {/* Prioridade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Data de Expiração */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Expiração
                  </label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Deixe em branco para banner permanente
                  </p>
                </div>

                {/* Status Ativo */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Banner ativo
                  </label>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Fazendo Upload...
                      </>
                    ) : (
                      `${editingBanner ? 'Atualizar' : 'Criar'} Banner`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManager;
