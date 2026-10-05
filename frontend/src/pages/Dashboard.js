import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Dashboard = () => {
  const { user, token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalAccounts: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalTransfers: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch accounts
      const accountsRes = await axios.get('http://localhost:5000/api/accounts', { headers });
      setAccounts(accountsRes.data);

      // Fetch transactions for each account
      let allTransactions = [];
      for (let account of accountsRes.data) {
        const txnRes = await axios.get(`http://localhost:5000/api/transactions/history/${account._id}`, { headers });
        allTransactions = [...allTransactions, ...txnRes.data.transactions];
      }
      setTransactions(allTransactions);

      // Calculate stats
      const totalBalance = accountsRes.data.reduce((sum, acc) => sum + acc.balance, 0);
      const totalDeposits = allTransactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
      const totalWithdrawals = allTransactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0);
      const totalTransfers = allTransactions.filter(t => t.type === 'transfer').reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalBalance,
        totalAccounts: accountsRes.data.length,
        totalDeposits,
        totalWithdrawals,
        totalTransfers
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const pieData = {
    labels: accounts.map(a => a.accountType),
    datasets: [{
      data: accounts.map(a => a.balance),
      backgroundColor: ['#667eea', '#11998e', '#f093fb', '#f5576c', '#4facfe'],
      borderWidth: 0
    }]
  };

  const barData = {
    labels: ['Deposits', 'Withdrawals', 'Transfers'],
    datasets: [{
      label: 'Transaction Amounts',
      data: [stats.totalDeposits, stats.totalWithdrawals, stats.totalTransfers],
      backgroundColor: ['#11998e', '#eb3349', '#667eea'],
      borderRadius: 10
    }]
  };

  const lineData = {
    labels: transactions.slice(0, 10).map(t => new Date(t.createdAt).toLocaleDateString()),
    datasets: [{
      label: 'Recent Transactions',
      data: transactions.slice(0, 10).map(t => t.amount),
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.2)',
      tension: 0.4
    }]
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '50px', animation: 'spin 1s linear infinite' }}>⚙️</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '30px' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#333', fontWeight: 'bold' }}>Welcome back, {user?.firstName}! 👋</h1>
          <p style={{ color: '#666' }}>Here's your financial overview</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(102,126,234,0.3)' }}>
            <div style={{ fontSize: '35px', marginBottom: '10px' }}>💰</div>
            <h3 style={{ fontSize: '28px', marginBottom: '5px' }}>${stats.totalBalance.toFixed(2)}</h3>
            <p style={{ opacity: '0.9' }}>Total Balance</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(17,153,142,0.3)' }}>
            <div style={{ fontSize: '35px', marginBottom: '10px' }}>🏦</div>
            <h3 style={{ fontSize: '28px', marginBottom: '5px' }}>{stats.totalAccounts}</h3>
            <p style={{ opacity: '0.9' }}>Total Accounts</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(245,87,108,0.3)' }}>
            <div style={{ fontSize: '35px', marginBottom: '10px' }}>📈</div>
            <h3 style={{ fontSize: '28px', marginBottom: '5px' }}>${stats.totalDeposits.toFixed(2)}</h3>
            <p style={{ opacity: '0.9' }}>Total Deposits</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(79,172,254,0.3)' }}>
            <div style={{ fontSize: '35px', marginBottom: '10px' }}>🔄</div>
            <h3 style={{ fontSize: '28px', marginBottom: '5px' }}>{transactions.length}</h3>
            <p style={{ opacity: '0.9' }}>Total Transactions</p>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginBottom: '20px', color: '#333' }}>Account Distribution</h4>
            <Pie data={pieData} />
          </div>

          <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
            <h4 style={{ marginBottom: '20px', color: '#333' }}>Transaction Overview</h4>
            <Bar data={barData} />
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ color: '#333', marginBottom: '0' }}>Recent Activity</h4>
            <a href="/transactions" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>View All →</a>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map(txn => (
                  <tr key={txn._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: txn.type === 'deposit' ? '#11998e' : txn.type === 'withdrawal' ? '#eb3349' : '#667eea' }}>
                        {txn.type === 'deposit' ? '⬇️' : txn.type === 'withdrawal' ? '⬆️' : '🔄'} {txn.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: txn.type === 'withdrawal' ? '#eb3349' : '#11998e' }}>
                      {txn.type === 'withdrawal' ? '-' : '+'}${txn.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {new Date(txn.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                        ✓ Completed
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                      No transactions yet
                    </td>
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

export default Dashboard;