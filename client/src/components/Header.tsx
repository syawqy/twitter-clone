// client/src/components/Header.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      logout();
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title">Twitter Clone</h1>
        </div>
        
        {user && (
          <div className="header-right">
            <div className="user-info">
              <span className="username">@{user.username}</span>
              <span className="email">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button"
              title="Keluar"
            >
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}