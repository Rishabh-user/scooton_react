import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPickupModal, setisPickupModal] = useState(false);
  const [isDeliveryModal, setisdeliveryModal] = useState(false);

  const openPickupModal = async() => {
    setisPickupModal(true);
  }
  const openDeliveryModal = async() => {
    setisdeliveryModal(true);
  }
 
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (token) {
          const response = await axios.get(`${BASE_URL}/order/v2/orders/get-city-wide-order/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setOrderDetail(response.data.jsonData);
          console.log(response.data.jsonData);
        }
      } catch (error) {
        console.error('Error fetching order detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

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
    vehiceDetails,
    tripDetails
  } = orderDetail;

  const handlePickupConfirm = async (payload) => {      
    try {
      const response = await axios.post(
        `${BASE_URL}/rider/pickup-delivery-otp-verification-admin/`,
        payload
      );
      if (response.data.success) {
        setisPickupModal(false);
        toast.success('Pickup confirmed successfully!'); 
        navigate(0);      
      } else {
        toast.error('Failed to confirm pickup: ' + response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while confirming pickup. Please try again.');
    }
  };
  const handleDeliveryConfirm = async (payload) => {      
    try {
      const response = await axios.post(
        `${BASE_URL}/rider/pickup-delivery-otp-verification-admin/`,
        payload
      );
      if (response.data.success) {
        toast.success('Delivery confirmed successfully!');
        setisdeliveryModal(false);
        window.location.reload();
      } else {
        toast.error('Failed to confirm pickup: ' + response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while confirming pickup. Please try again.');
    }
  };
  const downloadInvoice = async () => {      
    try {
      const response = await axios.post(
        `${BASE_URL}/order/orders/admin/getInvoice/${orderId}`,
        null,
        {
            responseType: 'blob', 
        }
     );
      if (response.data.success) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice_${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Invoice Download successfully!');
      } else {
        toast.error('Failed to failed to download: ' + response.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while downloading invoice. Please try again.');
    }
  };

  return (
    <Card>
        <ToastContainer />
        <div className="md:flex justify-between items-center mb-4 border-bottom">
            <div className="flex items-center mb-2">
                <Link to="/all-orders">
                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                </Link>
                <h4 className="card-title ms-2 mb-0">Order Details</h4>
            </div>
            <div className="mb-2 d-flex gap-4">
                <img src={vehiceDetails.imageUrl} alt={vehiceDetails.vehicleType} width={40} />
                <button type="button" className="btn btn-sm btn-dark py-1 px-2" onClick={downloadInvoice}>Get Invoice</button>                
            </div>
        </div>
        <div className="multistep-prgressbar">
            <ul>
                <li className={`multistep-list ${orderDetails.orderStatus === 'In Progress' 
                    || orderDetails.orderStatus === 'In Transit' 
                    || orderDetails.orderStatus === 'Delivered' ? 'active' : ''}`}>
                    <span>{orderDetails.orderDateTime}</span>
                    <div className="multistep-item">Order Placed</div>
                </li>
                <li className={`multistep-list  ${tripDetails?.orderAccepted ? 'active' : ''}`}>
                    {tripDetails?.orderAcceptedTimeTaken && (
                        <span className="orderTimetaken">{tripDetails?.orderAcceptedTimeTaken || ' '}</span>
                    )}                    
                    <span>{tripDetails?.orderAcceptedDateTime || ' '}</span>
                    <div className="multistep-item">Accepted</div>
                </li>
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
            </ul>
        </div>
        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <h6 className="text-scooton-500 p-4 border-bottom">Order Info</h6>
            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td  className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-3">
                        Order Id
                    </td>
                    <td  className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-3">
                        {orderDetails.order_Id}
                    </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td  className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-3">
                    Order Date
                    </td>
                    <td  className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-3">
                        {orderDetails.orderDateTime}
                    </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Order Status </td>
                    <td className=" px-6 py-3 text-end">{orderDetails.orderStatus}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Order Type </td>
                    <td className=" px-6 py-3 text-end">{orderDetails.orderType}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Pickup Address </td>
                    <td className=" px-6 py-3 text-end">{customerDetails.pickupAddress}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Pickup Contact </td>
                    <td className=" px-6 py-3 text-end">{customerDetails.pickupContact}</td>
                </tr>                    
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Delivery Address </td>
                    <td className=" px-6 py-3 text-end">{customerDetails.deliveryAddress},{customerDetails.deliveryAddress1},{customerDetails.deliveryPinCode}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Delivery Contact </td>
                    <td className=" px-6 py-3 text-end">{customerDetails.deliveryContact}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Distance (KM) </td>
                    <td className=" px-6 py-3 text-end">{orderDetails.distance}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Instruction </td>
                    <td className=" px-6 py-3 text-end">{orderDetails.instructionText}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Type Of Package </td>
                    <td className=" px-6 py-3 text-end">{packageDetails.packageType}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Package Weight</td>
                    <td className=" px-6 py-3 text-end">{packageDetails.packageWeight}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Package Value</td>
                    <td className=" px-6 py-3 text-end">{packageDetails.packageValue}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-3"> Package Type</td>
                    <td className=" px-6 py-3 text-end">{packageDetails.isFragile}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <h6 className="text-scooton-500 p-4 border-bottom">Rider Info</h6>
            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-3"> Rider Name </td>
                    <td className="text-end px-6 py-3">
                        {/* {riderDetails.riderName} */}
                    </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-3">Rider Number</td>
                    {/* <td className="text-end px-6 py-4"> {riderDetails.riderContact}</td> */}
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-3">Rider Vehicle Number</td>
                    {/* <td className="text-end px-6 py-4"> {riderDetails.riderVehicleNumber}</td> */}
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-3">Vehicle Type</td>
                    <td className="text-end px-6 py-3"> {vehiceDetails.vehicleType}</td>
                </tr>
                </tbody>
            </table>
        </div>      
        
        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <h6 className="text-scooton-500 p-4 border-bottom">Payment Detail</h6>
            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-3">Payment Mode</td>
                        <td className="text-end px-6 py-3">{orderDetails.paymentMode}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-3">Payment Status</td>
                        <td className="text-end px-6 py-3">{orderDetails.paymentStatus}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-3">MRP</td>
                        <td className="text-end px-6 py-3">{orderDetails.orderAmount.mrp}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-3">Discount</td>
                        <td className="text-end px-6 py-3">{orderDetails.orderAmount.discount}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-3">Taxes</td>
                        <td className="text-end px-6 py-3">{orderDetails.orderAmount.taxes}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-3">Applied Promocode</td>
                        <td className="text-end px-6 py-3">{orderDetails.orderAmount.promoCode}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-3">Total Amount Payable</td>
                        <td className="text-end px-6 py-3">{orderDetails.orderAmount.finalPrice}</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    </Card>
  );
};

export default OrderDetail;
