import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import WhoAmI from './pages/whoami';
import Contact from './pages/Contact';
import Warlok from './pages/warlok';
import Oomi from './pages/oomi';
import Projects from './pages/Projects';
import { ThemeProvider } from './contexts/themeContext';
import CycleButton from './components/CycleButton';
import Navigation from './components/Navigation';
import './App.css';

const RouteWrapper = () => {
  const location = useLocation();
  
  const getNextRoute = (currentPath) => {
    const routes = ['whoami', 'blog', 'contact', 'warlok', 'oomi', 'projects'];
    const currentIndex = routes.indexOf(currentPath.replace('/', ''));
    const nextIndex = (currentIndex + 1) % routes.length;
    return routes[nextIndex];
  };

  const currentRoute = location.pathname.replace('/', '') || 'whoami';
  const nextRoute = getNextRoute(currentRoute);

  return (
    <div className="App">
      <header className="header">
        <Navigation currentRoute={currentRoute} nextRoute={nextRoute} />
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/whoami" replace />} />
          <Route path="/whoami" element={<WhoAmI />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/warlok" element={<Warlok />} />
          <Route path="/oomi" element={<Oomi />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <RouteWrapper />
      </Router>
    </ThemeProvider>
  );
}

export default App;