import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Accounts = () => {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ accountType: 'savings', initialDeposit: '' });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/accounts', {
        accountType: formData.accountType,
        initialDeposit: parseFloat(formData.initialDeposit) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Account created successfully!');
      setShowModal(false);
      setFormData({ accountType: 'savings', initialDeposit: '' });
      fetchAccounts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create account');
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesFilter = filter === 'all' || account.accountType === filter;
    const matchesSearch = account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getAccountIcon = (type) => {
    switch(type) {
      case 'savings': return '💰';
      case 'checking': return '💳';
      case 'fixed_deposit': return '🏦';
      default: return '💳';
    }
  };

  const getAccountColor = (type) => {
    switch(type) {
      case 'savings': return 'linear-gradient(135deg, #667eea, #764ba2)';
      case 'checking': return 'linear-gradient(135deg, #11998e, #38ef7d)';
      case 'fixed_deposit': return 'linear-gradient(135deg, #f093fb, #f5576c)';
      default: return 'linear-gradient(135deg, #667eea, #764ba2)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333' }}>🏦 My Accounts</h1>
          <button onClick={() => setShowModal(true)} style={{ padding: '12px 25px', background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
            ➕ New Account
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="🔍 Search account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '25px', border: '2px solid #e0e0e0', fontSize: '14px' }}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: '25px', border: '2px solid #e0e0e0', fontSize: '14px' }}
          >
            <option value="all">All Accounts</option>
            <option value="savings">Savings</option>
            <option value="checking">Checking</option>
            <option value="fixed_deposit">Fixed Deposit</option>
          </select>
        </div>

        {/* Account Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : filteredAccounts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
            {filteredAccounts.map(account => (
              <div key={account._id} style={{ background: getAccountColor(account.accountType), color: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '30px' }}>{getAccountIcon(account.accountType)}</div>
                  <span style={{ background: 'rgba(255,255,255,0.3)', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {account.status.toUpperCase()}
                  </span>
                </div>
                <p style={{ opacity: '0.9', marginBottom: '10px', fontSize: '14px' }}>{account.accountNumber}</p>
                <h2 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 'bold' }}>${account.balance.toFixed(2)}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ textTransform: 'capitalize', opacity: '0.9' }}>{account.accountType} Account</span>
                  <span style={{ fontSize: '12px', opacity: '0.8' }}>
                    {new Date(account.openedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏦</div>
            <h3>No Accounts Found</h3>
            <p style={{ color: '#666' }}>Create your first account to get started</p>
          </div>
        )}
      </div>

      {/* Create Account Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>Create New Account</h3>
            <form onSubmit={handleCreateAccount}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                >
                  <option value="savings">💰 Savings Account</option>
                  <option value="checking">💳 Checking Account</option>
                  <option value="fixed_deposit">🏦 Fixed Deposit</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Initial Deposit</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.initialDeposit}
                  onChange={(e) => setFormData({ ...formData, initialDeposit: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Create
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '25px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;