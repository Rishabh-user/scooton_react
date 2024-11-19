import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";
import Textinput from "../../components/ui/Textinput";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import TextField from "@mui/material/TextField"; 
import Switch from "@/components/ui/Switch";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "@/components/ui/Select";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
 
const RejectionType = ["Information Rejected", "Document Issue"];
const DocumentStatus =["Approve","Reject"]

const RiderDetail = () => {
    const { riderId } = useParams();
    const [riderOrderDetail, setRiderOrderDetail] = useState(null);
    const [riderWalletDetail, setRiderWalletDetail] = useState(null);
    const [riderTripDetail, setRiderTripDetail] = useState(null);
    const [documentDetail, setDocumentDetail] = useState([]);
    const [deviceDetails, setDeviceDetails] = useState(null);
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [documentRejectDetails, setDocumentRejectDetails] = useState(null)
    const [driverDetails, setDriverDetails] = useState(null);
    const [language, setLanguage] = useState();
    const [isDriverActive, setIsDriverActive] = useState(false);
    const [isRechargeModal, setRechargeModel] = useState(false)
    const [driverRegistrationFee, setDriverRegistrationFee] = useState(false);
    const [driverRole, setDriverRole]= useState(false);
    const [approved, setApproved] = useState(true);
    const [rechageAmount, setRechageAmount] = useState({ amount: "" });
    const [documentModel, setIsDocumentModel] = useState(false)
    const [viewDocumentModelDetail, setDocumentModelDetail] = useState({
        id:'',
        fileName:''
    })
    const navigate = useNavigate();

   

    const [updateridersdetails, setUpdateRiderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchRiderOrderDetail = async () => {
        try {
          const token = localStorage.getItem('jwtToken');
          if (token) {
            const riderOrderResponse = await axios.get(`${BASE_URL}/rider/get-rider-orders/${riderId}?endDate=2025-03-31&page=0&size=500&startDate=2022-12-01`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const riderWalletResponse = await axios.get(`${BASE_URL}/rider/v2/get-rider-wallet/${riderId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
            const riderTripResponse = await axios.get(`${BASE_URL}/rider/get-rider-earning/${riderId}?endDate=2025-03-31&page=0&size=500&startDate=2022-12-01`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
            const documentResponse = await axios.get(`${BASE_URL}/login/get-rider-full-details/${riderId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            });

            
            setRiderOrderDetail(riderOrderResponse.data.jsonData.orderDetails);
            setRiderWalletDetail(riderWalletResponse.data.jsonData.walletTxn);
            setRiderTripDetail(riderTripResponse.data.jsonData.tripDetails);
            setDocumentDetail(documentResponse.data.jsonData.documentDetails || []);
            setDeviceDetails(documentResponse.data.jsonData.deviceDetails);
            setVehicleDetails(documentResponse.data.jsonData.vehicleDetails);
            setDriverDetails(documentResponse.data.jsonData.driverDetails)
            setDocumentRejectDetails(documentResponse.data.jsonData.rejectDetails)
            setLanguage(documentResponse.data.jsonData.language)
            const fetchedDriverDetails = documentResponse.data.jsonData.driverDetails;
            setIsDriverActive(fetchedDriverDetails?.active || false);
            setDriverRegistrationFee(fetchedDriverDetails?.isRegistrationFeesPaid || false);
            setDriverRole(fetchedDriverDetails?.isOnRoleRider || false);
           
          
          }
        } catch (error) {
          console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
      };  
      fetchRiderOrderDetail();
    }, [riderId]);



    const handlevehicleDetails = (e) => {
        const { name, value } = e.target;
        console.log('e',e)
        setVehicleDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleDriverDetails = (e) => {
        const { name, value } = e.target;
        console.log('e',e)
        setDriverDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handledeviceDetails = (e) => {
        const { name, value } = e.target;
        console.log('e',e)
        setDeviceDetails((prev) => ({ ...prev, [name]: value }));
    };
    const handleLanguage = (e) => {
        const { name, value } = e.target;
        console.log('e',e)
        setLanguage((prev) => ({ ...prev, [name]: value }));
    };
    const handleDocumentRejectionReason = (e) => {
        const { name, value } = e.target;
        console.log('e',e)
        setDocumentRejectDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleRechargeRiderWallet = (e) => {
        const { name, value } = e.target;
        console.log('e',e)
        setRechageAmount((prev) => ({ ...prev, [name]: value }));
    };

    
    const driverActive = async (id) => {
        const newState = !isDriverActive;
        try{
            await axios.post(`${BASE_URL}/register/rider/active/${id}`,{
                active: newState
            }).then((response) => {
                toast.success("Driver status change successfully!");
            })
            setIsDriverActive(newState)
        }catch{
            toast.error("Driver not activated successfully!");
        }
    }

    const driverRegistration = async (id) => {
        const newState = !driverRegistrationFee;
        try{
            await axios.post(`${BASE_URL}/register/rider/registration-fee-paid/${id}`,{
                active: newState
            }).then((response) => {
                toast.success("successfully!");
            })
            setDriverRegistrationFee(newState)
        }catch{
            toast.error("successfully!");
        }
    }

    const driveRoleChange = async (id) => {
        const newState = !driverRole;
        try{
            await axios.post(`${BASE_URL}/register/rider/onrole/${id}`,{
                active: newState
            }).then((response) => {
                toast.success("Rider role successfully!");
            })
            setDriverRole(newState)
        }catch{
            toast.error("Rider not role successfully!");
        }
    }



    const handleDocumentStatus = (event, index) => {
        const newStatus = event.target.value;
        setDocumentDetail((prevDetails) => {
            const updatedDetails = [...prevDetails];
            if (updatedDetails[index]?.status !== newStatus) { 
                updatedDetails[index].status = newStatus;
            }
            return updatedDetails;
        });
    };

    useEffect(() => {
        const allApproved = documentDetail.every(order => order.status === "Approve");
        setApproved(allApproved);
        console.log("allApproved",allApproved)
    }, [documentDetail]);
    
    
    

    const handleDocumentRejection= (e) => {
        const { value } = e.target;
        console.log("e",e)
        setDocumentRejectDetails(prevDetails => ({
            ...prevDetails,
            rejectedType: value
        }));
    };
    

    const updateRiderRegistration = () =>{
        try{
            axios.post(`${BASE_URL}/login/rider-registration`,{
                vehicleNumber: vehicleDetails?.vehicleNumber,
                ownerName: vehicleDetails?.ownerName,
                ownerMobileNumber: vehicleDetails?.ownerMobileNumber,
                vehicleType: vehicleDetails?.vehicleType,
                driverName: driverDetails?.driverName,
                city: driverDetails?.driverCity,
                state: driverDetails?.driverState,
                driverMobileNumber:driverDetails?.driverMobileNumber,
                riderReferralCode: driverDetails?.riderReferralCode,
                fcmId: driverDetails?.fcmId,
                documentDetails: documentDetail,
                rejectedReason: documentRejectDetails?.rejectedReason,
                accountHolderName: "",
                accountsNumber: "",
                accountsIFSC: "",
                language: language,
                rejectedType: documentRejectDetails?.rejectedType,
                approved: approved
            })
            toast.success("Rider information updated successfully!");
            setTimeout(() => {
                window.location.reload()
            }, 500);
        }catch{
            toast.error("Rider information not updated successfully!");
        }
    }

    const rechargeWallet = () => {
      setRechargeModel(true);
    }

    const handleViewClick = async (id) => {
        navigate(`/order-detail/${id}`);
    };

    const rechargeRiderWallet = async (amt,id) =>{
     try {
        await axios.post(`${BASE_URL}/wallet/rider-wallet-recharge`,{
            riderId: id,
            amount: amt,
            type: "Admin Recharge"
        }).then((response)=>{
            toast.success("Recharge Successfully");
            setRechargeModel(false);
        })
     }catch{
        toast.error("Not Recharge Successfully")
     }
    }

    const viewDocument = async (id,fileName) => {
        setIsDocumentModel(true)
        setDocumentModelDetail(id,fileName)
    }

    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 10; 
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    const paginatedOrders = riderOrderDetail?.slice(startIndex, endIndex);
  
    const totalPages = Math.ceil(riderOrderDetail?.length / itemsPerPage);
  
    const goToPage = (page) => {
      if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
      }
    };

    const [walletcurrentPage, setWalletCurrentPage] = useState(1);
    const walletitemsPerPage = 10;

    const walletstartIndex = (walletcurrentPage - 1) * walletitemsPerPage;
    const walletendIndex = walletstartIndex + walletitemsPerPage;

    const walletpaginatedOrders = riderWalletDetail?.slice(walletstartIndex, walletendIndex);

    const wallettotalPages = Math.ceil((riderWalletDetail?.length || 0) / walletitemsPerPage);

    const walletgoToPage = (page) => {
        if (page > 0 && page <= wallettotalPages) {
            setWalletCurrentPage(page);
        }
    };

    const [earringcurrentPage, setEarringCurrentPage] = useState(1);
    const earringitemsPerPage = 10;

    const earringstartIndex = (earringcurrentPage - 1) * earringitemsPerPage;
    const earringendIndex = earringstartIndex + earringitemsPerPage;

    const earringpaginatedOrders = riderTripDetail?.slice(earringstartIndex, earringendIndex);

    const earringtotalPages = Math.ceil((riderTripDetail?.length || 0) / earringitemsPerPage);

    const earringgoToPage = (page) => {
        if (page > 0 && page <= earringtotalPages) {
            setEarringCurrentPage(page);
        }
    };

    if (loading) {
        return <Loading />;
    }
  return (
    <>
        <ToastContainer/>
        <Card>
            <div className="card-header md:flex justify-between items-center mb-5 px-0">
                <div className="flex items-center">
                    <Link to="/">
                        <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                    </Link>
                    <h4 className="card-title ms-2">Rider Details  <span className="px-4 py-2 rounded-[6px] bg-danger-500 text-white">Rider Id: {riderId}</span></h4>
                </div>
                <div className="flex gap-2">
                    {/* <button type="button" className="btn btn-dark"><img src={} /></button> */}
                    <button type="button" className="btn btn-dark"><Icon icon="heroicons:bell-alert" className="text-[20px]"></Icon></button>
                    <button type="button" className="btn btn-dark"><Icon icon="heroicons:trash" className="text-[20px]"></Icon></button>
                    <button type="button" className="btn btn-dark"><Icon icon="heroicons:map-pin" className="text-[20px]"></Icon></button>
                </div>
            </div>
            <div className="">
                <Tabs>
                    <div className="max-w-[800px] mx-auto">
                        <TabList>
                            <Tab>Rider Details</Tab>
                            <Tab>Order History</Tab>
                            <Tab>Wallet</Tab>
                            <Tab>Earning</Tab>
                        </TabList>
                    </div>
                    <TabPanel>
                        <div className="change-rider-status mb-5">
                            <div>
                                <div className="form-check form-switch d-flex ps-0 gap-10">
                                    <label>Rider Profile Active</label>
                                    <Switch
                                        value={isDriverActive}
                                        onChange={() => driverActive(riderId)}
                                    />
                                </div>
                                <div className="form-check form-switch d-flex ps-0 gap-10">
                                    <label>Registration Fee Paid</label>
                                    <Switch
                                        value={driverRegistrationFee}
                                        onChange={() => driverRegistration(riderId)}
                                    />
                                </div>
                                <div className="form-check form-switch d-flex ps-0 gap-10">
                                
                                    <label>On Role Rider</label>
                                    <Switch
                                        value={driverRole}
                                        onChange={() => driveRoleChange(riderId)}
                                    />
                                </div>
                            </div>
                            <div>
                            <div>Created Date :{driverDetails?.createdDate}</div> 
                            <div>Document Submit : {driverDetails?.documentSubmit}</div>
                            <div>Rider OnBoard : {driverDetails?.riderOnboard} </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <h6 className="mt-4 mb-5">Vehicle Details</h6>
                            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                                <TextField
                                    label="Vehicle Number"
                                    id="vehicleNumber"
                                    type="text"
                                    name="vehicleNumber"
                                    value={vehicleDetails?.vehicleNumber || ""}
                                    onChange={handlevehicleDetails}
                                />
                                <TextField
                                    label="Owner Name"
                                    id="ownerName"
                                    type="text"
                                    name="ownerName"
                                    value={vehicleDetails?.ownerName || ""}
                                    onChange={handlevehicleDetails}
                                />
                                <TextField
                                    label="Owner Mobile Number"
                                    id="ownerMobileNumber"
                                    type="text"
                                    name="ownerMobileNumber"
                                    value={vehicleDetails?.ownerMobileNumber || ""}
                                    onChange={handlevehicleDetails}
                                />
                                <TextField
                                    label="Vehicle Type"
                                    id="vehicleType"
                                    type="text"
                                    name="vehicleType"
                                    value={vehicleDetails?.vehicleType || ""}
                                    onChange={handlevehicleDetails}
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <h6 className="mt-4 mb-5">Driver Details</h6>
                            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                                <TextField
                                    label="Driver Name"
                                    id="driverName"
                                    type="text"
                                    name="driverName"
                                    value={driverDetails?.driverName || ""}
                                    onChange={handleDriverDetails}
                                />
                                <TextField
                                    label="Driver Mobile Number"
                                    id="driverMobileNumber"
                                    type="text"
                                    name="driverMobileNumber"
                                    value={driverDetails?.driverMobileNumber || ""}
                                    onChange={handleDriverDetails}
                                />
                                <TextField
                                    label="City"
                                    id="driverCity"
                                    type="text"
                                    name="driverCity"
                                    value={driverDetails?.driverCity || ""}
                                    onChange={handleDriverDetails}
                                />
                                <TextField
                                    label="State"
                                    id="driverState"
                                    type="text"
                                    name="driverState"
                                    value={driverDetails?.driverState || ""}
                                    onChange={handleDriverDetails}
                                />
                                <TextField
                                    label="Rider Referral Code"
                                    id="riderReferralCode"
                                    type="text"
                                    name="riderReferralCode"
                                    value={driverDetails?.riderReferralCode || ""}
                                    onChange={handleDriverDetails}
                                />
                                <TextField
                                    label="FCM ID"
                                    id="fcmId"
                                    type="text"
                                    name="fcmId"
                                    value={driverDetails?.fcmId || ""}
                                    onChange={handleDriverDetails}
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <h6 className="mt-4 mb-5">Device Details</h6>
                            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                                <TextField
                                    label="Model"
                                    id="deviceModel"
                                    type="text"
                                    name="deviceModel"
                                    value={deviceDetails?.deviceModel || ""}
                                    onChange={handledeviceDetails}
                                />
                                <TextField
                                    label="Brand"
                                    id="deviceMake"
                                    type="text"
                                    name="deviceMake"
                                    value={deviceDetails?.deviceMake || ""}
                                    onChange={handledeviceDetails}
                                />
                                <TextField
                                    label="OS"
                                    id="deviceOs"
                                    type="text"
                                    name="deviceOs"
                                    value={deviceDetails?.deviceOs || ""}
                                    onChange={handledeviceDetails}
                                />
                                <TextField
                                    label="OS Version"
                                    id="deviceVersion"
                                    type="text"
                                    name="deviceVersion"
                                    value={deviceDetails?.deviceVersion || ""}
                                    onChange={handledeviceDetails}
                                />
                                <TextField
                                    label="App Version"
                                    id="appVersion"
                                    type="text"
                                    name="appVersion"
                                    value={deviceDetails?.appVersion || ""}
                                    onChange={handledeviceDetails}
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <h6 className="mt-4">Document Details</h6>
                            <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                                <thead>
                                    <tr>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Sr. No</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Document Id</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Document Name</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Document</span>
                                        </th>                                    
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Status</span>
                                        </th>
                                    </tr>  
                                </thead> 
                                <tbody>
                                    { documentDetail?.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">No orders found.</td>
                                        </tr>
                                    ) : (
                                        documentDetail?.map((order, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <Textinput defaultValue={order.mediaId}  />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Textinput defaultValue={order.documentType}  />                                                
                                                </td>                                            
                                                <td className="px-6 py-4">
                                                    <Button text="button" className="btn-dark" onClick={() => viewDocument(order.url, order.fileName)}>View Document</Button>
                                                </td>
                                                {/* <td className="px-6 py-4">{order.status}</td> */}
                                                <td className="px-6 py-4">   
                                                    <Select
                                                        id="role"
                                                        value={order.status || ""}
                                                        options={DocumentStatus}
                                                        onChange={(event) => handleDocumentStatus(event, index)}
                                                /></td> 
                                             
                                            </tr>
                                        ))
                                    )}
                                </tbody>                      
                            </table>
                        </div>
                        </div>
                        <div className="mb-5">
                            <h6 className="mt-4 mb-5">Reject Details</h6>
                            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                                {/* <Textinput
                                    label="Rejected Type"
                                    id="rejected_type"
                                    type="text"
                                /> */}
                                <Select
                                    label="Rejected Type"
                                    id="rejectedType"
                                    options={RejectionType}
                                    value={documentRejectDetails?.rejectedType || ""}
                                    onChange={handleDocumentRejection}
                                />
                                {/* <Textarea
                                    label="Rejected Reason"
                                    id="rejected_reason"
                                    type="text"
                                    value={documentRejectDetails?.rejectedReason || ""}
                                />  */}
                                <label>Rejected Reason</label>
                                <textarea
                                    className="documentreason"
                                    id="rejectedReason"
                                    name="rejectedReason"
                                    rows={3}
                                    type="text"
                                    value={documentRejectDetails?.rejectedReason || ""}
                                    onChange={handleDocumentRejectionReason}
                                />                           
                            </div>
                        </div>
                        <div className="mb-5">
                            <h6 className="mt-4 mb-5">Account Details</h6>
                            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                                <TextField
                                    label="UPI"
                                    id="upi"
                                    type="text"
                                    placeholder="UPI"
                                    
                                />                         
                            </div>
                        </div>
                        <div className="mb-5">
                            <h6 className="mt-4 mb-5">Language</h6>
                            <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                                <TextField
                                    label="Language"
                                    id="language"
                                    type="text"
                                    name="language"
                                    value={language || ""}
                                    onChange={handleLanguage}
                                />                        
                            </div>
                        </div>
                        <div className="text-end">
                            <Button type="button" className="btn-dark" onClick={() => updateRiderRegistration()}>Update</Button>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <h6 className="mt-4">Order Details</h6>
                        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                                <thead>
                                    <tr>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Sr. No</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Order Id</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Order Status</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Order Type</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Order Date</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Order Amount</span>
                                        </th>
                                    </tr>  
                                </thead> 
                                <tbody>
                                    {paginatedOrders?.length === 0 ? (
                                        <tr>
                                        <td colSpan="6" className="text-center p-4">No orders found.</td>
                                        </tr>
                                    ) : (
                                        paginatedOrders.map((order, index) => (
                                        <tr key={index} onClick={() => handleViewClick(order.order_Id)}>
                                            <td className="px-6 py-4">{startIndex + index + 1}</td>
                                            <td className="px-6 py-4">{order.order_Id}</td>
                                            <td className="px-6 py-4">{order.orderStatus}</td>
                                            <td className="px-6 py-4">{order.orderType}</td>
                                            <td className="px-6 py-4">{order.orderDate}</td>
                                            <td className="px-6 py-4">{order.orderAmount}</td>
                                        </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                            <div className="text-sm rounded leading-[16px] flex h-6 items-center justify-center transition-all duration-150">
                                <button 
                                disabled={currentPage === 1} 
                                className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180"
                                onClick={() => goToPage(currentPage - 1)}
                                >
                                Previous
                                </button>
                                {[...Array(totalPages).keys()].map((page) => (
                                <button
                                    key={page}
                                    className={`px-2 py-1 mx-1 rounded ${
                                        currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                    }`}
                                    onClick={() => goToPage(page + 1)}
                                >
                                    {page + 1}
                                </button>
                                ))}
                                <button 
                                className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180"
                                disabled={currentPage === totalPages} 
                                onClick={() => goToPage(currentPage + 1)}
                                >
                                Next
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="wallets">
                           <h6 className="mt-4">Wallet Details</h6>
                           <div onClick={ () => rechargeWallet()} >wallet</div>
                        </div>
                        
                        
                        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                                <thead>
                                    <tr>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Sr. No</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Order Id</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Order Date</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Wallet Txn</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Payment Mode</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Payment Type</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Rider Fees</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Order Amount</span>
                                        </th>
                                    </tr>  
                                </thead>
                                <tbody>
                                    {walletpaginatedOrders?.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">No orders found.</td>
                                        </tr>
                                    ) : (
                                        walletpaginatedOrders.map((order, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">{index + 1}</td>
                                                <td className="px-6 py-4">{order.tripId}</td>
                                                <td className="px-6 py-4">{order.tripDate}</td>
                                                <td className="px-6 py-4">{order.txnWallet}</td>
                                                <td className="px-6 py-4">{order.paymentMode}</td>
                                                <td className="px-6 py-4">{order.paymentType}</td>
                                                <td className="px-6 py-4">{order.riderFee}</td>
                                                <td className="px-6 py-4">{order.tripFare}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>                      
                            </table>
                            <div className="text-sm rounded leading-[16px] flex h-6 items-center justify-center transition-all duration-150">
           
                                <button
                                    disabled={walletcurrentPage === 1}
                                    className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180"
                                    onClick={() => walletgoToPage(walletcurrentPage - 1)}
                                >
                                    Previous
                                </button>

                                {[...Array(wallettotalPages).keys()].map((page) => (
                                    <button
                                        key={page}
                                        className={`px-2 py-1 mx-1 rounded ${
                                            walletcurrentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                        }`}
                                        onClick={() => walletgoToPage(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={walletcurrentPage === wallettotalPages}
                                    className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180"
                                    onClick={() => walletgoToPage(walletcurrentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <h6 className="mt-4">Earning</h6>
                        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                                <thead>
                                    <tr>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Sr. No</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Trip Id</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Trip Date</span>
                                        </th>
                                        <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                            <span className="block px-6 py-5 font-semibold">Trip Amount</span>
                                        </th>
                                    </tr>  
                                </thead> 
                                <tbody>
                                    {earringpaginatedOrders?.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center p-4">No orders found.</td>
                                        </tr>
                                    ) : (
                                        earringpaginatedOrders.map((order, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4">{index + 1}</td>
                                                <td className="px-6 py-4">{order.tripId}</td>
                                                <td className="px-6 py-4">{order.tripDate}</td>
                                                <td className="px-6 py-4">{order.tripAmount}</td>
                                                
                                            </tr>
                                        ))
                                    )}
                                </tbody>                      
                            </table>
                            <div className="text-sm rounded leading-[16px] flex h-6 items-center justify-center transition-all duration-150">
                                <button
                                    disabled={earringcurrentPage === 1}
                                    className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180"
                                    onClick={() => earringgoToPage(earringcurrentPage - 1)}
                                >
                                    Previous
                                </button>

                                {[...Array(earringtotalPages).keys()].map((page) => (
                                    <button
                                        key={page}
                                        className={`px-2 py-1 mx-1 rounded ${
                                            earringcurrentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                        }`}
                                        onClick={() => earringgoToPage(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={earringcurrentPage === earringtotalPages}
                                    className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180"
                                    onClick={() => earringgoToPage(earringcurrentPage + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </Card>

        {isRechargeModal && (  
           <Modal
        activeModal={isRechargeModal}
        uncontrol
        className="max-w-md"
        title=""
        
        onClose={() => setRechargeModel(false)}
      >
            <div className="">
              <h5 className="text-center mb-4">Recharge Rider Wallet</h5>
              <div>
                <TextField
                    label="Amount"
                    id="amount"
                    type="number"
                    name="amount"
                    value={rechageAmount.amount || ""}
                    onChange={handleRechargeRiderWallet}
                />
              </div>
              <div className="d-flex gap-2 justify-content-center mt-4">
                <Button className="btn btn-dark" type="button" onClick={() => rechargeRiderWallet(rechageAmount.amount,riderId)}>
                  Recharge
                </Button>
                <Button className="btn btn-outline-light" type="button" onClick={() => {setRechargeModel(false)}}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
      
      )} 
      
      {documentModel && (  
           <Modal
        activeModal={documentModel}
        uncontrol
        className="max-w-md"
        title=""
        
        onClose={() => setIsDocumentModel(false)}
      >
            <div className="">
              {viewDocumentModelDetail}
            </div>
          </Modal>
      
      )} 
    </>
  );
};

export default RiderDetail;
