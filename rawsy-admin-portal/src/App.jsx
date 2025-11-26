import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import UserManagement from './components/UserManagement';
import ProductModeration from './components/ProductModeration';
import PlatformAnalytics from './components/platformAnalytics';
// CSS import is correct here!
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('adminUser');

    if (token && user) {
      setIsAuthenticated(true);
      setAdminUser(JSON.parse(user));
    }

    setLoading(false);
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setAdminUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Rawsy Admin Portal</h1>

        <div className="header-actions">
          <span className="user-info">Welcome, {adminUser?.name}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>

        <button
          className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Moderation
        </button>
        <button
          className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Platform Analytics
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'products' && <ProductModeration />}
        {activeTab === 'analytics' && <PlatformAnalytics />}
      </main>
    </div>
  );
}

export default App;
