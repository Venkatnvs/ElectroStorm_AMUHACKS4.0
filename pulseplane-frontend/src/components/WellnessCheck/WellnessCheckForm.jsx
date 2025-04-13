import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { wellness_check_create } from '@/apis/wellness';


const formSchema = z.object({
  mood: z.string().min(1, { message: 'Please select your mood' }),
  stress_level: z.string().min(1, { message: 'Please select your stress level' }),
  sleep_hours: z.string()
    .refine(val => !isNaN(parseFloat(val)), { message: 'Sleep hours must be a number' })
    .refine(val => parseFloat(val) >= 0 && parseFloat(val) <= 24, { 
      message: 'Sleep hours must be between 0 and 24' 
    }),
  work_life_balance: z.string().min(1, { message: 'Please select your work-life balance' }),
  notes: z.string().optional()
});

const WellnessCheckForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mood: '',
      stress_level: '',
      sleep_hours: '7.5',
      work_life_balance: '',
      notes: ''
    }
  });

  const onSubmit = async (data) => {
    // Convert string values to numbers for the API
    const payload = {
      ...data,
      mood: parseInt(data.mood),
      stress_level: parseInt(data.stress_level),
      sleep_hours: parseFloat(data.sleep_hours),
      work_life_balance: parseInt(data.work_life_balance)
    };
    
    setIsSubmitting(true);
    
    try {
      const response = await wellness_check_create(payload);
      console.log('Wellness check submission successful:', response);
      toast({
        title: 'Wellness check submitted',
        description: 'Thank you for sharing your wellness data.',
        variant: 'success'
      });
      form.reset();
      
      // Call the onSuccess callback if provided
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting wellness check:', error);
      let errorMessage = 'Failed to submit wellness check';
      
      // Enhanced error handling
      if (error.response) {
        console.error('Error response:', error.response);
        if (error.response.data && error.response.data.detail) {
          errorMessage += `: ${error.response.data.detail}`;
        } else if (error.response.status === 400) {
          errorMessage += ': Invalid data submitted';
        } else if (error.response.status === 401 || error.response.status === 403) {
          errorMessage += ': Authentication or permission issue';
        } else if (error.response.status === 404) {
          errorMessage += ': Endpoint not found. Check API configuration.';
        } else if (error.response.status >= 500) {
          errorMessage += ': Server error. Please try again later.';
        }
      } else if (error.request) {
        errorMessage += ': No response received from server. Check your connection.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Daily Wellness Check-in</CardTitle>
        <CardDescription>
          Share how you're feeling today to help us support your wellbeing.
          Your responses are confidential and used to improve workplace wellness.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How are you feeling today?</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your mood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Very Low</SelectItem>
                        <SelectItem value="2">Low</SelectItem>
                        <SelectItem value="3">Neutral</SelectItem>
                        <SelectItem value="4">Good</SelectItem>
                        <SelectItem value="5">Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stress_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stress Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stress level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">No Stress</SelectItem>
                        <SelectItem value="2">Mild</SelectItem>
                        <SelectItem value="3">Moderate</SelectItem>
                        <SelectItem value="4">High</SelectItem>
                        <SelectItem value="5">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="sleep_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hours of sleep last night: {field.value}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter how many hours you slept last night
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="work_life_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work-Life Balance</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Rate your work-life balance" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Very Poor</SelectItem>
                      <SelectItem value="2">Poor</SelectItem>
                      <SelectItem value="3">Balanced</SelectItem>
                      <SelectItem value="4">Good</SelectItem>
                      <SelectItem value="5">Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share any additional information about your wellbeing"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Add any comments about your wellness today
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Wellness Check'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WellnessCheckForm; 