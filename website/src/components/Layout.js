import React from 'react';
import { Link } from 'react-router-dom';

export const Layout = ({ children }) => (
  <div className="layout-grid">
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/logo.svg" alt="Logo" className="nav-logo" />
        </Link>
        <ul>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>
    </nav>
    <main className="main-content">
      <div className="content-wrapper">
        {children}
      </div>
    </main>
    <footer className="site-footer">
      <div className="footer-content">
        <p>Mindful Engineering & Design</p>
      </div>
    </footer>
  </div>
); 