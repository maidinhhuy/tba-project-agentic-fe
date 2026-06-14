import React from 'react'

export interface Block {
  type: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'ul' | 'ol' | 'blockquote' | 'codeblock' | 'hr'
  content?: string
  items?: string[]
}

export function parseMarkdown(text: string): Block[] {
  if (!text) return []
  const lines = text.split(/\r?\n/)
  const blocks: Block[] = []
  
  let currentBlock: Block | null = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Code block
    if (line.trim().startsWith('```')) {
      if (currentBlock && currentBlock.type === 'codeblock') {
        blocks.push(currentBlock)
        currentBlock = null
      } else {
        if (currentBlock) {
          blocks.push(currentBlock)
        }
        currentBlock = { type: 'codeblock', content: '' }
      }
      continue
    }
    
    if (currentBlock && currentBlock.type === 'codeblock') {
      currentBlock.content = currentBlock.content ? currentBlock.content + '\n' + line : line
      continue
    }
    
    // Horizontal rule
    if (/^---+\s*$/.test(line)) {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      blocks.push({ type: 'hr' })
      continue
    }
    
    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.*)$/)
    if (headingMatch) {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      const level = headingMatch[1].length
      const content = headingMatch[2]
      blocks.push({ type: `h${level}` as any, content })
      continue
    }
    
    // Blockquote
    const quoteMatch = line.match(/^>\s?(.*)$/)
    if (quoteMatch) {
      const content = quoteMatch[1]
      if (currentBlock && currentBlock.type === 'blockquote') {
        currentBlock.content = currentBlock.content + '\n' + content
      } else {
        if (currentBlock) {
          blocks.push(currentBlock)
        }
        currentBlock = { type: 'blockquote', content }
      }
      continue
    }
    
    // Unordered List
    const ulMatch = line.match(/^[-*+]\s+(.*)$/)
    if (ulMatch) {
      const content = ulMatch[1]
      if (currentBlock && currentBlock.type === 'ul') {
        currentBlock.items = currentBlock.items || []
        currentBlock.items.push(content)
      } else {
        if (currentBlock) {
          blocks.push(currentBlock)
        }
        currentBlock = { type: 'ul', items: [content] }
      }
      continue
    }
    
    // Ordered List
    const olMatch = line.match(/^\d+\.\s+(.*)$/)
    if (olMatch) {
      const content = olMatch[1]
      if (currentBlock && currentBlock.type === 'ol') {
        currentBlock.items = currentBlock.items || []
        currentBlock.items.push(content)
      } else {
        if (currentBlock) {
          blocks.push(currentBlock)
        }
        currentBlock = { type: 'ol', items: [content] }
      }
      continue
    }
    
    // Paragraph / Blank line
    if (line.trim() === '') {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      continue
    }
    
    // Normal line (part of paragraph)
    if (currentBlock && currentBlock.type === 'p') {
      currentBlock.content = currentBlock.content + '\n' + line
    } else {
      if (currentBlock) {
        blocks.push(currentBlock)
      }
      currentBlock = { type: 'p', content: line }
    }
  }
  
  if (currentBlock) {
    blocks.push(currentBlock)
  }
  
  return blocks
}

export function parseInlineContent(text: string): React.ReactNode[] {
  if (!text) return []
  // Matches links [text](url), inline code `code`, bold **bold** or __bold__, and italic *italic* or _italic_
  const regex = /(\[.*?\]\(.*?\)|`.*?`|\*\*.*?\*\*|__.*?__|\*.*?\*|_[^_]+_)/g
  const parts = text.split(regex)
  
  return parts.map((part, idx) => {
    if (!part) return null
    
    // Check if it matches a link
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 underline font-medium"
        >
          {linkMatch[1]}
        </a>
      )
    }
    
    // Check if it matches inline code
    const codeMatch = part.match(/^`(.*?)`$/)
    if (codeMatch) {
      return (
        <code
          key={idx}
          className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-mono text-sm"
        >
          {codeMatch[1]}
        </code>
      )
    }
    
    // Check if it matches bold
    const boldMatch = part.match(/^(\*\*|__)(.*?)\1$/)
    if (boldMatch) {
      return (
        <strong key={idx} className="font-bold text-gray-900 dark:text-white">
          {boldMatch[2]}
        </strong>
      )
    }
    
    // Check if it matches italic
    const italicMatch = part.match(/^(\*|_)(.*?)\1$/)
    if (italicMatch) {
      return (
        <em key={idx} className="italic">
          {italicMatch[2]}
        </em>
      )
    }
    
    // Otherwise it's plain text
    return <span key={idx}>{part}</span>
  })
}

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const blocks = parseMarkdown(content)
  
  return (
    <div className={`prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 space-y-4 ${className}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'h1':
            return (
              <h1 key={index} className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
                {parseInlineContent(block.content || '')}
              </h1>
            )
          case 'h2':
            return (
              <h2 key={index} className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-5 mb-3">
                {parseInlineContent(block.content || '')}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={index} className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                {parseInlineContent(block.content || '')}
              </h3>
            )
          case 'h4':
            return (
              <h4 key={index} className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mt-3 mb-2">
                {parseInlineContent(block.content || '')}
              </h4>
            )
          case 'p':
            return (
              <p key={index} className="leading-relaxed whitespace-pre-wrap">
                {parseInlineContent(block.content || '')}
              </p>
            )
          case 'blockquote':
            return (
              <blockquote key={index} className="border-l-4 border-teal-500 pl-4 py-1 italic bg-gray-50 dark:bg-gray-800/40 rounded-r text-gray-600 dark:text-gray-400">
                {parseInlineContent(block.content || '')}
              </blockquote>
            )
          case 'codeblock':
            return (
              <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto leading-relaxed">
                <code>{block.content}</code>
              </pre>
            )
          case 'hr':
            return <hr key={index} className="my-6 border-t border-gray-200 dark:border-gray-800" />
          case 'ul':
            return (
              <ul key={index} className="list-disc pl-6 space-y-1.5 my-2">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {parseInlineContent(item)}
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={index} className="list-decimal pl-6 space-y-1.5 my-2">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {parseInlineContent(item)}
                  </li>
                ))}
              </ol>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
