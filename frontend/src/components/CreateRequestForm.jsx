import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateRequestForm.css';
import { useNavigate , useParams, useLocation } from 'react-router-dom';
import { setCookie, getCookie, removeCookie } from '../../utils/cookieUtils';

function CreateRequestForm({ channelId, userId, onRequestCreated, onCancel }) {
  const [formData, setFormData] = useState({
    category: '',
    address: '',
    description: ''
  });

  const { name: userName } = JSON.parse(getCookie("userSession"));
  const [locationError, setLocationError] = useState('');
  const [locationFetched, setLocationFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData((prev) => ({ ...prev, address: coords }));
          setLocationFetched(true);
        },
        (error) => {
          setLocationError("Unable to fetch location. Please allow location access or enter your address manually.");
          setLocationFetched(false);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setLocationFetched(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // console.log(userName);
    axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/create_request`, {
      ...formData,
      channelId: channelId,
      requesterId: userId,
      requesterName: userName
    })
    .then(response => {
      onRequestCreated(response.data);
      navigate(`/channel/${channelId}/requests`);
    })
    .catch(error => console.error("Failed to create request:", error));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create Request</h3>

        <label>Category:</label>
        <select name="category" onChange={handleChange} required>
          <option value="">Select a category</option>
          <option value="Food">Food</option>
          <option value="Clothes">Clothes</option>
          <option value="Medical">Medical</option>
          <option value="Shelter">Shelter</option>
          <option value="Rescue">Rescue</option>
          <option value="Other">Other</option>
        </select>

        {locationError && (
          <div className="location-error">
            <p>{locationError}</p>
          </div>
        )}

        {!locationFetched && (
          <>
            <label>Address:</label>
            <input
            className='req-address'
              name="address"
              placeholder="Enter your address"
              onChange={handleChange}
              required
            />
          </>
        )}

        <label>Description:</label>
        <textarea name="description" onChange={handleChange} required />

        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onCancel} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CreateRequestForm;
