import { core_sheduling_schedules_delete_user } from "@/apis/shifts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar, DeleteIcon, Trash, User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const DetailsOfShift = ({ shift, featchDetails }) => {
  const { toast } = useToast();
  const nvaigate = useNavigate();
  const handleDeleteUser = async (userId) => {
    try {
      const res = await core_sheduling_schedules_delete_user(shift?.id, { user_id: userId });
      if (res.status === 204 || res.status === 200) {
        toast({
          title: "User Removed",
          description: "User has been removed from the shift",
        })
        if (shift?.user?.length === 1) {
          nvaigate("/dashboard/shift-scheduling");
        } else {
          featchDetails();
        }
      } else {
        toast({
          title: "Error",
          description: "An error occurred while removing user",
          variant: "destructive",
        });
      }
    } catch (error) { 
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "An error occurred while removing user",
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-3xl">{shift.user.full_name}</CardTitle>
            <CardDescription className="text-lg mt-1">
              <span className="font-semibold text-gray-700">Shift:</span>{" "}
              {shift.shift_type}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Badge variant="secondary" className="text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {shift.date}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <User className="w-4 h-4 mr-1" />
            {shift?.user?.length} users
          </Badge>
        </div>

        <h3 className="text-xl font-semibold mb-4">Items:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {shift.user?.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square relative text-center flex justify-center items-center">
            <img
              src={`https://api.dicebear.com/9.x/personas/svg?hair=${item.gender === "male" ? 'shortCombover' : 'sideShave'}&backgroundColor=b6e3f4,c0aede,d1d4f9&seed=Felix`}
              alt={item.name}
              className="object-fit w-full h-full max-h-[100px] rounded-lg max-w-[100px]"
            />
            {/* Delete Icon */}
            <Trash
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              size={24}
              onClick={() => handleDeleteUser(item.id)}
            />
          </div>
              <CardContent className="p-4">
                <h4 className="text-lg font-bold mb-2">{item.full_name}</h4>
                <h6 className="text-md mb-2">{item.phone_number}</h6>
                <p className="text-sm text-gray-600 mb-1">
                  Department: {item.department.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Position: {item.position}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Gender: {item.gender}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full mb-2">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{item.full_name}</DialogTitle>
                      <DialogDescription>User Details</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <img
                        src={`https://api.dicebear.com/9.x/personas/svg?hair=${(item?.gender === "male") ? 'shortCombover' : 'sideShave'}&backgroundColor=b6e3f4,c0aede,d1d4f9&seed=Felix`}
                        alt={item.name}
                        className="w-full h-auto rounded-lg"
                      />
                      <p>
                        <strong>Email:</strong> {item.email}
                      </p>
                      <p>
                        <strong>Department:</strong> {item.department.toUpperCase()}
                      </p>
                      <p>
                        <strong>Position:</strong> {item.position}
                      </p>
                      <p>
                        <strong>Gender:</strong> {item.gender}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsOfShift;
