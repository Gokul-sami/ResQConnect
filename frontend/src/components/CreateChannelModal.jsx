import React, { useState } from 'react';
import './CreateChannelModal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../utils/cookieUtils';
 
function CreateChannelModal({ onClose, onCreate }) {
  const navigate = useNavigate();
  const session = JSON.parse(getCookie("userSession"));
  const userId = session.userId;
  const [formData, setFormData] = useState({
    userId: '',
    channelName: '',
    disasterType: '',
    status: 'created',
    zone: '',
    imageUrl: '',
    // description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
      setFormData((prev) => ({
        ...prev,
        imageUrl: '',
      }));
    }
  };

  const handleSubmit = async () => {    
    const payload = { ...formData, userId };
    console.log(userId);
    console.log(payload);
    onCreate(payload);
    axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/create_channel`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Channel created successfully", response.data);
      navigate("/home");
      onClose();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Channel</h2>

        <label>Enter name of the channel:</label>
        <input name="channelName" onChange={handleChange} required />

        <label>Enter type of the disaster:</label>
        <select
          name="disasterType"
          onChange={handleChange}
          value={formData.disasterType}
          required
        >
          <option value="">Select a disaster type</option>
          <option value="flood">Flood</option>
          <option value="cyclone">Cyclone</option>
          <option value="fire">Fire</option>
          <option value="earthquake">Earthquake</option>
        </select>

        <label>Zone:</label>
        <input name="zone" onChange={handleChange} required />

        <label>Take or Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
        />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }} />
        )}

        <button onClick={handleSubmit}>Create</button>
        <button onClick={onClose} className="cancel">Cancel</button>
      </div>
    </div>
  );
}

export default CreateChannelModal;
