import React, { useState, useEffect, useMemo } from 'react';
import '../styles/home.css';
import '../styles/volunteer-features.css';
import CreateChannelModal from '../../components/CreateChannelModal.jsx';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getCookie, removeCookie } from '../../../utils/cookieUtils.js';
 
function Home() {
  const [channels, setChannels] = useState([]);
  const [activeTab, setActiveTab] = useState('On-going channels');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [teamDetails, setTeamDetails] = useState(null);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [bellShake, setBellShake] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    setBellShake(false);
  }, []);
  
  useEffect(() => {
    if (isVolunteerOrRescue()) {
      fetchAssignedRequests();
      setShowRequestsModal(true);
    }
  }, []);

  const session = JSON.parse(getCookie("userSession") || "{}");
  const userId = session.userId;
  const userRole = session.role;
  const teamId = session.teamId;
 
  const handleCreate = (channelData) => {
    setChannels([...channels, channelData]);
  };
 
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/get_all_channels`)
      .then((response) => {
        setChannels(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch channels:", error.response?.data || error.message);
        setLoading(false);
      });
  }, []);
 
  const filteredActiveChannels = useMemo(() => channels.filter(channel => channel.status === 'active'), [channels]);
  const filteredPastChannels = useMemo(() => channels.filter(channel => channel.status === 'inactive'), [channels]);
 
  const isVolunteerOrRescue = () => {
    return userRole === 'volunteer' || userRole === 'rescueMember';
  };
 
  const fetchTeamDetails = async () => {
    setTeamLoading(true);
    try {
      if (!teamId) {
        setTeamDetails(null);
        setTeamLoading(false);
        return;
      }
 
      const teamsResponse = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/rescue_team/all`);
      const allTeams = teamsResponse.data;
 
      const usersResponse = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/users/by_team/${teamId}`);
      const members = usersResponse.data;
 
      const matchingTeam = allTeams.find(team => team.teamId === teamId);
 
      if (matchingTeam) {
        setTeamDetails({ ...matchingTeam, members, memberCount: members.length });
      } else {
        setTeamDetails(null);
      }
    } catch (error) {
      console.error("Failed to fetch team details:", error);
      setTeamDetails(null);
    } finally {
      setTeamLoading(false);
    }
  };
 
  const fetchAssignedRequests = async () => {
    setRequestsLoading(true);
    try {
      const allRequestsResponse = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/get_all_requests`);
      const allRequests = allRequestsResponse.data;
 
      const assignedTeamRequests = allRequests.filter(request =>
        request.teamId === teamId
      );
 
      setAssignedRequests(assignedTeamRequests);
    } catch (error) {
      console.error("Failed to fetch assigned requests:", error);
      setAssignedRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };
 
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/update_request_status`, null, {
        params: {
          requestId,
          status: newStatus
        }
      });
 
      setAssignedRequests(prevRequests =>
        prevRequests.map(req =>
          req.requestId === requestId ? { ...req, status: newStatus } : req
        )
      );
 
      setOpenDropdown(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status. Please try again.");
    }
  };
 
  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };
 
  const handleMyTeamClick = () => {
    fetchTeamDetails();
    setShowTeamModal(true);
  };
 
  const handleAssignedRequestsClick = () => {
    fetchAssignedRequests();
    setShowRequestsModal(true);
  };
 
  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" width={30} height={30} alt="ResQConnect Logo" />
          <h2>ResQConnect</h2>
        </div>
 
        <ul>
          <li className={activeTab === 'On-going channels' ? 'active' : ''} onClick={() => setActiveTab('On-going channels')}>On-going channels</li>
          <li className={activeTab === 'Past channels' ? 'active' : ''} onClick={() => setActiveTab('Past channels')}>Past channels</li>
          <li className={activeTab === 'Helpline' ? 'active' : ''} onClick={() => setActiveTab('Helpline')}>Helpline</li>
          {isVolunteerOrRescue() && (
            <li className="my-team-button" onClick={handleMyTeamClick}>My Team</li>
          )}
        </ul>
 
        <button className="create-channel" onClick={() => setShowModal(true)}>Create Channel</button>
        <button className="logout-button" onClick={() => {
          removeCookie("userSession");
            navigate("/");
          }}>Logout</button>
          </div>

          <div className="home-content">
          {isVolunteerOrRescue() && (
            <div className={`notification-bell ${assignedRequests.length > 0 ? 'shake' : ''}`} onClick={handleAssignedRequestsClick}>
            <span className="bell-icon">🔔</span>
            <span className="notification-count">{assignedRequests.length || 0}</span>
            </div>
          )}

          {activeTab === 'On-going channels' && (
            <div className="message">
            <h2 className="section-title">🚨 On-going Channels</h2>
            {loading ? (
              <p>Loading channels...</p>
            ) : (
              filteredActiveChannels.length > 0 ? (
              <ul>
                {filteredActiveChannels.map((channel, index) => (
                <li key={index} className="fade-in">
                  <div className="channel-details">
                  <div className="channel-info-left">
                    {channel.imageUrl && (
                    <img
                      src={
                      channel.imageUrl.startsWith("data:image")
                        ? channel.imageUrl
                        : `data:image/jpeg;base64,${channel.imageUrl}`
                      }
                      alt="crisis"
                      width="100"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEnlargedImage(
                      channel.imageUrl.startsWith("data:image")
                        ? channel.imageUrl
                        : `data:image/jpeg;base64,${channel.imageUrl}`
                      )}
                    />
                    )}
                    <div className="channel-meta">
                    <strong>{channel.channelName}</strong>
                    <p>Type: {channel.disasterType} | Zone: {channel.zone}</p>
                    <p>{new Date(channel.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="channel-info-right">
                    <Link
                    to={`/channel/${channel.channelId}/requests`}
                    state={{ userId, channelName: channel.channelName }}
                    >
                    <button>View Details</button>
                    </Link>
                  </div>
                  </div>
                </li>
                ))}
              </ul>
              ) : (
              <div className="no-channels-box">
                <p>No active channels</p>
              </div>
              )
            )}
            </div>
          )}

          {activeTab === 'Past channels' && (
            <div className="message">
            <h2 className="section-title">📁 Past Channels</h2>
            {loading ? (
              <p>Loading channels...</p>
            ) : (
              filteredPastChannels.length > 0 ? (
              <ul>
                {filteredPastChannels.map((channel, index) => (
                <li key={index} className="fade-in">
                  <div className="channel-details">
                  <div className="channel-info-left">
                    {channel.imageUrl && (
                    <img
                      src={
                      channel.imageUrl.startsWith("data:image")
                        ? channel.imageUrl
                        : `data:image/jpeg;base64,${channel.imageUrl}`
                      }
                      alt="crisis"
                      width="100"
                      style={{ cursor: "pointer" }}
                      onClick={() => setEnlargedImage(
                      channel.imageUrl.startsWith("data:image")
                        ? channel.imageUrl
                        : `data:image/jpeg;base64,${channel.imageUrl}`
                      )}
                    />
                    )}
                    <div className="channel-meta">
                    <strong>{channel.channelName}</strong>
                    <p>Type: {channel.disasterType} | Zone: {channel.zone}</p>
                    <p>{new Date(channel.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="channel-info-right">
                    <Link
                    to={`/channel/${channel.channelId}/requests`}
                    state={{ userId, channelName: channel.channelName }}
                    >
                    <button>View Details</button>
                    </Link>
                  </div>
                  </div>
                </li>
                ))}
              </ul>
              ) : (
              <div className="no-channels-box">
                <p>No past channels</p>
              </div>
              )
            )}
            </div>
          )}

          {activeTab === 'Helpline' && (
            <div className="message">
            <div className="helpline-section">
              <h3>📞 Emergency Helpline Numbers</h3>
              <ul className="helpline-list">
              <li><strong>National Emergency Number:</strong> <a href="tel:112">112</a></li>
              <li><strong>Police:</strong> <a href="tel:100">100</a></li>
              <li><strong>Fire:</strong> <a href="tel:101">101</a></li>
              <li><strong>Ambulance:</strong> <a href="tel:102">102</a></li>
              <li><strong>Disaster Management Services:</strong> <a href="tel:108">108</a></li>
              <li><strong>Child Helpline:</strong> <a href="tel:1098">1098</a></li>
              <li><strong>Women Helpline:</strong> <a href="tel:1091">1091</a></li>
              <li><strong>Senior Citizen Helpline:</strong> <a href="tel:14567">14567</a></li>
              <li><strong>Electricity Emergency:</strong> <a href="tel:1912">1912</a></li>
              <li><strong>Flood Relief (State-specific):</strong> <a href="tel:1070">1070</a> / <a href="tel:1077">1077</a></li>
              </ul>
            </div>
            </div>
          )}
          </div>

          {showModal && (
          <CreateChannelModal
            onClose={() => setShowModal(false)}
            onCreate={handleCreate}
          />
          )}

      {showTeamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>My Rescue Team</h3>
              <button className="close-button" onClick={() => setShowTeamModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {teamLoading ? (
                <p>Loading team details...</p>
              ) : teamDetails ? (
                <div className="team-details">
                  <h4>{teamDetails.teamName}</h4>
                  <p><strong>Team Lead:</strong> {teamDetails.teamLead}</p>
                  <p><strong>Zone:</strong> {teamDetails.zone}</p>
                  <p><strong>Members:</strong> {teamDetails.memberCount}</p>
                 
                  <div className="team-members">
                    <h5>Team Members:</h5>
                    <ul>
                      {teamDetails.members && teamDetails.members.map((member, index) => (
                        <li key={index}>{member.userName} - {member.phoneNo}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="no-assignment">
                  <p>You are not assigned to any team</p>
                  <small>Contact your administrator to get assigned to a rescue team</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
 
      {/* Assigned Requests Modal */}
      {showRequestsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Assigned Requests</h3>
              <button className="close-button" onClick={() => setShowRequestsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {requestsLoading ? (
                <p>Loading assigned requests...</p>
              ) : assignedRequests.length > 0 ? (
                <div>
                  {assignedRequests.map((request, index) => (
                    <div key={index} className="request-item">
                      <h5>{request.category}</h5>
                      <p><strong>Requester Name:</strong> {request.requesterName}</p>
                      <p><strong>Location:</strong> {request.address}</p>
                      <p><strong>Description:</strong> {request.description}</p>
                      <p><strong>Status:</strong> {request.status}</p>
                      <p><strong>Created at:</strong> {request.createdAt}</p>
                     
                      <div className="status-dropdown-container">
                        <button
                          className="status-button"
                          onClick={() => toggleDropdown(index)}
                        >
                          Update Status ▼
                        </button>
                       
                        {openDropdown === index && (
                          <div className="dropdown-menu">
                            <button
                              className="dropdown-item"
                              onClick={() => handleStatusUpdate(request.requestId, 'taken')}
                            >
                              Taken
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={() => handleStatusUpdate(request.requestId, 'in progress')}
                            >
                              In Progress
                            </button>
                            <button
                              className="dropdown-item"
                              onClick={() => handleStatusUpdate(request.requestId, 'completed')}
                            >
                              Completed
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-assignment">
                  <p>No assigned requests</p>
                  <small>You don't have any active requests assigned to you</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
export default Home;
