import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Transactions = () => {
  const { user, token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions();
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
      if (response.data.length > 0) {
        setSelectedAccount(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/history/${selectedAccount}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions/deposit', {
        accountId: selectedAccount,
        amount: parseFloat(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Deposit successful!');
      setAmount('');
      setShowDeposit(false);
      fetchTransactions();
      fetchAccounts();
    } catch (error) {
      alert(error.response?.data?.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions/withdraw', {
        accountId: selectedAccount,
        amount: parseFloat(amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Withdrawal successful!');
      setAmount('');
      setShowWithdraw(false);
      fetchTransactions();
      fetchAccounts();
    } catch (error) {
      alert(error.response?.data?.message || 'Withdrawal failed');
    }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'deposit': return '⬇️';
      case 'withdrawal': return '⬆️';
      case 'transfer': return '🔄';
      default: return '💳';
    }
  };

  const getTransactionColor = (type) => {
    switch(type) {
      case 'deposit': return '#11998e';
      case 'withdrawal': return '#eb3349';
      case 'transfer': return '#667eea';
      default: return '#666';
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: 'white', fontWeight: 'bold', marginBottom: '30px' }}>📊 Transactions</h2>

        <div className="card-custom" style={{ padding: '20px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="form-control-custom"
              style={{ flex: 1, minWidth: '200px' }}
            >
              {accounts.map(account => (
                <option key={account._id} value={account._id}>
                  {account.accountType} - {account.accountNumber} (${account.balance.toFixed(2)})
                </option>
              ))}
            </select>
            <button onClick={() => setShowDeposit(true)} className="btn-success-gradient">
              ⬇️ Deposit
            </button>
            <button onClick={() => setShowWithdraw(true)} className="btn-danger-gradient">
              ⬆️ Withdraw
            </button>
          </div>
        </div>

        {showDeposit && (
          <div className="card-custom" style={{ padding: '20px', marginBottom: '20px' }}>
            <form onSubmit={handleDeposit}>
              <h4 style={{ marginBottom: '15px' }}>⬇️ Deposit Money</h4>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control-custom"
                style={{ width: '100%', marginBottom: '15px' }}
                min="0.01"
                step="0.01"
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-success-gradient" style={{ flex: 1 }}>
                  ✅ Confirm Deposit
                </button>
                <button type="button" onClick={() => setShowDeposit(false)} className="btn-danger-gradient" style={{ flex: 1 }}>
                  ✖ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {showWithdraw && (
          <div className="card-custom" style={{ padding: '20px', marginBottom: '20px' }}>
            <form onSubmit={handleWithdraw}>
              <h4 style={{ marginBottom: '15px' }}>⬆️ Withdraw Money</h4>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-control-custom"
                style={{ width: '100%', marginBottom: '15px' }}
                min="0.01"
                step="0.01"
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-danger-gradient" style={{ flex: 1 }}>
                  ✅ Confirm Withdrawal
                </button>
                <button type="button" onClick={() => setShowWithdraw(false)} className="btn-gradient" style={{ flex: 1 }}>
                  ✖ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card-custom" style={{ padding: '20px' }}>
          <h4 style={{ marginBottom: '20px', color: '#333' }}>Transaction History</h4>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>Loading transactions...</p>
          ) : transactions.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)', color: 'white' }}>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Transaction</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Amount</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Balance After</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr key={transaction._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '15px', fontSize: '24px' }}>
                        {getTransactionIcon(transaction.type)}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          color: getTransactionColor(transaction.type),
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}>
                          {transaction.type}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '15px', 
                        textAlign: 'right',
                        color: getTransactionColor(transaction.type),
                        fontWeight: 'bold'
                      }}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right' }}>
                        ${transaction.balanceAfter.toFixed(2)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', color: '#666' }}>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666' }}>No transactions found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;