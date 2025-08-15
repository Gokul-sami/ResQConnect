import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ngoDashboard.css';
import { setCookie, getCookie, removeCookie } from '../../../utils/cookieUtils.js';
import AssignTasks from '../../components/AssignTasks.jsx';

const NgoDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAssignTasks, setShowAssignTasks] = useState(false);
  const [showTeams, setShowTeams] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const session = JSON.parse(getCookie("ngoSession"));
  const ngoId = session.ngoId;
  const [channels, setChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [formData, setFormData] = useState({
    teamName: '',
    teamLead: '',
    zone: '',
    ngoId: ngoId,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/get_all_channels`)
      .then((response) => {
        setChannels(response.data);
        setChannelsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch channels:", error);
        setChannelsLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/rescue_team/by_ngo/${ngoId}`)
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error('Error fetching rescue teams:', error);
      });
  }, [ngoId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateTeam = () => {
    axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/rescue_team/create`, formData)
      .then(() => {
        alert('Team created successfully!');
        setShowModal(false);
        axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/rescue_team/by_ngo/${ngoId}`)
          .then((response) => setTeams(response.data));
      })
      .catch((error) => {
        console.error('Error creating team:', error);
        alert('Failed to create team.');
      });
  };

  const handleLogout = () => {
    removeCookie("ngoSession");
    navigate('/ngoLogin');
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/users/by_team/${team.teamId}`)
      .then((response) => {
        console.log("Fetched team members:", response.data);
        setTeamMembers(response.data);
      })
      .catch((error) => {
        setTeamMembers([]);
        console.error('Error fetching team members:', error);
      });
  };

  const handleBackFromMembers = () => {
    setSelectedTeam(null);
    setTeamMembers([]);
  };

  const handleBackFromAssignTasks = () => {
    setShowAssignTasks(false);
  };

  return (
    <div className="ngo-container">
      <header className="ngo-header">{session.ngoName}</header>
      <div className="ngo-body">
        <aside className="ngo-sidebar">
          <button onClick={() => { setShowTeams(true); setShowAssignTasks(false); }}>Teams</button>
          <button onClick={() => setShowModal(true)}>Create team</button>
          <button onClick={() => navigate('/add-members')}>Add members</button>
          <button onClick={() => { setShowAssignTasks(true); setShowTeams(false); }}>Assign tasks</button>
          <button onClick={handleLogout} style={{ marginTop: 'auto', backgroundColor: '#ff4444', color: 'white' }}>Logout</button>
        </aside>

        <main className="ngo-main">
          {showAssignTasks ? (
            <AssignTasks 
              onBack={handleBackFromAssignTasks}
              channels={channels}
              channelsLoading={channelsLoading}
              teams={teams}
           />
          ) : showTeams ? (
            selectedTeam ? (
              <div>
                <button className="back-button" onClick={handleBackFromMembers}>Back to Teams</button>
                <h2>{selectedTeam.teamName} Members</h2>
                <table className="ngo-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                          No members in this team
                        </td>
                      </tr>
                    ) : (
                      teamMembers.map((member, idx) => (
                        <tr key={idx}>
                          <td>{member.userName}</td>
                          <td>{member.role}</td>
                          <td>{member.phoneNo}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <h2>Your Rescue Teams</h2>
                <table className="ngo-table">
                  <thead>
                    <tr>
                      <th>Team Name</th>
                      <th>Team Lead</th>
                      <th>Zone</th>
                      <th>Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                          No teams available
                        </td>
                      </tr>
                    ) : (
                      teams.map((team, index) => (
                        <tr key={index}>
                          <td>{team.teamName}</td>
                          <td>{team.teamLead}</td>
                          <td>{team.zone}</td>
                          <td>
                            <button onClick={() => handleTeamClick(team)}>
                              View Members
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            null
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Rescue Team</h2>
            <input name="teamName" placeholder="Team Name" onChange={handleInputChange} />
            <input name="teamLead" placeholder="Team Lead" onChange={handleInputChange} />
            <input name="zone" placeholder="Zone" onChange={handleInputChange} />
            <button onClick={handleCreateTeam}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoDashboard;
