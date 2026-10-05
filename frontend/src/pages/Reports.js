import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Reports = () => {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchTransactions();
    }
  }, [selectedAccount, dateRange]);

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
      console.error('Error:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions/history/${selectedAccount}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Transaction ID', 'Type', 'Amount', 'Description', 'Date'],
      ...transactions.map(t => [
        t.transactionId,
        t.type,
        t.amount,
        t.description || '',
        new Date(t.createdAt).toISOString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${selectedAccount}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const data = JSON.stringify(transactions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${selectedAccount}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const getTotalIncome = () => {
    return transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0);
  };

  const getNetBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>📊 Reports & Export</h1>

        {/* Controls */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '20px', marginBottom: '30px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0', flex: 1, minWidth: '200px' }}>
            {accounts.map(account => (
              <option key={account._id} value={account._id}>
                {account.accountType} - {account.accountNumber}
              </option>
            ))}
          </select>
          
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>

          <button onClick={exportToCSV} style={{ padding: '12px 20px', background: '#11998e', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            📥 Export CSV
          </button>
          <button onClick={exportToJSON} style={{ padding: '12px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            📥 Export JSON
          </button>
          <button onClick={printReport} style={{ padding: '12px 20px', background: '#f093fb', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
            🖨️ Print Report
          </button>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', padding: '25px', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '10px' }}>Total Income</h4>
            <h2>${getTotalIncome().toFixed(2)}</h2>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #eb3349, #f45c43)', color: 'white', padding: '25px', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '10px' }}>Total Expense</h4>
            <h2>${getTotalExpense().toFixed(2)}</h2>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '25px', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '10px' }}>Net Balance</h4>
            <h2>${getNetBalance().toFixed(2)}</h2>
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '20px' }}>Transaction Report</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Transaction ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Balance After</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px', fontSize: '12px', color: '#666' }}>{txn.transactionId}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: txn.type === 'deposit' ? '#11998e' : txn.type === 'withdrawal' ? '#eb3349' : '#667eea' }}>
                        {txn.type}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: txn.type === 'withdrawal' ? '#eb3349' : '#11998e' }}>
                      {txn.type === 'withdrawal' ? '-' : '+'}${txn.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '15px' }}>{txn.description || '-'}</td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>${txn.balanceAfter.toFixed(2)}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>{new Date(txn.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>No transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;