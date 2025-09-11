import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fnysulnccgaapugdpqlb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZueXN1bG5jY2dhYXB1Z2RwcWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MjMzOTEsImV4cCI6MjA3MzA5OTM5MX0.7Xpksqq5Ax6EPorE1Z0IDy4JTTxO082bz4OSQn0Qg5A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para TypeScript
export interface NewsItem {
  id: string
  title: string
  summary?: string
  content?: string
  image_url?: string
  image_credits?: string
  category: string
  location: string
  author?: string
  published_at: string
  is_featured: boolean
  is_breaking: boolean
  is_editor_choice: boolean
  views: number
  slug?: string
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  title: string
  description?: string
  image_url: string
  link_url?: string
  position: string
  is_active: boolean
  priority: number
  expires_at?: string
  clicks?: number
  impressions?: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  is_active: boolean
  created_at: string
}