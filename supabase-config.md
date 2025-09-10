# Configuração do Supabase

## 1. Criar projeto no Supabase
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Crie uma nova organização (se necessário)
4. Crie um novo projeto:
   - Nome: "portal-noticias" ou "impacto-diario"
   - Database Password: (anote a senha)
   - Region: South America (São Paulo)

## 2. Obter credenciais
Após criar o projeto:
1. Vá em Settings > API
2. Copie:
   - Project URL
   - anon/public key

## 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:
```
VITE_SUPABASE_URL=sua-url-aqui
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

## 4. Estrutura do Banco de Dados

### Tabela: news
```sql
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  image_description TEXT,
  image_credits TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: banners
```sql
CREATE TABLE banners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Inserir banners padrão:
```sql
INSERT INTO banners (id, name, position, image_url) VALUES
('homepage_1', 'Banner Homepage 1', 'homepage_1', ''),
('homepage_2', 'Banner Homepage 2', 'homepage_2', ''),
('homepage_3', 'Banner Homepage 3', 'homepage_3', ''),
('article_1', 'Banner Artigo 1', 'article_1', ''),
('article_2', 'Banner Artigo 2', 'article_2', '');
```

## 5. Configurar Storage
1. Vá em Storage
2. Crie um bucket chamado "images"
3. Torne público:
   - Clique no bucket "images"
   - Settings > Public bucket = ON

## 6. Configurar Authentication
1. Vá em Authentication > Settings
2. Disable "Enable email confirmations" (para facilitar)
3. Criar usuário admin:
   - Authentication > Users
   - Invite user
   - Email: seu-email@exemplo.com
   - Password: sua-senha-admin

## 7. Políticas de Segurança (RLS)
Para proteger os dados, configure as políticas:

### Para tabela news:
```sql
-- Permitir leitura pública de notícias publicadas
CREATE POLICY "Public can read published news" ON news
FOR SELECT USING (status = 'published');

-- Apenas usuários autenticados podem gerenciar notícias
CREATE POLICY "Authenticated users can manage news" ON news
FOR ALL USING (auth.role() = 'authenticated');
```

### Para tabela banners:
```sql
-- Permitir leitura pública de banners
CREATE POLICY "Public can read banners" ON banners
FOR SELECT TO anon USING (true);

-- Apenas usuários autenticados podem atualizar
CREATE POLICY "Authenticated users can update banners" ON banners
FOR UPDATE USING (auth.role() = 'authenticated');
```

### Para storage:
```sql
-- Permitir leitura pública de imagens
CREATE POLICY "Public can read images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Apenas usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
```
