import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../styles/adminDashboard.css";
import { removeCookie } from "../../../utils/cookieUtils.js";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [channels, setChannels] = useState([]);
    const [filteredChannels, setFilteredChannels] = useState([]);
    const [locationFilter, setLocationFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
    const [activeSection, setActiveSection] = useState("channels");
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChannelsAndUsers = async () => {
            try {
                setLoading(true);
                const channelsRes = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/getAllChannels`);
                const usersRes = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}/get_all_users`);
                const users = usersRes.data;

                const userIdToName = {};
                users.forEach(user => {
                    userIdToName[user.userId] = user.userName;
                });
                console.log("Fetched: ",userIdToName);

                const createdChannels = channelsRes.data
                    .filter((ch) => ch.status && ch.status.toLowerCase() === "created")
                    .map((ch) => ({
                        ...ch,
                        owner: userIdToName[ch.userId] || "N/A"
                    }));

                setChannels(createdChannels);
                setFilteredChannels(createdChannels);
                calculateStats(channelsRes.data);
            } catch (err) {
                setError("Failed to fetch channels or users. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchChannelsAndUsers();
    }, []);

    const calculateStats = (allChannels) => {
        const stats = {
            total: allChannels.length,
            approved: allChannels.filter(ch => ch.status?.toLowerCase() === "approved").length,
            pending: allChannels.filter(ch => ch.status?.toLowerCase() === "created").length
        };
        setStats(stats);
    };

    const uniqueLocations = useMemo(() =>
        [...new Set(channels.map((ch) => ch.zone).filter(Boolean))],
        [channels]
    );

    const uniqueCategories = useMemo(() =>
        [...new Set(channels.map((ch) => ch.disasterType).filter(Boolean))],
        [channels]
    );

    useEffect(() => {
        let filtered = [...channels];

        if (locationFilter) {
            filtered = filtered.filter(
                (ch) => ch.zone?.toLowerCase() === locationFilter.toLowerCase()
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(
                (ch) => ch.disasterType?.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (ch) =>
                    ch.owner?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        setFilteredChannels(filtered);
    }, [locationFilter, categoryFilter, searchTerm, channels, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const approveChannel = async (channelId) => {
        setChannels(prev => prev.filter(ch => ch.channelId !== channelId));
        try {
            await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}/approve_channel/${channelId}`);
            const notification = document.createElement('div');
            notification.className = 'admin-notification success';
            notification.textContent = 'Channel approved successfully!';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } catch (err) {
            setChannels(prev => [...prev, channels.find(ch => ch.channelId === channelId)]);
            const notification = document.createElement('div');
            notification.className = 'admin-notification error';
            notification.textContent = 'Failed to approve channel. Please try again.';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const hasImage = (channel) => {
        return channel.imageUrl && channel.imageUrl.trim() !== '';
    };

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);
    };

    if (loading) {
        return (
            <div className="admin-ngo-container">
                <div className="admin-ngo-header">Dashboard</div>
                <div className="admin-ngo-body">
                    <div className="admin-ngo-main">
                        <div className="admin-loading-container">
                            <div className="admin-loading-spinner"></div>
                            <p>Loading channels...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-ngo-container">
                <div className="admin-ngo-header">Admin Dashboard</div>
                <div className="admin-ngo-body">
                    <div className="admin-ngo-main">
                        <div className="admin-error-container">
                            <div className="admin-error-message">
                                <h3>Error</h3>
                                <p>{error}</p>
                                <button onClick={() => window.location.reload()} className="admin-retry-button">
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-ngo-container">
            <div className="admin-ngo-header">Admin Dashboard</div>
            <div className="admin-ngo-body">
                <div className="admin-ngo-sidebar">
                    <button
                        onClick={() => setActiveSection("analytics")}
                        className={activeSection === "analytics" ? "admin-active" : ""}
                        style={{ marginTop: "1rem" }}
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveSection("channels")}
                        className={activeSection === "channels" ? "admin-active" : ""}
                        style={{ marginTop: "0.5rem" }}
                    >
                        Channel Management
                    </button>
                    <button
                        id="admin-logout-btn"
                        // style={{ marginTop: "auto" }}
                        onClick={() => {
                            removeCookie("adminSession");
                            navigate('/admin');
                        }}
                    >
                        Logout
                    </button>
                </div>
                <div className="admin-ngo-main">
                    {activeSection === "analytics" && (
                        <section className="admin-analytics-section">
                            <h2>Analytics</h2>
                            <div className="admin-stats-grid">
                                <div className="admin-stat-card">
                                    <h3>{stats.total}</h3>
                                    <p>Total Channels</p>
                                </div>
                                <div className="admin-stat-card">
                                    <h3>{stats.pending}</h3>
                                    <p>Pending Approval</p>
                                </div>
                                <div className="admin-stat-card">
                                    <h3>{stats.total - stats.pending}</h3>
                                    <p>Approved</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "channels" && (
                        <section className="admin-channels-section">
                            <h2>Channel Management</h2>
                            <div className="admin-filters-section">
                                <div className="admin-filter-group">
                                    <label>Search:</label>
                                    <input
                                        type="text"
                                        placeholder="Search by Creator name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="admin-search-input"
                                    />
                                </div>
                                <div className="admin-filter-group">
                                    <label>Location:</label>
                                    <select
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        className="admin-filter-select"
                                    >
                                        <option value="">All Locations</option>
                                        {uniqueLocations.map((zone) => (
                                            <option key={zone} value={zone}>
                                                {zone}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="admin-filter-group">
                                    <label>Category:</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        className="admin-filter-select"
                                    >
                                        <option value="">All Categories</option>
                                        {uniqueCategories.map((disasterType) => (
                                            <option key={disasterType} value={disasterType}>
                                                {disasterType}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => {
                                        setLocationFilter("");
                                        setCategoryFilter("");
                                        setSearchTerm("");
                                    }}
                                    className="admin-clear-filters-btn"
                                    style={{ marginLeft: '1rem' }}
                                >
                                    Clear Filters
                                </button>
                            </div>

                            <div className="admin-results-summary">
                                <p>
                                    Showing {filteredChannels.length} of {channels.length} channels
                                </p>
                            </div>

                            <div className="admin-table-container">
                                <table className="admin-ngo-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort('name')} className="admin-sortable">
                                                Name
                                            </th>
                                            <th onClick={() => handleSort('zone')} className="admin-sortable">
                                                Zone {sortConfig.key === 'zone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th onClick={() => handleSort('category')} className="admin-sortable">
                                                Category
                                            </th>
                                            <th onClick={() => handleSort('date')} className="admin-sortable">
                                                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th onClick={() => handleSort('owner')} className="admin-sortable">
                                                Owner
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredChannels.length > 0 ? (
                                            filteredChannels.map((ch) => (
                                                <tr key={ch.id}>
                                                    <td>
                                                        <div className="admin-channel-name">
                                                            <span>{ch.channelName}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="admin-zone-badge">{ch.zone || 'N/A'}</span>
                                                    </td>
                                                    <td>
                                                        <span className="admin-category-badge">{ch.disasterType || 'N/A'}</span>
                                                    </td>
                                                    <td>{formatDate(ch.createdAt)}</td>
                                                    <td>{ch.owner || 'N/A'}</td>
                                            <td>
                                                <div className="admin-action-buttons">
                                                    {hasImage(ch) && (
                                                        <button
                                                            className="admin-view-image-button"
                                                            onClick={() => openImageModal(ch.imageUrl)}
                                                            title="View channel image"
                                                        >
                                                            View Image
                                                        </button>
                                                    )}
                                                    <button
                                                        className="admin-approve-button"
                                                        onClick={() => approveChannel(ch.channelId)}
                                                        title="Approve this channel"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="admin-no-data">
                                                    <div className="admin-no-data-message">
                                                        <p>No channels found matching your criteria</p>
                                                        <button onClick={() => {
                                                            setLocationFilter("");
                                                            setCategoryFilter("");
                                                            setSearchTerm("");
                                                        }} className="admin-clear-filters-btn">
                                                            Clear all filters
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {showImageModal && selectedImage && (
                <div className="admin-image-modal-overlay" onClick={closeImageModal}>
                    <div className="admin-image-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-image-modal-header">
                            <h3>Channel Image</h3>
                            <button className="admin-modal-close-btn" onClick={closeImageModal}>
                                ×
                            </button>
                        </div>
                        <div className="admin-image-modal-content">
                            <img 
                                src={selectedImage} 
                                alt="Channel" 
                                className="admin-modal-image"
                                onError={(e) => {
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNjBDMTEzLjMgNjAgMTI0IDcwLjcgMTI0IDg0QzEyNCA5Ny4zIDExMy4zIDEwOCAxMDAgMTA4Qzg2LjcgMTA4IDc2IDk3LjMgNzYgODRDNzYgNzAuNyA4Ni43IDYwIDEwMCA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTkwIDEyMEgxMTBWMTQwSDkwVjEyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
