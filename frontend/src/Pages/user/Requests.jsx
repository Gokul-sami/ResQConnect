import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Requests.css';
import CreateRequestForm from '../../components/CreateRequestForm.jsx';
import { getCookie } from '../../../utils/cookieUtils.js';

function Requests() {
  const { id: channelId } = useParams();
  const location = useLocation();
  const channelName = location.state?.channelName;
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('General Requests');
  const [showForm, setShowForm] = useState(false);
  const session = JSON.parse(getCookie("userSession") || "{}");
  const userId = session.userId || null;
  const navigate = useNavigate();
  const [forumChats, setForumChats] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatImage, setChatImage] = useState(null);
  const [forumLoading, setForumLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'Forum' && channelId) {
      setForumLoading(true);
      axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/get_forum_chats/${channelId}`)
        .then(res => {
          setForumChats(res.data);
          setForumLoading(false);
        })
        .catch(err => {
          setForumLoading(false);
          console.error("Failed to fetch forum chats:", err);
        });
    }
  }, [activeTab, channelId]);

  const handleChatInputChange = (e) => setChatInput(e.target.value);

  const handleChatImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setChatImage(reader.result); // base64
      reader.readAsDataURL(file);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput && !chatImage) return;
    const payload = {
      channelId,
      userId,
      name: session.name,
      chatContent: chatInput,
      image: chatImage,
      createdAt: new Date().toISOString(),
    };
    setForumChats(prev => [...prev, { ...payload, userId }]);
    setChatInput('');
    setChatImage(null);
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/create_chat`, payload);
    } catch (err) {
      console.log(err);
    }
  };

  const combinedForumItems = useMemo(() => {
    const allRequests = requests.map(req => ({
      type: 'request',
      id: req.id,
      userId: req.requesterId,
      userName: req.requesterName,
      message: req.description,
      image: req.imageUrl,
      createdAt: req.createdAt,
      category: req.category,
      address: req.address,
      status: req.status,
    }));

    const chats = forumChats.map(chat => ({
      type: 'chat',
      id: chat.id || chat.createdAt,
      userId: chat.userId,
      userName: chat.name,
      message: chat.chatContent,
      image: chat.image,
      createdAt: chat.createdAt,
    }));
    return [...allRequests, ...chats].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [forumChats, requests]);

  useEffect(() => {
    if (activeTab === 'Forum' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [forumChats, activeTab]);

  useEffect(() => {
    if (!channelId) {
      console.error("Channel ID is undefined");
      return;
    }

    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/get_requests/${channelId}`)
      .then(response => setRequests(response.data))
      .catch(error => console.error("Failed to fetch requests:", error));
  }, [channelId]);

  const handleRequestCreated = (newRequest) => {
    axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/get_requests/${channelId}`)
      .then(response => {
        setRequests(response.data);
        setShowForm(false);
      })
      .catch(error => {
        console.error("Failed to fetch requests after creation:", error);
        setRequests([...requests, newRequest]);
        setShowForm(false);
      });
  };

  const filteredRequests = [...requests]
    .filter(req => {
      if (activeTab === 'My Requests') {
        return req.requesterId == userId;
      }
      return true; 
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="app">
      <div className="req-sidebar">
        <h2 className="app-title">ResQConnect</h2>
        <ul>
          <li className={activeTab === 'General Requests' ? 'active' : ''} onClick={() => setActiveTab('General Requests')}>General Requests</li>
          <li className={activeTab === 'My Requests' ? 'active' : ''} onClick={() => setActiveTab('My Requests')}>My Requests</li>
          <li className={activeTab === 'Forum' ? 'active' : ''} onClick={() => setActiveTab('Forum')}>Forum</li>
        </ul>
      </div>

      {activeTab === 'Forum' && (
        <div className="forum-section">
          <div className="req-header">
            <button className="back-button" onClick={() => navigate('/home')}> Go back</button>
            <h2>{channelName}</h2>
            <button className="create-button" onClick={() => setShowForm(true)}>Create Request</button>
          </div>
          <div className="forum-chat-window">
            {forumLoading ? (
              <p>Loading chats...</p>
            ) : (
              combinedForumItems.map((item, idx) => {
                const isOwn = item.userId === userId;
                return (
                  <div
                    key={item.id || idx}
                    className={`forum-chat-bubble ${item.type}${isOwn ? ' own' : ''}`}
                  >
                    <div className="forum-chat-user">{item.userName}</div>
                    {item.message && <div className="forum-chat-message">{item.message}</div>}
                    {/* {item.image && (
                      <img
                        src={item.image.startsWith("data:image") ? item.image : `data:image/jpeg;base64,${item.image}`}
                        alt="chat"
                        className="forum-chat-image"
                        onClick={() => window.open(item.image, "_blank")}
                      />
                    )} */}
                    {item.type === 'request' && (
                      <div className="forum-chat-request-meta">
                        <span>Request: {item.category}, {item.address}</span>
                      </div>
                    )}
                    <div className="forum-chat-timestamp">
                      {new Date(item.createdAt).toLocaleString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>
          <form
            className="forum-chat-input"
            onSubmit={e => {
              e.preventDefault();
              handleSendChat();
            }}
          >
            <input
              type="text"
              value={chatInput}
              onChange={handleChatInputChange}
              placeholder="Type your message..."
              className="forum-chat-text"
            />
            <label className="forum-chat-image-btn">
              <span role="img" aria-label="Upload Image">📷</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleChatImageChange}
                style={{ display: 'none' }}
              />
            </label>
            <button type="submit" className="forum-chat-send-btn">Send</button>
            {chatImage && (
              <div className="forum-chat-image-preview">
                <img
                  src={chatImage}
                  alt="Preview"
                  style={{ maxHeight: '60px', borderRadius: '8px', marginLeft: '10px' }}
                />
                <button
                  type="button"
                  className="forum-chat-remove-image"
                  onClick={() => setChatImage(null)}
                  style={{ marginLeft: '8px', background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1.2rem' }}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {(activeTab === 'General Requests' || activeTab === 'My Requests') && (
        <div className="req-content">
          <div className="req-header">
            <button className="back-button" onClick={() => navigate('/home')}> Go back</button>
            <h2>{channelName}</h2>
            <button className="create-button" onClick={() => setShowForm(true)}>Create Request</button>
          </div>

          {showForm && (
            <CreateRequestForm
              channelId={channelId}
              userId={userId}
              onRequestCreated={handleRequestCreated}
              onCancel={() => setShowForm(false)}
            />
          )}

          <div className="message-reqs">
            <ul className="request-list">
              {filteredRequests.map((req, index) => (
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Requests;
