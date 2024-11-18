import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

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
  } = orderDetail;

  return (
    <Card>
        <div className="md:flex justify-between items-center mb-5">
            <div className="flex items-center">
                <Link to="/">
                    <Icon icon="heroicons:arrow-left-circle" className="text-xl font-bold text-scooton-500" />
                </Link>
                <h4 className="card-title ms-2">Order Details</h4>
            </div>
            <img src={vehiceDetails.imageUrl} alt={vehiceDetails.vehicleType} width={50} />
        </div>
        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <h6 className="text-scooton-500 p-5">Order Info</h6>
            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td  className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                        Order Id
                    </td>
                    <td  className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                        {orderDetails.order_Id}
                    </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td  className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                    Order Date
                    </td>
                    <td  className="text-slate-900 dark:text-slate-300 text-sm  font-normal ltr:text-left ltr:last:text-right rtl:text-right rtl:last:text-left px-6 py-4">
                        {orderDetails.orderDateTime}
                    </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Order Status </td>
                    <td className=" px-6 py-4 text-end">{orderDetails.orderStatus}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Order Type </td>
                    <td className=" px-6 py-4 text-end">{orderDetails.orderType}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Pickup Address </td>
                    <td className=" px-6 py-4 text-end">{customerDetails.pickupAddress}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Pickup Contact </td>
                    <td className=" px-6 py-4 text-end">{customerDetails.pickupContact}</td>
                </tr>                    
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Delivery Address </td>
                    <td className=" px-6 py-4 text-end">{customerDetails.deliveryAddress},{customerDetails.deliveryAddress1},{customerDetails.deliveryPinCode}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Delivery Contact </td>
                    <td className=" px-6 py-4 text-end">{customerDetails.deliveryContact}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Distance (KM) </td>
                    <td className=" px-6 py-4 text-end">{orderDetails.distance}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Instruction </td>
                    <td className=" px-6 py-4 text-end">{orderDetails.instructionText}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Type Of Package </td>
                    <td className=" px-6 py-4 text-end">{packageDetails.packageType}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Package Weight</td>
                    <td className=" px-6 py-4 text-end">{packageDetails.packageWeight}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Package Value</td>
                    <td className=" px-6 py-4 text-end">{packageDetails.packageValue}</td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className=" px-6 py-4"> Package Type</td>
                    <td className=" px-6 py-4 text-end">{packageDetails.isFragile}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <h6 className="text-scooton-500 p-5">Rider Info</h6>
            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-4"> Rider Name </td>
                    <td className="text-end px-6 py-4">
                        {/* {riderDetails.riderName} */}
                    </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-4">Rider Number</td>
                    {/* <td className="text-end px-6 py-4"> {riderDetails.riderContact}</td> */}
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-4">Rider Vehicle Number</td>
                    {/* <td className="text-end px-6 py-4"> {riderDetails.riderVehicleNumber}</td> */}
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                    <td className="px-6 py-4">Vehicle Type</td>
                    <td className="text-end px-6 py-4"> {vehiceDetails.vehicleType}</td>
                </tr>
                </tbody>
            </table>
        </div>      
        
        <div className="mx-auto shadow-base dark:shadow-none my-8 rounded-md overflow-x-auto">
            <h6 className="text-scooton-500 p-5">Payment Detail</h6>
            <table className="w-full border-collapse table-fixed dark:border-slate-700 dark:border">
                <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-4">Payment Mode</td>
                        <td className="text-end px-6 py-4">{orderDetails.paymentMode}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-4">Payment Status</td>
                        <td className="text-end px-6 py-4">{orderDetails.paymentStatus}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-4">MRP</td>
                        <td className="text-end px-6 py-4">{orderDetails.orderAmount.mrp}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-4">Discount</td>
                        <td className="text-end px-6 py-4">{orderDetails.orderAmount.discount}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-4">Taxes</td>
                        <td className="text-end px-6 py-4">{orderDetails.orderAmount.taxes}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-4">Applied Promocode</td>
                        <td className="text-end px-6 py-4">{orderDetails.orderAmount.promoCode}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="px-6 py-4">Total Amount Payable</td>
                        <td className="text-end px-6 py-4">{orderDetails.orderAmount.finalPrice}</td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    </Card>
  );
};

export default OrderDetail;
