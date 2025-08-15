import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AddMembersPage.css';
import { setCookie, getCookie, removeCookie } from '../../../utils/cookieUtils.js';
import { useNavigate } from 'react-router-dom';
 
function AddMembersPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [rescueTeams, setRescueTeams] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const session = JSON.parse(getCookie("ngoSession"));
  const ngoId = session.ngoId;
  const navigate = useNavigate();
 
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/rescuers/get_unadded`)
      .then((response) => {
        console.log("Fetched members:", response.data);
        setMembers(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch members:", error.response?.data || error.message);
      });
  }, []);
 
  const handleAddClick = (member) => {
    setSelectedMember(member);
    setShowPopup(true);
 
    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/rescue_team/by_ngo/${ngoId}`)
      .then((response) => {
        console.log("Fetched rescue teams:", response.data);
        setRescueTeams(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch rescue teams:", error.response?.data || error.message);
      });
  };
 
  const closePopup = () => {
    setShowPopup(false);
    setSelectedMember(null);
    setRescueTeams([]);
  };
 
  const handleAssign = (team) => {
    axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/rescue_team/assign_member/${selectedMember.userId}/${team.teamId}`)
    .then(() => {
      const message = `${selectedMember.userName} has been successfully assigned to team ${team.teamName}`;
      console.log(message);
      setSuccessMessage(message);
      closePopup();
 
      setTimeout(() => setSuccessMessage(''), 3000);
    })
    .catch((error) => {
      console.error("Assignment failed:", error.response?.data || error.message);
      setSuccessMessage('Assignment failed. Please try again.');
      setTimeout(() => setSuccessMessage(''), 3000);
    });
  };
 
  const filteredMembers = members.filter(member =>
    member.teamId === 0 &&
    (member.role === 'Volunteer' || member.role === 'Rescue Member') &&
    member.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <div className="add-members-page">
      <button
        className="ngo-back-btn"
        onClick={() => navigate("/ngoDasboard")}
      >
        Back
      </button>
      <h2>Add Members</h2>
 
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
 
      <input
        type="text"
        placeholder="Search"
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
 
      <table className="members-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                No members available
              </td>
            </tr>
          ) : (
            filteredMembers.map((member) => (
              <tr key={member.phoneNo || member.userName}>
                <td>{member.userName}</td>
                <td>{member.phoneNo}</td>
                <td>{member.role}</td>
                <td>
                  <button className="add-btn" onClick={() => handleAddClick(member)}>Assign to team</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
 
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add to Rescue Team</h3>
            {selectedMember && (
              <p><strong>Member:</strong> {selectedMember.userName}</p>
            )}
 
            {rescueTeams.length === 0 ? (
              <p style={{ color: '#888', padding: '10px' }}>No rescue teams available</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Team No</th>
                    <th>Team Name</th>
                    <th>Zone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rescueTeams.map((team, index) => (
                    <tr key={team.teamId || `team-${index}`}>
                      <td>{team.teamId || 'N/A'}</td>
                      <td>{team.teamName || 'Unnamed Team'}</td>
                      <td>{team.zone || 'Unknown Zone'}</td>
                      <td>
                        <button className="ok-btn" onClick={() => handleAssign(team)}>
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
 
            <div className="popup-buttons">
              <button className="close-btn" onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default AddMembersPage;
