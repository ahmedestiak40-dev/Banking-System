import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    twoFactorAuth: false,
    language: 'english',
    currency: 'USD',
    theme: 'light'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '30px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '30px' }}>⚙️ Settings</h1>

        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Notification Settings</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" name="notifications" checked={settings.notifications} onChange={handleChange} style={{ marginRight: '10px', width: '20px', height: '20px' }} />
              <span>Enable Notifications</span>
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" name="emailAlerts" checked={settings.emailAlerts} onChange={handleChange} style={{ marginRight: '10px', width: '20px', height: '20px' }} />
              <span>Email Alerts</span>
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" name="smsAlerts" checked={settings.smsAlerts} onChange={handleChange} style={{ marginRight: '10px', width: '20px', height: '20px' }} />
              <span>SMS Alerts</span>
            </label>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleChange} style={{ marginRight: '10px', width: '20px', height: '20px' }} />
              <span>Two-Factor Authentication</span>
            </label>
          </div>
        </div>

        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Preferences</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Language</label>
            <select name="language" value={settings.language} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }}>
              <option value="english">English</option>
              <option value="bangla">বাংলা</option>
              <option value="spanish">Español</option>
              <option value="french">Français</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Currency</label>
            <select name="currency" value={settings.currency} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }}>
              <option value="USD">USD - US Dollar</option>
              <option value="BDT">BDT - Bangladeshi Taka</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Theme</label>
            <select name="theme" value={settings.theme} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e0e0e0' }}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '15px', background: 'linear-gradient(45deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;