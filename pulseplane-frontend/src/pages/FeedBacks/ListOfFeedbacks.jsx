import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { core_employees_list } from "@/apis/employee";
import {
  core_emp_feedback2_list,
  core_emp_feedback_create,
} from "@/apis/feedback";

export default function ListOfFeedbacks() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await core_employees_list();
      const res2 = await core_emp_feedback2_list();
      if (res2.status === 200 && response.status === 200) {
        let emp_data = response.data;
        emp_data.map((user) => ({ ...user, rating: 0, isSaving: false }));
        const ratedUsers = res2.data.map((r) => r.user);
        emp_data = emp_data.filter((u) => !ratedUsers.includes(u.id));
        setUsers(emp_data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { toast } = useToast();

  const handleRatingChange = (userId, newValue) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, rating: newValue[0] } : user
      )
    );
  };

  const handleSave = async (userId) => {
    try {
      const res = await core_emp_feedback_create({
        user: userId,
        feedback: users.find((u) => u.id === userId).rating,
      });
      if (res.status === 200 || res.status === 201) {
        toast({
          title: "Feedback Saved",
          description: `Rating for ${
            users.find((u) => u.id === userId).full_name
          } has been updated.`,
        });
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: `Error saving feedback for ${
            users.find((u) => u.id === userId).full_name
          }`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Error saving feedback for ${
          users.find((u) => u.id === userId).full_name
        }`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <h2 className="font-bold">Pending Feedbacks</h2>
      <div className="container mx-auto flex gap-2">
        {users.map((user) => (
          <>
            <div className="w-1/2">
              <Card key={user.id} className="mb-4">
                <CardHeader>
                  <CardTitle className="text-md">{user.full_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {user.position}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Slider
                      min={0}
                      max={150}
                      step={1}
                      value={[user.rating]}
                      onValueChange={(newValue) =>
                        handleRatingChange(user.id, newValue)
                      }
                      className="flex-grow"
                    />
                    <span className="font-sm w-10 text-right">
                      {user.rating}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSave(user.id)}
                    disabled={user.isSaving}
                    className="w-full"
                    size="sm"
                  >
                    {user.isSaving ? "Saving..." : "Save Rating"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        ))}
        {
            users.length === 0 && <p>No pending feedbacks</p>
        }
      </div>
    </>
  );
}
