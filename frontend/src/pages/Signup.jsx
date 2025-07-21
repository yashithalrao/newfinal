import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { email, password, role });
      alert('Account created!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={brandText}>SANSERA</h1>
        <h2 style={titleStyle}>Create Account</h2>

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
          required
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          style={inputStyle}
          required
        />

        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          style={selectStyle}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={buttonStyle}>Sign up</button>

        <div style={loginPrompt}>
          Already have an account?
          <Link to="/" style={loginLink}> Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;

const pageStyle = {
  backgroundColor: '#121212',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#fff',
  padding: '20px'
};

const formStyle = {
  backgroundColor: '#1e1e1e',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '400px'
};

const brandText = {
  fontSize: '2.4rem',
  fontWeight: 'bold',
  color: '#61dafb',
  letterSpacing: '1.5px',
  textAlign: 'center',
  marginBottom: '10px'
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '30px',
  color: 'rgba(212, 149, 227, 1)',
  fontSize: '1.8rem'
};

const inputStyle = {
  backgroundColor: '#2c2c2c',
  color: '#f0f0f0',
  border: '1px solid #444',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '20px',
  fontSize: '1rem'
};

const selectStyle = {
  ...inputStyle,
  backgroundColor: '#2c2c2c'
};

const buttonStyle = {
  backgroundColor: 'rgba(212, 149, 227, 1)',
  color: '#121212',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  marginTop: '10px'
};

const loginPrompt = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#ccc'
};

const loginLink = {
  color: 'rgba(212, 149, 227, 1)',
  marginLeft: '5px',
  textDecoration: 'underline',
  cursor: 'pointer'
};
