import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { auth } from "../../../firebase";


// Police station data (you can also import this from a separate file if needed)
const policeStations = [
  {
      "name": "Bandra Police Station",
      "latitude": 19.0559589,
      "longitude": 72.8357172
  },
  {
    "name": "Bhayandar Police Station",
      "latitude": 19.3010 ,
      "longitude": 72.8466
  },
  {
      "name": "Khar Police Station",
      "latitude": 19.0640370,
      "longitude": 72.8371137
  },
  {
      "name": "Aarey Police Station",
      "latitude": 19.1664849,
      "longitude": 72.8543819
  },
  {
      "name": "Goregaon (E) Police Station",
      "latitude": 19.1558742,
      "longitude": 72.8576756
  },
  {
      "name": "Police Commissioner Office",
      "latitude": 19.1960801,
      "longitude": 72.9811271
  },
  {
      "name": "Vartak Nagar Police Station",
      "latitude": 19.2131355,
      "longitude": 72.9627611
  },
  {
      "name": "D Mart Police Station",
      "latitude": 19.0990752,
      "longitude": 73.0051825
  },
  {
      "name": "Vishnunagar Police Station",
      "latitude": 19.2192494,
      "longitude": 73.0867512
  },
  {
      "name": "Police Station, Thakur Village",
      "latitude": 19.2059514,
      "longitude": 72.8729038
  },
  {
      "name": "Dindoshi Police station",
      "latitude": 19.1789489,
      "longitude": 72.8577333
  },
  {
      "name": "Gokuldham Police Station",
      "latitude": 19.1755909,
      "longitude": 72.8676526
  },
  {
      "name": "Tilak Nagar Police Station",
      "latitude": 19.0652856,
      "longitude": 72.8959976
  },
  {
      "name": "VB Nagar Police Station",
      "latitude": 19.0717172,
      "longitude": 72.8842275
  },
  {
      "name": "POLICE STATION",
      "latitude": 19.0537000,
      "longitude": 72.9357000
  },
  {
      "name": "Tembhipada Police Chowki",
      "latitude": 19.1548902,
      "longitude": 72.9291114
  },
  {
      "name": "chembur police station",
      "latitude": 19.0639495,
      "longitude": 72.9008254
  },
  {
      "name": "Govandi Police station",
      "latitude": 19.0595211,
      "longitude": 72.9116651
  },
  {
      "name": "Lallubhai Police Station",
      "latitude": 19.0528478,
      "longitude": 72.9270997
  },
  {
      "name": "gaikwaad nagar police station",
      "latitude": 19.0603518,
      "longitude": 72.9104397
  },
  {
      "name": "WAGLE POLICE STATION",
      "latitude": 19.2031874,
      "longitude": 72.9550994
  },
  {
      "name": "Nehru Nagar Kurla E Police Chowky",
      "latitude": 19.0650661,
      "longitude": 72.8808749
  },
  {
      "name": "Khardev Nagar Police Station",
      "latitude": 19.0557429,
      "longitude": 72.9088297
  },
  {
      "name": "Vikhroli Police Station",
      "latitude": 19.1187189,
      "longitude": 72.9373252
  },
  {
      "name": "Chheda Nagar Police Station",
      "latitude": 19.0672141,
      "longitude": 72.9031566
  },
  {
      "name": "Police Station",
      "latitude": 19.2573838,
      "longitude": 72.8650937
  },
  {
      "name": "Navghar Marg Police Station",
      "latitude": 19.1695498,
      "longitude": 72.9591762
  },
  {
      "name": "Lokmanya Tilak Road Police Station",
      "latitude": 19.1715356,
      "longitude": 72.9566691
  },
  {
      "name": "Shil Mhape Police Chouki",
      "latitude": 19.1147228,
      "longitude": 73.0343208
  },
  {
      "name": "Shil Daighar Police Station",
      "latitude": 19.1428227,
      "longitude": 73.0461170
  },
  {
      "name": "Rabale Police Station",
      "latitude": 19.1463017,
      "longitude": 73.0009279
  },
  {
      "name": "Kandivali Police Station",
      "latitude": 19.2095830,
      "longitude": 72.8501404
  },
  {
      "name": "BKC Police Station",
      "latitude": 19.0645147,
      "longitude": 72.8603409
  },
  {
      "name": "Samatanagar Police Station",
      "latitude": 19.1998393,
      "longitude": 72.8614152
  },
  {
      "name": "Traffic Police Chowky",
      "latitude": 19.1639760,
      "longitude": 72.9374814
  },
  {
      "name": "Malad Police Station",
      "latitude": 19.1834974,
      "longitude": 72.8445059
  },
  {
      "name": "Chitalsar Police Station",
      "latitude": 19.2313943,
      "longitude": 72.9762793
  },
  {
      "name": "Ramnagar Police Station",
      "latitude": 19.2166065,
      "longitude": 73.0861813
  },
  {
      "name": "Vishnu Nagar Police Station",
      "latitude": 19.2190690,
      "longitude": 73.0868311
  },
  {
      "name": "Kasarvadavali Police Station",
      "latitude": 19.2590592,
      "longitude": 72.9669954
  },
  {
      "name": "Juhu Police Station",
      "latitude": 19.1031659,
      "longitude": 72.8327116
  },
  {
      "name": "Anti Corruption Bureau Thane",
      "latitude": 19.2059644,
      "longitude": 72.9826331
  },
  {
      "name": "Shivaji Nagar Police Station",
      "latitude": 19.0610696,
      "longitude": 72.8433137
  }
]

const categories = [
  { value: 'theft', label: 'Theft' },
  { value: 'burglary', label: 'Burglary' },
  { value: 'assault', label: 'Assault' },
  { value: 'fraud', label: 'Fraud' },
  { value: 'vandalism', label: 'Vandalism' },
  { value: 'drug_offense', label: 'Drug Offense' },
  { value: 'homicide', label: 'Homicide' },
  { value: 'domestic_violence', label: 'Domestic Violence' },
  { value: 'missing_person', label: 'Missing Person' },
  { value: 'traffic_violation', label: 'Traffic Violation' },
  { value: 'public_disturbance', label: 'Public Disturbance' },
  { value: 'sexual_assault', label: 'Sexual Assault' },
  { value: 'others', label: 'Others' },
];

// Haversine formula to calculate distance between two lat/lon points
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};



const ComplaintForm = () => {
  const [nearestStation, setNearestStation] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    anonymous: false,
    image: null,
    location: null,
    
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUserData = async (uid) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/users/${uid}`);
      setUserDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserData(user.uid);
      } else {
        console.log("No user logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setFormData(prev => ({ ...prev, location: userLocation }));
  
          // Find the nearest police station
          const nearestStation = policeStations.reduce((prev, curr) => {
            const prevDistance = haversineDistance(userLocation, {
              latitude: prev.latitude,
              longitude: prev.longitude
            });
            const currDistance = haversineDistance(userLocation, {
              latitude: curr.latitude,
              longitude: curr.longitude
            });
            return (currDistance < prevDistance) ? curr : prev;
          });
          setNearestStation(nearestStation);
  
          console.log("Your location:", userLocation);
          console.log("Nearest police station:", nearestStation);
          
     
        },
        (error) => {
          console.error("Error getting location:", error);
          showToast("Unable to get your location. Please ensure location services are enabled.", "error");
        }
      );
    } else {
      showToast("Your browser doesn't support geolocation.", "error");
    }
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    for (const key in formData) {
      if (key === 'location') {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    if (userDetails && userDetails.email) {
      data.append('userEmail', userDetails.email);
    }

      // Include nearest station in the form data
    if (nearestStation) {
       data.append('nearestStation', JSON.stringify(nearestStation));
     }

    try {
      const response = await axios.post('http://localhost:3001/api/complaints', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      showToast("Your complaint has been successfully registered.", "success");
      window.alert(`Your complaint has been sent to the nearest police station: ${nearestStation.name}`);

      setFormData({
        category: '',
        description: '',
        anonymous: false,
        image: null,
        location: formData.location,
      });
    } catch (err) {
      console.error('Error submitting complaint:', err.response ? err.response.data : err.message);
      showToast("There was an error submitting your complaint. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className='flex items-center justify-center max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <form onSubmit={submitHandler} className='w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md'>
          <h1 className='font-bold text-2xl text-center text-gray-900'>Register a Complaint</h1>
          
          <div>
            <Label htmlFor="category" className='block text-sm font-medium text-gray-700'>Select the Category:</Label>
            <Select onValueChange={handleSelect} value={formData.category}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className='block text-sm font-medium text-gray-700'>Description:</Label>
            <Input 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm'
              placeholder="Provide details about the incident"
            />
          </div>

          <div>
            <Label htmlFor="image" className='block text-sm font-medium text-gray-700'>Upload an Image:</Label>
            <Input 
              id="image"
              type="file"
              name="image"
              onChange={handleFileChange}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm'
              accept="image/*"
            />
          </div>

          <div className="flex items-center">
            <RadioGroup className='flex items-center space-x-2'>
              <div className='flex items-center'>
                <RadioGroupItem
                  id="anonymous"
                  name="anonymous"
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: checked })) }
                />
                <Label htmlFor="anonymous" className='ml-2 block text-sm text-gray-900'>Post this complaint anonymously?</Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
