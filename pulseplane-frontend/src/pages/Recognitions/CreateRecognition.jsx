import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecognition } from '../../apis/employee/recognition';
import { core_employees_list } from '../../apis/employee'; 
import Layout from '../../components/layout/Layout';
import { 
  Button, 
  Card, 
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Alert,
  AlertTitle,
  AlertDescription 
} from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeftIcon, SendIcon } from 'lucide-react';

const CreateRecognitionPage = () => {
  const [formData, setFormData] = useState({
    recipient: '',
    recognition_type: '',
    message: '',
    is_public: true
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await core_employees_list();
        // Filter out the current user
        const filteredEmployees = response.data.filter(
          employee => employee.id !== user.id
        );
        setEmployees(filteredEmployees);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        setError('Failed to load employees. Please try again later.');
      } finally {
        setFetchingEmployees(false);
      }
    };

    fetchEmployees();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await createRecognition(formData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        recipient: '',
        recognition_type: '',
        message: '',
        is_public: true
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/recognitions');
      }, 2000);
    } catch (err) {
      console.error('Failed to create recognition:', err);
      setError('Failed to send recognition. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const recognitionTypes = [
    { value: 'teamwork', label: 'Excellent Teamwork' },
    { value: 'innovation', label: 'Innovation' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'achievement', label: 'Outstanding Achievement' },
    { value: 'support', label: 'Helpful Support' },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/recognitions')} 
            className="mb-4"
          >
            <ArrowLeftIcon size={16} className="mr-2" /> Back to Recognitions
          </Button>
          <h1 className="text-2xl font-bold">Give Recognition</h1>
          <p className="text-gray-600">
            Recognize your colleagues for their great work and contributions.
          </p>
        </div>

        {success ? (
          <Alert className="bg-green-50 border-green-200 text-green-800 mb-6">
            <AlertTitle className="text-green-800">Recognition Sent!</AlertTitle>
            <AlertDescription>
              Your recognition has been successfully sent. Redirecting to recognitions page...
            </AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card className="p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="recipient">Recognize a Colleague</Label>
              <Select 
                name="recipient"
                value={formData.recipient}
                onValueChange={(value) => handleSelectChange('recipient', value)}
                disabled={fetchingEmployees || loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {fetchingEmployees ? (
                    <SelectItem value="" disabled>Loading employees...</SelectItem>
                  ) : employees.length === 0 ? (
                    <SelectItem value="" disabled>No employees found</SelectItem>
                  ) : (
                    employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.first_name} {employee.last_name} - {employee.position}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="recognition_type">Recognition Type</Label>
              <Select 
                name="recognition_type"
                value={formData.recognition_type}
                onValueChange={(value) => handleSelectChange('recognition_type', value)}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select recognition type" />
                </SelectTrigger>
                <SelectContent>
                  {recognitionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Describe what your colleague did that deserves recognition..."
                rows={4}
                disabled={loading}
                required
                className="w-full"
              />
            </div>
            
            <div className="mb-6 flex items-center">
              <Checkbox
                id="is_public"
                name="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, is_public: checked }))
                }
                disabled={loading}
              />
              <Label htmlFor="is_public" className="ml-2 cursor-pointer">
                Make this recognition visible to everyone
              </Label>
            </div>
            
            <Button 
              type="submit" 
              disabled={
                loading || 
                !formData.recipient || 
                !formData.recognition_type || 
                !formData.message
              }
              className="w-full"
            >
              {loading ? 'Sending...' : (
                <>
                  <SendIcon size={16} className="mr-2" /> Send Recognition
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateRecognitionPage; 