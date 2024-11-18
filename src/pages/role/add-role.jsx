import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "../../api";
import { useNavigate } from "react-router-dom";

const AddRole = () => {
  const serviceAreaId = localStorage.getItem("serviceAreaId");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    password: "",
    role: "",
    email: "",
    service_id: null,
  });
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios
        .get(`${BASE_URL}/register/get-all-roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const roles = response.data.map((role) => {
            let label;
            switch (role) {
              case "ROLE_SUPER_ADMIN":
                label = "Super Admin";
                break;
              case "ROLE_CITY_ADMIN":
                label = "Admin";
                break;
              case "ROLE_EDITOR":
                label = "Viewer";
                break;
              default:
                label = role;
            }
            return { value: role, label };
          });
          setRoleOptions(roles);
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
        });
    } else {
      console.error("No token found");
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.error("Role can't be empty");
      return;
    }
    
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios
        .post(`${BASE_URL}/register/admin/add`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          toast.success("Role added successfully!");
          setFormData({
            firstName: "",
            lastName: "",
            mobileNumber: "",
            password: "",
            role: "",
            email: "",
            service_id: null,
          })
          console.log("Role added successfully:", response.data);
        })
        .catch((error) => {
          //toast.error("Error adding role. Please try again.");
          if (error.response && error.response.status === 401) {
            navigate("/");
            toast.error("Unauthorized. Please log in again.");
          } else {
            toast.error("Error adding role. Please try again.");
          }
        });
    } else {
      console.error("No token found");
    }
  };

  return (
    <>
      <ToastContainer />
      <Card title="Add New Role">
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
            <Textinput
              label="First Name"
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
            />
            <Textinput
              label="Last Name"
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
            <Textinput
              label="Mobile Number"
              id="mobileNumber"
              type="number"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
            <Textinput
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Textinput
              label="Password"
              id="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
            />
             {/* <Select
              label="Select Role"
              options={roleOptions}
              onChange={handleChange}
              value={formData.password}
              id="role"
            /> */}
            
            {/* <Select
              label="Select Role"
              options={roleOptions}
              onChange={handleChange}
              value={roleOptions.find((option) => option.value === formData.role)}
              id="role"
            /> */}
             <Select
              label="Select Role"
              options={roleOptions}
              onChange={handleChange}
              value={formData.role}
              id="role"
            />
          </div>
          <div className="space-y-4 text-end">
            <Button text="Submit" className="btn-dark" type="submit" />
          </div>
        </form>
      </Card>
    </>
  );
};

export default AddRole;
