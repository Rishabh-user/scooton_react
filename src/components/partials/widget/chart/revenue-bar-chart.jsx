import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { BASE_URL } from "../../../../api";
import axiosInstance from "../../../../api";

const VehicleAreaChart = [
  {
    "vehicles": [
      {
        "type": "Two Wheeler",
        "orders": [120, 150, 180, 200, 170, 190, 210, 230, 220, 250, 270, 300]
      },
      {
        "type": "Three Wheeler",
        "orders": [80, 90, 100, 110, 95, 105, 115, 125, 130, 140, 150, 160]
      },
      {
        "type": "Two Wheeler EV",
        "orders": [200, 220, 250, 270, 260, 280, 300, 320, 310, 330, 350, 370]
      },
      {
        "type": "Pickup 8ft",
        "orders": [50, 60, 70, 80, 75, 85, 95, 100, 110, 120, 130, 140]
      }
    ],
    "months": [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]
  }
  
]

const RevenueBarChart = ({ height = 400 }) => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    // Extract months for categories
    const months = VehicleAreaChart[0].months;
    setCategories(months);

    // Extract orders for series
    const formattedSeries = VehicleAreaChart[0].vehicles.map((vehicle) => ({
      name: vehicle.type,
      data: vehicle.orders,
    }));

    setSeries(formattedSeries);
  }, []);

  const options = {
    chart: {
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 4,
      },
    },
    stroke: {
      width: 2
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
      labels: { style: { fontFamily: "Inter" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontFamily: "Inter" } },
    },
    tooltip: {
      y: { formatter: (val) => `${val} orders` },
    },
  };
  
  

  return (
    <div>
      <Chart options={options} series={series} type="area" height={height} />
    </div>
  );
};

export default RevenueBarChart;
