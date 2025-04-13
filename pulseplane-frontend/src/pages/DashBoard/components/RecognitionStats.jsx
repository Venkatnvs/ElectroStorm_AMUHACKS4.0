import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { getCompanyHighlights } from '../../../apis/employee/recognition';
import { Award, ThumbsUp, Users } from 'lucide-react';
import { formatDistance } from 'date-fns';

const RecognitionStats = () => {
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecognitions = async () => {
      try {
        const response = await getCompanyHighlights();
        setRecognitions(response.data);
      } catch (error) {
        console.error('Error fetching recognition highlights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecognitions();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Recent Recognitions
        </CardTitle>
        <Award className="h-4 w-4 text-indigo-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading recognition data...</div>
        ) : recognitions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No recognitions yet</p>
            <p className="text-sm">Be the first to recognize a colleague!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recognitions.slice(0, 3).map((recognition) => (
              <div key={recognition.id} className="flex items-start space-x-2 border-b border-gray-100 pb-2 last:border-0">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <ThumbsUp className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    {recognition.sender.first_name} recognized {recognition.recipient.first_name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">{recognition.message}</p>
                  <p className="text-xs text-gray-400">
                    {formatDistance(new Date(recognition.created_at), new Date(), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
            {recognitions.length > 3 && (
              <div className="text-center text-xs text-blue-500 pt-1">
                + {recognitions.length - 3} more recognitions
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecognitionStats; 