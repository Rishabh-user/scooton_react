import React, { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import {useTable, useRowSelect, useSortBy, usePagination,} from "react-table";
import Card from "../../components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";
import Tooltip from "@/components/ui/Tooltip";
import { useNavigate } from "react-router-dom";
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
  // {
  //   Header: "Pick Up Address",
  //   accessor: "orderHistory.pickupAddressDetails.addressLine1"
  // },
  // {
  //   Header: "Delivery Address",
  //   accessor: "orderHistory.deliveryAddressDetails.addressLine1"
  // },
  {
    Header: "Vehicle Type",
    accessor: "vehicleId",
  },
  {
    Header:"Platform",
    accessor:"orderHistory.platform"
  },
  {
    Header: "Action",
    accessor: "action",
    Cell: (row) => {
      const navigate = useNavigate();
      const handleViewClick = () => {
        const orderId = row.row.original.orderHistory.orderId;
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

const CityWideOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios
        .post(`${BASE_URL}/order-history/search-city-wide-orders-all-service-area-isOfflineOrder/0/false?page=${currentPage}&size=100`,{orderType: "ALL ORDERS", searchType: "NONE"}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setOrderData(response.data);
          console.log(response.data);
          setPageCount(response.data.totalPages);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        })
        .finally(() => {
          setLoading(false); 
        });
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token && search) {
      axios
        .post(`${BASE_URL}/user/search-by-mobile-number`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            mobileNumber: search,
          },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [search]);
  
  

  const columns = useMemo(() => COLUMNS, []);
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
          <h4 className="card-title">Citywide Orders</h4>
          <div>
            <Textinput
                placeholder="Search by mobile number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
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
                  className={` ${
                    pageIdx === pageIndex
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
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
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
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      </Card>
    </>
  );
};

export default CityWideOrders;
