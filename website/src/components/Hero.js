import React from 'react';
import { Button } from './Button';

export const Hero = ({ title, subtitle }) => (
  <section className="hero-section">
    <div className="hero-content">
      <h1 className="hero-title">
        <span className="text-gradient">{title}</span>
      </h1>
      <p className="hero-subtitle">{subtitle}</p>
      <div className="hero-actions">
        <Button variant="primary" to="/projects">
          Explore Work
        </Button>
        <Button variant="secondary" to="/about">
          My Journey
        </Button>
      </div>
    </div>
    <div className="hero-decoration">
      <div className="geometric-pattern" aria-hidden="true" />
      <div className="blob-animation" aria-hidden="true" />
    </div>
  </section>
); 