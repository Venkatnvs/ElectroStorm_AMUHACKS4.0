import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WellnessCheckForm from '@/components/WellnessCheck/WellnessCheckForm';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { wellness_check_list } from '@/apis/wellness';

const WellnessPage = () => {
  const [wellnessHistory, setWellnessHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchWellnessHistory();
  }, []);

  const fetchWellnessHistory = async () => {
    try {
      const response = await wellness_check_list();
      setWellnessHistory(response.data);
    } catch (error) {
      console.error('Error fetching wellness history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wellness history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodLabel = (value) => {
    const moodLabels = {
      1: 'Very Low',
      2: 'Low',
      3: 'Neutral',
      4: 'Good',
      5: 'Excellent'
    };
    return moodLabels[value] || value;
  };

  const getStressLabel = (value) => {
    const stressLabels = {
      1: 'No Stress',
      2: 'Mild',
      3: 'Moderate',
      4: 'High',
      5: 'Severe'
    };
    return stressLabels[value] || value;
  };

  const prepareChartData = () => {
    // Sort by date (oldest first) for the chart
    return [...wellnessHistory]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        date: format(new Date(item.date), 'MMM dd'),
        mood: item.mood,
        stress: item.stress_level,
        workLifeBalance: item.work_life_balance,
        sleep: item.sleep_hours
      }));
  };

  return (
    <PageContainer scrollable={true}>
      <h1 className="text-3xl font-bold mb-6">Wellness Center</h1>
      
      <Tabs defaultValue="check-in" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="check-in">Daily Check-in</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="check-in">
          <WellnessCheckForm onSuccess={fetchWellnessHistory} />
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Wellness History</CardTitle>
              <CardDescription>
                Review your previous wellness check-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading history...</p>
              ) : wellnessHistory.length > 0 ? (
                <Table>
                  <TableCaption>Your wellness check-in history</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Mood</TableHead>
                      <TableHead>Stress Level</TableHead>
                      <TableHead>Sleep (hrs)</TableHead>
                      <TableHead>Work-Life Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wellnessHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{getMoodLabel(entry.mood)}</TableCell>
                        <TableCell>{getStressLabel(entry.stress_level)}</TableCell>
                        <TableCell>{entry.sleep_hours}</TableCell>
                        <TableCell>{getMoodLabel(entry.work_life_balance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No wellness check-ins recorded yet. Start by completing your daily check-in!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Wellness Trends</CardTitle>
              <CardDescription>
                Visualize your wellness metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading trends...</p>
              ) : wellnessHistory.length > 0 ? (
                <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={prepareChartData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="mood" stroke="#8884d8" name="Mood" />
                      <Line type="monotone" dataKey="stress" stroke="#ff8042" name="Stress Level" />
                      <Line type="monotone" dataKey="workLifeBalance" stroke="#82ca9d" name="Work-Life Balance" />
                      <Line type="monotone" dataKey="sleep" stroke="#4bc0c0" name="Sleep Hours" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p>No wellness data available to display trends. Start by completing your daily check-in!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default WellnessPage; 