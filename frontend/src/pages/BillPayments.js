import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BillPayments = () => {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    accountId: '',
    billType: 'electricity',
    billerName: '',
    accountNumber: '',
    amount: '',
    dueDate: ''
  });

  const billTypes = [
    { value: 'electricity', label: '⚡ Electricity', color: '#f39c12' },
    { value: 'water', label: '💧 Water', color: '#3498db' },
    { value: 'internet', label: '🌐 Internet', color: '#9b59b6' },
    { value: 'phone', label: '📱 Phone', color: '#2ecc71' },
    { value: 'gas', label: '🔥 Gas', color: '#e74c3c' },
    { value: 'credit_card', label: '💳 Credit Card', color: '#1abc9c' }
  ];

  useEffect(() => {
    fetchAccounts();
    fetchBills();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, accountId: response.data[0]._id }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchBills = async () => {
    // Simulated bills data
    const mockBills = [
      { id: 1, type: 'electricity', biller: 'Power Co.', amount: 150.00, dueDate: '2024-01-15', status: 'pending' },
      { id: 2, type: 'internet', biller: 'NetFast', amount: 59.99, dueDate: '2024-01-20', status: 'pending' },
      { id: 3, type: 'water', biller: 'City Water', amount: 35.50, dueDate: '2024-01-10', status: 'paid' },
      { id: 4, type: 'phone', biller: 'TeleCom', amount: 45.00, dueDate: '2024-01-25', status: 'pending' }
    ];
    setBills(mockBills);
  };

  const handlePayBill = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions/withdraw', {
        accountId: formData.accountId,
        amount: parseFloat(formData.amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Bill paid successfully!');
      setShowForm(false);
      setFormData({ ...formData, billerName: '', accountNumber: '', amount: '', dueDate: '' });
      fetchAccounts();
      fetchBills();
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
    }
  };

  const getBillColor = (type) => {
    const bill = billTypes.find(b => b.value === type);
    return bill ? bill.color : '#666';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#333' }}>💳 Bill Payments</h1>
          <button onClick={() => setShowForm(true)} style={{ padding: '12px 25px', background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
            ➕ Pay New Bill
          </button>
        </div>

        {/* Bill Types Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {billTypes.map(type => (
            <div key={type.value} style={{ background: 'white', padding: '25px', borderRadius: '20px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>{type.label.split(' ')[0]}</div>
              <p style={{ fontWeight: 'bold', color: type.color }}>{type.label.split(' ')[1]}</p>
            </div>
          ))}
        </div>

        {/* Bills List */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Upcoming Bills</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Bill Type</th>
                  <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Biller</th>
                  <th style={{ padding: '15px', textAlign: 'right', color: '#666' }}>Amount</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: '#666' }}>Due Date</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: '#666' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'center', color: '#666' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: getBillColor(bill.type) }}>
                        {bill.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>{bill.biller}</td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>${bill.amount.toFixed(2)}</td>
                    <td style={{ padding: '15px', textAlign: 'center', color: '#666' }}>{bill.dueDate}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{ background: bill.status === 'paid' ? '#d4edda' : '#fff3cd', color: bill.status === 'paid' ? '#155724' : '#856404', padding: '5px 15px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                        {bill.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      {bill.status === 'pending' && (
                        <button onClick={() => setShowForm(true)} style={{ background: '#667eea', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer' }}>
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '20px' }}>💳 Pay Bill</h3>
            <form onSubmit={handlePayBill}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>From Account</label>
                <select value={formData.accountId} onChange={(e) => setFormData({ ...formData, accountId: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }}>
                  {accounts.map(account => (
                    <option key={account._id} value={account._id}>
                      {account.accountType} - {account.accountNumber} (${account.balance})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Bill Type</label>
                <select value={formData.billType} onChange={(e) => setFormData({ ...formData, billType: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }}>
                  {billTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Biller Name</label>
                <input type="text" placeholder="Enter biller name" value={formData.billerName} onChange={(e) => setFormData({ ...formData, billerName: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }} required />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Account Number</label>
                <input type="text" placeholder="Enter bill account number" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }} required />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Amount</label>
                <input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }} required />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Pay Bill
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '25px', cursor: 'pointer' }}>
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

export default BillPayments;