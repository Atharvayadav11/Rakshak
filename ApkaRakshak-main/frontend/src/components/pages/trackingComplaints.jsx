import React, { useState, useEffect } from 'react';
import { MapPin, ThumbsUp, ThumbsDown, Calendar, Clock, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import Navbar from '../shared/Navbar';

const getIncidentLevelColor = (level) => {
  switch (level) {
    case 'Low Priority': return 'bg-yellow-500';
    case 'Medium Priority': return 'bg-orange-500';
    case 'High Priority': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const ComplaintDetailsPage = () => {
  const [searchId, setSearchId] = useState('');
  const [allComplaints, setAllComplaints] = useState([]);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/complaints');
        if (!response.ok) {
          throw new Error('Failed to fetch complaints');
        }
        const data = await response.json();
        setAllComplaints(data);
      } catch (err) {
        setError('Failed to load complaints. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setError(null);
    const found = allComplaints.find(c => c._id === searchId);
    if (found) {
      setComplaint(found);
    } else {
      setError('Complaint not found. Please check the ID and try again.');
      setComplaint(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading complaints...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter Complaint ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-grow border border-gray-300 rounded p-2"
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </form>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {complaint && (
          <div className="border rounded shadow p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">{complaint.category}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{new Date(complaint.time).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {complaint.isVerified ? (
                  <span className="flex items-center text-green-500">
                    <CheckCircle size={20} className="mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-500">
                    <AlertTriangle size={20} className="mr-1" />
                    Unverified
                  </span>
                )}
                <div className={`${getIncidentLevelColor(complaint.geminiAnalysis.incidentLevel)} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                  {complaint.geminiAnalysis.incidentLevel || 'Unknown Priority'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Details</h3>
              <p>{complaint.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <MapPin className="w-4 h-4" />
                <span>Latitude: {complaint.location.latitude}, Longitude: {complaint.location.longitude}</span>
              </div>
              {complaint.image && (
                <div className="flex items-center space-x-2 mt-2">
                  {/* Assuming complaint.image is a URL */}
                  <img src={complaint.image} alt="Complaint" className="w-full h-auto rounded" />
                </div>
              )}
            </div>

            {/* User Info */}
            {!complaint.anonymous ? (
              <div className="mt-4 flex items-center space-x-4">
                {/* Display user email or name */}
                <span>{complaint.userDetailss.userEmail}</span>
              </div>
            ) : (
              <div className="mt-4 flex items-center space-x-2 text-gray-500">
                <AlertTriangle className="w-4 h-4" />
                <span>Anonymous Complaint</span>
              </div>
            )}

            {/* Upvote and Downvote Buttons */}
            <div className="flex justify-between items-center pt-4">
              <button className="bg-gray-200 rounded px-3 py-1 flex items-center space-x-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{complaint.upvotes}</span>
              </button>
              <button className="bg-gray-200 rounded px-3 py-1 flex items-center space-x-2">
                <ThumbsDown className="w-4 h-4" />
                <span>{complaint.downvotes}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;