import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/apis/axios';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  recipient: z.string().min(1, { message: 'Please select a recipient' }),
  badge: z.string().min(1, { message: 'Please select a badge' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
    .max(500, { message: 'Message cannot exceed 500 characters' }),
  public: z.boolean().default(true),
});

const RecognitionForm = ({ onSuccess }) => {
  const [recipients, setRecipients] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: '',
      badge: '',
      message: '',
      public: true,
    }
  });

  useEffect(() => {
    // Fetch employees and badges when component mounts
    const fetchData = async () => {
      try {
        const [employeesRes, badgesRes] = await Promise.all([
          api.get('/accounts/users/'),
          api.get('/employee/recognition/badges/'),
        ]);
        
        setRecipients(employeesRes.data.filter(user => user.id !== getCurrentUser().id));
        setBadges(badgesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load form data',
          variant: 'destructive',
        });
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const getCurrentUser = () => {
    // Get current user from context/local storage
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : { id: null };
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/employee/recognition/awards/', data);
      toast({
        title: 'Recognition Award Sent',
        description: 'Your colleague will be notified of your recognition!',
        variant: 'success',
      });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting recognition:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to submit recognition',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div>Loading recognition form...</div>;
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Recognize a Colleague</CardTitle>
        <CardDescription>
          Show appreciation for your colleagues by giving them recognition badges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Who do you want to recognize?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a recipient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recipients.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.full_name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the colleague you want to appreciate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recognition Badge</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a badge" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {badges.map((badge) => (
                        <SelectItem key={badge.id} value={badge.id.toString()}>
                          <div className="flex items-center">
                            <i className={badge.icon}></i>
                            <span className="ml-2">{badge.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {badges.map((badge) => (
                      <Badge 
                        key={badge.id} 
                        variant={field.value === badge.id.toString() ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => form.setValue("badge", badge.id.toString())}
                      >
                        <i className={`${badge.icon} mr-1`}></i>
                        {badge.name}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recognition Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe why you're recognizing this person..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about what they did and the impact it had
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Make public</FormLabel>
                    <FormDescription>
                      Make this recognition visible to everyone on the team
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Recognition'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RecognitionForm; 