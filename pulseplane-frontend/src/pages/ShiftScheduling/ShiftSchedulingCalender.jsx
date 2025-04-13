import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import DetailsDialog from './components/DetailsDialog';
import { core_sheduling_detailed_schedules_list, core_sheduling_schedules_list } from '@/apis/shifts';

const ShiftTypeEnum = z.enum(['MORNING', 'AFTERNOON', 'NIGHT']);

const PriorityEnum = z.enum(['HIGH', 'MEDIUM', 'LOW']);

const ScheduleSchema = z.object({
  date: z.string().optional(),
  shift_type: ShiftTypeEnum.default('MORNING'),
  priority: PriorityEnum,
  start_time: z.string(),
  end_time: z.string(),
  user: z.array(z.number()).default([]),
});

const ShiftSchedulingCalender = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDateClick = info => {
    setSelectedDate(info.dateStr);
    setOpenDialog(true);
  };

  const fetchShifts = async () => {
    try{
       const res = await core_sheduling_detailed_schedules_list();
       if (res.status === 200) {
        setShifts(res.data);
       } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch shifts',
          variant: 'destructive',
        });
       }
    } catch (error) {
      console.error(error?.response?.data);
      toast({
        title: 'Error!',
        description: 'Failed to fetch outfits',
        variant: 'destructive',
      });
    }
  };

  const { toast } = useToast();
  const navigate = useNavigate();

  const renderEventContent = (eventInfo) => {
    return (
      <div className="fc-event-content cursor-pointer p-1"
        onClick={() => {
          navigate(`/dashboard/shift-scheduling/${eventInfo.event.extendedProps.shift_id}`);
        }}
      >
        <div className="flex space-x-2 flex-wrap items-center">
          {
            eventInfo.event.extendedProps.users.map(user => (
              <>
                <img
                    src={`https://api.dicebear.com/9.x/personas/svg?hair=${(user?.gender === "male") ? 'shortCombover' : 'sideShave'}&backgroundColor=b6e3f4,c0aede,d1d4f9&seed=Felix`}
                    alt={user?.full_name}
                    className="w-6 h-6 rounded-full"
                    title={user?.full_name}
                  />
              </>
            ))
          }
        </div>
        <span className='text-sm'>{eventInfo.event.title}</span>
      </div>
    );
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <DetailsDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedDate={selectedDate}
        ScheduleSchema={ScheduleSchema}
        fetchShifts={fetchShifts}
      />

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        dateClick={handleDateClick}
        events={shifts.map(shift => ({
          title: shift.shift_type,
          users: shift.user,
          date: shift.date,
          shift_id : shift.id
        }))}
        eventContent={renderEventContent}
      />
    </div>
  )
}

export default ShiftSchedulingCalender