import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Pencil, Info, Plus } from 'lucide-react'
import { core_employees_list, core_employees_partial_update } from "@/apis/employee";
import { useToast } from "@/hooks/use-toast";

const AllEmployes = () => {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('all')
    const [genderFilter, setGenderFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 10
  
    const filteredUsers = users.filter(user => 
      (user.full_name.toLowerCase().includes(search.toLowerCase()) || 
       user.email.toLowerCase().includes(search.toLowerCase())) &&
      (departmentFilter === 'all' || user.department === departmentFilter) &&
      (genderFilter === 'all' || user.gender === genderFilter)
    )
  
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  
    const handleDelete = (userId) => {
      // Implement delete functionality here
      console.log(`Delete user with id: ${userId}`)
    }

    const { toast } = useToast()
  
    const addShift = async (userId, c_count) => {
      try {
        const res = await core_employees_partial_update(userId, {current_shifts_count: c_count+1})
        if (res.status === 200) {
          get_employees_list()
          toast({
            title: 'Success',
            description: 'Shift added successfully',
          })
        } else {
          toast({
            title: 'Error',
            description: 'Failed to add shift',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error',
          description: 'Failed to add shift',
          variant: 'destructive',
        })
      }
    }

    const get_employees_list = async () => {
        try {
            const response = await core_employees_list()
            console.log(response.data)
            setUsers(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        get_employees_list()
    },[])

  return (
    <div className="container mx-auto">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={setDepartmentFilter} value={departmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="Design">Design</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setGenderFilter} value={genderFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Shifts</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Current/Expected Salary</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.position}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.current_shifts_count || 0}/{user.no_of_shifts || 10}</TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>{(user.salary/user.no_of_shifts)* user.current_shifts_count }/{user.salary}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => addShift(user.id, user.current_shifts_count)}>
                      <Plus className="mr-1 h-4 w-4" />
                      <span>Add Shift</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="flex items-center">
                            <Info className="mr-2 h-4 w-4" />
                            <span>Details</span>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Name:</span>
                              <span className="col-span-3">{user.name}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Position:</span>
                              <span className="col-span-3">{user.position}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Email:</span>
                              <span className="col-span-3">{user.email}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Department:</span>
                              <span className="col-span-3">{user.department}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Gender:</span>
                              <span className="col-span-3">{user.gender}</span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleDelete(user.id)} className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllEmployes;
