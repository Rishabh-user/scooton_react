import React, { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import {useTable, useRowSelect, useSortBy, usePagination,} from "react-table";
import Card from "../../components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { BASE_URL } from "../../api";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from "@mui/material/TextField";
import Loading from "../../components/Loading";
const COLUMNS = [
  {
    Header: "Sr. No.",
    accessor: (row, i) => i + 1,
  },            
  {
    Header: "Order ID",
    accessor: "orderHistory.orderId",
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
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                row?.cell?.value === "COMPLETED"
                  ? "text-success-500 bg-success-500"
                  : ""
              } 
            ${
              row?.cell?.value === "PLACED"
                ? "text-warning bg-warning-700"
                : ""
            }
            ${
              row?.cell?.value === "CANCEL"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
            ${
                row?.cell?.value === "DISPATCHED"
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
  {
    Header: "Vehicle Type",
    accessor: "vehicleId",
  },
  {
    Header:"Platform",
    accessor:"orderHistory.platform"
  },
  
];

const OfflineOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [ordersType, SetOrderType] = useState("ALL ORDERS");
  const [filterby, setFilterBy] = React.useState('NONE');
  const [pagesizedata, setpagesizedata]=useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const maxPagesToShow = 5;
  useEffect(() => {
    fetchOrders("ALL ORDERS");
  }, [currentPage,pagesizedata]);

  const fetchOrders = (orderType) => {
    setLoading(true);
    SetOrderType(orderType)
    axios
      .post(
        `${BASE_URL}/order-history/search-city-wide-orders-all-service-area-isOfflineOrder/0/true?page=${currentPage}&size=${pagesizedata}`,
        { "orderType": orderType, "searchType": "NONE" },

      )
      .then((response) => {
        setOrderData(response.data);
        setTotalCount(Number(response.headers["x-total-count"])); 
        setPageCount(Math.ceil(Number(response.headers["x-total-count"]) / pagesizedata)); 
        console.log("response",response)
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  

  const columns = useMemo(() => COLUMNS, []);
  const tableInstance = useTable(
    {
      columns,
      data: orderData,
      initialState: {
        pageIndex: currentPage,
        pageSize: 10,
      },
      manualPagination: true, 
      pageCount, 
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
  const handlePageSizeChange = (newSize) => {
    setpagesizedata(newSize); 
    setCurrentPage(0); 
    
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleChange = (event) => {
    console.log("qwerty", event.target.value)
    setFilterBy(event.target.value);
    if (event.target.value === 'NONE') {
      setSearch("");
      fetchOrders(ordersType)
    }
  };

  useEffect(() => {
    if(filterby && search){
      FilterOrder();
    }
      
  }, [filterby, search,currentPage]);

  const FilterOrder = () => {
    setLoading(true);
    axios
      .post(
        `${BASE_URL}/order-history/search-city-wide-orders-all-service-area-isOfflineOrder/0/true?page=${currentPage}&size=100`,
        { "number": search, "orderType": ordersType, "searchType": filterby },

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

  useEffect(() => {
    setCurrentPage(pageIndex);
  }, [pageIndex]);
  
  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">All Riders</h4>
          <div className="flex gap-2">
            <FormControl fullWidth>
              <label className="text-sm">Filter By</label>
              <Select
                id="demo-simple-select"
                value={filterby}
                //label="Filter By"
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="NONE">NONE</MenuItem>
                <MenuItem value="ORDERID">ORDER ID</MenuItem>
                <MenuItem value="MOBILE">Mobile Number</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <label className="text-sm">Filter By</label>
              <TextField
                id="search"
                type="text"
                name="search"
                value={search}
                onChange={handleSearchChange}
              />
            </FormControl>
          </div>
        </div>
        <div className="filter-orderlist">
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              onChange={(e) => fetchOrders(e.target.value)}
              defaultValue="ALL ORDERS"
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
              value={pagesizedata}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
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
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            {totalCount > pagesizedata && (
              <>
                {/* First Page Button */}
                <li>
                  <button
                    onClick={() => gotoPage(0)}
                    disabled={currentPage === 0}
                    className={currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Icon icon="heroicons:chevron-double-left-solid" />
                  </button>
                </li>

                {/* Previous Page Button */}
                <li>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={currentPage === 0 ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    Prev
                  </button>
                </li>

                {/* Page Numbers */}
                {(() => {
                  const totalPages = pageCount; // Total number of pages
                  const currentGroup = Math.floor(currentPage / maxPagesToShow); // Current group of pages
                  const startPage = currentGroup * maxPagesToShow; // Starting page of the current group
                  const endPage = Math.min(startPage + maxPagesToShow, totalPages); // Ending page of the current group

                  return (
                    <>
                      {/* Previous dots */}
                      {startPage > 0 && (
                        <li>
                          <button onClick={() => setCurrentPage(startPage - 1)}>
                            ...
                          </button>
                        </li>
                      )}

                      {/* Render page numbers */}
                      {Array.from({ length: endPage - startPage }).map((_, idx) => {
                        const pageNumber = startPage + idx;
                        return (
                          <li key={pageNumber}>
                            <button
                              className={
                                pageNumber === currentPage
                                  ? "bg-scooton-900 text-white"
                                  : ""
                              }
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber + 1}
                            </button>
                          </li>
                        );
                      })}

                      {/* Next dots */}
                      {endPage < totalPages && (
                        <li>
                          <button onClick={() => setCurrentPage(endPage)}>
                            ...
                          </button>
                        </li>
                      )}
                    </>
                  );
                })()}

                {/* Next Page Button */}
                <li>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= pageCount - 1}
                    className={
                      currentPage >= pageCount - 1 ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    Next
                  </button>
                </li>

                {/* Last Page Button */}
                <li>
                  <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={currentPage >= pageCount - 1}
                    className={
                      currentPage >= pageCount - 1 ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    <Icon icon="heroicons:chevron-double-right-solid" />
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </Card>
    </>
  );
};

export default OfflineOrders;
