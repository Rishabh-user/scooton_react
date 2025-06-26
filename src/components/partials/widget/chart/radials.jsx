import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import useWidth from "@/hooks/useWidth";
import axiosInstance from "../../../../api";
import { BASE_URL } from "../../../../api";

const RadialsChart = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();
  const [activeRiders, setActiveRiders] = useState(0);
  const [onRoleRiders, setOnRoleRiders] = useState(0);
  const [totalRiders, setTotalRiders] = useState(0);
  const [unregisteredRiders, setUnregisteredRiders] = useState(0);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/order-history/orders/get-all-riders-count`
        );

        setActiveRiders(response.data.data.activeRiders || 0);
        setOnRoleRiders(response.data.data.onRoleRiders || 0);
        setTotalRiders(response.data.data.totalRiders || 0);
        setUnregisteredRiders(response.data.data.unregisteredRiders || 0);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, []);

  const total = activeRiders + onRoleRiders + unregisteredRiders;

  const series = [ onRoleRiders, unregisteredRiders, activeRiders,totalRiders];
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "16px",
            color: isDark ? "#CBD5E1" : "#475569",
          },
          value: {
            fontSize: "16px",
            color: isDark ? "#CBD5E1" : "#475569",
            formatter: function (val) {
              return val; 
            },
          },
          // total: {
          //   show: true,
          //   label: "Total",
          //   color: isDark ? "#CBD5E1" : "#475569",
          //   formatter: function () {
          //     return totalRiders
          //   },
          // },
        },
        track: {
          background: "#E2E8F0",
          strokeWidth: "97%",
        },
      },
    },
    labels: [ "OnRole Riders", "Unregistered Riders", "Active Riders", "Total Riders"],
    colors: ["#4669FA"  ,"#FA916B", "#50C793","#FFC75F"],
  };

  return (
    <div>
      <Chart
        options={options}
        series={series}
        type="radialBar"
        height={width > breakpoints.md ? 360 : 250}
      />
    </div>
  );
};

export default RadialsChart;
