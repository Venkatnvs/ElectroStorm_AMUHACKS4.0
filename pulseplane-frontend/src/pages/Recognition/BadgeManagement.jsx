import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { fetchBadgesList, createBadge, updateBadge, deleteBadge } from '@/apis/recognition';

const badgeFormSchema = z.object({
  name: z.string().min(1, 'Badge name is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon class is required'),
  points: z.coerce.number().min(1, 'Points must be at least 1')
});

const BadgeManagement = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(badgeFormSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
      points: 10
    }
  });

  useEffect(() => {
    loadBadges();
  }, []);

  useEffect(() => {
    if (editingBadge) {
      form.reset({
        name: editingBadge.name,
        description: editingBadge.description,
        icon: editingBadge.icon,
        points: editingBadge.points
      });
    } else {
      form.reset({
        name: '',
        description: '',
        icon: '',
        points: 10
      });
    }
  }, [editingBadge, form]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      const response = await fetchBadgesList();
      
      // Ensure we get an array back
      if (Array.isArray(response.data)) {
        setBadges(response.data);
      } else {
        console.error('Unexpected badges response format:', response);
        setBadges([]);
        toast({
          title: 'Warning',
          description: 'Failed to load badges correctly',
          variant: 'warning'
        });
      }
    } catch (error) {
      console.error('Error loading badges:', error);
      toast({
        title: 'Error',
        description: 'Failed to load badges. ' + (error.response?.data?.detail || ''),
        variant: 'destructive'
      });
      setBadges([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingBadge) {
        await updateBadge(editingBadge.id, data);
        toast({
          title: 'Success',
          description: 'Badge updated successfully',
          variant: 'success'
        });
      } else {
        await createBadge(data);
        toast({
          title: 'Success',
          description: 'New badge created successfully',
          variant: 'success'
        });
      }
      setIsDialogOpen(false);
      loadBadges();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save badge',
        variant: 'destructive'
      });
      console.error('Error saving badge:', error);
    }
  };

  const handleDelete = async (badgeId) => {
    if (window.confirm('Are you sure you want to delete this badge?')) {
      try {
        await deleteBadge(badgeId);
        toast({
          title: 'Success',
          description: 'Badge deleted successfully',
          variant: 'success'
        });
        loadBadges();
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.detail || 'Failed to delete badge',
          variant: 'destructive'
        });
        console.error('Error deleting badge:', error);
      }
    }
  };

  return (
    <PageContainer scrollable={true}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recognition Badges</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBadge(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Badge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBadge ? 'Edit Badge' : 'Create New Badge'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Badge Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Badge Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Class</FormLabel>
                      <FormControl>
                        <Input placeholder="FontAwesome icon class (e.g. fa-trophy)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBadge ? 'Update Badge' : 'Create Badge'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Badges</CardTitle>
          <CardDescription>
            Manage the recognition badges that can be awarded to employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading badges...</p>
          ) : badges.length > 0 ? (
            <Table>
              <TableCaption>List of available recognition badges</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Badge</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {badges.map((badge) => (
                  <TableRow key={badge.id}>
                    <TableCell className="font-medium">{badge.name}</TableCell>
                    <TableCell>{badge.description}</TableCell>
                    <TableCell><i className={badge.icon}></i> {badge.icon}</TableCell>
                    <TableCell>{badge.points}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingBadge(badge);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(badge.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No badges available. Create your first badge using the button above.</p>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default BadgeManagement; 