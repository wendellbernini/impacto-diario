# 📰 Portal de Notícias

Um portal de notícias moderno e profissional com painel administrativo completo.

## 🚀 Funcionalidades

### 📱 Site Principal
- **Design responsivo** e moderno
- **Seções organizadas** por categorias
- **Layout profissional** para jornalismo
- **Integração com Supabase** para dados dinâmicos

### 🔧 Painel Administrativo
- **Dashboard dinâmico** com estatísticas em tempo real
- **Editor de notícias** com formatação rica
- **Gerenciamento de categorias** e flags especiais
- **Sistema de autenticação** seguro
- **Upload de imagens** e créditos fotográficos
- **Preview em tempo real** do conteúdo

### 📝 Editor Avançado
- **Formatação de texto**: Negrito, itálico, títulos
- **Inserção de mídia**: Imagens, vídeos YouTube, links
- **Preview integrado** para visualização
- **Suporte a HTML** para formatação avançada

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Editor**: TipTap (editor rico)
- **Deploy**: Vercel

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/portal-noticias.git
cd portal-noticias
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase
```

4. **Execute o projeto**
```bash
npm run dev
```

## 🔧 Configuração do Supabase

1. **Crie um projeto** no [Supabase](https://supabase.com)
2. **Execute as migrações** para criar as tabelas:
   - `news` - Notícias
   - `banners` - Banners publicitários
   - `categories` - Categorias de notícias

3. **Configure a autenticação** para o painel admin

## 📊 Estrutura do Banco

### Tabela `news`
- `id` - UUID único
- `title` - Título da notícia
- `summary` - Resumo
- `content` - Conteúdo completo (HTML)
- `image_url` - URL da imagem principal
- `category` - Categoria da notícia
- `is_featured` - Notícia em destaque
- `is_breaking` - Notícia urgente
- `views` - Contador de visualizações
- `slug` - URL amigável
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### Tabela `banners`
- `id` - UUID único
- `title` - Título do banner
- `description` - Descrição
- `image_url` - URL da imagem
- `link_url` - URL de destino
- `position` - Posição (header, sidebar, content)
- `is_active` - Banner ativo
- `priority` - Prioridade de exibição

## 🚀 Deploy

### Vercel (Recomendado)
1. **Conecte o repositório** ao Vercel
2. **Configure as variáveis** de ambiente
3. **Deploy automático** a cada push

### Outras plataformas
- **Netlify**: Suporte completo
- **GitHub Pages**: Com build estático
- **Railway**: Para full-stack

## 📱 URLs

- **Site Principal**: `/`
- **Painel Admin**: `/admin`
- **Login Admin**: `/admin` (redirecionamento automático)

## 🔐 Credenciais de Teste

**Admin**: `admin@exemplo.com` / `admin123`

*Crie este usuário no Supabase Auth para testar*

## 📈 Roadmap

- [ ] **Sistema de comentários**
- [ ] **Newsletter integrado**
- [ ] **Analytics avançado**
- [ ] **SEO otimizado**
- [ ] **PWA (Progressive Web App)**
- [ ] **Modo escuro**
- [ ] **Internacionalização**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Bernardo** - [GitHub](https://github.com/seu-usuario)

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**
