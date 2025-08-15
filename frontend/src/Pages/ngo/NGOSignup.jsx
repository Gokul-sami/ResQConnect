import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';
import { setCookie } from '../../../utils/cookieUtils';

function NGOSignup() {
  const [ngoName, setNgoName] = useState('');
  const [contact, setContact] = useState('');
  const [head, setHead] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [certificateBase64, setCertificateBase64] = useState('');
  const navigate = useNavigate();

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    setCertificate(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertificateBase64(reader.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ngoName,
      contact,
      head,
      govtVerifiedUrl: certificateBase64,
    };
    axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/ngoSignup`, payload)
      .then((response) => {
        if (response.data.ngoId) {
          const ngoData = {
            ngoId: response.data.ngoId,
            ngoName,
            contactNo: contact,
          };
          setCookie('ngoSession', JSON.stringify(ngoData), { expires: 2 });
          navigate('/ngoDashboard');
        } else {
          alert('Signup failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
      });
  };

  const handleLoginRedirect = (e) => {
    e.preventDefault();
    navigate('/ngoLogin');
  };

  return (
    <div className="login-frame-wrapper">
      <div className="login-wrapper">
        <div className="login-left blue-theme">
          <div className="logo-container">
            <img src="logo.png" alt="ResQConnect Logo" className="logo" />
          </div>
          <h1>Join ResQConnect</h1>
          <p>
            Register your NGO and become part of a network that saves lives and empowers communities.
          </p>
        </div>

        <div className="login-right">
          <form className="login-form blue-theme-form" onSubmit={handleSubmit}>
            <h2>NGO Sign-Up</h2>
            <label htmlFor="ngoName">NGO Name</label>
            <input id="ngoName" type="text" value={ngoName} onChange={(e) => setNgoName(e.target.value)} required />

            <label htmlFor="contact">Contact Number</label>
            <input id="contact" type="tel" value={contact} onChange={(e) => setContact(e.target.value)} required />

            <label htmlFor="head">Head of Organization</label>
            <input id="head" type="text" value={head} onChange={(e) => setHead(e.target.value)} required />

            <label htmlFor="certificate">Government Certificate</label>
            <input id="certificate" type="file" onChange={handleCertificateChange} required />

            <button type="submit">Register</button>

            <div style={{ textAlign: 'center' }} className="login-link">
              <a href="#" onClick={handleLoginRedirect}>Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NGOSignup;
