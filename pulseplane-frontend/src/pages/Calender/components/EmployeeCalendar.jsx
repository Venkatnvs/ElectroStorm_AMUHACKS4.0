import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { core_emp_leaves_create, core_emp_leaves_list } from '@/apis/leaves';
import DialogForLeave from './DialogForLeave';
import { core_sheduling_detailed_schedules2_list } from '@/apis/shifts';

const EmployeeCalendar = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchEvents = async () => {
    try {
      const leaveRes = await core_emp_leaves_list();

      const shiftRes = await core_sheduling_detailed_schedules2_list();

      const leaveEvents = leaveRes.data.map(item => ({
        title: item.approved ? 'Approved Leave' : 'Pending Leave',
        start: item.date,
        end: item.date,
        color: item.approved ? 'green' : 'red',
      }));

      const shiftEvents = shiftRes.data.map(item => ({
        title: item.shift_type + ' Shift',
        start: item.date,
        end: item.date,
        color: 'blue',
      }));

      setEvents([...leaveEvents, ...shiftEvents]);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = info => {
    setSelectedDate(info.dateStr);
    setOpenDialog(true);
    console.log(info.dateStr);
  };

  return (
    <div className="p-4">
      <DialogForLeave
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        selectedDate={selectedDate}
        fetchEvents={() => fetchEvents()}
      />

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        dateClick={handleDateClick}
        events={events}
      />
    </div>
  );
};

export default EmployeeCalendar;