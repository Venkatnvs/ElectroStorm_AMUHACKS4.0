import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Award, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { fetchAwardsList, createAward, deleteAward, fetchBadgesList } from '@/apis/recognition';
import { core_employees_list } from '@/apis/employee';

const awardFormSchema = z.object({
  recipient: z.string().min(1, 'Recipient is required'),
  badge: z.string().min(1, 'Badge is required'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  public: z.boolean().default(true)
});

const RecognitionCenter = () => {
  const [awards, setAwards] = useState([]);
  const [badges, setBadges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(awardFormSchema),
    defaultValues: {
      recipient: '',
      badge: '',
      message: '',
      public: true
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  // Add effect to log user info for debugging
  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [awardsResponse, badgesResponse, employeesResponse] = await Promise.all([
        fetchAwardsList(),
        fetchBadgesList(),
        core_employees_list()
      ]);
      
      // Detailed logging of raw response
      console.log('Raw Awards API response:', JSON.stringify(awardsResponse, null, 2));
      console.log('Current user from Redux:', JSON.stringify(user, null, 2));
      
      // Ensure we have the expected structure from the API
      if (awardsResponse && awardsResponse.data) {
        // Check for 'public' field in each award
        const awardsWithPublicStatus = awardsResponse.data.map(award => {
          // Log each individual award for debugging
          console.log('Processing award:', JSON.stringify(award, null, 2));
          
          // If public status is undefined or null, set a default
          if (award.public === undefined || award.public === null) {
            console.log('Award missing public status, setting default:', award.id);
            return { ...award, public: true }; // Default to public if not specified
          }
          return award;
        });
        
        console.log('Processed awards count:', awardsWithPublicStatus.length);
        setAwards(awardsWithPublicStatus);
      } else {
        console.error('Unexpected awards response format:', awardsResponse);
        setAwards([]);
        toast({
          title: 'Warning',
          description: 'Failed to load awards data correctly',
          variant: 'warning'
        });
      }
      
      if (badgesResponse && badgesResponse.data) {
        setBadges(badgesResponse.data);
      } else {
        console.error('Unexpected badges response format:', badgesResponse);
        setBadges([]);
      }
      
      // Filter out current user from recipients list
      // First check if employeesResponse.data exists and is an array
      if (Array.isArray(employeesResponse.data)) {
        setEmployees(employeesResponse.data.filter(emp => emp.id !== user.id));
      } else {
        console.error('Unexpected employees response format:', employeesResponse);
        setEmployees([]);
        toast({
          title: 'Warning',
          description: 'Failed to load employee list correctly',
          variant: 'warning'
        });
      }
    } catch (error) {
      console.error('Error loading recognition data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recognition data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      // Convert string IDs to numbers for the API
      const payload = {
        recipient: parseInt(data.recipient),
        badge: parseInt(data.badge),
        message: data.message,
        public: data.public
      };
      
      console.log('Sending award payload:', payload);
      await createAward(payload);
      toast({
        title: 'Success',
        description: 'Recognition award sent successfully',
        variant: 'success'
      });
      setIsDialogOpen(false);
      loadData();
      form.reset();
    } catch (error) {
      console.error('Error sending recognition:', error);
      let errorMessage = 'Failed to send recognition';
      
      if (error.response) {
        if (error.response.data && error.response.data.detail) {
          errorMessage += `: ${error.response.data.detail}`;
        } else if (error.response.status === 400) {
          errorMessage += ': Invalid data submitted';
        } else if (error.response.status === 404) {
          errorMessage += ': API endpoint not found';
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (awardId) => {
    if (!awardId) {
      console.error('No award ID provided for deletion');
      toast({
        title: 'Error',
        description: 'Cannot delete: missing award ID',
        variant: 'destructive'
      });
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this recognition?')) {
      try {
        await deleteAward(awardId);
        toast({
          title: 'Success',
          description: 'Recognition deleted successfully',
          variant: 'success'
        });
        loadData();
      } catch (error) {
        console.error('Error deleting recognition:', error);
        let errorMessage = 'Failed to delete recognition';
        
        if (error.response) {
          if (error.response.data && error.response.data.detail) {
            errorMessage += `: ${error.response.data.detail}`;
          } else if (error.response.status === 404) {
            errorMessage += ': Award not found';
          } else if (error.response.status === 403) {
            errorMessage += ': You do not have permission to delete this award';
          }
        }
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    }
  };

  const getReceivedAwards = () => {
    if (!Array.isArray(awards) || !awards.length) {
      console.error('Awards is not an array or is empty:', awards);
      return [];
    }
    
    if (!user || !user.id) {
      console.error('Invalid user object:', user);
      return [];
    }
    
    // Normalize user ID for comparison
    const currentUserId = Number(user.id);
    
    // Create a comprehensive filter for received awards
    const receivedAwards = awards.filter(award => {
      if (!award) return false;
      
      // Extract recipient ID using all possible paths
      let recipientId = null;
      
      // Case 1: Direct recipient_id field
      if (award.recipient_id !== undefined && award.recipient_id !== null) {
        recipientId = Number(award.recipient_id);
      } 
      // Case 2: Nested recipient object with id
      else if (award.recipient && award.recipient.id !== undefined) {
        recipientId = Number(award.recipient.id);
      }
      // Case 3: Check other potential fields based on API design
      else if (award.to_user_id !== undefined) {
        recipientId = Number(award.to_user_id);
      }
      
      const isCurrentUserRecipient = recipientId === currentUserId;
      
      if (isCurrentUserRecipient) {
        console.log('Found received award:', award.id, 'for user:', currentUserId, 'Public:', award.public);
      }
      
      return isCurrentUserRecipient;
    });
    
    console.log(`Found ${receivedAwards.length} received awards for user ID ${currentUserId}`);
    return receivedAwards;
  };

  const getGivenAwards = () => {
    if (!Array.isArray(awards) || !awards.length) {
      console.error('Awards is not an array or is empty:', awards);
      return [];
    }
    
    if (!user || !user.id) {
      console.error('Invalid user object:', user);
      return [];
    }
    
    // Normalize user ID for comparison
    const currentUserId = Number(user.id);
    
    // Create a comprehensive filter for given awards
    const givenAwards = awards.filter(award => {
      if (!award) return false;
      
      // Extract giver ID using all possible paths
      let giverId = null;
      
      // Case 1: Direct giver_id field
      if (award.giver_id !== undefined && award.giver_id !== null) {
        giverId = Number(award.giver_id);
      } 
      // Case 2: Nested giver object with id
      else if (award.giver && award.giver.id !== undefined) {
        giverId = Number(award.giver.id);
      }
      // Case 3: Check other potential fields based on API design
      else if (award.from_user_id !== undefined) {
        giverId = Number(award.from_user_id);
      }
      
      const isCurrentUserGiver = giverId === currentUserId;
      
      if (isCurrentUserGiver) {
        console.log('Found given award:', award.id, 'from user:', currentUserId, 'Public:', award.public);
      }
      
      return isCurrentUserGiver;
    });
    
    console.log(`Found ${givenAwards.length} given awards from user ID ${currentUserId}`);
    return givenAwards;
  };

  const getPublicAwards = () => {
    if (!Array.isArray(awards) || !awards.length) {
      console.error('Awards is not an array or is empty:', awards);
      return [];
    }
    
    // Create a comprehensive filter for public awards
    const publicAwards = awards.filter(award => {
      if (!award) return false;
      
      // Check if award is explicitly marked as public
      const isPublic = award.public === true;
      
      return isPublic;
    });
    
    console.log(`Found ${publicAwards.length} public awards out of ${awards.length} total awards`);
    return publicAwards;
  };

  return (
    <PageContainer scrollable={true}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recognition Center</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Award className="mr-2 h-4 w-4" />
              Recognize a Colleague
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Recognize a Colleague</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              {employee.full_name || employee.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select badge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {badges.map((badge) => (
                            <SelectItem key={badge.id} value={badge.id.toString()}>
                              <div className="flex items-center">
                                <i className={`${badge.icon} mr-2`}></i> {badge.name} ({badge.points} pts)
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your recognition message here..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Make this recognition public
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Send Recognition
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="received" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="received">Received Recognition</TabsTrigger>
          <TabsTrigger value="given">Given Recognition</TabsTrigger>
          <TabsTrigger value="public">Public Recognition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received">
          <Card>
            <CardHeader>
              <CardTitle>Your Recognition Awards</CardTitle>
              <CardDescription>
                Recognition awards you&apos;ve received from colleagues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading your awards...</p>
              ) : getReceivedAwards().length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getReceivedAwards().map((award) => (
                    <RecognitionCard 
                      key={award.id} 
                      award={award} 
                      canDelete={false}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <p>You haven&apos;t received any recognition awards yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="given">
          <Card>
            <CardHeader>
              <CardTitle>Recognition You&apos;ve Given</CardTitle>
              <CardDescription>
                Recognition awards you&apos;ve given to colleagues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading awards you&apos;ve given...</p>
              ) : getGivenAwards().length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getGivenAwards().map((award) => (
                    <RecognitionCard 
                      key={award.id} 
                      award={award} 
                      canDelete={true}
                      onDelete={() => handleDelete(award.id)}
                    />
                  ))}
                </div>
              ) : (
                <p>You haven&apos;t given any recognition awards yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="public">
          <Card>
            <CardHeader>
              <CardTitle>Public Recognition</CardTitle>
              <CardDescription>
                Public recognition awards across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading public recognition...</p>
              ) : getPublicAwards().length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getPublicAwards().map((award) => (
                    <RecognitionCard 
                      key={award.id} 
                      award={award} 
                      canDelete={
                        // More comprehensive check for delete permissions
                        (award.giver && Number(award.giver.id) === Number(user.id)) || 
                        (award.giver_id && Number(award.giver_id) === Number(user.id)) ||
                        (award.from_user_id && Number(award.from_user_id) === Number(user.id))
                      }
                      onDelete={() => handleDelete(award.id)}
                    />
                  ))}
                </div>
              ) : (
                <p>No public recognition awards to display.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

// Recognition Card Component
const RecognitionCard = ({ award, canDelete, onDelete }) => {
  // Add null checks
  if (!award) {
    return <Card className="overflow-hidden"><CardContent><p>Invalid award data</p></CardContent></Card>;
  }
  
  // Handle different API response formats
  const badgeData = award.badge_details || award.badge || {};
  const isPrivate = award.public === false;
  
  // Log the data for debugging
  console.log('Rendering award card:', award.id, 'Public:', award.public, 'Badge:', badgeData);
  
  // Get recipient and giver information
  const recipientName = 
    award.recipient_name || 
    (award.recipient ? (award.recipient.full_name || award.recipient.email) : null) || 
    'Unknown Recipient';
  
  const giverName = 
    award.giver_name || 
    (award.giver ? (award.giver.full_name || award.giver.email) : null) || 
    'Unknown Giver';
  
  return (
    <Card className="overflow-hidden">
      <div className={`${isPrivate ? 'bg-muted' : 'bg-primary'} text-${isPrivate ? 'primary' : 'primary-foreground'} p-4 flex justify-between items-center`}>
        <div className="flex items-center">
          <i className={`${badgeData.icon || 'fa-award'} mr-2 text-xl`}></i>
          <span className="font-bold">
            {badgeData.name || 'Unknown Badge'} 
            {isPrivate && <span className="ml-2 text-xs">(Private)</span>}
          </span>
        </div>
        <div>{badgeData.points || 0} pts</div>
      </div>
      <CardContent className="p-4">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">
            From <span className="font-semibold">{giverName}</span> to <span className="font-semibold">{recipientName}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {award.created_at ? format(new Date(award.created_at), 'MMM dd, yyyy') : 'Unknown date'}
          </p>
        </div>
        <p className="text-sm mt-2">{award.message || 'No message provided'}</p>
        {canDelete && (
          <div className="flex justify-end mt-2">
            <Button variant="ghost" size="sm" onClick={() => onDelete(award.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecognitionCenter; 