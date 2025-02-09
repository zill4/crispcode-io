import React from 'react';
import { Link } from 'react-router-dom';
import CycleButton from './CycleButton';
import '../styles/Navigation.css';

const Navigation = ({ currentRoute, nextRoute }) => {
  // Function to format route for display
  const formatRoute = (route) => {
    if (route.length > 20) {
      return route.substring(0, 20) + '...';
    }
    return route;
  };

  // Split current route into segments
  const routeSegments = currentRoute.split('/').filter(Boolean);

  return (
    <div className="navigation-container">
      <Link to="/" className="logo-section">crispcode.io</Link>
      <div className="route-section">
        {routeSegments.map((segment, index) => (
          <React.Fragment key={index}>
            <span className="separator">/</span>
            <Link 
              to={`/${routeSegments.slice(0, index + 1).join('/')}`}
              className="route-segment"
            >
              {formatRoute(segment)}
            </Link>
          </React.Fragment>
        ))}
        <CycleButton />
        <Link to={`/${nextRoute}`} className="next-route">
          {formatRoute(nextRoute)}
        </Link>
      </div>
    </div>
  );
};

export default Navigation; 