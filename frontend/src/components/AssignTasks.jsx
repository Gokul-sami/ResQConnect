import { useState } from 'react';
import axios from 'axios';
import '../components/assignTasks.css';

const AssignTasks = ({ channels, channelsLoading, teams }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [assignModal, setAssignModal] = useState({ open: false, request: null });
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState('');
  const [assigningTeamId, setAssigningTeamId] = useState('');

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
    setRequestsLoading(true);
    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/get_requests/${channel.channelId}`)
      .then((response) => {
        setRequests(response.data);
        setRequestsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch requests:", error);
        setRequestsLoading(false);
      });
  };

  const handleBackToChannels = () => {
    setSelectedChannel(null);
    setRequests([]);
  };

  const handleAssignClick = (request) => {
    setAssignModal({ open: true, request });
    setAssignSuccess('');
    setAssigningTeamId('');
  };

  const handleAssignRequest = (teamId) => {
    setAssigningTeamId(teamId);
    setAssignLoading(true);
    axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/assign_request/${assignModal.request.requestId}/${teamId}`)
      .then(() => {
        setAssignSuccess('Request assigned successfully!');
        setAssignLoading(false);
      })
      .catch((error) => {
        setAssignSuccess('Failed to assign request.');
        setAssignLoading(false);
      });
  };

  const closeAssignModal = () => {
    setAssignModal({ open: false, request: null });
    setAssignSuccess('');
    setAssigningTeamId('');
  };

  if (selectedChannel) {
    // Show requests view
    return (
      <div className="assign-tasks-container">
        <div className="req-header">
          <button className="back-button" onClick={handleBackToChannels}>
            Back to Channels
          </button>
          <h2>{selectedChannel.channelName}</h2>
        </div>
        <div className="message-reqs">
          {requestsLoading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <div className="no-channels-box">
              <p>No requests available</p>
            </div>
          ) : requests.filter(req => req.teamId === 0).length > 0 ? (
            <ul className="request-list">
              {requests
                .filter(req => req.teamId === 0)
                .map((req, index) => (
                  <li key={index}>
                    <div className="req-info">
                      <strong>{req.requesterName} - {req.category}</strong>
                      <p>{new Date(req.createdAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}</p>
                    </div>
                    <p>Location: {req.address}</p>
                    <div className="req-info">
                      <p>Description: {req.description}</p>
                      <p className='req-status'>Status: {req.status}</p>
                    </div>
                    <button
                      className="assign-btn"
                      onClick={() => handleAssignClick(req)}
                    >
                      Assign
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <div className="no-channels-box">
              <p>No unassigned requests in this channel</p>
            </div>
          )}
        </div>

        {/* Assign Modal/Card */}
        {assignModal.open && (
          <div className="assign-modal-overlay">
            <div className="assign-modal-card">
              <h3>Assign Request</h3>
              <p><strong>Request:</strong> {assignModal.request.requesterName} - {assignModal.request.category}</p>
              <div style={{ margin: '18px 0' }}>
                {(Array.isArray(teams) ? teams : []).map(team => (
                  <div key={team.teamId || team.id} className="team-assign-row">
                    <span>
                      <strong>{team.teamName || 'Unnamed Team'}</strong> ({team.zone || 'No Zone'})
                    </span>
                    <button
                      className="assign-btn"
                      style={{ marginLeft: '12px' }}
                      onClick={() => handleAssignRequest(team.teamId || team.id)}
                      disabled={assignLoading && assigningTeamId === (team.teamId || team.id)}
                    >
                      {assignLoading && assigningTeamId === (team.teamId || team.id) ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="close-btn"
                onClick={closeAssignModal}
                style={{ marginTop: '10px' }}
              >
                Cancel
              </button>
              {assignSuccess && (
                <p style={{ color: assignSuccess.includes('success') ? 'green' : 'red', marginTop: '10px' }}>
                  {assignSuccess}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show channels view
  return (
    <div className="assign-tasks-container">
      <h2 className="section-title">Available Channels</h2>
      {channelsLoading ? (
        <p>Loading channels...</p>
      ) : (
        <ul>
          {channels.length > 0 ? (
            channels
              .filter(channel => channel.status === 'active')
              .map((channel, index) => (
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
                          alt={`${channel.channelName} crisis`}
                          width="100"
                        />
                      )}
                      <div className="channel-meta">
                        <strong>{channel.channelName}</strong>
                        <p>Type: {channel.disasterType} | Zone: {channel.zone}</p>
                      </div>
                    </div>
                    <div className="channel-info-right">
                      <button
                        onClick={() => handleChannelClick(channel)}
                        className="view-details-btn"
                      >
                        View Requests
                      </button>
                    </div>
                  </div>
                </li>
              ))
          ) : (
            <div className="no-channels-box">
              <p>No channels available</p>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default AssignTasks;
