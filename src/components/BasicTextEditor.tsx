import React, { useState, useRef } from 'react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link2, 
  Image, 
  Youtube,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'

interface BasicTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function BasicTextEditor({ content, onChange, placeholder = "Digite o conteúdo..." }: BasicTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [selectedText, setSelectedText] = useState('')

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    onChange(newText)
    
    // Reposicionar cursor
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newText = content.substring(0, start) + text + content.substring(start)
    onChange(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const addLink = () => {
    const url = prompt('Digite a URL do link:')
    if (url) {
      const linkText = selectedText || prompt('Digite o texto do link:') || url
      insertText(`<a href="${url}" target="_blank">`, `</a>`)
    }
  }

  const addImage = () => {
    const url = prompt('Digite a URL da imagem:')
    if (url) {
      const alt = prompt('Digite a descrição da imagem:') || 'Imagem'
      insertAtCursor(`<img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; margin: 1rem 0; border-radius: 8px;" />`)
    }
  }

  const addYoutube = () => {
    const url = prompt('Digite a URL do vídeo do YouTube:')
    if (url) {
      let videoId = ''
      
      // Extrair ID do vídeo
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
      if (match) {
        videoId = match[1]
        const embedCode = `<div style="margin: 1rem 0;"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="border-radius: 8px;"></iframe></div>`
        insertAtCursor(embedCode)
      } else {
        alert('URL do YouTube inválida')
      }
    }
  }

  const ToolbarButton = ({ onClick, title, children }: {
    onClick: () => void
    title: string
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-300 transition-colors"
    >
      {children}
    </button>
  )

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleSelection = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    setSelectedText(content.substring(start, end))
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar Simples */}
      <div className="bg-gray-50 border-b border-gray-300 p-3">
        <div className="flex flex-wrap gap-1">
          <ToolbarButton
            onClick={() => insertText('**', '**')}
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => insertText('*', '*')}
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <ToolbarButton
            onClick={() => insertText('# ', '')}
            title="Título Grande"
          >
            <Type className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => insertText('- ', '')}
            title="Lista"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => insertText('1. ', '')}
            title="Lista Numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <ToolbarButton
            onClick={addLink}
            title="Inserir Link"
          >
            <Link2 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={addImage}
            title="Inserir Imagem"
          >
            <Image className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={addYoutube}
            title="Inserir Vídeo YouTube"
          >
            <Youtube className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Área de Texto */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextareaChange}
          onSelect={handleSelection}
          placeholder={placeholder}
          className="w-full min-h-[400px] p-4 border-0 focus:outline-none resize-none font-mono text-sm leading-relaxed"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        />
      </div>

      {/* Preview */}
      {content && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-3">
            <button
              type="button"
              className="text-xs text-gray-600 hover:text-gray-800"
              onClick={() => {
                const preview = document.getElementById('content-preview')
                if (preview) {
                  preview.style.display = preview.style.display === 'none' ? 'block' : 'none'
                }
              }}
            >
              👁️ Alternar Preview
            </button>
          </div>
          <div 
            id="content-preview" 
            className="p-4 prose prose-sm max-w-none border-t border-gray-200 bg-white"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/^- (.*$)/gm, '<li>$1</li>')
                .replace(/^1\. (.*$)/gm, '<li>$1</li>')
                .replace(/\n/g, '<br>')
            }}
          />
        </div>
      )}
    </div>
  )
}
