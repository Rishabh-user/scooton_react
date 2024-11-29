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
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { TabPanel, Tabs, Tab, TabList } from "react-tabs";
import Flatpickr from "react-flatpickr";

const Settings = () => {
    const navigate = useNavigate();
    const[logoutAll, setLogoutAllList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logoutDevice, setLogoutDevice] = useState();
    const [isLogoutModal, setIsLogoutModal] = useState(false);
    const [from_date, setFromDate] = useState("");
    const [to_date, setToDate] = useState("");

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
            console.log("response.data",response.data)
            const validLogoutList = response.data.filter(item => !item.isExpired);

            setLogoutAllList(validLogoutList);
          }
        } catch (error) {
          console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
      };  
      fetchLogoutAllList();
    }, []);

    const allRidersOnline = () => {
        try{
            axios.post(`${BASE_URL}/auth/register-rider-online`).then((response) => {
                toast.success("Register riders online  successfully!");
            })
        }catch{
            if (error.response && error.response.status === 401) {
            navigate("/");
            toast.error("Unauthorized. Please log in again.");
            } else {
            toast.error("Error while updating. Please try again.");
            }
        }
    }

    const logoutModal = () => {
        setIsLogoutModal(true)
    }

    const logoutAllDevice = () => {
       try{
        axios.post(`${BASE_URL}/auth/logout-all-device`,0).then((response) => {
            toast.success("All Device Logout Successfully")
            localStorage.clear("jwtToken")
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
       }catch{
         toast.error("Promocode not updated successfully!");
       }
    }

    const getTodayDate = () => {
        const today = new Date();
        console.log("today",today)
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        
        return `${month}-${day}-${year}`;
    };
   
    const todaydate = getTodayDate()

    const isDateWithinOneMonth = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const maxEndDate = new Date(startDate);
        maxEndDate.setMonth(startDate.getMonth() + 1);
         
        console.log("gap",endDate <= maxEndDate)
    
        return endDate <= maxEndDate;
    };
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;

    
        if (name === "from_date") {
            setFromDate(value);
            
            if (to_date && !isDateWithinOneMonth(value, to_date)) {
                //toast.error("The selected dates must be within one month of each other.")
                setToDate(""); 
            }
        } else if (name === "to_date") {
            if (from_date && !isDateWithinOneMonth(from_date, value)) {
                //toast.error("The selected dates must be within one month of each other.")
                return;
            }
            setToDate(value);
        }
    };

    const formatDateToDatetimeLocal = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${month}-${day}-${year}`;
      };

    const exportCsv = async (fromdate, todate) =>{
       console.log("dates",fromdate,todate)
       const fromdatevalue = formatDateToDatetimeLocal(fromdate);
       const todatevalue = formatDateToDatetimeLocal(todate)
       try{
            await axios.get(`${BASE_URL}/order/v2/orders/get-city-wide-orders-by-date?from_date=${fromdatevalue}&to_date=${todatevalue}`).then((response) => {
                toast.success("CSV downloaded successfully")
            })
       }catch{
        toast.error(error)
       }
       
    }

    if (loading) {
        return <Loading />;
    }
  return (
    <>
        <ToastContainer/>
        <Card>
            <Tabs>
                <div className="max-w-[800px] mx-auto">
                    <TabList>
                        <Tab>Logout From All Devices</Tab>
                        <Tab>Make All Rider Online</Tab>
                        <Tab>Export Order Data</Tab>
                    </TabList>
                </div>
                <TabPanel>
                    <div className="card-header md:flex justify-between items-center mb-4 px-0 py-2">
                        <div className="flex items-center">                            
                            <h4 className="card-title ms-2">Logout From All Devices</h4>
                        </div>
                    </div>
                    <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                        <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                            <thead>
                                <tr>
                                    <th className="dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                        <span className="block px-6 py-3 font-semibold">Sr. No</span>
                                    </th>
                                    <th className="dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                        <span className="block px-6 py-3 font-semibold">First Name</span>
                                    </th>
                                    <th className="dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                        <span className="block px-6 py-3 font-semibold">Mobile Number</span>
                                    </th>
                                    <th className="dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                        <span className="block px-6 py-3 font-semibold">Email Id</span>
                                    </th>                                    
                                    <th className="dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                        <span className="block px-6 py-3 font-semibold">Role</span>
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
                        <Button type="button" className="btn btn-dark" onClick={() => logoutModal()}>Logout All Device</Button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="card-header md:flex justify-between items-center mb-3 px-0 py-1 ">
                        <div className="flex items-center">
                            <h4 className="card-title">Make All Rider Online</h4>
                        </div>
                    </div>
                    <p>By clicking on this button all registered riders in DB will be marked online, however after a defined time if there is no activity on the app by the rider he will automatically be marked offline again, according to the logic.</p>
                    <div className="text-end">
                        <Button type="button" className="btn btn-dark" onClick={() => allRidersOnline()}>Go Online</Button>
                    </div>
                </TabPanel>
                <TabPanel>
                    <div className="card-header md:flex justify-between items-center mb-4 px-0 py-2">
                        <div className="flex items-center">
                            <h4 className="card-title">Export Order Data</h4>
                        </div>
                    </div>
                    <div className="grid xl:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-3 items-end">
                        {/* <TextField
                            id="from_date"
                            type="date" 
                            name="from_date"
                            value={from_date}
                            onChange={handleInputChange}          
                        />     */}
                        <Flatpickr
                            type="date"
                            id="from_date"
                            className="form-control py-3"
                            value={from_date}
                            onChange={handleInputChange} 
                            style={{backgroundColor: 'transparent'}}
                        />
                                         
                        {/* <TextField
                            id="to_date"
                            type="date"
                            name="to_date"
                            value={to_date}
                            maxDate={new Date}
                            onChange={handleInputChange}                
                        /> */}
                        <Flatpickr
                            id="to_date"
                            type="date"
                            className="form-control py-3"
                            name="to_date"
                            value={to_date}
                            maxDate={new Date}
                            onChange={handleInputChange} 
                            style={{backgroundColor: 'transparent'}}
                        />
                        <div className="w-100 h-100"><Button type="button" className="btn h-100 items-center btn-dark py-2" disabled={isDateWithinOneMonth()} onClick={() => exportCsv(from_date,to_date)}>Export</Button></div>
                    </div>
                </TabPanel>
            </Tabs>
           
           
            
        </Card>
            {isLogoutModal && 
                <Modal
                activeModal={isLogoutModal}
                uncontrol
                className="max-w-md"
                title=""
                
                onClose={() => setIsLogoutModal(false)}
                centered
            >
              <div className="">
                  <h5 className="text-center">Are you sure to logout all devices?</h5>
                  <div className="d-flex gap-2 justify-content-center mt-4">
                    <Button className="btn btn-dark" type="button" onClick={() => setIsLogoutModal(false)}>
                      No
                    </Button>
                    <Button className="btn btn-outline-light" type="button" onClick={() => {logoutAllDevice();setIsLogoutModal(false)}}>
                      Yes
                    </Button>
                  </div>
              </div>
            </Modal>
        }
    </>
  );
};

export default Settings;
