import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { format, differenceInDays, parseISO } from "date-fns";
import Datepicker from "react-tailwindcss-datepicker";
import Card from "@/components/ui/Card";
import { BASE_URL } from "../../../../api";

const OrderAnalytics = ({ height = 400 }) => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  // Default last 7 days
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().setDate(new Date().getDate() - 6)), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchAnalytics = async (start, end) => {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/admin/dashboard/order-analytics?startDate=${start}&endDate=${end}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data.jsonData;
    const dateKeys = Object.keys(data).sort();

    const totalOrders = [];
    const srOrders = [];
    const cityWideOrders = [];

    dateKeys.forEach((date) => {
      const item = data[date]?.[0];
      totalOrders.push(item ? item.totalOrdersCount : 0);
      srOrders.push(item ? item.srOrdersCount : 0);
      cityWideOrders.push(item ? item.cityWideOrdersCount : 0);
    });

    setCategories(dateKeys);
    setSeries([
      { name: "Total Orders", data: totalOrders },
      { name: "SR Orders", data: srOrders },
      { name: "City-Wide Orders", data: cityWideOrders },
    ]);
  } catch (error) {
    console.error("Error fetching order analytics:", error);
  }
};


  useEffect(() => {
    fetchAnalytics(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const handleDateChange = (newRange) => {
    const start = parseISO(newRange.startDate);
    const end = parseISO(newRange.endDate);
    const diff = differenceInDays(end, start);

    if (diff > 31) {
      alert("Date range cannot exceed 31 days.");
      return;
    }

    setDateRange(newRange);
  };

  const options = {
    chart: {
      toolbar: { show: false },
      type: "area",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "solid",
      opacity: 0.1,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      labels: { style: { fontFamily: "Inter" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { fontFamily: "Inter" } },
      title: {
        text: "Order Count",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} orders`,
      },
    },
  };

  return (
    <Card>
      {/* Header Row: Title + Datepicker */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Order Analytics</h2>

        <div className="graph-date-picker w-full max-w-xs">
          <Datepicker
            value={dateRange}
            onChange={handleDateChange}
            displayFormat={"DD/MM/YYYY"}
            maxDate={new Date()}
            primaryColor={"red"}
            showShortcuts={true}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="legend-ring">
        <Chart options={options} series={series} type="area" height={height} />
      </div>
    </Card>
  );
};

export default OrderAnalytics;
