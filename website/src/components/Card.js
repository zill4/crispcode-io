import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

export const CardHeader = ({ date }) => (
  <div className="card-header">
    <time className="post-date">{new Date(date).toLocaleDateString()}</time>
  </div>
);

export const CardBody = ({ children }) => (
  <div className="card-body">{children}</div>
);

export const CardAction = ({ to, children }) => (
  <div className="card-action">
    <Link to={to} className="btn-zen-text">
      {children || 'Continue Reading'}
    </Link>
  </div>
);

export const Card = ({ children, variant = 'default' }) => (
  <article className={`zen-card ${variant}`}>
    <div className="card-inner">
      <div className="card-content">
        {children}
      </div>
      <div className="card-decoration" aria-hidden="true">
        <div className="shine-effect" />
        <div className="texture-overlay" />
      </div>
    </div>
  </article>
);

// Usage:
