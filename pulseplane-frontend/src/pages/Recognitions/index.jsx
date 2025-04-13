import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getRecognitions, 
  getSentRecognitions, 
  getReceivedRecognitions 
} from '../../apis/employee/recognition';
import { Badge, Button, Card, Tabs, Tab, Alert } from '../../components/ui';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { formatDistance } from 'date-fns';
import { UserIcon, AwardIcon, CheckCircleIcon, PlusIcon } from 'lucide-react';

const RecognitionBadge = ({ type }) => {
  const badgeColors = {
    teamwork: 'bg-blue-100 text-blue-800',
    innovation: 'bg-purple-100 text-purple-800',
    leadership: 'bg-yellow-100 text-yellow-800',
    achievement: 'bg-green-100 text-green-800',
    support: 'bg-teal-100 text-teal-800',
  };

  const labels = {
    teamwork: 'Teamwork',
    innovation: 'Innovation',
    leadership: 'Leadership',
    achievement: 'Achievement',
    support: 'Support',
  };

  return (
    <Badge className={badgeColors[type]}>
      {labels[type]}
    </Badge>
  );
};

const RecognitionCard = ({ recognition }) => {
  const timeAgo = formatDistance(
    new Date(recognition.created_at),
    new Date(),
    { addSuffix: true }
  );

  return (
    <Card className="mb-4 p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
            <UserIcon size={20} />
          </div>
          <div>
            <h3 className="font-semibold">{recognition.sender.first_name} {recognition.sender.last_name}</h3>
            <p className="text-sm text-gray-600">recognized</p>
          </div>
        </div>
        <RecognitionBadge type={recognition.recognition_type} />
      </div>
      
      <div className="flex items-center my-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
          <AwardIcon size={20} />
        </div>
        <div>
          <h3 className="font-semibold">{recognition.recipient.first_name} {recognition.recipient.last_name}</h3>
          <p className="text-sm text-gray-600">{recognition.recipient.department} • {recognition.recipient.position}</p>
        </div>
      </div>
      
      <div className="my-3 bg-gray-50 p-3 rounded-md italic">
        "{recognition.message}"
      </div>
      
      <div className="text-sm text-gray-500 flex justify-between mt-2">
        <span>{timeAgo}</span>
        {recognition.is_public ? (
          <span className="flex items-center text-green-600">
            <CheckCircleIcon size={16} className="mr-1" /> Public
          </span>
        ) : (
          <span className="text-gray-600">Private</span>
        )}
      </div>
    </Card>
  );
};

const RecognitionsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecognitions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data;
        switch(activeTab) {
          case 'sent':
            data = await getSentRecognitions();
            break;
          case 'received':
            data = await getReceivedRecognitions();
            break;
          default:
            data = await getRecognitions();
        }
        setRecognitions(data.data);
      } catch (err) {
        console.error('Failed to fetch recognitions:', err);
        setError('Failed to load recognitions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecognitions();
  }, [activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Peer Recognitions</h1>
          <Button onClick={() => navigate('/recognitions/create')}>
            <PlusIcon size={16} className="mr-2" /> Give Recognition
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <Tab value="all">All Recognitions</Tab>
          <Tab value="received">Received</Tab>
          <Tab value="sent">Sent</Tab>
        </Tabs>

        <div className="mt-6">
          {loading ? (
            <p className="text-center py-10">Loading recognitions...</p>
          ) : error ? (
            <Alert variant="destructive">{error}</Alert>
          ) : recognitions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">No recognitions found.</p>
              {activeTab === 'all' && (
                <Button onClick={() => navigate('/recognitions/create')}>
                  Give your first recognition
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recognitions.map(recognition => (
                <RecognitionCard key={recognition.id} recognition={recognition} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RecognitionsPage; 