import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { MapPin, ThumbsUp, ThumbsDown, Calendar, Clock, User, Mail, Camera, AlertTriangle, CheckCircle2, Search ,CheckCircle} from 'lucide-react';
import Navbar from '../shared/Navbar';
const getIncidentLevelColor = (level) => {
  switch (level) {
    case 'Low Priority': return 'bg-yellow-500';
    case 'Medium Priority': return 'bg-orange-500';
    case 'High Priority': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const StatusStepper = ({ currentStatus }) => {
  const steps = ["Submitted", "Verified", "Investigation", "Resolved"];
  const currentStep = steps.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between w-full my-4">
      
    </div>
  );
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
      <Navbar/>
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Enter Complaint ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {complaint && (
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">{complaint.category}</CardTitle>
                <CardDescription>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{new Date(complaint.time).toLocaleTimeString()}</span>
                  </div>
                </CardDescription>
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
          </CardHeader>
          <CardContent>
            <StatusStepper currentStatus={complaint.status || "Submitted"} />
            <Tabs defaultValue="details" className="w-full mt-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="user">User Info</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="space-y-4">
                  <p className="text-lg">{complaint.description}</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Latitude: {complaint.location.latitude}, Longitude: {complaint.location.longitude}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Image: {complaint.image}</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analysis">
                <div className="space-y-2">
                  <p><strong>Image Description:</strong> {complaint.geminiAnalysis.imageDescription}</p>
                  <p><strong>Description Match:</strong> {complaint.geminiAnalysis.descriptionMatch}</p>
                  <p><strong>Additional Details:</strong> {complaint.geminiAnalysis.additionalDetails}</p>
                </div>
              </TabsContent>
              <TabsContent value="user">
                {!complaint.anonymous ? (
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{complaint.userDetailss.userEmail[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{complaint.userDetailss.userEmail}</p>
                      <p className="text-sm text-gray-500">Registered User</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Anonymous Complaint</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between items-center pt-4">
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{complaint.upvotes}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ThumbsDown className="w-4 h-4" />
                <span>{complaint.downvotes}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
    </div>
  );
};

export default ComplaintDetailsPage;