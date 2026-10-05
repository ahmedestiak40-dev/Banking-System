import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Transfer = () => {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, fromAccountId: response.data[0]._id }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/transactions/transfer', {
        fromAccountId: formData.fromAccountId,
        toAccountNumber: formData.toAccountNumber,
        amount: parseFloat(formData.amount),
        description: formData.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('✅ Transfer successful!');
      alert('Transfer successful!');
      
      // Reset form
      setFormData({
        fromAccountId: accounts[0]?._id || '',
        toAccountNumber: '',
        amount: '',
        description: ''
      });
      
      // Refresh accounts
      fetchAccounts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Transfer failed';
      setMessage('❌ ' + errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
          🔄 Transfer Money
        </h2>

        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          {message && (
            <div style={{
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              background: message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('✅') ? '#155724' : '#721c24',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleTransfer}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
                From Account
              </label>
              <select
                value={formData.fromAccountId}
                onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '16px' }}
                required
              >
                {accounts.map(account => (
                  <option key={account._id} value={account._id}>
                    {account.accountType} - {account.accountNumber} (Balance: ${account.balance})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
                To Account Number
              </label>
              <input
                type="text"
                placeholder="Enter destination account number (e.g., ACC123456789)"
                value={formData.toAccountNumber}
                onChange={(e) => setFormData({ ...formData, toAccountNumber: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '16px' }}
                required
              />
              <small style={{ color: '#666' }}>
                💡 Tip: Check your other account's number from Accounts page
              </small>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '16px' }}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="Add a note"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0', fontSize: '16px' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : '🔄 Transfer Money'}
            </button>
          </form>
        </div>

        {/* Show user's accounts for reference */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', marginTop: '20px' }}>
          <h4 style={{ marginBottom: '15px', color: '#333' }}>Your Account Numbers:</h4>
          {accounts.map(account => (
            <div key={account._id} style={{
              padding: '10px',
              background: '#f8f9fa',
              borderRadius: '10px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold' }}>{account.accountNumber}</span>
              <span style={{ color: '#666' }}>${account.balance.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transfer;