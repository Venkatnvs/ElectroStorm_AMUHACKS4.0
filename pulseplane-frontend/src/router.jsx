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
import RecognitionsPage from "./pages/Recognitions";
import CreateRecognitionPage from "./pages/Recognitions/CreateRecognition";


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
        name: 'recognitions',
        path: '/dashboard/recognitions',
        element: RecognitionsPage,
    },
    {
        name: 'create-recognition',
        path: '/dashboard/recognitions/create',
        element: CreateRecognitionPage,
    }
];

export default routes;