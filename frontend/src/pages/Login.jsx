import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/authContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

return (
  <div style={pageStyle}>
    <form onSubmit={handleSubmit} style={formStyle}>
      <h1 style = {brandText}>SANSERA</h1>
      <h2 style={titleStyle}>Login</h2>

      <input
        type="email"
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

      <button type="submit" style={buttonStyle}>Login</button>
    </form>
  </div>
);

}

export default Login;

const pageStyle = {
  backgroundColor: '#121212',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Segoe UI',
  color: '#fff'
};

const formStyle = {
  backgroundColor: '#1e1e1e',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '400px'
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

const buttonStyle = {
  backgroundColor: 'rgba(212, 149, 227, 1)',
  color: '#121212',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem'
};

const brandText = {
  fontSize: '2.4rem',
  fontWeight: 'bold',
  color: '#61dafb',
  letterSpacing: '1.5px',
};