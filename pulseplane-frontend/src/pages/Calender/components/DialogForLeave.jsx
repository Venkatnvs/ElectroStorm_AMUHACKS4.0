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
import { useToast } from "@/hooks/use-toast";
import formatErrorMessages from "@/lib/formatErrorMessages";
import moment from "moment";
import { core_emp_leaves_create } from "@/apis/leaves";

const LeaveSchema = z.object({
    date: z.string(),
    reason: z.string(),
});

const DialogForLeave = ({
    openDialog,
    setOpenDialog,
    selectedDate,
    fetchEvents,
}) => {
    const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(LeaveSchema),
    defaultValues: {
      date: moment(selectedDate).format("YYYY-MM-DD"),
    reason: "",
    },
  });

  const onSubmit = async (data) => {    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("date", moment(selectedDate).format("YYYY-MM-DD"));
      formData.append("reason", data.reason);

      const res = await core_emp_leaves_create(formData);
      if (res.status === 201) {
        form.reset();
        setOpenDialog(false);
        fetchEvents();
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
          <DialogTitle>Create New Leave</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter date'
                          {...field}
                          type='date'
                          value={moment(selectedDate).format('YYYY-MM-DD')}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name='reason'
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                            <Input
                            placeholder='Enter reason'
                            {...field}
                            />
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
  )
}

export default DialogForLeave