import React, { useEffect, useState } from "react";
import 'react-tabs/style/react-tabs.css';
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";
import Button from "../../components/ui/Button";
import Textinput from "@/components/ui/Textinput";

const Settings = () => {
    const[logoutAll, setLogoutAllList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchLogoutAllList = async () => {
        try {
          const token = localStorage.getItem('jwtToken');
          if (token) {
            const response = await axios.get(`${BASE_URL}/auth/get-logout-details`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            setLogoutAllList(response.data);
          }
        } catch (error) {
          console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
      };  
      fetchLogoutAllList();
    }, []);

    if (loading) {
        return <Loading />;
    }
  return (
    <Card>
        <div className="mb-5">
            <div className="card-header md:flex justify-between items-center mb-5 px-0">
                <div className="flex items-center">
                    <Link to="/">
                        <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                    </Link>
                    <h4 className="card-title ms-2">Logout From All Devices</h4>
                </div>
            </div>
            <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                    <thead>
                        <tr>
                            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                <span className="block px-6 py-5 font-semibold">Sr. No</span>
                            </th>
                            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                <span className="block px-6 py-5 font-semibold">First Name</span>
                            </th>
                            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                <span className="block px-6 py-5 font-semibold">Mobile Number</span>
                            </th>
                            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                <span className="block px-6 py-5 font-semibold">Email Id</span>
                            </th>                                    
                            <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                <span className="block px-6 py-5 font-semibold">Role</span>
                            </th>
                        </tr>  
                    </thead> 
                    <tbody>
                        {logoutAll.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-4">No orders found.</td>
                            </tr>
                        ) : (
                            logoutAll.map((logout, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        {logout.firstName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {logout.mobileNumber}                                                
                                    </td>   
                                    <td className="px-6 py-4">{logout.email}</td>                                         
                                    <td className="px-6 py-4">
                                        {logout.role}
                                    </td>
                                    
                                </tr>
                            ))
                        )}
                    </tbody>                      
                </table>
            </div>
            <div className="text-end">
                <Button type="button" className="btn btn-dark">Logout All Device</Button>
            </div>
        </div>
        <div className="mb-5">
            <div className="card-header md:flex justify-between items-center mb-5 px-0">
                <div className="flex items-center">
                    <h4 className="card-title ms-2">Make All Rider Online</h4>
                </div>
            </div>
            <p>By clicking on this button all registered riders in DB will be marked online, however after a defined time if there is no activity on the app by the rider he will automatically be marked offline again, according to the logic.</p>
            <div className="text-end">
                <Button type="button" className="btn btn-dark">Go Online</Button>
            </div>
        </div>
        <div className="mb-5">
            <div className="card-header md:flex justify-between items-center mb-5 px-0">
                <div className="flex items-center">
                    <h4 className="card-title ms-2">Export Order Data</h4>
                </div>
            </div>
            <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-5 items-end">
                <Textinput
                    label="From Date"
                    id="from_date"
                    type="date"                
                />
                <Textinput
                    label="To Date"
                    id="to_date"
                    type="date"                
                />
                <div className="w-100"><Button type="button" className="btn btn-dark w-[100%] py-2">Export</Button></div>
            </div>
        </div>
    </Card>
  );
};

export default Settings;
