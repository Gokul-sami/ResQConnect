import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';
import { setCookie } from '../../../utils/cookieUtils';

function NGOLogin() {
  const [ngoName, setNgoName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!ngoName || !contactNo) {
      setError('Please fill in all fields.');
      return;
    }
    axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/ngoLogin`, { ngoName, contactNo })
      .then((response) => {
        if (response.data.ngoId && response.data.ngoId !== 0) {
          const ngoData = {
            ngoId: response.data.ngoId,
            ngoName,
            contactNo,
          };
          setCookie('ngoSession', JSON.stringify(ngoData), { expires: 2 });
          navigate('/ngoDashboard');
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
      })
      .catch(() => {
        setError('Login failed. Please check your credentials and try again.');
      });
  };

  const handleSignupRedirect = (e) => {
    e.preventDefault();
    navigate('/ngoSignup');
  };

  return (
    <div className="login-frame-wrapper">
      <div className="login-wrapper">
        <div className="login-left blue-theme">
          <div className="logo-container">
            <img src="logo.png" alt="ResQConnect Logo" className="logo" />
          </div>
          <h1>Welcome to ResQConnect</h1>
          <p>
            Empowering NGOs to respond faster and smarter. Join us in making a difference.
          </p>
        </div>
        <div className="login-right">
          <form className="login-form blue-theme-form" onSubmit={handleSubmit}>
            <h2>NGO Login</h2>
            <label htmlFor="ngoName">NGO Name</label>
            <input
              id="ngoName"
              type="text"
              value={ngoName}
              onChange={e => setNgoName(e.target.value)}
              required
            />
            <label htmlFor="contactNo">Contact Number</label>
            <input
              id="contactNo"
              type="tel"
              value={contactNo}
              onChange={e => setContactNo(e.target.value)}
              required
            />
            <button type="submit">LOGIN</button>
            {error && <div className="admin-error">{error}</div>}
            <div className="or-separator">— or —</div>
            <div style={{ textAlign: 'center' }} className="login-link">
              <a href="#" onClick={handleSignupRedirect}>NGO Signup</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NGOLogin;
