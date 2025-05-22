
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  let html = content;

  // Code blocks (must be before other block elements like lists)
  // Match ```optional_lang\ncode\n```
  html = html.replace(/```(\w*)\s*\n([\s\S]*?)\n\s*```/g, (_match, lang, code) => {
    const languageClass = lang ? `language-${lang}` : '';
    // Escape HTML within code blocks
    const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre class="bg-zinc-800 p-3 rounded-md my-2 overflow-x-auto text-sm text-stone-200 border border-zinc-700 ${languageClass}"><code>${escapedCode.trim()}</code></pre>`;
  });
  
  // Links: [text](url)
  html = html.replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-sky-400 hover:text-sky-300 underline">$1</a>');

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Inline code: `code` (ensure not to mess with code blocks already processed)
  // Only apply if not inside a <pre> tag (basic check)
  if (!html.includes('<pre>')) { // This check is very basic, ideally parse line by line or use a more robust method
    html = html.replace(/`([^`]+)`/g, '<code class="bg-zinc-600/50 px-1 py-0.5 rounded text-rose-300 text-sm">$1</code>');
  }


  // Handling lists (unordered and ordered) by splitting into lines
  const lines = html.split('\n');
  let inUl = false;
  let inOl = false;
  const processedLines = lines.map((line, index) => {
    let processedLine = line;

    // Unordered list item: * item, - item, + item
    const ulMatch = line.match(/^(\s*)([\*\-\+])\s+(.*)/);
    if (ulMatch) {
      if (!inUl) {
        processedLine = (inOl ? '</ol>\n' : '') + `<ul class="list-disc list-inside my-1 pl-4 text-sm sm:text-base">\n` + `<li class="mb-0.5">${ulMatch[3]}</li>`;
        inUl = true;
        inOl = false;
      } else {
        processedLine = `<li class="mb-0.5">${ulMatch[3]}</li>`;
      }
    } else if (inUl && !ulMatch && !line.match(/^(\s*)([0-9]+\.)\s+(.*)/)) {
      // Line is not a list item, and we were in a UL
      processedLine = '</ul>\n' + line;
      inUl = false;
    }

    // Ordered list item: 1. item
    const olMatch = line.match(/^(\s*)([0-9]+\.)\s+(.*)/);
    if (olMatch) {
      if (!inOl) {
        processedLine = (inUl ? '</ul>\n' : '') + `<ol class="list-decimal list-inside my-1 pl-4 text-sm sm:text-base">\n` + `<li class="mb-0.5">${olMatch[3]}</li>`;
        inOl = true;
        inUl = false;
      } else {
        processedLine = `<li class="mb-0.5">${olMatch[3]}</li>`;
      }
    } else if (inOl && !olMatch && !line.match(/^(\s*)([\*\-\+])\s+(.*)/)) {
      // Line is not a list item, and we were in an OL
      processedLine = '</ol>\n' + line;
      inOl = false;
    }
    
    // If it's the last line and we are in a list, close the list
    if (index === lines.length - 1) {
      if (inUl) processedLine += '\n</ul>';
      if (inOl) processedLine += '\n</ol>';
    }
    
    return processedLine;

  }).join('\n').replace(/\n<\/ul>/g, '</ul>').replace(/\n<\/ol>/g, '</ol>'); // Clean up extra newlines before closing list tags


  // Replace remaining newlines with <br /> for lines not part of <pre> or lists
  // This is tricky with mixed content. For simplicity, only add <br> if not in <pre>
  // And ensure paragraphs are handled by default browser rendering of block elements or via CSS
  let finalHtml = processedLines;
  if (!finalHtml.includes('<pre>') && !finalHtml.includes('<ul>') && !finalHtml.includes('<ol>')) {
    finalHtml = finalHtml.replace(/\n/g, '<br />');
  } else {
    // For mixed content, split by <pre> blocks, process non-pre parts for <br>, then rejoin
    finalHtml = finalHtml.split(/(<pre[\s\S]*?<\/pre>)/g).map((part, i) => {
        if (i % 2 === 1) return part; // This is a <pre> block, return as is
        // Process for lists before adding <br>
        if (part.includes('<ul>') || part.includes('<ol>')) return part;
        return part.replace(/\n/g, '<br />');
    }).join('');
  }


  return (
    <div 
      className="prose prose-sm sm:prose-base prose-stone dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-code:bg-zinc-700 prose-code:text-rose-300 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs prose-a:text-sky-400 hover:prose-a:text-sky-300"
      dangerouslySetInnerHTML={{ __html: finalHtml }}
      style={{ whiteSpace: 'pre-wrap' }} // Keep this for general whitespace handling
    />
  );
};

export default MarkdownRenderer;
