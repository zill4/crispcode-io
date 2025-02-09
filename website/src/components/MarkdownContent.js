import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Image } from './Image';

export const MarkdownContent = ({ content }) => {
  if (!content) return null;

  return (
    <div className="markdown-container">
      <ReactMarkdown
        components={{
          h2: ({ node, ...props }) => (
            <h2 className="md-heading" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a 
              className="md-link" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props} 
            />
          ),
          code: ({ node, inline, ...props }) => (
            <code 
              className={`md-code ${inline ? 'inline' : 'block'}`} 
              {...props} 
            />
          ),
          img: ({ node, ...props }) => (
            <Image {...props} aspectRatio="16/9" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
      <div className="scroll-indicator" aria-hidden="true" />
    </div>
  );
}; 