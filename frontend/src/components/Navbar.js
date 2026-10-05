import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: '📊 Dashboard' },
    { to: '/accounts', label: '🏦 Accounts' },
    { to: '/transactions', label: '💳 Transactions' },
    { to: '/transfer', label: '🔄 Transfer' },
    { to: '/bills', label: '💡 Bills' },
    { to: '/reports', label: '📈 Reports' },
    { to: '/settings', label: '⚙️ Settings' }
  ];

  return (
    <nav style={{ background: 'linear-gradient(90deg, #1e3c72, #2a5298)', padding: '15px 30px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' }}>
          🏦 BankPro
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 15px',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                background: 'rgba(255,255,255,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <span>{user.firstName}</span>
              <span>▼</span>
            </button>

            {showDropdown && (
              <div style={{ position: 'absolute', right: 0, top: '50px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', minWidth: '200px', padding: '10px' }}>
                <Link to="/profile" style={{ display: 'block', padding: '10px 15px', textDecoration: 'none', color: '#333', borderRadius: '10px' }}>
                  👤 Profile
                </Link>
                <Link to="/settings" style={{ display: 'block', padding: '10px 15px', textDecoration: 'none', color: '#333', borderRadius: '10px' }}>
                  ⚙️ Settings
                </Link>
                <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '10px 15px', background: 'none', border: 'none', textAlign: 'left', color: '#eb3349', cursor: 'pointer', borderRadius: '10px' }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;