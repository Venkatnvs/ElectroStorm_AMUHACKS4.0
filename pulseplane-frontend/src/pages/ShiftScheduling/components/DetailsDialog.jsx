import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import formatErrorMessages from "@/lib/formatErrorMessages";
import { MultiSelect } from "@/components/ui/multi-select";
import moment from "moment";
import { core_sheduling_schedules_create } from "@/apis/shifts";
import { core_employees_list } from "@/apis/employee";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { core_emp_leaves_detailed_list } from "@/apis/leaves/detailed";

const DetailsDialog = ({
  openDialog,
  setOpenDialog,
  selectedDate,
  ScheduleSchema,
  fetchShifts,
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [shiftItems, setShiftItems] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  const fetchShiftItems = async () => {
    try {
      const res = await core_employees_list();
      if (res.status === 200) {
        setShiftItems(res.data);
      } else {
        toast({
          title: "Error!",
          description: "Failed to fetch shift items",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error?.response?.data);
      toast({
        title: "Error!",
        description: "Failed to fetch shift items",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const [res, res2] = await Promise.all([
        core_employees_list(),
        core_emp_leaves_detailed_list(),
      ]); // Parallel API requests

      if (res.status === 200 && res2.status === 200) {
        let employees = res.data;
        const leaveData = res2.data;

        console.log("Employees:", employees);
        console.log("Leave Data:", leaveData);

        // Filter out employees with approved leave on the selected date
        employees = employees.filter((user) => {
          const leave = leaveData.find(
            (leave) =>
              leave.user.id === user.id &&
              leave.approved === true &&
              leave.date === selectedDate
            );
          console.log("Filtered User:", user, "Leave:", leave);
          return !leave; // Include user only if no approved leave is found
        });

        // Map employees to user options for the select input
        const userOptions = employees.map((user) => ({
          label: user.full_name,
          value: user.id,
          gender: user.gender,
          icon: user.full_name
            ? () => (
                <img
                  src={`https://api.dicebear.com/9.x/personas/svg?hair=${
                    user.gender === "male" ? "shortCombover" : "sideShave"
                  }&backgroundColor=b6e3f4,c0aede,d1d4f9&seed=${
                    user.full_name
                  }`}
                  alt={user.full_name}
                  width={20}
                  height={20}
                  className="mr-1 h-4 w-4 text-muted-foreground rounded-full"
                />
              )
            : null,
        }));

        setUserOptions(userOptions);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error!",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (openDialog) {
      fetchShiftItems();
      fetchUsers();
    }
  }, [openDialog]);

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      date: moment(selectedDate).format("YYYY-MM-DD"),
      shift_type: "MORNING",
      priority: "MEDIUM",
      start_time: "",
      end_time: "",
      user: [],
    },
  });

  const onSubmit = async (data) => {
    if (data.shift_type === "NIGHT") {
      const femaleUsers = data.user.filter((userId) => {
        const user = userOptions.find(
          (user) => user.gender === "female" && user.id === userId
        );
        return user;
      });
      if (femaleUsers.length > 0) {
        toast({
          title: "Error!",
          description: "Female employees are not allowed for night shift",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("date", moment(selectedDate).format("YYYY-MM-DD"));
      formData.append("shift_type", data.shift_type);
      formData.append("priority", data.priority);
      formData.append("start_time", data.start_time);
      formData.append("end_time", data.end_time);

      // Append user IDs from the multi-select
      data.user.forEach((userId) => {
        formData.append("user", userId);
      });

      console.log(formData);

      const res = await core_sheduling_schedules_create(formData);
      if (res.status === 201) {
        form.reset();
        setOpenDialog(false);
        fetchShifts();
      } else {
        toast({
          title: "Error!",
          description: "Failed to create schedule",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error?.response?.data);
      toast({
        title: "Error!",
        description: formatErrorMessages(error?.response?.data),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Schedule</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={form.control}
                  name="shift_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shift Type</FormLabel>
                      <Select
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          console.log(value, userOptions);
                          field.onChange(value);
                          if (value === "NIGHT") {
                            const new_us = userOptions.filter(
                              (user) => user.gender === "male"
                            );
                            setUserOptions(new_us);
                          } else {
                            fetchUsers();
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shift type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MORNING">Morning</SelectItem>
                          <SelectItem value="AFTERNOON">Afternoon</SelectItem>
                          <SelectItem value="NIGHT">Night</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Users</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={userOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select users..."
                          disabled={loading || userOptions.length === 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter date"
                          {...field}
                          type="date"
                          value={moment(selectedDate).format("YYYY-MM-DD")}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center">
                  <Button
                    type="submit"
                    disabled={loading || !form.formState.isValid}
                    className="text-sm"
                  >
                    Save Schedule
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;
