import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import useRtl from "@/hooks/useRtl";
import axios from "axios";
import { BASE_URL } from "../../../../api";

const RevenueBarChart = ({ height = 400 }) => {
  const [isDark] = useDarkMode();
  const [isRtl] = useRtl();
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const fetchOrderData = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/order-history/search-city-wide-orders-all-service-area/0?page=0&size=1000`,
          { orderType: "ALL ORDERS", searchType: "NONE" },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const orders = response.data;
        console.log("orders", orders);

        // Get the first date of the last month
        const today = new Date();
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        const filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.orderHistory.orderDate);
          return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
        });

        const ordersByDay = filteredOrders.reduce(
          (acc, order) => {
            const day = new Date(order.orderHistory.orderDate).toLocaleDateString('en-US');
            acc[day] = acc[day] || { ACCEPTED: 0, CANCELLED: 0, COMPLETED: 0 };
            acc[day][order.orderHistory.orderStatus]++;
            return acc;
          },
          {}
        );

        console.log("ordersByDay", ordersByDay);

        const categories = Object.keys(ordersByDay);
        const acceptedOrders = categories.map(day => ordersByDay[day].ACCEPTED);
        const cancelledOrders = categories.map(day => ordersByDay[day].CANCELLED);
        const completedOrders = categories.map(day => ordersByDay[day].COMPLETED);

        console.log("acceptedOrders", acceptedOrders);
        console.log("cancelledOrders", cancelledOrders);
        console.log("completedOrders", completedOrders);

        setCategories(categories);
        setSeries([
          { name: 'Accepted Orders', data: acceptedOrders },
          { name: 'Cancelled Orders', data: cancelledOrders },
          { name: 'Completed Orders', data: completedOrders }
        ]);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, []);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '45%',
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: 'Inter',
      offsetY: -30,
      markers: {
        width: 8,
        height: 8,
        offsetY: -1,
        offsetX: -5,
        radius: 12,
      },
      labels: {
        colors: isDark ? '#CBD5E1' : '#475569',
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
    },
    title: {
      text: 'Order Status Report for Last Month',
      align: 'left',
      offsetX: isRtl ? '0%' : 0,
      offsetY: 13,
      floating: false,
      style: {
        fontSize: '20px',
        fontWeight: '500',
        fontFamily: 'Inter',
        color: isDark ? '#fff' : '#0f172a',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    yaxis: {
      opposite: isRtl ? true : false,
      labels: {
        style: {
          colors: isDark ? '#CBD5E1' : '#475569',
          fontFamily: 'Inter',
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: isDark ? '#CBD5E1' : '#475569',
          fontFamily: 'Inter',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: val => `${val} orders`,
      },
    },
    colors: ['#4669FA', '#FA4669', '#69FA46'],
    grid: {
      show: true,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      strokeDashArray: 10,
      position: 'back',
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: 'bottom',
            offsetY: 8,
            horizontalAlign: 'center',
          },
          plotOptions: {
            bar: {
              columnWidth: '80%',
            },
          },
        },
      },
    ],
  };

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={height} />
    </div>
  );
};

export default RevenueBarChart;
