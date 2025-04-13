import React, { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import OverViewCard from './components/OverViewCards';
import {
  BadgeIndianRupee,
  CalendarCheck,
  CircleDollarSign,
  CircuitBoardIcon,
  IndianRupee,
  Laptop2Icon,
  MessageCircle,
  MicrochipIcon,
  RadioTowerIcon,
  Shirt,
  UserCog,
  UserRoundCheck,
  UserRoundX,
  Users,
  Award,
} from 'lucide-react';
import CalendarDateRangePicker from '@/components/date-range-picker';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { core_dashboard_data_count_list, core_dashboard_data_count_list2, core_dashboard_graph_data_list } from '@/apis/dashboard';
import PieChartForPosition from './components/PieChartForPosition';
import PieChartForGender from './components/PieChartForGender';
import RecognitionStats from './components/RecognitionStats';

const MainDashBoardContainer = ({
  countData,
}) => {
  const data = [
    {
      title: 'Total Employee',
      icon: <Users size={24} className='text-primary' />,
      amount: countData.number_of_employees,
      description: 'Total Employee',
    },
    {
      title: 'Total Present Employee',
      icon: <UserRoundCheck size={24} className='text-primary' />,
      amount: countData.number_of_present_employees,
      description: 'Total Present Employee'
    },
    {
      title: 'Total Absent Employee',
      icon: <UserRoundX size={24} className='text-primary' />,
      amount: countData.number_of_absent_employees,
      description: 'Total Absent Employee',
    },
    {
      title: 'Total New Hiring Application',
      icon: <CalendarCheck size={24} className='text-primary' />,
      amount: countData.new_hiring_applications,
      description: 'Total New Hiring Application', 
    },
    {
      title: 'Total Salaries',
      icon: <IndianRupee size={24} className='text-primary' />,
      amount: countData.total_salary,
      description: 'Total Salaries',
    },
    {
      title: 'Total Payrolls',
      icon: <BadgeIndianRupee size={24} className='text-primary' />,
      amount: countData.total_payroll,
      description: 'Total Payrolls',
    }
  ];

  return (
    <>
      <div className='grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-4'>
        {data.map((item, index) => (
          <OverViewCard
            key={index}
            title={item.title}
            icon={item.icon}
            amount={item.amount}
            // description={item.description}
          />
        ))}
      </div>
    </>
  );
};

const MainDashBoardContainer2 = ({
  countData,
}) => {
  const data = [
    {
      title: 'Total No. working shifts',
      icon: <UserRoundCheck size={24} className='text-primary' />,
      amount: countData.total_working_shifts,
      description: 'Total No. working shifts',
    },
    {
      title: 'Total No. Days Absent',
      icon: <UserRoundX size={24} className='text-primary' />,
      amount: countData.days_absent,
      description: 'Total No. Days Absent'
    },
    {
      title: 'Total No. of Extra Shifts',
      icon: <UserCog size={24} className='text-primary' />,
      amount: countData.total_extra_shifts,
      description: 'Total No. of Extra Shifts',
    },
    {
      title: 'Total Salaries',
      icon: <IndianRupee size={24} className='text-primary' />,
      amount: countData.total_salary,
      description: 'Total Salaries',
    },
    {
      title: 'Feedback Avg',
      icon: <MessageCircle size={24} className='text-primary' />,
      amount: countData.feedback_avg,
      description: 'Feedback Avg',
    }
  ];

  return (
    <>
      <div className='grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-4'>
        {data.map((item, index) => (
          <OverViewCard
            key={index}
            title={item.title}
            icon={item.icon}
            amount={item.amount}
            // description={item.description}
          />
        ))}
      </div>
    </>
  );
};

const MainDashBoard = () => {
  const [countData, setCountData] = useState({
    number_of_employees: 0,
    number_of_present_employees: 0,
    number_of_absent_employees: 0,
    new_hiring_applications: 0,
    total_salary: 0,
    total_payroll: 0,
  });

  const [countData2, setCountData2] = useState({
    total_working_shifts: 0,
    days_absent: 0,
    total_extra_shifts: 0,
    total_salary: 0,
    feedback_avg: 0,
  });

  const [chartData, setChartData] = useState({});

  const { is_superuser } = useSelector((state) => state.auth);

  const [date, setDate] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const fetchCountData = async (from = date.from, to = date.to) => {
    try {
      const res = await core_dashboard_data_count_list(
        moment(from).format('YYYY-MM-DD'),
        moment(to).add(1, 'days').format('YYYY-MM-DD'),
      );
      if (res.status == 200) {
        setCountData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCountData2 = async (from = date.from, to = date.to) => {
    try {
      const res = await core_dashboard_data_count_list2(
        moment(from).format('YYYY-MM-DD'),
        moment(to).add(1, 'days').format('YYYY-MM-DD'),
      );
      if (res.status == 200) {
        setCountData2(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const GetChartData = async (from = date.from, to = date.to) => {
    try {
      const res = await core_dashboard_graph_data_list(
        moment(from).format('YYYY-MM-DD'),
        moment(to).add(1, 'days').format('YYYY-MM-DD'),
      );
      if (res.status == 200) {
        console.log(res.data);
        setChartData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDateChange = changeDate => {
    setDate(changeDate);
    fetchCountData(changeDate?.from, changeDate?.to);
  };

  useEffect(() => {
    if(is_superuser) {
      fetchCountData();
    } else {
      fetchCountData2();
    }
    GetChartData();
  }, []);

  return (
    <PageContainer scrollable={true}>
      <div className='space-y-2'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Hi, Welcome back 👋
          </h2>
          <div className='hidden items-center space-x-2 md:flex lg:flex'>
            <CalendarDateRangePicker
              handleDateChange={handleDateChange}
              date={date}
            />
          </div>
        </div>
      </div>
      {
        is_superuser ? (
          <>
            <MainDashBoardContainer
              countData={countData}
              setCountData={setCountData}
              // fetchCountData={fetchCountData}
            />
            <div className='flex items-center justify-between space-y-2'>
            <div className='grid grid-cols-1 md:gap-4 md:grid-cols-2 lg:grid-cols-7 mt-5 space-y-4 md:space-y-0'>
              <div className='col-span-4 md:col-span-3'>
                {chartData?.chart1 && (
                  <PieChartForPosition chartData={chartData?.chart1} />
                )}
              </div>
              <div className='col-span-4 md:col-span-3'>
                {chartData?.chart2 && (
                  <PieChartForGender chartData={chartData?.chart2} />
                )}
              </div>
              <div className='col-span-4 md:col-span-1'>
                <RecognitionStats />
              </div>
            </div>
            </div>
          </>
        ) : (
          <>
            <MainDashBoardContainer2
              countData={countData2}
              setCountData={setCountData2}
            />
            <div className='grid grid-cols-1 md:gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5'>
              <div className='col-span-1'>
                <RecognitionStats />
              </div>
            </div>
          </>
        )
      }
    </PageContainer>
  );
};

export default MainDashBoard;
