


// import { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom'; // 👈 added Link
// import api from '../api/axios';
// import { AuthContext } from '../context/authContext';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/auth/login', { email, password });
//       login(res.data.user, res.data.token);
//       navigate('/dashboard');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div style={pageStyle}>
//       <form onSubmit={handleSubmit} style={formStyle}>
//         <h1 style={brandText}>SANSERA</h1>
//         <h2 style={titleStyle}>Login</h2>

//         <input
//           type="email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           placeholder="Email"
//           style={inputStyle}
//           required
//         />

//         <input
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           placeholder="Password"
//           style={inputStyle}
//           required
//         />

//         <button type="submit" style={buttonStyle}>Login</button>

//         {/* 👇 Signup link */}
//         <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
//           Don’t have an account?{' '}
//           <Link to="/signup" style={{ color: 'rgba(212, 149, 227, 1)', textDecoration: 'underline' }}>
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Login;

// const pageStyle = {
//   backgroundColor: '#121212',
//   minHeight: '100vh',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   fontFamily: 'Segoe UI',
//   color: '#fff'
// };

// const formStyle = {
//   backgroundColor: '#1e1e1e',
//   padding: '40px',
//   borderRadius: '12px',
//   boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
//   display: 'flex',
//   flexDirection: 'column',
//   width: '100%',
//   maxWidth: '400px'
// };

// const titleStyle = {
//   textAlign: 'center',
//   marginBottom: '30px',
//   color: 'rgba(212, 149, 227, 1)',
//   fontSize: '1.8rem'
// };

// const inputStyle = {
//   backgroundColor: '#2c2c2c',
//   color: '#f0f0f0',
//   border: '1px solid #444',
//   borderRadius: '8px',
//   padding: '12px',
//   marginBottom: '20px',
//   fontSize: '1rem'
// };

// const buttonStyle = {
//   backgroundColor: 'rgba(212, 149, 227, 1)',
//   color: '#121212',
//   padding: '12px',
//   border: 'none',
//   borderRadius: '8px',
//   fontWeight: 'bold',
//   cursor: 'pointer',
//   fontSize: '1rem'
// };

// const brandText = {
//   fontSize: '2.4rem',
//   fontWeight: 'bold',
//   color: '#61dafb',
//   letterSpacing: '1.5px',
// };
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/authContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
    <div style={wrapperStyle}>
      {/* 🔹 Background Video */}
      <video autoPlay muted loop playsInline style={videoStyle}>
        <source src="/vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Login Form */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={brandText}>SANSERA</h1>
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
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={inputStyle}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          style={toggleButtonStyle}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>

        <button type="submit" style={buttonStyle}>Login</button>

        <p style={footerText}>
          Don’t have an account?{' '}
          <Link to="/signup" style={linkStyle}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
const wrapperStyle = {
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Segoe UI'
};

const videoStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  minWidth: '100%',
  minHeight: '100%',
  objectFit: 'cover',
  zIndex: -1,
  opacity: 1
};

const formStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '400px',
  zIndex: 1,
  color: '#003366'
};

const brandText = {
  fontSize: '2.4rem',
  fontWeight: 'bold',
  color: '#007BFF',
  letterSpacing: '1.5px',
  textAlign: 'center',
  marginBottom: '10px'
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '30px',
  color: '#0056b3',
  fontSize: '1.8rem'
};

const inputStyle = {
  backgroundColor: '#f0f8ff',
  color: '#003366',
  border: '1px solid #b3d7ff',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '15px',
  fontSize: '1rem'
};

const toggleButtonStyle = {
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '0.85rem',
  cursor: 'pointer',
  width: '60px',
  marginBottom: '20px',
  alignSelf: 'flex-end'
};

const buttonStyle = {
  backgroundColor: '#0056b3',
  color: '#ffffff',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem'
};

const footerText = {
  marginTop: '20px',
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#003366'
};

const linkStyle = {
  color: '#007BFF',
  textDecoration: 'underline'
};
