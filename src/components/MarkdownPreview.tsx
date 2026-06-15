import React from 'react'

export interface Block {
  type: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'ul' | 'ol' | 'blockquote' | 'codeblock' | 'hr' | 'table'
  content?: string
  items?: string[]
  language?: string
  headers?: string[]
  alignments?: ('left' | 'center' | 'right')[]
  rows?: string[][]
}

export function parseMarkdown(text: string): Block[] {
  if (!text) return []
  const lines = text.split(/\r?\n/)
  const blocks: Block[] = []
  
  let currentBlock: Block | null = null
  
  const parseSeparator = (line: string): ('left' | 'center' | 'right')[] | null => {
    const columns = line.split('|')
    if (columns[0].trim() === '') columns.shift()
    if (columns[columns.length - 1]?.trim() === '') columns.pop()
    
    if (columns.length === 0) return null
    
    const alignments: ('left' | 'center' | 'right')[] = []
    for (const col of columns) {
      const trimmed = col.trim()
      if (!/^:?-+:?$/.test(trimmed)) {
        return null // not a valid separator line
      }
      const left = trimmed.startsWith(':')
      const right = trimmed.endsWith(':')
      if (left && right) {
        alignments.push('center')
      } else if (right) {
        alignments.push('right')
      } else {
        alignments.push('left')
      }
    }
    return alignments
  }
  
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
        const lang = line.trim().slice(3).trim()
        currentBlock = { type: 'codeblock', content: '', language: lang }
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
    
    // Table detection: check if this is the start of a table (header followed by separator)
    const nextLine = lines[i + 1]
    if (nextLine !== undefined && nextLine.includes('|') && /^[|\s:-]+$/.test(nextLine) && nextLine.includes('-')) {
      const alignments = parseSeparator(nextLine)
      if (alignments) {
        // This is a table header!
        const headerLine = line
        const headerCols = headerLine.split('|').map(s => s.trim())
        if (headerLine.trim().startsWith('|')) headerCols.shift()
        if (headerLine.trim().endsWith('|')) headerCols.pop()
        
        if (currentBlock) {
          blocks.push(currentBlock)
          currentBlock = null
        }
        
        const tableBlock: Block = {
          type: 'table',
          headers: headerCols,
          alignments: alignments,
          rows: []
        }
        
        i++ // skip separator line
        
        // consume subsequent rows
        while (i + 1 < lines.length) {
          const rowLine = lines[i + 1]
          if (rowLine.trim() === '' || 
              !rowLine.includes('|') ||
              rowLine.trim().startsWith('```') || 
              /^---+\s*$/.test(rowLine) || 
              /^(#{1,6})\s+(.*)$/.test(rowLine)) {
            break // Ends the table
          }
          
          const rowCols = rowLine.split('|').map(s => s.trim())
          if (rowLine.trim().startsWith('|')) rowCols.shift()
          if (rowLine.trim().endsWith('|')) rowCols.pop()
          
          tableBlock.rows = tableBlock.rows || []
          tableBlock.rows.push(rowCols)
          
          i++
        }
        
        blocks.push(tableBlock)
        continue
      }
    }
    
    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      if (currentBlock) {
        blocks.push(currentBlock)
        currentBlock = null
      }
      const level = headingMatch[1].length
      const content = headingMatch[2]
      blocks.push({ type: `h${level}` as Block['type'], content })
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
  // Matches images ![alt](url), links [text](url), inline code `code`, bold **bold** or __bold__, and italic *italic* or _italic_
  const regex = /(\!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|`.*?`|\*\*.*?\*\*|__.*?__|\*.*?\*|_[^_]+_)/g
  const parts = text.split(regex)
  
  return parts.map((part, idx) => {
    if (!part) return null
    
    // Check if it matches an image
    const imgMatch = part.match(/^\!\[(.*?)\]\((.*?)\)$/)
    if (imgMatch) {
      return (
        <img
          key={idx}
          src={imgMatch[2]}
          alt={imgMatch[1]}
          className="max-w-full h-auto rounded my-2 inline-block"
        />
      )
    }
    
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

interface Token {
  type: string
  text: string
}

function tokenize(code: string, language: string): Token[] {
  const lang = language.toLowerCase()
  
  let rules: { type: string; regex: RegExp }[] = []
  
  const jsRules = [
    { type: 'comment', regex: /(?:\/\/.*|\/\*[\s\S]*?\*\/)/y },
    { type: 'string', regex: /(?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|`[^`\\]*(?:\\.[^`\\]*)*`)/y },
    { type: 'keyword', regex: /\b(const|let|var|function|class|constructor|extends|super|import|export|default|from|as|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|typeof|instanceof|in|of|async|await|yield|null|undefined|true|false|debugger|interface|type|public|private|protected|readonly|abstract|implements|namespace|module|any|string|number|boolean|unknown|never|void|unique|symbol)\b/y },
    { type: 'number', regex: /\b\d+(?:\.\d+)?\b/y },
    { type: 'function', regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/y },
    { type: 'word', regex: /[a-zA-Z_$][a-zA-Z0-9_$]*/y },
    { type: 'operator', regex: /(\+|-|\*|\/|%|=|\+=|-=|\*=|\/=|==|!=|===|!==|<|>|<=|>=|&&|\|\||!|\?|:|\.\.\.)/y },
    { type: 'punctuation', regex: /([{}()\[\],.;])/y },
    { type: 'whitespace', regex: /\s+/y },
    { type: 'text', regex: /./y }
  ]
  
  const pyRules = [
    { type: 'comment', regex: /#[^\n]*/y },
    { type: 'string', regex: /(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/y },
    { type: 'keyword', regex: /\b(def|class|return|if|elif|else|for|while|in|is|and|or|not|import|from|as|try|except|finally|raise|assert|with|yield|lambda|pass|break|continue|global|nonlocal|True|False|None)\b/y },
    { type: 'builtin', regex: /\b(print|len|range|str|int|float|list|dict|set|tuple|type|abs|all|any|open|sum|min|max|enumerate|zip|map|filter)\b/y },
    { type: 'decorator', regex: /@[a-zA-Z_][a-zA-Z0-9_]*/y },
    { type: 'number', regex: /\b\d+(?:\.\d+)?\b/y },
    { type: 'function', regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/y },
    { type: 'word', regex: /[a-zA-Z_][a-zA-Z0-9_]*/y },
    { type: 'operator', regex: /(\+|-|\*|\/|%|=|\+=|-=|\*=|\/=|==|!=|<|>|<=|>=|&|\||\^|~)/y },
    { type: 'punctuation', regex: /([{}()\[\],.:;])/y },
    { type: 'whitespace', regex: /\s+/y },
    { type: 'text', regex: /./y }
  ]
  
  const javaRules = [
    { type: 'comment', regex: /(?:\/\/.*|\/\*[\s\S]*?\*\/)/y },
    { type: 'string', regex: /(?:"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')/y },
    { type: 'keyword', regex: /\b(class|interface|enum|extends|implements|public|private|protected|package|import|static|final|abstract|void|int|double|float|long|short|byte|char|boolean|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|throws|new|this|super|instanceof|synchronized|volatile|transient|native|strictfp|null|true|false)\b/y },
    { type: 'annotation', regex: /@[a-zA-Z_][a-zA-Z0-9_]*/y },
    { type: 'number', regex: /\b\d+(?:\.\d+)?(?:[fFdDlL])?\b/y },
    { type: 'function', regex: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/y },
    { type: 'word', regex: /[a-zA-Z_][a-zA-Z0-9_]*/y },
    { type: 'operator', regex: /(\+|-|\*|\/|%|=|\+=|-=|\*=|\/=|==|!=|<|>|<=|>=|&|\||\^|~|!|\?|:)/y },
    { type: 'punctuation', regex: /([{}()\[\],.;])/y },
    { type: 'whitespace', regex: /\s+/y },
    { type: 'text', regex: /./y }
  ]
  
  const htmlRules = [
    { type: 'comment', regex: /<!--[\s\S]*?-->/y },
    { type: 'doctype', regex: /<!DOCTYPE[^>]*>/iy },
    { type: 'tag', regex: /<\/?[a-zA-Z0-9:-]+/y },
    { type: 'attr-name', regex: /[a-zA-Z0-9:-]+(?=\s*=)/y },
    { type: 'attr-value', regex: /=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/y },
    { type: 'punctuation', regex: /([\/<>])/y },
    { type: 'whitespace', regex: /\s+/y },
    { type: 'text', regex: /[^<]+/y },
    { type: 'text-fallback', regex: /./y }
  ]
  
  const cssRules = [
    { type: 'comment', regex: /\/\*[\s\S]*?\*\//y },
    { type: 'selector', regex: /[^{\n]+(?=\s*\{)/y },
    { type: 'property', regex: /[a-zA-Z-]+\s*(?=:)/y },
    { type: 'value', regex: /:[^;}\n]+(?=[;}\n])/y },
    { type: 'punctuation', regex: /([{};:])/y },
    { type: 'whitespace', regex: /\s+/y },
    { type: 'text', regex: /./y }
  ]
  
  const sqlRules = [
    { type: 'comment', regex: /(?:--.*|\/\*[\s\S]*?\*\/)/y },
    { type: 'string', regex: /'[^'\\]*(?:\\.[^'\\]*)*'/y },
    { type: 'keyword', regex: /\b(SELECT|FROM|WHERE|INSERT|INTO|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|AND|OR|NOT|IN|EXISTS|LIKE|IS|NULL|TRUE|FALSE|AS|UNION|ALL|CASE|WHEN|THEN|ELSE|END|INT|VARCHAR|CHAR|TEXT|DATE|TIMESTAMP|BOOLEAN|PRIMARY|KEY|FOREIGN|REFERENCES|DEFAULT|UNIQUE)\b/iy },
    { type: 'number', regex: /\b\d+(?:\.\d+)?\b/y },
    { type: 'word', regex: /[a-zA-Z_][a-zA-Z0-9_]*/y },
    { type: 'operator', regex: /(\+|-|\*|\/|%|=|<|>|<=|>=|!=|<>)/y },
    { type: 'punctuation', regex: /([()\[\],.;])/y },
    { type: 'whitespace', regex: /\s+/y },
    { type: 'text', regex: /./y }
  ]

  const jsonRules = [
    { type: 'string', regex: /"[^"\\]*(?:\\.[^"\\]*)*"/y },
    { type: 'keyword', regex: /\b(true|false|null)\b/y },
    { type: 'number', regex: /-?\b\d+(?:\.\d+)?\b/y },
    { type: 'punctuation', regex: /([{}()\[\],.:;])/y },
    { type: 'whitespace', regex: /\s+/y },
    { type: 'text', regex: /./y }
  ]
  
  if (['js', 'javascript', 'ts', 'typescript', 'jsx', 'tsx'].includes(lang)) {
    rules = jsRules
  } else if (['py', 'python'].includes(lang)) {
    rules = pyRules
  } else if (['java'].includes(lang)) {
    rules = javaRules
  } else if (['html', 'xml', 'svg'].includes(lang)) {
    rules = htmlRules
  } else if (['css'].includes(lang)) {
    rules = cssRules
  } else if (['sql'].includes(lang)) {
    rules = sqlRules
  } else if (['json'].includes(lang)) {
    rules = jsonRules
  } else {
    rules = [
      { type: 'whitespace', regex: /\s+/y },
      { type: 'text', regex: /.+/y }
    ]
  }
  
  const tokens: Token[] = []
  let index = 0
  const len = code.length
  
  while (index < len) {
    let matched = false
    for (const rule of rules) {
      rule.regex.lastIndex = index
      const match = rule.regex.exec(code)
      if (match && match.index === index) {
        tokens.push({ type: rule.type, text: match[0] })
        index += match[0].length
        matched = true
        break
      }
    }
    if (!matched) {
      tokens.push({ type: 'text', text: code[index] })
      index++
    }
  }
  
  return tokens
}

function HighlightedCode({ code, language }: { code: string; language?: string }) {
  if (!language) {
    return <code>{code}</code>
  }
  
  const tokens = tokenize(code, language)
  
  return (
    <code>
      {tokens.map((token, idx) => {
        let className = ''
        
        switch (token.type) {
          case 'comment':
            className = 'text-slate-500 italic'
            break
          case 'string':
          case 'attr-value':
          case 'value':
            className = 'text-emerald-400'
            break
          case 'keyword':
          case 'doctype':
            className = 'text-purple-400 font-bold'
            break
          case 'builtin':
          case 'decorator':
          case 'annotation':
            className = 'text-cyan-400 font-semibold'
            break
          case 'number':
            className = 'text-amber-400'
            break
          case 'function':
          case 'selector':
            className = 'text-blue-400 font-semibold'
            break
          case 'property':
          case 'tag':
          case 'attr-name':
            className = 'text-rose-400'
            break
          case 'operator':
            className = 'text-yellow-400'
            break
          case 'punctuation':
            className = 'text-slate-400'
            break
          default:
            className = 'text-slate-100'
            break
        }
        
        return (
          <span key={idx} className={className}>
            {token.text}
          </span>
        )
      })}
    </code>
  )
}

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const blocks = parseMarkdown(content)
  
  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'center') return 'text-center'
    if (align === 'right') return 'text-right'
    return 'text-left'
  }
  
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
          case 'h5':
            return (
              <h5 key={index} className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mt-2 mb-1">
                {parseInlineContent(block.content || '')}
              </h5>
            )
          case 'h6':
            return (
              <h6 key={index} className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mt-2 mb-1 italic">
                {parseInlineContent(block.content || '')}
              </h6>
            )
          case 'p':
            return (
              <p key={index} className="leading-relaxed whitespace-pre-wrap">
                {parseInlineContent(block.content || '')}
              </p>
            )
          case 'blockquote':
            return (
              <blockquote key={index} className="border-l-4 border-teal-500 pl-4 py-1 italic bg-gray-50 dark:bg-gray-800/40 rounded-r text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {parseInlineContent(block.content || '')}
              </blockquote>
            )
          case 'codeblock':
            return (
              <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto leading-relaxed">
                <HighlightedCode code={block.content || ''} language={block.language} />
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
          case 'table':
            return (
              <div key={index} className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      {block.headers?.map((header, hIdx) => {
                        const align = block.alignments?.[hIdx]
                        return (
                          <th
                            key={hIdx}
                            className={`px-4 py-3 font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 ${getAlignmentClass(align)}`}
                          >
                            {parseInlineContent(header)}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-transparent">
                    {block.rows?.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                        {block.headers?.map((_, cIdx) => {
                          const cellValue = row[cIdx] || ''
                          const align = block.alignments?.[cIdx]
                          return (
                            <td
                              key={cIdx}
                              className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${getAlignmentClass(align)}`}
                            >
                              {parseInlineContent(cellValue)}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

