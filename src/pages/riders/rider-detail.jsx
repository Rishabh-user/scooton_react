import React, { useEffect, useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useParams, Link, useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";
import Textinput from "../../components/ui/Textinput";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import TextField from "@mui/material/TextField";
import Switch from "@/components/ui/Switch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "@/components/ui/Select";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api";
import dayjs from "dayjs";
import { GoogleMap, LoadScript, useLoadScript, Marker } from '@react-google-maps/api';
import getRole from "../../store/utility";

const RejectionType = ["Information Rejected", "Document Rejected"];
const DocumentStatus = ["Approve", "Reject", "VERIFICATION_PENDING"]


const mapContainerStyle = {
    width: '50vw',
    height: '50vh',
};

const markers = [
    { lat: '', lng: '' }
];


const RiderDetail = () => {
    const { riderId } = useParams();
    const [searchParams] = useSearchParams();
    const documentStatus = searchParams.get("documentStatus") || '';
    const riderStatus = searchParams.get("riderStatus");
    const vehicleId = searchParams.get("vehicleid");
    const pagenumber = searchParams.get("page");
    const riderstype = searchParams?.get("rider") || '';
    const pagesizedata = searchParams?.get("pagesizedata") || '';
    const [riderOrderDetail, setRiderOrderDetail] = useState(null);
    const [riderWalletDetail, setRiderWalletDetail] = useState(null);
    const [riderTripDetail, setRiderTripDetail] = useState(null);
    const [documentDetail, setDocumentDetail] = useState([]);
    const [deviceDetails, setDeviceDetails] = useState(null);
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [documentRejectDetails, setDocumentRejectDetails] = useState(null)
    const [driverDetails, setDriverDetails] = useState(null);
    const [language, setLanguage] = useState(null);
    const [isDriverActive, setIsDriverActive] = useState(false);
    const [isRechargeModal, setRechargeModel] = useState(false)
    const [updateWallet, setUpdateWallet] = useState([]);
    const [driverRegistrationFee, setDriverRegistrationFee] = useState(false);
    const [driverRole, setDriverRole] = useState(false);
    const [approved, setApproved] = useState(true);
    const [rechageAmount, setRechageAmount] = useState({ amount: "" });
    const [documentModel, setIsDocumentModel] = useState(false)
    const [updateerrormsg, setUpdateErrorMsg] = useState(false)
    const [walletAmount, setWalletAmount] = useState([]);
    const [viewDocumentModelDetail, setDocumentModelDetail] = useState({
        id: '',
        fileName: ''
    })
    const [riderAddress, setRiderAddress] = useState(null);
    const [riderLastLocation, setRiderLastLocation] = useState(null);
    const [riderLatitude, setRiderLatitude] = useState(null);
    const [riderLongitude, setRiderLongitude] = useState(null);
    const mapRef = useRef(null);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
    const [ordeeCurrentPage, setOrderCurrentPage] = useState(0);
    const role = getRole();
    const navigate = useNavigate();
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [updateridersdetails, setUpdateRiderDetails] = useState(null);
    const [loading, setLoading] = useState(true);


    // useEffect(() => {
    //     if (mapRef.current && window.google) {
    //       new window.google.maps.marker.AdvancedMarkerElement({
    //         map: mapRef.current,
    //         position: center,
    //         title: "Advanced Marker",
    //       });
    //     }
    // }, []);

    useEffect(() => {
        const fetchRiderOrderDetail = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (token) {

                    const documentResponse = await axiosInstance.get(`${BASE_URL}/login/get-rider-full-details/${riderId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });


                    // setDocumentDetail(documentResponse.data.jsonData.documentDetails || []);
                    setDocumentDetail(
                        (documentResponse.data.jsonData.documentDetails || []).map(order => ({
                            ...order,
                            filteredStatus:
                                order.status === "Approve" || order.status === "Reject"
                                    ? DocumentStatus.filter(status => status !== "VERIFICATION_PENDING")
                                    : DocumentStatus
                        }))
                    );

                    setDeviceDetails(documentResponse.data.jsonData.deviceDetails);
                    setVehicleDetails(documentResponse.data.jsonData.vehicleDetails);
                    setDriverDetails(documentResponse.data.jsonData.driverDetails)
                    setDocumentRejectDetails(documentResponse.data.jsonData.rejectDetails)
                    setLanguage(documentResponse.data.jsonData)
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
    }, [riderId, updateWallet]);


    const handlevehicleDetails = (e) => {
        const { name, value } = e.target;
        setVehicleDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleDriverDetails = (e) => {
        const { name, value } = e.target;
        setDriverDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handledeviceDetails = (e) => {
        const { name, value } = e.target;
        setDeviceDetails((prev) => ({ ...prev, [name]: value }));
    };
    const handleLanguage = (e) => {
        const { name, value } = e.target;
        setLanguage((prev) => ({ ...prev, [name]: value }));

    };
    const handleDocumentRejectionReason = (e) => {
        const { name, value } = e.target;
        setDocumentRejectDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleRechargeRiderWallet = (e) => {
        const { name, value } = e.target;
        setRechageAmount((prev) => ({ ...prev, [name]: value }));
    };


    const driverActive = async (id) => {
        const newState = !isDriverActive;
        const token = localStorage.getItem("jwtToken");
        try {
            await axiosInstance.post(`${BASE_URL}/register/rider/active/${id}`, {
                active: newState
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            ).then((response) => {
                if (response.data.active) {
                    toast.success("Rider status enabled!");
                } else {
                    toast.success("Rider status disabled!");
                }

            })
            setIsDriverActive(newState)
        } catch {
            toast.error("Rider is not deactivated successfully!");
        }
    }

    const driverRegistration = async (id) => {
        const newState = !driverRegistrationFee;
        const token = localStorage.getItem("jwtToken");
        try {
            await axiosInstance.post(`${BASE_URL}/register/rider/registration-fee-paid/${id}`, {
                active: newState
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                if (response.data.registrationFeesPaid) {
                    toast.success("Rider status enabled");
                } else {
                    toast.success("Rider status disabled!");
                }
            })
            setDriverRegistrationFee(newState)
        } catch {
            toast.error("Registration fee paid status is not updated successfully!");
        }
    }

    const driveRoleChange = async (id) => {
        const newState = !driverRole;
        const token = localStorage.getItem("jwtToken");
        try {
            await axiosInstance.post(`${BASE_URL}/register/rider/onrole/${id}`, {
                active: newState
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                if (response.data.onRoleRider) {
                    toast.success("Rider status enabled");
                } else {
                    toast.success("Rider status disabled!");
                }
            })
            setDriverRole(newState)
        } catch {
            toast.error("Rider role is not updated successfully!");
        }
    }

    const viewDocument = async (id, fileName, index) => {
        setIsDocumentModel(true);
        setSelectedOrderIndex(index);
        setDocumentModelDetail(id, fileName);
    }

    const handleStatusChange = (newStatus) => {
        debugger
        if (selectedOrderIndex !== null) {
            setDocumentDetail((prevDetails) => {
                const updatedDetails = [...prevDetails];
                if (updatedDetails[selectedOrderIndex]?.status !== newStatus) {
                    updatedDetails[selectedOrderIndex].status = newStatus;
                }
                return updatedDetails;
            });
            console.log("documentDetaildocumentDetail", documentDetail)
        }
        debugger
        setIsDocumentModel(false);
    };

    const handleDocumentStatus = (event, index) => {
        debugger
        const newStatus = event.target.value;
        setDocumentDetail((prevDetails) => {
            const updatedDetails = [...prevDetails];
            if (updatedDetails[index]?.status !== newStatus) {
                updatedDetails[index].status = newStatus;
            }
            return updatedDetails;
        });
        debugger
        const allApproved = documentDetail.every(order => order.status !== "Reject");
        setApproved(allApproved);
    };

    useEffect(() => {
        const allApproved = documentDetail.every(order => order.status !== "Reject");
        setApproved(allApproved);
    }, [documentDetail]);




    const handleDocumentRejection = (e) => {
        const { value } = e.target;
        setDocumentRejectDetails(prevDetails => ({
            ...prevDetails,
            rejectedType: value
        }));

    };

    const mapLocation = async () => {
        try {
            await axiosInstance.get(`${BASE_URL}/login/get-rider-location/${riderId}`).then((response) => {

                setRiderAddress(response.data.riderAddress);
                setRiderLatitude(response.data.latitude);
                setRiderLongitude(response.data.longitude);
                setRiderLastLocation(response.data.lastLocationUpdate);
            });
        } catch (error) {
            console.error("Error fetching rider location:", error);
        }
    };

    const center = {
        lat: riderLatitude || 28.207609,
        lng: riderLongitude || 79.826660
    }


    const updateRiderRegistration = async () => {
        const payload = {
            vehicleNumber: vehicleDetails?.vehicleNumber,
            ownerName: vehicleDetails?.ownerName,
            ownerMobileNumber: vehicleDetails?.ownerMobileNumber,
            vehicleType: vehicleDetails?.vehicleType,
            driverName: driverDetails?.driverName,
            city: driverDetails?.driverCity,
            state: driverDetails?.driverState,
            driverMobileNumber: driverDetails?.driverMobileNumber,
            riderReferralCode: driverDetails?.riderReferralCode,
            fcmId: driverDetails?.fcmId,
            documentDetails: documentDetail,
            rejectedReason: documentRejectDetails?.rejectedReason,
            accountHolderName: "",
            accountsNumber: "",
            accountsIFSC: "",
            language: language.language,
            rejectedType: documentRejectDetails?.rejectedType,
            approved: approved
        };

        if (!approved && (!documentRejectDetails?.rejectedReason || documentRejectDetails.rejectedReason.trim() === '')) {
            setUpdateErrorMsg(true);
            toast.error("Note: State Reason for Rejection");
            return;
        }

        try {
            await axiosInstance.post(`${BASE_URL}/login/rider-registration`, payload);
            toast.success("Rider information updated successfully!");
            setUpdateErrorMsg(false);
        } catch (error) {
            toast.error("Rider information not updated successfully!");
        }
    };

    const rechargeWallet = () => {
        setRechargeModel(true);
    }

    const handleViewClick = async (id) => {
        navigate(`/order-detail/${id}`);
    };

    const rechargeRiderWallet = async (amt, id) => {
        const token = localStorage.getItem("jwtToken");
        try {
            await axiosInstance.post(`${BASE_URL}/wallet/rider-wallet-recharge`, {
                riderId: id,
                amount: amt,
                type: "Admin Recharge"
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then((response) => {
                toast.success("Recharge Successfully");
                setRechargeModel(false);
                setUpdateWallet();
            })
        } catch {
            toast.error("Not Recharge Successfully")
        }
    }



    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedOrders = riderOrderDetail?.slice(startIndex, endIndex);

    const totalPages = Math.ceil(riderOrderDetail?.length / itemsPerPage) || 0;

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const [walletcurrentPage, setWalletCurrentPage] = useState(1);
    const walletitemsPerPage = 50;

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
    const earringitemsPerPage = 50;

    const earringstartIndex = (earringcurrentPage - 1) * earringitemsPerPage;
    const earringendIndex = earringstartIndex + earringitemsPerPage;

    const earringpaginatedOrders = riderTripDetail?.slice(earringstartIndex, earringendIndex);

    const earringtotalPages = Math.ceil((riderTripDetail?.length || 0) / earringitemsPerPage);

    const earringgoToPage = (page) => {
        if (page > 0 && page <= earringtotalPages) {
            setEarringCurrentPage(page);
        }
    };

    // if (loading) {
    //     return <Loading />;
    // }

    const date = new Date();

    const formattedFromDate = dayjs(date).format("YYYY-MM-DD");


    const deleteRider = async (riderId) => {
        const token = localStorage.getItem("jwtToken");
        try {
            const response = await axiosInstance.delete(
                `${BASE_URL}/login/delete/${riderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                toast.success("Rider deleted successfully!");
                setTimeout(() => {
                    navigate('/non-registered-riders');
                }, 500);


            } else {
                toast.error("Failed to delete rider. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting rider:", error);
            toast.error("An error occurred while deleting the rider.");
        }


    };


    const orderHistory = async () => {
        setLoading(true);
        await axiosInstance.get(`${BASE_URL}/rider/get-rider-orders/${riderId}?endDate=${formattedFromDate}&page=0&size=500&startDate=2022-12-01`, {
        }).then((response) => {

            console.log("response", response)
            setRiderOrderDetail(response?.data?.jsonData?.orderDetails);
        }).catch((error) => {
            console.error("Error fetching order data:", error);
        }).finally(() => {
            setLoading(false);
        });

    }

    // const orderHistory = async () => {
    //     const riderOrderResponse = await axiosInstance.get(`${BASE_URL}/rider/get-rider-orders/${riderId}?endDate=${formattedFromDate}&page=0&size=500&startDate=2022-12-01`, {

    //     });
    //     console.log("riderOrderResponse",riderOrderResponse)
    //     setRiderOrderDetail(riderOrderResponse?.data?.jsonData?.orderDetails);

    // }

    const orderWallet = async () => {
        setLoading(true);
        await axiosInstance.get(`${BASE_URL}/rider/v2/get-rider-wallet/${riderId}?page=0&size=100`, {
        }).then((response) => {
            console.log("response", response)
            setRiderWalletDetail(response?.data?.jsonData?.walletTxn);
            setWalletAmount(response?.data?.jsonData?.balance);
        }).catch((error) => {
            console.error("Error fetching order data:", error);
        }).finally(() => {
            setLoading(false);
        })

    }

    const earning = async () => {
        setLoading(true);
        await axiosInstance.get(`${BASE_URL}/rider/get-rider-earning/${riderId}?endDate=${formattedFromDate}&page=0&size=500&startDate=2022-12-01`, {
        }).then((response) => {
            console.log("response", response)
            setRiderTripDetail(response?.data?.jsonData?.tripDetails);
        }).catch((response) => {
            console.error("Error fetching order data:", error);
        }).finally(() => {
            setLoading(false);
        })

    }



    return (
        <>
            <ToastContainer />
            <Card>
                <div className="card-header md:flex justify-between items-center mb-5 px-0 pt-0">
                    <div className="flex items-center">
                        {/* {documentStatus && riderStatus && pagenumber && riderStatus && vehicleId ? (
                        <Link to={`/all-riders?page=${pagenumber || 0}&documentStatus=${documentStatus}&riderStatus=${riderStatus}&vehicleid=${vehicleId}`}>
                           <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                        </Link>
                    ) : (
                        <Link to="/all-riders">
                             <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                        </Link>
                    )} */}
                        {riderStatus && pagenumber && vehicleId ? (
                            riderstype === 'nonregister' ? (
                                <Link to={`/non-registered-riders?page=${pagenumber || 0}&documentStatus=${documentStatus}&riderStatus=${riderStatus}&vehicleid=${vehicleId}&rider=${riderstype}&pagesizedata=${pagesizedata}`}>
                                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                                </Link>
                            ) : riderstype === 'register' ? (
                                <Link to={`/registered-riders?page=${pagenumber || 0}&documentStatus=${documentStatus}&riderStatus=${riderStatus}&vehicleid=${vehicleId}&rider=${riderstype}&pagesizedata=${pagesizedata}`}>
                                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                                </Link>
                            ) : (
                                <Link to={`/all-riders?page=${pagenumber || 0}&documentStatus=${documentStatus}&riderStatus=${riderStatus}&vehicleid=${vehicleId}&pagesizedata=${pagesizedata}`}>
                                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                                </Link>
                            )
                        ) : null}

                        {riderstype === 'onroleriders' ? (
                            <Link to="/on-role-riders">
                                <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                            </Link>
                        ) : null}



                        <h4 className="card-title ms-2 mb-0">Rider Details  <span className="px-2 py-1 text-sm rounded-[6px] bg-danger-500 text-white">Rider Id: {riderId}</span></h4>
                    </div>


                    <div className="flex gap-2">
                        {/* <button type="button" className="btn btn-dark"><img src={} /></button> */}
                        <button type="button" className="btn btn-dark p-2"><Icon icon="heroicons:bell-alert" className="text-[20px]"></Icon></button>
                        <button type="button" className="btn btn-dark p-2" onClick={() => setIsDeleteModal(true)}><Icon icon="heroicons:trash" className="text-[20px]"></Icon></button>
                        {isDeleteModal && (
                            <Modal
                                activeModal={isDeleteModal}
                                uncontrol
                                className="max-w-md"
                                title=""
                                centered
                                onClose={() => setIsDeleteModal(false)}
                            >
                                <div>
                                    <h5 className="text-center">Are you sure you want to delete this rider?</h5>
                                    <div className="d-flex gap-2 justify-content-center mt-4">
                                        <Button
                                            className="btn btn-dark"
                                            type="button"
                                            onClick={() => setIsDeleteModal(false)}
                                        >
                                            No
                                        </Button>
                                        <Button
                                            className="btn btn-outline-light"
                                            type="button"
                                            onClick={() => {
                                                deleteRider(riderId);
                                                setIsDeleteModal(false);
                                            }}
                                        >
                                            Yes
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                        )}
                        <button type="button" className="btn btn-dark p-2" onClick={() => { setIsMapOpen(true), mapLocation() }}><Icon icon="heroicons:map-pin" className="text-[20px]"></Icon></button>
                        {
                            isMapOpen && (
                                <Modal
                                    activeModal={isMapOpen}
                                    uncontrol
                                    className="max-w-5xl text-black"
                                    title="Rider Details"
                                    centered
                                    onClose={() => setIsMapOpen(false)}
                                >
                                    <div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", marginBottom: "10px", }}>
                                            <div><strong>Map Rider Id:</strong> {riderId}</div>
                                            <div><strong>Rider Mobile:</strong> {driverDetails?.driverMobileNumber || ""}</div>
                                            <div><strong>Device:</strong> {deviceDetails?.deviceMake || ""}</div>
                                            <div><strong>Model:</strong> {deviceDetails?.deviceModel || ""}</div>
                                            <div><strong>OS version:</strong> {deviceDetails?.deviceOs || ""}-{deviceDetails?.deviceVersion || ""}</div>
                                            <div><strong>App Version:</strong> {deviceDetails?.appVersion || ""}</div>
                                        </div>
                                        {/* <h6 className="text-center map mb-2">Map Rider Id: {riderId}; Rider Mobile: {driverDetails?.driverMobileNumber || ""}; Device: {deviceDetails?.deviceMake || ""};  Modal: {deviceDetails?.deviceModel || ""}; OS version: {deviceDetails?.deviceOs || ""}-{deviceDetails?.deviceVersion || ""}; App Version: {deviceDetails?.appVersion || ""}</h6> */}
                                        <LoadScript googleMapsApiKey="AIzaSyDTetPmohnWdWT0lsYV9iT-58Z5Gm4jmgA" preventGoogleFonts={true}>
                                            <div className="overflow-hidden">
                                                <GoogleMap
                                                    mapContainerStyle={mapContainerStyle}
                                                    center={center}
                                                    zoom={20}
                                                    onLoad={(map) => (mapRef.current = map)}
                                                >
                                                    {markers.map((marker, index) => (
                                                        <Marker key={index} position={{ lat: riderLatitude, lng: riderLongitude }} />
                                                    ))}
                                                </GoogleMap>
                                            </div>

                                        </LoadScript>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "5px", marginTop: "20px", fontSize: "14px", }}>
                                        <div><strong>Updated:</strong> {riderLastLocation}</div>
                                        <div><strong>Rider Location:</strong> {riderAddress}</div>
                                    </div>
                                    {/* <div className="row mt-3">
                                <div className="col-md-3 map">
                                   <p>Updated: {riderLastLocation}</p>
                                </div>
                                <div className="col-md-9 text-end map">
                                  <p>Rider Location: {riderAddress}</p>
                                </div>
                            </div> */}
                                    {/* <div className="text-end mt-3">
                                <button 
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    onClick={() => setIsMapOpen(false)}
                                >
                                    Close
                                </button>
                            </div> */}

                                </Modal>
                            )}
                    </div>
                </div>
                <div className="">
                    <Tabs>
                        <div className="max-w-[800px] mx-auto">
                            <TabList>
                                <Tab>Rider Details</Tab>
                                <Tab onClick={() => orderHistory()}>Order History</Tab>
                                <Tab onClick={() => orderWallet()}>Wallet</Tab>
                                <Tab onClick={() => earning()}>Earning</Tab>
                            </TabList>
                        </div>
                        <TabPanel>
                            <div className="change-rider-status mb-3">
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
                                    <div>Created Date : {driverDetails?.createdDate}</div>
                                    <div>Document Submit : {driverDetails?.documentSubmit}</div>
                                    <div>Rider OnBoard : {driverDetails?.riderOnboard} </div>
                                </div>
                            </div>
                            <div className="mb-5">
                                <h6 className="mt-4 mb-3">Vehicle Details</h6>
                                <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 common-box-shadow">
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
                                        readonly='readonly'
                                        value={vehicleDetails?.ownerMobileNumber || ""}
                                    //onChange={handlevehicleDetails}
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
                                <h6 className="mt-4 mb-3">Driver Details</h6>
                                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 common-box-shadow">
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
                                <h6 className="mt-4 mb-3">Device Details</h6>
                                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 common-box-shadow">
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
                                <div className="mx-auto shadow-base dark:shadow-none my-3 rounded-md overflow-x-auto">
                                    <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                                        <thead>
                                            <tr>
                                                <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                                    <span className="block px-6 py-3 font-semibold">Sr. No</span>
                                                </th>
                                                <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                                    <span className="block px-6 py-3 font-semibold">Document Id</span>
                                                </th>
                                                <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                                    <span className="block px-6 py-3 font-semibold">Document Name</span>
                                                </th>
                                                <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                                    <span className="block px-6 py-3 font-semibold">Document</span>
                                                </th>
                                                <th className="bg-slate-50 dark:bg-slate-700 dark:text-slate-300 text-xs text-left font-medium leading-4 uppercase text-slate-600">
                                                    <span className="block px-6 py-3 font-semibold">Status</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documentDetail?.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center p-4">No orders found.</td>
                                                </tr>
                                            ) : (
                                                documentDetail?.map((order, index) => (
                                                    <tr key={index}>
                                                        <td className="px-6 py-3">{index + 1}</td>
                                                        <td className="px-6 py-3">
                                                            <Textinput defaultValue={order.mediaId} />
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <Textinput defaultValue={order.documentType} />
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <Button text="button" className="btn-dark" onClick={() => viewDocument(order.url, order.fileName, index)}>View Document</Button>
                                                        </td>
                                                        {/* <td className="px-6 py-4">{order.status}</td> */}
                                                        <td className="px-6 py-3">
                                                            <Select
                                                                id="role"
                                                                value={order.status || ""}
                                                                options={order.filteredStatus}
                                                                onChange={(event) => handleDocumentStatus(event, index)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="mb-5">
                                <h6 className="mt-4 mb-3">Reject Details</h6>
                                <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 common-box-shadow">
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
                                    <div>
                                        <label className="form-label">Rejected Reason</label>
                                        <textarea
                                            className="documentreason form-control"
                                            id="rejectedReason"
                                            name="rejectedReason"
                                            rows={3}
                                            type="text"
                                            value={documentRejectDetails?.rejectedReason || ""}
                                            onChange={handleDocumentRejectionReason}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-5">
                                <h6 className="mt-4 mb-3">Account Details</h6>
                                <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 common-box-shadow">
                                    <TextField
                                        label="UPI"
                                        id="upi"
                                        type="text"
                                        placeholder="UPI"

                                    />
                                </div>
                            </div>
                            <div className="mb-5">
                                <h6 className="mt-4 mb-3">Language</h6>
                                <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 common-box-shadow">
                                    <TextField
                                        label="Language"
                                        id="language"
                                        type="text"
                                        name="language"
                                        value={language?.language || ""}
                                        onChange={handleLanguage}
                                    />
                                </div>
                            </div>
                            <div className="text-end">
                                <Button type="button" className="btn-dark" onClick={() => updateRiderRegistration()}>Update</Button>
                                {updateerrormsg && (
                                    <p className="mt-1 error-msg">Note: State Reason for Rejection</p>
                                )}
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <h6 className="mt-5">Order Details</h6>
                            {
                                loading ? (
                                    <div className="flex justify-center items-center w-100">
                                        <Loading />
                                    </div>
                                ) : (
                                    <>
                                        <div className="mx-auto shadow-base dark:shadow-none my-3 rounded-md overflow-x-auto">
                                            <>
                                                <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                                                    <thead className="bg-slate-200 dark:bg-slate-700">
                                                        <tr>
                                                            <th className="table-th">
                                                                <span >Sr. No</span>
                                                            </th>
                                                            <th className="table-th">
                                                                <span>Order Id</span>
                                                            </th>
                                                            <th className="table-th">
                                                                <span>Order Status</span>
                                                            </th>
                                                            <th className="table-th">
                                                                <span>Order Type</span>
                                                            </th>
                                                            <th className="table-th">
                                                                <span>Order Date</span>
                                                            </th>
                                                            <th className="table-th">
                                                                <span>Order Amount</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                                        {paginatedOrders?.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="6" className="text-center p-4">No orders found.</td>
                                                            </tr>
                                                        ) : (
                                                            paginatedOrders?.map((order, index) => (
                                                                <tr key={index} onClick={() => handleViewClick(order.order_Id)}>
                                                                    <td className="table-td">{startIndex + index + 1}</td>
                                                                    <td className="table-td">{order.order_Id}</td>
                                                                    <td className="table-td">{order.orderStatus}</td>
                                                                    <td className="table-td">{order.orderType}</td>
                                                                    <td className="table-td">{order.orderDate}</td>
                                                                    <td className="table-td">{order.orderAmount}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </table>
                                            </>
                                        </div>
                                        <div className="text-sm rounded leading-[16px] flex h-6 items-center justify-center transition-all duration-150">
                                            <button
                                                disabled={currentPage === 1}
                                                className="text-sm mx-2 leading-4 text-slate-900 dark:text-white rtl:rotate-180"
                                                onClick={() => goToPage(currentPage - 1)}
                                            >
                                                Previous
                                            </button>
                                            {[...Array(totalPages)?.keys()]?.map((page) => (
                                                <button
                                                    key={page}
                                                    className={`px-2 py-1 mx-2 rounded ${currentPage === page + 1 ? 'bg-scooton-900 text-white' : 'bg-gray-200 text-black'
                                                        }`}
                                                    onClick={() => goToPage(page + 1)}
                                                >
                                                    {page + 1}
                                                </button>
                                            ))}
                                            <button
                                                className="text-sm mx-2 leading-4 text-slate-900 dark:text-white rtl:rotate-180"
                                                disabled={currentPage === totalPages}
                                                onClick={() => goToPage(currentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )
                            }
                        </TabPanel>
                        <TabPanel>

                            <div className="wallets">
                                <h6 className="mt-3">Wallet Details <span className="text-sm text-scooton-500">(Balance : {walletAmount})</span></h6>

                                {role == 'ROLE_SUPER_ADMIN' && (
                                    <button type="button" onClick={() => rechargeWallet()} className="btn btn-dark p-2"><Icon icon="heroicons:wallet" className="text-[20px]"></Icon></button>
                                )}

                            </div>
                            {
                                loading ? (
                                    <div className="flex justify-center items-center w-100">
                                        <Loading />
                                    </div>
                                ) : (
                                    <>
                                        <div className="mx-auto shadow-base dark:shadow-none my-3 rounded-md overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                                                <thead className=" bg-slate-200 dark:bg-slate-700">
                                                    <tr>
                                                        <th className=" table-th">
                                                            <span>Sr. No</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Order Id</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Order Date</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Wallet Txn</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Payment Mode</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Payment Type</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Rider Fees</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Order Amount</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Payment Status</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                                    {walletpaginatedOrders?.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="8" className="text-center p-4">No orders found.</td>
                                                        </tr>
                                                    ) : (
                                                        walletpaginatedOrders?.map((order, index) => (
                                                            <tr key={index}>
                                                                <td className="table-td">{index + 1}</td>
                                                                <td className="table-td">{order.tripId}</td>
                                                                <td className="table-td">{order.tripDate}</td>
                                                                <td className="table-td">{order.txnWallet}</td>
                                                                <td className="table-td">{order.paymentMode}</td>
                                                                <td className="table-td">{order.paymentType}</td>
                                                                <td className="table-td">{order.riderFee}</td>
                                                                <td className="table-td">{order.tripFare}</td>
                                                                <td className="table-td">
                                                                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                                                </td>

                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-sm rounded leading-[16px] flex h-6 items-center justify-center transition-all duration-150">
                                            <button
                                                disabled={walletcurrentPage === 1}
                                                className="text-sm leading-4 mx-2 text-slate-900 dark:text-white rtl:rotate-180"
                                                onClick={() => walletgoToPage(walletcurrentPage - 1)}
                                            >
                                                Previous
                                            </button>

                                            {[...Array(wallettotalPages)?.keys()]?.map((page) => (
                                                <button
                                                    key={page}
                                                    className={`px-2 py-1 mx-2 rounded ${walletcurrentPage === page + 1 ? 'bg-scooton-900 text-white' : 'bg-gray-200 text-black'
                                                        }`}
                                                    onClick={() => walletgoToPage(page + 1)}
                                                >
                                                    {page + 1}
                                                </button>
                                            ))}

                                            <button
                                                disabled={walletcurrentPage === wallettotalPages}
                                                className="text-sm leading-4 mx-2 text-slate-900 dark:text-white rtl:rotate-180"
                                                onClick={() => walletgoToPage(walletcurrentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )
                            }
                        </TabPanel>
                        <TabPanel>
                            <h6 className="mt-5">Earning</h6>
                            {
                                loading ? (
                                    <div className="flex justify-center items-center w-100">
                                        <Loading />
                                    </div>
                                ) : (
                                    <>
                                        <div className="mx-auto shadow-base dark:shadow-none my-3 rounded-md overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                                                <thead className=" bg-slate-200 dark:bg-slate-700">
                                                    <tr>
                                                        <th className=" table-th">
                                                            <span>Sr. No</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Trip Id</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Trip Date</span>
                                                        </th>
                                                        <th className=" table-th">
                                                            <span>Trip Amount</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                                    {earringpaginatedOrders?.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="4" className="text-center p-4">No orders found.</td>
                                                        </tr>
                                                    ) : (
                                                        earringpaginatedOrders?.map((order, index) => (
                                                            <tr key={index}>
                                                                <td className="table-td">{index + 1}</td>
                                                                <td className="table-td">{order.tripId}</td>
                                                                <td className="table-td">{order.tripDate}</td>
                                                                <td className="table-td">{order.tripAmount}</td>

                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-sm rounded leading-[16px] flex h-6 items-center justify-center transition-all duration-150">
                                            <button
                                                disabled={earringcurrentPage === 1}
                                                className="text-sm leading-4 mx-2 text-slate-900 dark:text-white rtl:rotate-180"
                                                onClick={() => earringgoToPage(earringcurrentPage - 1)}
                                            >
                                                Previous
                                            </button>

                                            {[...Array(earringtotalPages)?.keys()]?.map((page) => (
                                                <button
                                                    key={page}
                                                    className={`px-2 py-1 mx-2 rounded ${earringcurrentPage === page + 1 ? 'bg-scooton-500 text-white' : 'bg-gray-200 text-black'
                                                        }`}
                                                    onClick={() => earringgoToPage(page + 1)}
                                                >
                                                    {page + 1}
                                                </button>
                                            ))}

                                            <button
                                                disabled={earringcurrentPage === earringtotalPages}
                                                className="text-sm leading-4 mx-2 text-slate-900 dark:text-white rtl:rotate-180"
                                                onClick={() => earringgoToPage(earringcurrentPage + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )
                            }

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
                    centered
                    onClose={() => setRechargeModel(false)}
                >
                    <div className="">
                        <h5 className="text-center mb-4">Recharge Rider Wallet</h5>
                        <div className="w-full">
                            <label className="form-label">Enter Amount</label>
                            <input
                                id="amount"
                                type="number"
                                name="amount"
                                className="w-full form-control"
                                value={rechageAmount.amount || ""}
                                onChange={handleRechargeRiderWallet}
                            />
                        </div>
                        <div className="d-flex gap-2 justify-content-center mt-4">
                            <Button className="btn btn-dark" type="button" onClick={() => rechargeRiderWallet(rechageAmount.amount, riderId)}>
                                Recharge
                            </Button>
                            <Button className="btn btn-outline-light" type="button" onClick={() => { setRechargeModel(false) }}>
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
                    className="max-w-4xl"
                    title=""
                    centered
                    onClose={() => setIsDocumentModel(false)}
                >
                    <div className="viewdocument-frame">
                        {viewDocumentModelDetail.id}
                        <iframe
                            src={viewDocumentModelDetail}
                            width="100%"
                            height="400px"
                            title="Document Viewer"
                        />
                    </div>
                    <div className="d-flex gap-2 justify-content-end mt-4">
                        <Button className="btn btn-dark" type="button" onClick={() => handleStatusChange("Reject")}>
                            Reject
                        </Button>
                        <Button className="btn btn-outline-light" type="button" onClick={() => handleStatusChange("Accepted")}>
                            Accept
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default RiderDetail;
