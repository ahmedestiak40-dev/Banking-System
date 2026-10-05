import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    if (result.success) {
      navigate('/');
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div className="card-custom fade-in" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto',
            background: 'linear-gradient(45deg, #11998e, #38ef7d)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>
            📝
          </div>
          <h2 style={{ marginTop: '20px', color: '#333', fontWeight: 'bold' }}>Create Account</h2>
          <p style={{ color: '#666' }}>Join our bank today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
                👤 First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="John"
                onChange={handleChange}
                className="form-control-custom"
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
                👤 Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Doe"
                onChange={handleChange}
                className="form-control-custom"
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
              📧 Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              onChange={handleChange}
              className="form-control-custom"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
                🔒 Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                onChange={handleChange}
                className="form-control-custom"
                style={{ width: '100%' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
                🔒 Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                onChange={handleChange}
                className="form-control-custom"
                style={{ width: '100%' }}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>
              📱 Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+880 1XXX-XXXXXX"
              onChange={handleChange}
              className="form-control-custom"
              style={{ width: '100%' }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-success-gradient"
            style={{ width: '100%', fontSize: '16px', marginTop: '25px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : '✅ Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#11998e', fontWeight: 'bold', textDecoration: 'none' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;