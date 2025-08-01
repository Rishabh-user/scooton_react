import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Icon } from "@iconify/react/dist/iconify.js";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api";
import { GoogleMap, LoadScript, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '70vh',
};

const markers = [
    { lat: '', lng: '' }
];



const OrderDetail = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { thirdPartyUsername } = useParams();
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPickupModal, setisPickupModal] = useState(false);
    const [isDeliveryModal, setisdeliveryModal] = useState(false);
    const [isLoadingInvoice, setisLoadingInvoice] = useState(false);
    const [pickup, setPickup] = useState(false);
    const [delivered, setDelivered] = useState(false);
    const [nearRiderMap, setNearRiderMap] = useState(false);
    const [riderNearLocation, setRiderNearLocation] = useState([]);
    const [nearActiveRider, setNearActiveRider] = useState(null);
    const [nearInActiveRider, setNearInActiveRider] = useState(null);
    const [nearTotalRider, setNearTotalRider] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedPickupMarker, setSelectedPickupMarker] = useState(null);
    const [selectedDroppMarker, setSelectedDropMarker] = useState(null);
    const mapRef = useRef(null);
    const [searchParams] = useSearchParams();
    const customRadio = searchParams.get("customRadio") || '';
    const searchId = searchParams.get("searchId") || '';
    const searchText = searchParams.get("searchText") || '';
    const pagenumber = searchParams.get("page");
    const orders = searchParams?.get("orders");
    const pagesizedata = searchParams?.get("pagesizedata");

    const openPickupModal = async () => {
        setisPickupModal(true);
    }
    const openDeliveryModal = async () => {
        setisdeliveryModal(true);
    }

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (thirdPartyUsername) {
                    const response = await axiosInstance.get(`${BASE_URL}/order/v2/get-order-details/${orderId}?orderType=THIRDPARTY`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setOrderDetail(response.data.jsonData);
                } else {
                    const response = await axiosInstance.get(`${BASE_URL}/order/v2/get-order-details/${orderId}?orderType=CITYWIDE`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setOrderDetail(response.data.jsonData);
                }
            } catch (error) {
                console.error('Error fetching order detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId, pickup, delivered]);

    // Rider Assign
    const [riderId, setRiderId] = useState('');
    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                orderType: thirdPartyUsername ? "THIRDPARTY" : "CITYWIDE"
            };

            const response = await axiosInstance.post(
                `${BASE_URL}/order/v2/orders/accept-city-wide-order-by-rider/${riderId}/${orderId}/ACCEPTED`,
                payload
            );

            if (response.data.statusCode === 200) {
                toast.success("Rider assigned successfully!");
                setRiderId('');
            } else {
                toast.error(response.data.message || "Failed to assign rider.");
            }
        } catch (error) {
            const message = error?.response?.data?.message || "An unexpected error occurred while assigning rider.";
            toast.error(message);
            console.error("Assign rider error:", error);
        }
    };
    // Rider Assign

    if (loading) {
        return <Loading />;
    }

    if (!orderDetail) {
        return <div>Order not found.</div>;
    }

    const {
        orderDetails,
        customerDetails,
        packageDetails,
        cancelDetails,
        riderDetails,
        vehicleDetails,
        tripDetails
    } = orderDetail;

    const handlePickupConfirm = async (payload) => {
        try {
            let response;
            if (thirdPartyUsername) {
                response = await axiosInstance.post(
                    `${BASE_URL}/thirdParty/pickup-delivery-otp-verification-admin/`,
                    payload
                );
            } else {
                response = await axiosInstance.post(
                    `${BASE_URL}/rider/pickup-delivery-otp-verification-admin/`,
                    payload
                );
            }
            if (response?.data?.message === "Success") {
                setisPickupModal(false);
                setPickup(true);
                toast.success('Pickup confirmed successfully!');
            } else {
                toast.error('Failed to confirm pickup: ' + (response?.data?.message || "Unknown error"));
            }
        } catch (error) {
            toast.error('An error occurred while confirming pickup. Please try again.');
        }
    };
    const handleDeliveryConfirm = async (payload) => {
        try {
            let response;
            if (thirdPartyUsername) {
                response = await axiosInstance.post(
                    `${BASE_URL}/thirdParty/pickup-delivery-otp-verification-admin/`,
                    payload
                );
            } else {
                response = await axiosInstance.post(
                    `${BASE_URL}/rider/pickup-delivery-otp-verification-admin/`,
                    payload
                );
            }
            if (response?.data?.message === "Success") {
                toast.success('Delivery confirmed successfully!');
                setDelivered(true);
                setisdeliveryModal(false);
            } else {
                toast.error('Failed to confirm pickup: ' + response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while confirming pickup. Please try again.');
        }
    };
    const downloadInvoice = async () => {

        setisLoadingInvoice(true);
        try {

            const response = await axiosInstance.post(
                `${BASE_URL}/order/orders/admin/getInvoice/${orderId}`,
                {},
                { responseType: 'blob' }
            );
            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Invoice_${orderId}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                toast.success('Invoice Download successfully!');

            } else {
                toast.error('Failed to failed to download: ' + response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while downloading invoice. Please try again.');
        } finally {
            setLoading(false);
            setisLoadingInvoice(false);
        };

    };

    const nearByRiderDetails = async () => {
        const params = {
            radius: 5,
            userLatitude: customerDetails?.pickupLocation?.lat,
            userLongitude: customerDetails?.pickupLocation?.lon,
            vehicleCategoryId: orderDetail?.vehicleDetails?.categoryId
        }
        try {
            await axiosInstance.get(`${BASE_URL}/rider/nearby-riders`, { params }).then((response) => {
                if (response.data.length > 0) {
                    setNearRiderMap(true);
                    setRiderNearLocation(response.data)
                    const activeRiders = response.data.filter(rider => rider.riderActiveForOrders === true);
                    const countActiveRiders = activeRiders.length;
                    setNearActiveRider(countActiveRiders);

                    const inactiveRiders = response.data.filter(rider => rider.riderActiveForOrders === false);
                    const countInactiveRiders = inactiveRiders.length;
                    setNearInActiveRider(countInactiveRiders);

                    const totalRiders = response.data.length;
                    setNearTotalRider(totalRiders)
                }
                else {
                    toast.error("Sorry, no rider available at the moment. Please try again later.")
                }
            })
        } catch (error) {
            console.error("Error fetching rider location:", error);
        }

    }

    const pickupLocation = {
        lat: customerDetails?.pickupLocation?.lat,
        lng: customerDetails?.pickupLocation?.lon,
        address: customerDetails?.pickupAddress,
        name: "Pickup Location"
    }

    const dropLocation = {
        lat: customerDetails?.deliveryLocation?.lat,
        lng: customerDetails?.deliveryLocation?.lon,
        address: customerDetails?.deliveryAddress,
        name: "Drop Location"
    }
    const mrp = orderDetails?.orderAmount?.mrp || 0;
    const discount = orderDetails?.orderAmount?.discount || 0;
    const mcdTax = orderDetails?.orderAmount?.mcdTax || 0;
    const stateTax = orderDetails?.orderAmount?.stateTax || 0;
    const tollTax = orderDetails?.orderAmount?.tollTax || 0;

    const calculatedAmount = mrp - discount + mcdTax + stateTax + tollTax;


    return (
        <Card>
            {/* <ToastContainer /> */}
            <div className="order-header">
                <div className="md:flex justify-between items-center mb-4 border-bottom">
                    <div className="flex items-center mb-2">
                        {/* //serviceAreaId=0;customRadio=CANCELLED;page=5;searchId=NONE;searchText=undefined */}
                        {/* ?orderstatus=${orderDetails?.orderStatus};page=${pageno};searchId=${};searchText=${} */}
                        {/* <Link to={`/all-orders`}>
                            <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                        </Link> */}
                        {customRadio && pagenumber ? (
                            orders == 'ALLCITYWIDE' ? (
                                <Link to={`/all-orders?customRadio=${customRadio}&page=${pagenumber || 0}&searchId=${searchId || ''}&searchText=${searchText || ''}&orders=ALL&pagesizedata=${pagesizedata}`}>
                                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                                </Link>
                            ) : orders == 'CITYWIDE' ? (
                                <Link to={`/offline-orders?customRadio=${customRadio}&page=${pagenumber || 0}&searchId=${searchId || ''}&searchText=${searchText || ''}&orders=citywide&pagesizedata=${pagesizedata}`}>
                                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                                </Link>
                            ) : orders.trim() == 'CITYWIDEON' ? (
                                <Link to={`/citywide-orders?customRadio=${customRadio}&page=${pagenumber || 0}&searchId=${searchId || ''}&searchText=${searchText || ''}&orders=CITYWIDEON&pagesizedata=${pagesizedata}`}>
                                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                                </Link>
                            ) : orders == 'THIRDPARTY' || orders == 'SHIPROCKET' ? (
                                <Link to={`/${orders}?customRadio=${customRadio}&page=${pagenumber || 0}&searchId=${searchId || ''}&searchText=${searchText || ''}&orders=${orders}`}>
                                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                                </Link>
                            ) : orders == 'THIRDPARTY' || orders == 'DAAKIT' ? (
                                <Link to={`/${orders}?customRadio=${customRadio}&page=${pagenumber || 0}&searchId=${searchId || ''}&searchText=${searchText || ''}&orders=${orders}`}>
                                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                                </Link>
                            ) : null

                        ) : null}
                        <h4 className="card-title ms-2 mb-0">Order Details</h4>
                    </div>
                    <div className="mb-2 d-flex gap-4">
                        <img src={vehicleDetails?.imageUrl} alt={vehicleDetails?.vehicleType} width={40} />
                        {orderDetails.orderStatus === 'Delivered' && (
                            <button type="button" className="btn btn-sm btn-dark py-1 px-2" onClick={downloadInvoice}>Get Invoice</button>
                        )}
                        {isLoadingInvoice && (
                            <div className="loader-fixed">
                                <span className="flex items-center gap-2">
                                    <Loading />
                                </span>
                            </div>
                        )}

                        <form className="d-flex gap-2" onSubmit={handleAssign}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rider ID"
                                value={riderId}
                                onChange={(e) => setRiderId(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-sm btn-dark py-1 px-2">
                                Assign
                            </button>
                        </form>
                    </div>
                </div>
                <div className="multistep-prgressbar">
                    <ul>
                        {/* <li className={`multistep-list ${orderDetails.orderStatus === 'In Progress'
                            || orderDetails.orderStatus === 'In Transit'
                            || orderDetails.orderStatus === 'Delivered' ? 'active' : ''}`}>
                            <span>{orderDetails.orderDateTime}</span>
                            <div className="multistep-item">Order Placed hyg</div>
                        </li> */}
                        <li className="multistep-list active">
                            {/* <span>{thirdPartyUsername ? new Date(orderDetails.orderDateTime).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                                timeZone: "UTC"
                            }) : orderDetails.orderDateTime}</span> */}
                            <span>{orderDetails.orderDateTime}</span>
                            <div className="multistep-item">Order Placed</div>
                        </li>

                        {tripDetails?.orderAccepted && (
                            <li className={`multistep-list  ${tripDetails?.orderAccepted ? 'active' : ''}`}>
                                {tripDetails?.orderAcceptedTimeTaken && (
                                    <span className="orderTimetaken">{tripDetails?.orderAcceptedTimeTaken || ' '}</span>
                                )}
                                <span>{tripDetails?.orderAcceptedDateTime || ' '}</span>
                                <div className="multistep-item">Accepted</div>
                            </li>
                        )}
                        {(!tripDetails?.orderAccepted && orderDetails.orderStatus !== 'Cancelled') && (
                            <li className={`multistep-list  ${tripDetails?.orderAccepted ? 'active' : ''}`}>
                                {tripDetails?.orderAcceptedTimeTaken && (
                                    <span className="orderTimetaken">{tripDetails?.orderAcceptedTimeTaken || ' '}</span>
                                )}
                                <span>{tripDetails?.orderAcceptedDateTime || ' '}</span>
                                <div className="multistep-item">Accepted</div>
                            </li>
                        )}
                        {tripDetails?.orderInTransit === true && (
                            <li className={`multistep-list ${tripDetails?.orderInTransit ? 'active' : ''}`}>
                                {tripDetails?.orderInTransitTimeTaken && (
                                    <span className="orderTimetaken">{tripDetails?.orderInTransitTimeTaken || ' '}</span>
                                )}
                                <span>{tripDetails?.orderInTransitDateTime || ' '}</span>
                                <div className="multistep-item" onClick={() => {
                                    if (!tripDetails?.orderInTransit) {
                                        openPickupModal();
                                    }
                                }}> Pickup
                                </div>
                                {isPickupModal && (
                                    <Modal
                                        activeModal={isPickupModal}
                                        uncontrol
                                        className="max-w-md"
                                        title=""
                                        centered
                                        onClose={() => setisPickupModal(false)}
                                    >
                                        <div className="">
                                            <h5 className="text-center">Pickup Service</h5>
                                            <p className="text-center my-3">Confirm Pickup Order</p>
                                            <div className="d-flex gap-2 justify-content-center mt-4">
                                                <Button className="btn btn-dark" type="button" onClick={() => setisPickupModal(false)}>
                                                    No
                                                </Button>
                                                <Button className="btn btn-outline-light" type="button"
                                                    onClick={() => handlePickupConfirm({
                                                        orderId: orderId,
                                                        orderType: "CITYWIDE",
                                                        otp: "0000"
                                                    })}
                                                >
                                                    Yes
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal>
                                )}
                            </li>
                        )}
                        {(!tripDetails?.orderInTransit && orderDetails.orderStatus !== 'Cancelled') && (
                            <li className={`multistep-list ${tripDetails?.orderInTransit ? 'active' : ''}`}>
                                {tripDetails?.orderInTransitTimeTaken && (
                                    <span className="orderTimetaken">{tripDetails?.orderInTransitTimeTaken || ' '}</span>
                                )}
                                <span>{tripDetails?.orderInTransitDateTime || ' '}</span>
                                <div className="multistep-item" onClick={() => {
                                    if (!tripDetails?.orderInTransit) {
                                        openPickupModal();
                                    }
                                }}> Pickup
                                </div>
                                {isPickupModal && (
                                    <Modal
                                        activeModal={isPickupModal}
                                        uncontrol
                                        className="max-w-md"
                                        title=""
                                        centered
                                        onClose={() => setisPickupModal(false)}
                                    >
                                        <div className="">
                                            <h5 className="text-center">Pickup Service</h5>
                                            <p className="text-center my-3">Confirm Pickup Order</p>
                                            <div className="d-flex gap-2 justify-content-center mt-4">
                                                <Button className="btn btn-dark" type="button" onClick={() => setisPickupModal(false)}>
                                                    No
                                                </Button>
                                                <Button className="btn btn-outline-light" type="button"
                                                    onClick={() => handlePickupConfirm({
                                                        orderId: orderId,
                                                        orderType: "CITYWIDE",
                                                        otp: "0000"
                                                    })}
                                                >
                                                    Yes
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal>
                                )}
                            </li>
                        )}
                        {tripDetails?.orderDelivered && (
                            <li className={`multistep-list ${tripDetails?.orderDelivered ? 'active' : ''}`}>
                                {tripDetails?.orderDeliveredTimeTaken && (
                                    <span className="orderTimetaken">{tripDetails?.orderDeliveredTimeTaken || ' '}</span>
                                )}
                                <span>{tripDetails?.orderDeliveredDateTime || ' '}</span>
                                <div className="multistep-item"
                                    onClick={() => {
                                        if (!tripDetails?.orderDelivered) {
                                            openDeliveryModal();
                                        }
                                    }}
                                > Delivered
                                </div>
                                {isDeliveryModal && (
                                    <Modal
                                        activeModal={isDeliveryModal}
                                        uncontrol
                                        className="max-w-md"
                                        title=""
                                        centered
                                        onClose={() => setisdeliveryModal(false)}
                                    >
                                        <div className="">
                                            <h5 className="text-center">Delivery Service</h5>
                                            <p className="text-center my-3">Confirm Delivery Order</p>
                                            <div className="d-flex gap-2 justify-content-center mt-4">
                                                <Button className="btn btn-dark" type="button" onClick={() => setisdeliveryModal(false)}>
                                                    No
                                                </Button>
                                                <Button className="btn btn-outline-light" type="button"
                                                    onClick={() => handleDeliveryConfirm({
                                                        orderId: orderId,
                                                        orderType: "CITYWIDE",
                                                        otp: "0000"
                                                    })}
                                                >
                                                    Yes
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal>
                                )}
                            </li>
                        )}
                        {(!tripDetails?.orderDelivered && orderDetails.orderStatus !== 'Cancelled') && (
                            <li className={`multistep-list ${tripDetails?.orderDelivered ? 'active' : ''}`}>
                                {tripDetails?.orderDeliveredTimeTaken && (
                                    <span className="orderTimetaken">{tripDetails?.orderDeliveredTimeTaken || ' '}</span>
                                )}
                                <span>{tripDetails?.orderDeliveredDateTime || ' '}</span>
                                <div className="multistep-item"
                                    onClick={() => {
                                        if (!tripDetails?.orderDelivered) {
                                            openDeliveryModal();
                                        }
                                    }}
                                > Delivered
                                </div>
                                {isDeliveryModal && (
                                    <Modal
                                        activeModal={isDeliveryModal}
                                        uncontrol
                                        className="max-w-md"
                                        title=""
                                        centered
                                        onClose={() => setisdeliveryModal(false)}
                                    >
                                        <div className="">
                                            <h5 className="text-center">Delivery Service</h5>
                                            <p className="text-center my-3">Confirm Delivery Order</p>
                                            <div className="d-flex gap-2 justify-content-center mt-4">
                                                <Button className="btn btn-dark" type="button" onClick={() => setisdeliveryModal(false)}>
                                                    No
                                                </Button>
                                                <Button className="btn btn-outline-light" type="button"
                                                    onClick={() => handleDeliveryConfirm({
                                                        orderId: orderId,
                                                        orderType: "CITYWIDE",
                                                        otp: "0000"
                                                    })}
                                                >
                                                    Yes
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal>
                                )}
                            </li>
                        )}

                        {orderDetails.orderStatus === 'Cancelled' && (
                            <li className={`multistep-list ${orderDetails.orderStatus === 'Cancelled' ? 'active' : ''}`}>
                                {cancelDetails?.orderCancelledTimeTaken && (
                                    <span className="orderTimetaken">{cancelDetails?.orderCancelledTimeTaken || ' '}</span>
                                )}
                                <span>{cancelDetails.orderCancelledDateTime}</span>
                                <div className="multistep-item">Cancel</div>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
            <div className="row order-detail-list">
                <div className="col-lg-6">
                    <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                        <h6 className="text-scooton-500 p-3 border-bottom">Order Info</h6>
                        <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                            <tbody>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">
                                        Order Id
                                    </td>
                                    <td className="px-6 py-2 text-end">

                                        {thirdPartyUsername ? orderDetails.orderId : orderDetails.order_Id}
                                    </td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">
                                        Order Date
                                    </td>
                                    <td className="px-6 py-2 text-end">
                                        {orderDetails.orderDateTime}
                                    </td>
                                    {/* <td className="px-6 py-2 text-end">
                                        {thirdPartyUsername ? new Date(orderDetails.orderDateTime).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                            timeZone: "UTC"
                                        }) : orderDetails.orderDateTime}
                                    </td> */}
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className=" px-6 py-2"> Order Status </td>
                                    <td className=" px-6 py-2 text-end">{orderDetails.orderStatus}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className=" px-6 py-2"> Order Type </td>
                                    <td className=" px-6 py-2 text-end">
                                        {thirdPartyUsername ? "THIRD PARTY" : orderDetails.orderType}
                                    </td>
                                </tr>
                                {/* {cancelDetails?.orderCancelled === true && (
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <td className=" px-6 py-2"> Order Cancel Reason </td>
                                        <td className=" px-6 py-2 text-end">
                                            {cancelDetails?.cancelReasonType?.trim() || cancelDetails?.cancelReasonSelected}
                                        </td>
                                    </tr>
                                )} */}
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className=" px-6 py-2"> Pickup Address </td>
                                    <td className=" px-6 py-2 text-end">{customerDetails?.pickupAddress}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className=" px-6 py-2"> Pickup Contact </td>
                                    <td className=" px-6 py-2 text-end">{customerDetails?.pickupContact}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className=" px-6 py-2"> Delivery Address </td>
                                    <td className=" px-6 py-2 text-end">{customerDetails?.deliveryAddress},{customerDetails.deliveryAddress1},{customerDetails.deliveryPinCode}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className=" px-6 py-2"> Delivery Contact </td>
                                    <td className=" px-6 py-2 text-end">{customerDetails?.deliveryContact}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className=" px-6 py-2"> Distance (KM) </td>
                                    <td className=" px-6 py-2 text-end">{orderDetails?.distance}</td>

                                    {/* {thirdPartyUsername ? (
                                        <td className=" px-6 py-2 text-end">{orderDetails?.distance?.text} , {orderDetails?.distance?.value} </td>
                                    ) : (
                                        <td className=" px-6 py-2 text-end">{orderDetails?.distance}</td>
                                    )} */}

                                </tr>


                                {/* {thirdPartyUsername ? (
                                    <>
                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2"> Pickup OTP </td>
                                            <td className=" px-6 py-2 text-end">{orderDetails?.pickupOtp}</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2"> Delivery OTP</td>
                                            <td className=" px-6 py-2 text-end">{orderDetails?.deiveryOtp}</td>
                                        </tr>
                                    </>

                                ) : ( */}
                                <>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <td className=" px-6 py-2"> Pickup OTP </td>
                                        <td className=" px-6 py-2 text-end">{orderDetails?.pickupOtp}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <td className=" px-6 py-2"> Delivery OTP</td>
                                        <td className=" px-6 py-2 text-end">{orderDetails?.deliveryOtp}</td>
                                    </tr>
                                </>


                                {!thirdPartyUsername && (
                                    <>
                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2"> Instruction </td>
                                            <td className=" px-6 py-2 text-end">{orderDetails?.instructionText}</td>
                                        </tr>
                                        {/* <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2"> Type Of Package </td>
                                            <td className=" px-6 py-2 text-end">{packageDetails?.packageType}</td>
                                        </tr> */}
                                    </>
                                )}

                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className=" px-6 py-2"> Package Weight</td>
                                    <td className=" px-6 py-2 text-end">
                                        {thirdPartyUsername ? orderDetails?.packageWeight : packageDetails?.packageWeight}
                                    </td>
                                </tr>
                                {!thirdPartyUsername && (
                                    <>
                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2"> Package Value</td>
                                            <td className=" px-6 py-2 text-end">{packageDetails?.packageValue}</td>
                                        </tr>
                                        {/* <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2"> Package Type</td>
                                            <td className=" px-6 py-2 text-end">{packageDetails?.isFragile}</td>
                                        </tr> */}
                                    </>
                                )}

                                {/* {thirdPartyUsername && (
                                    <>
                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2">Client Order ID</td>
                                            <td className=" px-6 py-2 text-end">{orderDetails?.clientOrderId}</td>
                                        </tr>
                                    </>
                                )} */}
                                {/* {thirdPartyUsername && (
                                    <>
                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2">Cancel By</td>
                                            <td className=" px-6 py-2 text-end">{cancelDetails?.cancelBy}</td>
                                        </tr>
                                    </>
                                )} */}
                            </tbody>
                        </table>
                    </div>
                    {thirdPartyUsername && (
                        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                            <h6 className="text-scooton-500 p-3 border-bottom">Vendor Details</h6>
                            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                                <tbody>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <td className=" px-6 py-2">Client Order ID</td>
                                        <td className=" px-6 py-2 text-end">{orderDetails?.clientOrderId}</td>
                                    </tr>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <td className=" px-6 py-2">Cancel By</td>
                                        <td className=" px-6 py-2 text-end">{cancelDetails?.cancelBy}</td>
                                    </tr>
                                    {cancelDetails?.orderCancelled === true && (
                                        <tr className="border-b border-slate-100 dark:border-slate-700">
                                            <td className=" px-6 py-2">Cancel Reason </td>
                                            <td className=" px-6 py-2 text-end">
                                                {cancelDetails?.cancelReasonType?.trim() || cancelDetails?.cancelReasonSelected}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="col-lg-6">
                    <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                        <h6 className="text-scooton-500 p-3 border-bottom">Rider Info</h6>
                        <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                            <tbody>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2"> Rider Name</td>
                                    <td className="text-end px-6 py-2">
                                        <Link to={`/rider-detail/${riderDetails?.riderId}`} className="hover:underline">  {riderDetails?.riderName || ""} </Link>
                                    </td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Rider Number</td>
                                    <td className="text-end px-6 py-2"> {riderDetails?.riderContact || ""}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Rider Vehicle Number</td>
                                    <td className="text-end px-6 py-2"> {riderDetails?.riderVehicleNumber || ""}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Vehicle Type</td>
                                    <td className="text-end px-6 py-2">
                                        {thirdPartyUsername ? vehicleDetails?.vehicleType : vehicleDetails?.vehicleType}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
                        <h6 className="text-scooton-500 p-3 border-bottom">Payment Detail</h6>
                        <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                            <tbody>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Payment Mode</td>
                                    <td className="text-end px-6 py-2">{orderDetails?.paymentMode}</td>
                                </tr>
                                {(orderDetails.orderStatus === 'Delivered' && orderDetails.paymentMode !== 'PREPAID') && (
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <td className="px-6 py-2">Payment Status</td>
                                        <td className="text-end px-6 py-2">COMPLETED</td>
                                    </tr>
                                )}
                                {(orderDetails.orderStatus !== 'Delivered' && orderDetails.paymentMode !== 'PREPAID') && (
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <td className="px-6 py-2">Payment Status</td>
                                        <td className="text-end px-6 py-2">PENDING</td>
                                    </tr>
                                )}
                                {(orderDetails.paymentMode === 'PREPAID') && (
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <td className="px-6 py-2">Payment Status</td>
                                        {/* <td className="text-end px-6 py-2">Cancelled</td> */}
                                        <td className="text-end px-6 py-2">{orderDetails?.paymentStatus}</td>
                                    </tr>
                                )}
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Applied Promocode</td>
                                    <td className="text-end px-6 py-2">{orderDetails.orderAmount.promoCode}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Fare Amount <small>(As per tariff)</small></td>
                                    <td className="text-end px-6 py-2">
                                        {orderDetails.orderAmount.mrp}
                                        {/* {thirdPartyUsername ? orderDetails.orderAmount.mrp : orderDetails.orderAmount.mrp} */}
                                    </td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Discount</td>
                                    <td className="text-end px-6 py-2">{orderDetails.orderAmount.discount}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">MCD Tax</td>
                                    <td className="text-end px-6 py-2">{orderDetails?.orderAmount?.mcdTax?.toFixed(3)}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">State Tax</td>
                                    <td className="text-end px-6 py-2">{orderDetails.orderAmount.stateTax?.toFixed(3)}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Toll Tax</td>
                                    <td className="text-end px-6 py-2">{orderDetails.orderAmount.tollTax?.toFixed(3)}</td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">
                                        Order Amount <small>(Fare - Discount + MCD + State + Toll Tax)</small>
                                    </td>
                                    <td className="text-end px-6 py-2">
                                        {calculatedAmount}
                                    </td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">
                                        ThirdParty Amount
                                    </td>
                                    <td className="text-end px-6 py-2">
                                        {orderDetails?.orderAmount?.tpAmount ?? 0}
                                    </td>
                                </tr>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    <td className="px-6 py-2">Total Amount Payable <small>(Collactive Amount)</small></td>
                                    <td className="text-end px-6 py-2">
                                        {orderDetails?.orderAmount?.collectiveAmount}
                                        {/* {thirdPartyUsername ? orderDetails.orderAmount : orderDetails.orderAmount.finalPrice} */}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-3 d-flex justify-content-end gap-3">
                        {orderDetails.orderStatus === 'In Progress' && (
                            <>
                                <img src={vehicleDetails?.imageUrl} alt={vehicleDetails?.vehicleType} width={40} />
                                <button type="button" className="btn btn-dark p-2" onClick={() => { nearByRiderDetails() }}> Get Near By Rider</button>
                            </>

                        )}

                    </div>
                    {nearRiderMap && (
                        <Modal
                            activeModal={nearRiderMap}
                            uncontrol
                            className="h-full"
                            title="Near By Rider"
                            centered
                            onClose={() => setNearRiderMap(false)}
                        >
                            <div>
                                {/* <h6 className="text-center mb-2">Near By Rider</h6> */}
                                <LoadScript googleMapsApiKey="AIzaSyDTetPmohnWdWT0lsYV9iT-58Z5Gm4jmgA" preventGoogleFonts={true}>
                                    <div className="overflow-hidden">
                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={pickupLocation}
                                            zoom={13}
                                            onLoad={(map) => (mapRef.current = map)}
                                        >
                                            {/* {riderNearLocation?.map((marker, index) => (
                                                <Marker
                                                    key={index}
                                                    position={{ lat: marker.latitude, lng: marker.longitude }}
                                                    icon={marker.riderActiveForOrders ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/rider-icon-green.png' : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/rider-icon-red.png'}
                                                    onClick={() => setSelectedMarker(marker)}
                                                />
                                            ))} */}
                                            {riderNearLocation?.map((marker, index) => {
                                                let iconUrl;

                                                // Determine icon URL based on vehicleId and riderActiveForOrders
                                                if (marker.vehicleId === 1) {
                                                    iconUrl = marker.riderActiveForOrders
                                                    ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Two-Wheeler-green.png'
                                                    : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Two-Wheeler.png';
                                                } else if (marker.vehicleId === 2) {
                                                    iconUrl = marker.riderActiveForOrders
                                                    ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Two-Wheeler-EV-green.png'
                                                    : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Two-Wheeler-EV.png';
                                                } else if (marker.vehicleId === 3) {
                                                    iconUrl = marker.riderActiveForOrders
                                                    ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Tata-Ace-green.png'
                                                    : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Tata-Ace.png';
                                                } else if (marker.vehicleId === 4) {
                                                    iconUrl = marker.riderActiveForOrders
                                                    ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Three-Wheeler-green.png'
                                                    : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Three-Wheeler.png';
                                                } else if (marker.vehicleId === 5) {
                                                    iconUrl = marker.riderActiveForOrders
                                                    ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Eeco-green.png'
                                                    : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Eeco.png';
                                                } else if (marker.vehicleId === 6) {
                                                    iconUrl = marker.riderActiveForOrders
                                                    ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Champion-green.png'
                                                    : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Champion.png';
                                                } else if (marker.vehicleId === 7) {
                                                    iconUrl = marker.riderActiveForOrders
                                                    ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Pickup-8ft-green.png'
                                                    : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Pickup-8ft.png';
                                                }
                                                 else {
                                                    iconUrl = marker.riderActiveForOrders
                                                    ? 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/rider-icon-green.png'
                                                    : 'https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/rider-icon-red.png';
                                                }

                                                return (
                                                    <Marker
                                                    key={index}
                                                    position={{ lat: marker.latitude, lng: marker.longitude }}
                                                    icon={iconUrl}
                                                    onClick={() => setSelectedMarker(marker)}
                                                    />
                                                );
                                            })}

                                            {selectedMarker && selectedMarker.latitude && selectedMarker.longitude && (
                                                <InfoWindow
                                                    position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                                                    onCloseClick={() => setSelectedMarker(null)}
                                                >
                                                    <div>
                                                        <h6 className="mb-1 text-base mr-3">{selectedMarker.firstName}</h6>
                                                        <p className="font-normal">{selectedMarker.mobileNumber}</p>
                                                    </div>
                                                </InfoWindow>
                                            )}
                                            <Marker
                                                position={pickupLocation}
                                                icon={{
                                                    url: "https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/pickuppoint.png",
                                                }}
                                                onClick={() => setSelectedPickupMarker(pickupLocation)}
                                            />

                                            {selectedPickupMarker && (
                                                <InfoWindow
                                                    position={selectedPickupMarker}

                                                    onCloseClick={() => setSelectedPickupMarker(null)}
                                                >
                                                    <div>
                                                        <h6 className="mb-1 text-base mr-3">{selectedPickupMarker.name}</h6>
                                                        <p className="font-normal">{selectedPickupMarker.address}</p>
                                                    </div>
                                                </InfoWindow>
                                            )}
                                            <Marker
                                                position={dropLocation}
                                                icon={{
                                                    url: "https://image-res.s3.ap-south-1.amazonaws.com/Admin-assets/Droppoint.png",
                                                }}
                                                onClick={() => setSelectedDropMarker(dropLocation)}
                                            />

                                            {selectedDroppMarker && (
                                                <InfoWindow
                                                    position={selectedDroppMarker}

                                                    onCloseClick={() => setSelectedDropMarker(null)}
                                                >
                                                    <div>
                                                        <h6 className="mb-1 text-base mr-3">{selectedDroppMarker.name}</h6>
                                                        <p className="font-normal">{selectedDroppMarker.address}</p>
                                                    </div>
                                                </InfoWindow>
                                            )}
                                        </GoogleMap>
                                    </div>
                                </LoadScript>
                            </div>
                            <div className="mt-2 text-center">
                                <strong>
                                    Near By Total Riders: {nearTotalRider} [
                                    <span style={{ color: "green", fontWeight: "bold" }}>Active Rider: {nearActiveRider} </span>
                                    <span>-</span>
                                    <span style={{ color: "red", fontWeight: "bold" }}> InActive Riders: {nearInActiveRider}</span>]
                                </strong>

                            </div>
                        </Modal>
                    )}
                </div>
            </div>


        </Card>
    );
};

export default OrderDetail;
