import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({ 
  children, 
  to, 
  variant = 'primary',
  icon,
  ...props 
}) => {
  const Element = to ? Link : 'button';
  
  return (
    <Element 
      className={`btn btn-${variant}`}
      to={to}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
      <span className="btn-hover-effect" />
    </Element>
  );
}; 