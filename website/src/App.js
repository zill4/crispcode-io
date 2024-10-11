import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CreateProject from './pages/CreateProject';
import CreateBlogPost from './pages/CreateBlogPost';
import BlogDetail from './pages/BlogDetail';
import PrivateRoute from './components/privateRoute';
import ProjectDetail from './pages/ProjectDetail';
import { AuthContext } from './contexts/authContext';
import { ThemeProvider } from './contexts/themeContext';
import ThemeToggle from './components/themeToggle';
import './App.css';

function App() {
  const { currentUser, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <header className="header">
            <div className="container header-content">
              <div className="logo">
                <Link to="/">crispcode.io</Link>
              </div>
              <nav>
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/projects">Projects</Link></li>
                  <li><Link to="/about">About</Link></li>
                  {/* {currentUser ? (
                    <>
                      <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                      <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                    </>
                  ) : (
                    <li><Link to="/admin/login">Admin</Link></li>
                  )} */}
                  <li><ThemeToggle /></li>
                </ul>
              </nav>
            </div>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              {/* <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/admin/create-project" element={
                <PrivateRoute>
                  <CreateProject />
                </PrivateRoute>
              } />
              <Route path="/admin/create-blog-post" element={
                <PrivateRoute>
                  <CreateBlogPost />
                </PrivateRoute>
              } /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="footer">
            <div className="container">
              <p>&copy; 2024 crispcode.io All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;