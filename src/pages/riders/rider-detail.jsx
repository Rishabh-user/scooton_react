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
import Textarea from "../../components/ui/Textarea" 


const RiderDetail = () => {
    const { riderId } = useParams();
    const [riderOrderDetail, setRiderOrderDetail] = useState(null);
    const [riderWalletDetail, setRiderWalletDetail] = useState(null);
    const [riderTripDetail, setRiderTripDetail] = useState(null);
    const [documentDetail, setDocumentDetail] = useState(null);
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
            setDocumentDetail(documentResponse.data.jsonData.documentDetails);
          }
        } catch (error) {
          console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
      };  
      fetchRiderOrderDetail();
    }, [riderId]);

    if (loading) {
        return <Loading />;
    }
  return (
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
                    <div className="mb-5">
                        <h6 className="mt-4 mb-5">Vehicle Details</h6>
                        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                            <Textinput
                                label="Vehicle Number"
                                id="vehicle_number"
                                type="text"
                            />
                            <Textinput
                                label="Owner Name"
                                id="owner_name"
                                type="text"
                            />
                            <Textinput
                                label="Owner Mobile Number"
                                id="owner_number"
                                type="text"
                            />
                            <Textinput
                                label="Vehicle Type"
                                id="vehicle_type"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <h6 className="mt-4 mb-5">Driver Details</h6>
                        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                            <Textinput
                                label="Driver Name"
                                id="driver_name"
                                type="text"
                            />
                            <Textinput
                                label="Driver Mobile Number"
                                id="driver_number"
                                type="text"
                            />
                            <Textinput
                                label="City"
                                id="city"
                                type="text"
                            />
                            <Textinput
                                label="State"
                                id="state"
                                type="text"
                            />
                            <Textinput
                                label="Rider Referral Code"
                                id="rider_referral"
                                type="text"
                            />
                            <Textinput
                                label="FCM ID"
                                id="fmc_id"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <h6 className="mt-4 mb-5">Device Details</h6>
                        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                            <Textinput
                                label="Model"
                                id="model"
                                type="text"
                            />
                            <Textinput
                                label="Brand"
                                id="brand"
                                type="text"
                            />
                            <Textinput
                                label="OS"
                                id="os"
                                type="text"
                            />
                            <Textinput
                                label="OS Version"
                                id="os_version"
                                type="text"
                            />
                            <Textinput
                                label="App Version"
                                id="app_version"
                                type="text"
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
                                {documentDetail.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">No orders found.</td>
                                    </tr>
                                ) : (
                                    documentDetail.map((order, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <Textinput defaultValue={order.mediaId}  />
                                            </td>
                                            <td className="px-6 py-4">
                                                <Textinput defaultValue={order.documentType}  />                                                
                                            </td>                                            
                                            <td className="px-6 py-4">
                                                <Button text="button" className="btn-dark">View Document</Button>
                                            </td>
                                            <td className="px-6 py-4">{order.status}</td>
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
                            <Textinput
                                label="Rejected Type"
                                id="rejected_type"
                                type="text"
                            />
                            <Textarea
                                label="Rejected Reason"
                                id="rejected_reason"
                                type="text"
                            />                           
                        </div>
                    </div>
                    <div className="mb-5">
                        <h6 className="mt-4 mb-5">Account Details</h6>
                        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                            <Textinput
                                label="UPI"
                                id="upi"
                                type="text"
                            />                         
                        </div>
                    </div>
                    <div className="mb-5">
                        <h6 className="mt-4 mb-5">Language</h6>
                        <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                            <Textinput
                                label="Language"
                                id="language"
                                type="text"
                            />                        
                        </div>
                    </div>
                    <div className="text-end">
                        <Button type="button" className="btn-dark">Update</Button>
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
                                {riderOrderDetail.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">No orders found.</td>
                                    </tr>
                                ) : (
                                    riderOrderDetail.map((order, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{order.orderId}</td>
                                            <td className="px-6 py-4">{order.orderStatus}</td>
                                            <td className="px-6 py-4">{order.orderType}</td>
                                            <td className="px-6 py-4">{order.orderDate}</td>
                                            <td className="px-6 py-4">{order.orderAmount}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>                      
                        </table>
                    </div>
                </TabPanel>
                <TabPanel>
                    <h6 className="mt-4">Wallet Details</h6>
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
                                {riderWalletDetail.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4">No orders found.</td>
                                    </tr>
                                ) : (
                                    riderWalletDetail.map((order, index) => (
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
                                {riderTripDetail.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4">No orders found.</td>
                                    </tr>
                                ) : (
                                    riderTripDetail.map((order, index) => (
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
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    </Card>
  );
};

export default RiderDetail;
