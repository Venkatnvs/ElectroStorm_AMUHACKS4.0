import MainCalender from "./pages/Calender/MainCalender";
import MainDashBoard from "./pages/DashBoard/MainDashBoard";
import CreateEmployee from "./pages/Employees/CreateEmployee";
import MainEmployees from "./pages/Employees/MainEmployees";
import MainFeedBacks from "./pages/FeedBacks/MainFeedBacks";
import MainLeaves from "./pages/Leaves/MainLeaves";
import MainNewHiring from "./pages/NewHiring/MainNewHiring";
import MainProfilePage from "./pages/Profile/MainProfilePage";
import MainShiftScheduling from "./pages/ShiftScheduling/MainShiftScheduling";
import ShiftDetails from "./pages/ShiftScheduling/ShiftDetails";
import WellnessPage from './pages/Wellness';
import BadgeManagement from './pages/Recognition/BadgeManagement';
import RecognitionCenter from './pages/Recognition/RecognitionCenter';


const routes = [
    {
        name: 'root',
        path: '/dashboard',
        element: MainDashBoard,
    },
    {
        name: 'employee',
        path: '/dashboard/employee',
        element: MainEmployees,
    },
    {
        name: 'employee-create',
        path: '/dashboard/employee/create',
        element: CreateEmployee,
    },
    {
        name: 'shift Scheduling',
        path: '/dashboard/shift-scheduling',
        element: MainShiftScheduling,
    },
    {
        name: 'shift Scheduling Details',
        path: '/dashboard/shift-scheduling/:id',
        element: ShiftDetails,
    },
    {
        name: 'calendar',
        path: '/dashboard/calendar',
        element: MainCalender,
    },
    {
        name: 'Leaves',
        path: '/dashboard/leaves',
        element: MainLeaves,
    },
    {
        name: 'Feedback',
        path: '/dashboard/feedback',
        element: MainFeedBacks,
    },
    {
        name: 'New Hire',
        path: '/dashboard/new-hire',
        element: MainNewHiring,
    },
    {
        name: 'profile',
        path: '/dashboard/profile',
        element: MainProfilePage,
    },
    {
        name: 'wellness',
        path: '/dashboard/wellness',
        element: WellnessPage,
    },
    {
        name: 'recognition-center',
        path: '/dashboard/recognition',
        element: RecognitionCenter,
    },
    {
        name: 'badge-management',
        path: '/dashboard/badges',
        element: BadgeManagement,
    }
];

export default routes;