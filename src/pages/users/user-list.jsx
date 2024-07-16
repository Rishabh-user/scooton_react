import React, { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import {useTable, useRowSelect, useSortBy, usePagination,} from "react-table";
import Card from "../../components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Switch from "@/components/ui/Switch";
import { BASE_URL } from "../../api";
import Loading from "../../components/Loading";

const COLUMNS = [
  {
    Header: "Sr. No.",
    accessor: (row, i) => i + 1,
  },
  {
    Header: "User Id",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "firstName",
    Cell: (row) => {
      const { original } = row.row;
      const firstName = original.firstName || "";
      const lastName = original.lastName || "";
      const imageUrl = original.media ? original.media.url : null;
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
      return (
        <span className="flex items-center">
          <div className="flex-none">
          <div className="w-8 h-8 rounded-[100%] ltr:mr-3 rtl:ml-3">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Rider"
                  className="w-full h-full rounded-[100%] object-cover"
                />
              ) : (
                <span className="text-white bg-scooton-500 font-medium rounded-[50%] w-8 h-8 flex items-center justify-center">{initials}</span>
              )}
            </div>
          </div>
          <div className="flex-1 text-start">
            <h4 className="text-sm font-medium text-slate-600 whitespace-nowrap">
              {row?.cell?.value || "No Name"}
            </h4>
          </div>
        </span>
      );
    },
  },
  {
    Header: "Mobile",
    accessor: "mobileNumber",
  },
  {
    Header: "Created Date",
    accessor: "createdAt",
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
    Header: "Last Activity Date",
    accessor: "lastActivity",
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
  // {
  //   Header: "Status",
  //   accessor: "active",
  //   Cell: ({ value }) => {
  //     const statusClass = value ? "text-success-500 bg-success-500" : "text-warning-500 bg-warning-500";
  //     const statusText = value ? "Active" : "Inactive";
  
  //     return (
  //       <span className={`block w-full`}>
  //         <span
  //           className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${statusClass}`}
  //         >
  //           {statusText}
  //         </span>
  //       </span>
  //     );
  //   },
  // },
  // {
  //   Header: "Action",
  //   accessor: "active",
  //   Cell: ({ row }) => {
  //     const isActive = row.value;
  //     return (
  //       <span>
  //         <Switch
  //           activeClass="bg-danger-500"
  //           checked={isActive}
  //         />
  //       </span>
  //     );
  //   },
  // }
  {
    Header: "Action",
    accessor: "active",
    Cell: ({ row }) => {
      const [isActive, setIsActive] = useState(row.original.active);
      const toggleActive = async () => {
        try {
          const token = localStorage.getItem("jwtToken");
          await axios.patch(
            `${BASE_URL}/user/${row.original.id}/toggle-active`,
            { active: !isActive },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsActive(!isActive);
        } catch (error) {
          console.error("Error toggling user active state:", error);
        }
      };

      return (
        <span>
          <Switch
            activeClass="bg-danger-500"
            checked={isActive}
            onChange={toggleActive}
          />
        </span>
      );
    },
  }
];

const UserList = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axios
        .get(`${BASE_URL}/user/get-all?page=${currentPage}&size=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserData(response.data);
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
      data: userData,
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
          <h4 className="card-title">Users List</h4>
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

export default UserList;
