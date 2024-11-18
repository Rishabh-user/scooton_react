import React, { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { useTable, useRowSelect, useSortBy, usePagination, } from "react-table";
import Card from "../../components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import twowheeler from '../../assets/images/icon/Two_Wheeler_EV.png';
import threewheeler from '../../assets/images/icon/Three_Wheeler.png';
import tataace from '../../assets/images/icon/Tata_Ace.png'
import pickup_8ft from "../../assets/images/icon/Pickup_8ft.png";
import Tooltip from "@/components/ui/Tooltip";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

const COLUMNS = (openIsNotificationModel, openIsDeleteOrder, ordersType) => [
  {
    Header: "Sr. No.",
    accessor: (row, i) => i + 1,
  },
  {
    Header: "Order ID",
    accessor: "order_Id",
  },
  {
    Header: "Mobile Number",
    accessor: "orderHistory.userInfo.mobileNumber",
  },
  {
    Header: "City",
    accessor: "City",
    Cell: () => {
      const staticValue = "Delhi";
      return staticValue;
    },
  },
  {
    Header: "Amount",
    accessor: "orderHistory.totalAmount",
  },
  {
    Header: "Order Date",
    accessor: "orderHistory.orderDate",
    Cell: ({ cell }) => {
      const date = new Date(cell.value);
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
      return <span>{`${formattedDate}, ${formattedTime}`}</span>;
    },
  },
  {
    Header: "Status",
    accessor: "orderHistory.orderStatus",
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${row?.cell?.value === "COMPLETED"
              ? "text-success-500 bg-success-500"
              : ""
              } 
            ${row?.cell?.value === "PLACED"
                ? "text-warning bg-warning-700"
                : ""
              }
            ${row?.cell?.value === "CANCEL"
                ? "text-danger-500 bg-danger-500"
                : ""
              }
            ${row?.cell?.value === "DISPATCHED"
                ? "text-warning-500 bg-warning-400"
                : ""
              }
            
             `}
          >
            {row?.cell?.value}
          </span>
        </span>
      );
    },
  },
  {
    Header: "Pick Up Address",
    accessor: "orderHistory.pickupAddressDetails.addressLine1"
  },
  {
    Header: "Delivery Address",
    accessor: "orderHistory.deliveryAddressDetails.addressLine1"
  },
  ...(ordersType === "PLACED"
    ? [
      {
        Header: "Notification",
        accessor: "",
        Cell: (row) => {
          return (
            <div onClick={() => openIsNotificationModel(row.row.original.order_Id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z" />
              </svg>
            </div>
          );
        },
      },
    ]
    : []),
  {
    Header: "Cancel",
    accessor: "",
    Cell: (row) => {
      return (
        <div onClick={() => openIsDeleteOrder(row.row.original.order_Id)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" /></svg>

        </div>
      )

    }
  },
  {
    Header: "Vehicle Type",
    accessor: "vehicleId",
    Cell: (row) => {
      return (
        <div>
          {row?.cell?.value === 1 ? (
            <img className="object-cover" width={30} alt="twowheeler" class="mr-2 rounded-0" src={twowheeler}></img>
          ) : row?.cell?.value === 2 ? (
            <img className="object-cover" width={30} alt="threewheeler" class="mr-2 rounded-0" src={threewheeler}></img>
          ) : row?.cell?.value === 3 ? (
            <img className=" object-cover" width={30} alt="tataace" class="mr-2 rounded-0" src={tataace}></img>
          ) : (
            <img className="object-cover" width={30} alt="pickup_8ft" class="mr-2 rounded-0" src={pickup_8ft}></img>
          )
          }

        </div>
      )

    }
  },
  {
    Header: "Platform",
    accessor: "orderHistory.platform",
    Cell: (row) => {
      return (
        <div>
          {row?.cell?.value === 'android' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 128 128"><path fill="#fff" d="M21.012 91.125c-5.538.003-10.038-4.503-10.039-10.04l-.002-30.739c-.002-5.532 4.497-10.037 10.028-10.038c2.689-.002 5.207 1.041 7.105 2.937s2.942 4.418 2.944 7.099l-.003 30.74a9.92 9.92 0 0 1-2.931 7.094a9.96 9.96 0 0 1-7.102 2.947m-.008-48.12c-4.053-.002-7.338 3.291-7.339 7.341l.005 30.736a7.347 7.347 0 0 0 7.341 7.348a7.34 7.34 0 0 0 7.339-7.347V50.342a7.345 7.345 0 0 0-7.346-7.337" /><path fill="#fff" d="m99.742 44.527l-2.698-.001l-66.119.009l-2.699.001l-.002-2.699c-.006-11.08 6.03-21.385 15.917-27.473l-3.844-7.017c-.47-.822-.588-1.863-.314-2.815a3.73 3.73 0 0 1 1.814-2.239a3.6 3.6 0 0 1 1.759-.447c1.362 0 2.609.739 3.267 1.933l4.023 7.329a37.8 37.8 0 0 1 13.099-2.305c4.606-.002 9.023.777 13.204 2.311l4.017-7.341a3.71 3.71 0 0 1 3.263-1.932a3.7 3.7 0 0 1 1.761.438A3.7 3.7 0 0 1 88 4.524a3.7 3.7 0 0 1-.318 2.832l-3.842 7.013c9.871 6.101 15.9 16.398 15.899 27.459zM80.196 15.403l5.123-9.355a1.019 1.019 0 1 0-1.783-.981l-5.176 9.45c-4.354-1.934-9.229-3.021-14.382-3.016c-5.142-.005-10.008 1.078-14.349 3.005l-5.181-9.429a1.01 1.01 0 0 0-1.379-.405c-.497.266-.68.891-.403 1.379l5.125 9.348c-10.07 5.194-16.874 15.084-16.868 26.439l66.118-.008c.003-11.351-6.789-21.221-16.845-26.427M48.94 29.86a2.772 2.772 0 0 1 .003-5.545a2.78 2.78 0 0 1 2.775 2.774a2.775 2.775 0 0 1-2.778 2.771m30.107-.006a2.767 2.767 0 0 1-2.772-2.771a2.79 2.79 0 0 1 2.773-2.778a2.79 2.79 0 0 1 2.767 2.779a2.77 2.77 0 0 1-2.768 2.77m-27.336 96.305c-5.533-.001-10.036-4.501-10.037-10.038l-.002-13.567l-2.638.003a10.45 10.45 0 0 1-7.448-3.082a10.44 10.44 0 0 1-3.083-7.452l-.01-47.627v-2.701h2.699l65.623-.01l2.7-.002v2.699l.007 47.633c.001 5.809-4.725 10.536-10.532 10.535l-2.654.002l.003 13.562c0 5.534-4.502 10.039-10.033 10.039a9.93 9.93 0 0 1-7.098-2.937a9.95 9.95 0 0 1-2.947-7.096v-13.568H61.75v13.565c-.002 5.535-4.503 10.043-10.039 10.042" /><path fill="#fff" d="M31.205 92.022a7.82 7.82 0 0 0 7.831 7.837h5.333l.006 16.264c-.001 4.05 3.289 7.341 7.335 7.342a7.34 7.34 0 0 0 7.338-7.348l.001-16.259l9.909-.003l-.001 16.263c.004 4.051 3.298 7.346 7.343 7.338c4.056.003 7.344-3.292 7.343-7.344l-.005-16.259l5.353-.001c4.319.001 7.832-3.508 7.832-7.837l-.009-47.635l-65.621.012zm75.791-.91c-5.536.001-10.039-4.498-10.038-10.036l-.008-30.738c.002-5.537 4.498-10.041 10.031-10.041c5.54-.001 10.046 4.502 10.045 10.038l.003 30.736c.001 5.534-4.498 10.042-10.033 10.041m-.01-48.116c-4.053-.004-7.337 3.287-7.337 7.342l.003 30.737a7.336 7.336 0 0 0 7.342 7.34a7.34 7.34 0 0 0 7.338-7.343l-.008-30.736a7.335 7.335 0 0 0-7.338-7.34" /><path fill="#a4c439" d="M21.004 43.005c-4.053-.002-7.338 3.291-7.339 7.341l.005 30.736a7.34 7.34 0 0 0 7.342 7.343a7.33 7.33 0 0 0 7.338-7.342V50.342a7.345 7.345 0 0 0-7.346-7.337m59.192-27.602l5.123-9.355a1.023 1.023 0 0 0-.401-1.388a1.02 1.02 0 0 0-1.382.407l-5.175 9.453c-4.354-1.938-9.227-3.024-14.383-3.019c-5.142-.005-10.013 1.078-14.349 3.005l-5.181-9.429a1.01 1.01 0 0 0-1.378-.406a1.007 1.007 0 0 0-.404 1.38l5.125 9.349c-10.07 5.193-16.874 15.083-16.868 26.438l66.118-.008c.003-11.351-6.789-21.221-16.845-26.427M48.94 29.86a2.772 2.772 0 0 1 .003-5.545a2.78 2.78 0 0 1 2.775 2.774a2.775 2.775 0 0 1-2.778 2.771m30.107-.006a2.77 2.77 0 0 1-2.772-2.771a2.793 2.793 0 0 1 2.773-2.778a2.79 2.79 0 0 1 2.767 2.779a2.767 2.767 0 0 1-2.768 2.77M31.193 44.392l.011 47.635a7.82 7.82 0 0 0 7.832 7.831l5.333.002l.006 16.264c-.001 4.05 3.291 7.342 7.335 7.342c4.056 0 7.342-3.295 7.343-7.347l-.004-16.26l9.909-.003l.004 16.263c0 4.047 3.293 7.346 7.338 7.338c4.056.003 7.344-3.292 7.343-7.344l-.005-16.259l5.352-.004a7.835 7.835 0 0 0 7.836-7.834l-.009-47.635zm83.134 5.943a7.34 7.34 0 0 0-7.341-7.339c-4.053-.004-7.337 3.287-7.337 7.342l.006 30.738a7.334 7.334 0 0 0 7.339 7.339a7.337 7.337 0 0 0 7.338-7.343z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52a4.17 4.17 0 0 0-1 3.09a3.69 3.69 0 0 0 2.94-1.42m2.52 7.44a4.51 4.51 0 0 1 2.16-3.81a4.66 4.66 0 0 0-3.66-2c-1.56-.16-3 .91-3.83.91s-2-.89-3.3-.87a4.92 4.92 0 0 0-4.14 2.53C2.93 12.45 4.24 17 6 19.47c.8 1.21 1.8 2.58 3.12 2.53s1.75-.82 3.28-.82s2 .82 3.3.79s2.22-1.24 3.06-2.45a11 11 0 0 0 1.38-2.85a4.41 4.41 0 0 1-2.68-4.04" /></svg>
          )}

        </div>
      )
    }
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: (row) => {
      const navigate = useNavigate();
      const handleViewClick = () => {
        const orderId = row.row.original.order_Id;
        navigate(`/order-detail/${orderId}`);
      };
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="View" placement="top" arrow animation="shift-away">
            <button className="action-btn bg-scooton" type="button" onClick={handleViewClick}>
              <Icon icon="heroicons:eye" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },

];

const AllOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [ordersType, SetOrderType] = useState("PLACED")
  const [filterby, setFilterBy] = React.useState('NONE');
  const [notificationModel, setNotificationModel] = useState(false);
  const [deleteordermodel, setDeleteOrderModel] = useState(false);
  const [orderdeleteid, setOrderDeleteId] = useState();
  const [notification, setNotification] = useState("ALL");
  const [mobile, setMobile] = useState();
  const [notificationid, setNotifictionId] = useState()

  const openIsNotificationModel = async (id) => {
    console.log("id", id);
    setNotifictionId(id)
    setNotificationModel(true);
  }

  const openIsDeleteOrder = async (id) => {
    setDeleteOrderModel(true)
    setOrderDeleteId(id)
  }

  const deletePlaceOrder = () => {
    try {
      axios.post(`${BASE_URL}/order/cancel-order/${orderdeleteid}`).then((response) => {
        toast.success("Order cancel successfully");
      })
    } catch {
      (error) => {
        toast.error("Failed");
      }
    }
  }

  const handleMobileNumber = (event) => {
    console.log("setMobile", event.target.value)
    setMobile(event.target.value);
  };
  const handlenotification = (event) => {
    console.log("qwerty", event.target.value)
    setNotification(event.target.value);
  };
  const sendNotification = () => {
    try {
      if (mobile) {
        axios.get(`${BASE_URL}/order/v2/send-order-notification/${notificationid}/${mobile}`).then((response) => {
          toast.success("Notification Sended Successfully")
          setNotification(false);
        })
      } else {
        axios.get(`${BASE_URL}/order/v2/send-order-notification/${notificationid}`).then((response) => {
          toast.success("Notification Sended Successfully")
          setNotification(false);
        })
      }

    } catch (error) {
      toast.error("Notification not Sended");
    }
  }

  const handleChange = (event) => {
    console.log("qwerty", event.target.value)
    setFilterBy(event.target.value);
    if (event.target.value === 'NONE') {
      setSearch("");
      fetchOrders(ordersType)
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (search === '') {
      fetchOrders(ordersType)
    }
  };
  useEffect(() => {
    // const token = localStorage.getItem("jwtToken");
    // if (token) {
    //   axios
    //     .post(`${BASE_URL}/order-history/search-city-wide-orders-all-service-area/0?page=${currentPage}&size=100`,{orderType: "ALL ORDERS", searchType: "NONE"}, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((response) => {
    //       setOrderData(response.data);
    //       console.log(response.data);
    //       setPageCount(response.data.totalPages);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching user data:", error);
    //     })
    //     .finally(() => {
    //       setLoading(false); 
    //     });
    // }
    fetchOrders("PLACED");
  }, []);


  useEffect(() => {
    if (search.trim() || filterby !== "NONE") {
      FilterOrder();
    }
  }, [filterby, search]);

  const fetchOrders = (orderType) => {
    setLoading(true);
    SetOrderType(orderType)
    axios
      .post(
        `${BASE_URL}/order-history/search-city-wide-orders-all-service-area/0?page=${currentPage}&size=100`,
        { "orderType": orderType, searchType: "NONE" },

      )
      .then((response) => {
        setOrderData(response.data);
        setPageCount(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const FilterOrder = () => {
    setLoading(true);
    axios
      .post(
        `${BASE_URL}/order-history/search-city-wide-orders-all-service-area/0?page=${currentPage}&size=100`,
        { "number": search, "orderType": ordersType, searchType: filterby },

      )
      .then((response) => {
        setOrderData(response.data);
        setPageCount(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("jwtToken");
  //   if (token && search) {
  //     axios
  //       .post(`${BASE_URL}/user/search-by-mobile-number`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params: {
  //           mobileNumber: search,
  //         },
  //       })
  //       .then((response) => {
  //         setUserData(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user data:", error);
  //       });
  //   }
  // }, [search]);



  // const columns = useMemo(() => COLUMNS(openIsNotificationModel), []);
  const columns = useMemo(() => COLUMNS(openIsNotificationModel, openIsDeleteOrder, ordersType), [ordersType]);

  const tableInstance = useTable(
    {
      columns,
      data: orderData,
      initialState: {
        pageSize: 10,
      },
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    setPageSize,
    prepareRow,
  } = tableInstance;

  const { pageIndex, pageSize } = state;
  useEffect(() => {
    setCurrentPage(pageIndex);
  }, [pageIndex]);

  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">All Orders</h4>
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterby}
                label="Filter By"
                onChange={handleChange}
              >
                <MenuItem value="NONE">NONE</MenuItem>
                <MenuItem value="ORDERID">ORDER ID</MenuItem>
                <MenuItem value="MOBILE">Mobile Number</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="search"
              type="text"
              name="search"
              placeholder="Filter By"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => fetchOrders(e.target.value)}
              defaultValue="PLACED"
            >
              <FormControlLabel value="PLACED" control={<Radio />} label="PLACED" />
              <FormControlLabel value="ACCEPTED" control={<Radio />} label="ACCEPTED" />
              <FormControlLabel value="PICKED" control={<Radio />} label="PICKED" />
              <FormControlLabel value="DELIVERED" control={<Radio />} label="DELIVERED" />
              <FormControlLabel value="CANCELLED" control={<Radio />} label="CANCELLED" />
              <FormControlLabel value="ALL ORDERS" control={<Radio />} label="ALL ORDERS" />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              {loading ? (
                <div className="flex justify-center items-center w-100">
                  <Loading />
                </div>
              ) : (
                <table
                  className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                  {...getTableProps()}
                >
                  <thead className=" bg-slate-200 dark:bg-slate-700">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps(
                              // column.getSortByToggleProps()
                            )}
                            scope="col"
                            className=" table-th "
                          >
                            {column.render("Header")}
                            {/* <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span> */}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                    {...getTableBodyProps()}
                  >
                    {page.map((row) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()}>
                          {row.cells.map((cell) => {
                            return (
                              <td {...cell.getCellProps()} className="table-td">
                                {cell.render("Cell")}

                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Prev
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${pageIdx === pageIndex
                    ? "bg-scooton-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                    : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                    }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={` ${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      </Card>

      {notificationModel && (

        <Modal
          activeModal={notificationModel}
          uncontrol
          className="max-w-md"

          onClose={() => setNotificationModel(false)}
        >
          <div className="">
            <h5 className="text-center mb-4">Send Notification</h5>
            <div>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={notification}
                  label="Filter By"
                  onChange={handlenotification}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="INDIVIDAUL">Individual</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField
                label="Mobile Number"
                id="mobile"
                type="number"
                name="mobile"
                value={mobile}
                onChange={handleMobileNumber}
              />
            </div>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Button className="btn btn-dark" type="button" onClick={sendNotification} >
                Send Notification
              </Button>
              <Button className="btn btn-outline-light" type="button" onClick={() => { setNotificationModel(false) }}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

      )}

      {deleteordermodel && (
        <Modal
          activeModal={deleteordermodel}
          uncontrol
          className="max-w-md"
          title=""

          onClose={() => setDeleteOrderModel(false)}
        >
          <div className="">
            <h5 className="text-center">Are you sure to cancel?</h5>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Button className="btn btn-dark" type="button" onClick={() => setDeleteOrderModel(false)}>
                No
              </Button>
              <Button className="btn btn-outline-light" type="button" onClick={() => { deletePlaceOrder(); setDeleteOrderModel(false) }}>
                Yes
              </Button>
            </div>
          </div>
        </Modal>
      )}


    </>
  );
};

export default AllOrders;
