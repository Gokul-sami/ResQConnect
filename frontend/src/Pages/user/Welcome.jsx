import '../styles/Welcome.css';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { setCookie, getCookie } from '../../../utils/cookieUtils.js';

function Welcome() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedUserType, setSelectedUserType] = useState("");
  const [userTypeError, setUserTypeError] = useState("");
  const [nameError, setNameError] = useState("");
  const [contactError, setContactError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userSession = getCookie("userSession");
    if (userSession) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!name.trim()) {
      setNameError("Full Name is required.");
      valid = false;
    } else {
      setNameError("");
    }

    if (!contact.trim()) {
      setContactError("Contact No is required.");
      valid = false;
    } else if (!/^\d{10}$/.test(contact.trim())) {
      setContactError("Contact No must be exactly 10 digits.");
      valid = false;
    } else {
      setContactError("");
    }

    if (!selectedUserType) {
      setUserTypeError("Please select a user type.");
      valid = false;
    } else {
      setUserTypeError("");
    }

    if (!valid) return;

    const userData = {
      userName: name,
      phoneNo: contact,
      role: selectedUserType,
    };

    axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/user_login`, userData, {
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      setCookie("userSession", JSON.stringify({
        name,
        contact,
        role: selectedUserType,
        userId: response.data.userId,
        teamId: response.data.teamId,
      }), 1);
      navigate('/home');
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  const handleNGOLink = (e) => {
    e.preventDefault();
    navigate('/ngoSignup');
  };

  return (
    <div className="welcome-wrapper">
      <div className="welcome-image-side"></div>
      <div className="welcome-box-side">
        <form className="welcome-box" onSubmit={handleSubmit}>
          <div className="welcome-header">
            <img
              src="/logo.png"
              alt="ResQConnect Logo"
            />
            <h1>ResQConnect</h1>
            <p className="tagline">Bringing help and hope during disasters.</p>
          </div>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {nameError && <p className="welcome-error">{nameError}</p>}
          <input
            type="number"
            placeholder="Contact No"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          {contactError && <p className="welcome-error">{contactError}</p>}
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="userType"
                value="user"
                checked={selectedUserType === "user"}
                onChange={() => setSelectedUserType("user")}
              />
              <span>Public</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="userType"
                value="volunteer"
                checked={selectedUserType === "volunteer"}
                onChange={() => setSelectedUserType("volunteer")}
              />
              <span>Volunteer</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="userType"
                value="rescueMember"
                checked={selectedUserType === "rescueMember"}
                onChange={() => setSelectedUserType("rescueMember")}
              />
              <span>Rescue Member</span>
            </label>
          </div>
          {userTypeError && <p className="welcome-error">{userTypeError}</p>}
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default Welcome;
