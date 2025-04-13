import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Clock, CalendarDays, ListChecks, Heart } from 'lucide-react';

const navLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <Home className="h-6 w-6" />,
    visibleFor: ["admin", "employee"]
  },
  {
    title: "Employees",
    path: "/employees",
    icon: <Users className="h-6 w-6" />,
    visibleFor: ["admin"]
  },
  {
    title: "Shifts",
    path: "/shift-scheduling",
    icon: <Clock className="h-6 w-6" />,
    visibleFor: ["admin", "employee"]
  },
  {
    title: "Leaves",
    path: "/leaves",
    icon: <CalendarDays className="h-6 w-6" />,
    visibleFor: ["admin", "employee"]
  },
  {
    title: "Feedback",
    path: "/feedback",
    icon: <ListChecks className="h-6 w-6" />,
    visibleFor: ["admin", "employee"]
  },
  {
    title: "Wellness",
    path: "/wellness",
    icon: <Heart className="h-6 w-6" />,
    visibleFor: ["admin", "employee"]
  }
];

const SideBar = ({ userRole = "admin" }) => {
  const filteredLinks = navLinks.filter(link => 
    link.visibleFor.includes(userRole.toLowerCase())
  );

  return (
    <div className="w-64 h-full bg-white shadow-md">
      <div className="p-5">
        <h1 className="text-xl font-bold">PulsePlan</h1>
      </div>
      <nav className="mt-5">
        <ul>
          {filteredLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.path}
                className="flex items-center p-4 hover:bg-gray-100"
              >
                <span className="mr-3 text-gray-500">{link.icon}</span>
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideBar; 