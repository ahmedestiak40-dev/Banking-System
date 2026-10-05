import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh',
      padding: '30px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card-custom fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="avatar" style={{ margin: '0 auto' }}>
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <h2 style={{ marginTop: '20px', color: '#333' }}>
            {user.firstName} {user.lastName}
          </h2>
          <span style={{
            background: 'linear-gradient(45deg, #11998e, #38ef7d)',
            color: 'white',
            padding: '5px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {user.role.toUpperCase()}
          </span>
        </div>

        <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '15px' }}>
            <span style={{ fontSize: '24px', marginRight: '15px' }}>📧</span>
            <div>
              <p style={{ color: '#666', fontSize: '12px', marginBottom: '0' }}>Email</p>
              <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '0' }}>{user.email}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '15px' }}>
            <span style={{ fontSize: '24px', marginRight: '15px' }}>📱</span>
            <div>
              <p style={{ color: '#666', fontSize: '12px', marginBottom: '0' }}>Phone</p>
              <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '0' }}>{user.phone}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '15px', background: '#f8f9fa', borderRadius: '15px' }}>
            <span style={{ fontSize: '24px', marginRight: '15px' }}>🎯</span>
            <div>
              <p style={{ color: '#666', fontSize: '12px', marginBottom: '0' }}>Status</p>
              <p style={{ fontWeight: 'bold', color: '#11998e', marginBottom: '0' }}>
                {user.status || 'Active'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;