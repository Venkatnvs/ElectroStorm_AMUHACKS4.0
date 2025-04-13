import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { core_employees_create } from "@/apis/employee";
import { useNavigate } from "react-router-dom";

const CreateEmployeeForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    department: "",
    position: "",
    gender: "",
    salary: 0,
    no_of_shifts: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some((field) => field === "")) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    try {
        console.log(formData);
        const res = await core_employees_create(formData);
        if (res.status == 201) {
            toast({
                title: "Success",
                description: "Employee created successfully!",
            });
            setFormData({
                full_name: "",
                email: "",
                password: "",
                phone_number: "",
                department: "",
                position: "",
                gender: "",
            });
            navigate("/dashboard/employee");
        } else {
            toast({
                title: "Error",
                description: "Failed to create employee. Please try again.",
                variant: "destructive",
            });
        }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 mx-auto p-6 bg-white dark:bg-accent rounded-xl shadow-md"
      >
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Select
            name="department"
            value={formData.department}
            onValueChange={(value) => handleSelectChange("department", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Cooking">Cooking</SelectItem>
              <SelectItem value="Cleaning">Cleaning</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Select
            name="position"
            value={formData.position}
            onValueChange={(value) => handleSelectChange("position", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="barista">Barista</SelectItem>
              <SelectItem value="cleaner">Cleaner</SelectItem>
              <SelectItem value="chef">Chef</SelectItem>
              <SelectItem value="waiter">Waiter</SelectItem>
              <SelectItem value="salesman">Salesman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Gender</Label>
          <RadioGroup
            name="gender"
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            {/* <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div> */}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="no_of_shifts">Number of Shifts</Label>
          <Input
            id="no_of_shifts"
            name="no_of_shifts"
            type="number"
            value={formData.no_of_shifts}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Create Employee
        </Button>
      </form>
    </div>
  );
};

export default CreateEmployeeForm;
