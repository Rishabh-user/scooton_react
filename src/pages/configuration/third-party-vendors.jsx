
import React, { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { useTable, useRowSelect, useSortBy, usePagination } from "react-table";
import Card from "../../components/ui/Card";
import { BASE_URL } from "../../api";
import Tooltip from "@/components/ui/Tooltip";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import axiosInstance from "../../api";
import { Badge } from "react-bootstrap";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Sidebar from "../../components/partials/sidebar";
import { format } from "date-fns";

const Third_Party_Vendors = (vendorlist) => {

  const [loading, setLoading] = useState(true);
  const [roleList, setRoleList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pagesizedata, setpagesizedata] = useState(10);

  const [isEditModal, setIsEditModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [modalFormValues, setModalFormValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState([]);

  const fieldLabels = {
    userName: "Vendor Name",
    email: "Email",
    mobileNumber: "Mobile Number",
    clientId: "ClientId",
    createdDate: "createdDate",
    active: 'Active',
    thirdPartyEnum: "ThirdParty Enum",
    deviceOs: "DeviceOs",
    isPickupOtpEnabled: 'Pickup Otp Enabled',
    isDeliveryOtpEnabled: 'Delivery Otp Enabled',
    id: "Id",
  };
  const CLIENT_ID_LENGTH = 10;
  const ALPHA_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const CHAR_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const RANDOMS = Math.random;

  function generateUniqueClientId() {
    let clientId = '';

    const randomIndexForAlpha = Math.floor(RANDOMS() * ALPHA_POOL.length);
    clientId += ALPHA_POOL.charAt(randomIndexForAlpha);

    for (let i = 1; i < CLIENT_ID_LENGTH; i++) {
      const randomIndex = Math.floor(RANDOMS() * CHAR_POOL.length);
      clientId += CHAR_POOL.charAt(randomIndex);
    }

    return clientId;
  }

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setLoading(true);
      axiosInstance
        .get(`${BASE_URL}/api/v1/admin/third-party-users`)
        .then((response) => {
          setRoleList(response.data || []);
          setTotalCount(response.data.length);

        })
        .catch((error) => {
          console.error("Error fetching config data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentPage, pagesizedata]);

  useEffect(() => {
    if (isCreating) {
      setModalFormValues((prev) => ({
        ...prev,
        clientId: generateUniqueClientId(),
      }));
    }
  }, [isCreating]);



  const columns = useMemo(
    () => [
      {
        Header: "Sr. No.",
        accessor: (row, i) => i + 1,
      },
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "User Name",
        accessor: "userName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "ClientId",
        accessor: "clientId",

      },
      {
        Header: "Mobile Number",
        accessor: "mobileNumber",
      },
      {
        Header: "Third Party Enum",
        accessor: "thirdPartyEnum",
      },
      {
        Header: "Created Date",
        accessor: "createdDate",
        Cell: ({ cell }) => {
          const formattedDate = format(new Date(cell.value), "MMM dd, yyyy h:mm:ss a");

          return <div className="rider-datetime">{formattedDate}</div>;
        },
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: ({ value }) => (
          <Badge bg={value == true ? "success" : "danger"}>
            {value ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Tooltip content="Edit" placement="top" arrow animation="shift-away">
              <button
                className="action-btn"
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setModalFormValues({ ...row.original });
                  setIsEditModal(true);
                  setFieldErrors([]); // Clear errors when opening the modal
                }}
              >
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: roleList,
      initialState: {
        pageIndex: currentPage,
        pageSize: pagesizedata,
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
    prepareRow,
    state,
  } = tableInstance;

  const { pageIndex } = state;

  useEffect(() => {
    setCurrentPage(pageIndex);
  }, [pageIndex]);

  const handleModalSave = async () => {
    setFieldErrors([]);

    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!modalFormValues.userName) {
      errors.push({ fieldName: "userName", fieldError: "User Name is required" });
    }
    if (!modalFormValues.email) {
      errors.push({ fieldName: "email", fieldError: "Email Id is required" });
    } else if (!emailRegex.test(modalFormValues.email)) {
      errors.push({ fieldName: "email", fieldError: "Invalid Email Id" });
    }

    if (!modalFormValues.clientId) {
      errors.push({ fieldName: "clientId", fieldError: "ClientId Id is required" });
    }

    if (!modalFormValues.mobileNumber) {
      errors.push({ fieldName: "mobileNumber", fieldError: "Mobile Number is required" });
    } else if (!phoneRegex.test(modalFormValues.mobileNumber)) {
      errors.push({ fieldName: "mobileNumber", fieldError: "Invalid Mobile Number" });
    }

    if (errors.length > 0) {
      setFieldErrors(errors);
      return;
    }



    try {
      await axiosInstance.post(
        `${BASE_URL}/api/v1/admin/third-party-users`,
        modalFormValues
      );

      toast.success(
        isCreating ? "Third Party Vendors added successfully!" : "Third Party Vendors updated successfully!"
      );

      if (isCreating) {
        setRoleList((prev) => [...prev, modalFormValues]);
      } else {
        setRoleList((prev) =>
          prev.map((item) =>
            item.id === modalFormValues.id ? modalFormValues : item
          )
        );
      }

      setIsEditModal(false);
      setIsCreating(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error submitting vehicle config:", error);
      toast.error(error.response.data.details ? error.response.data.details : error.response.data.message);
    }
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h4 className="card-title">Third Party Vendors</h4>
          <Button
            className="btn btn-dark"
            type="button"
            onClick={() => {
              setIsCreating(true);
              setModalFormValues({
                userName: "",
                email: "",
                mobileNumber: "",
                clientId: generateUniqueClientId(),
                active: true,
                thirdPartyEnum: "THIRD_PARTY",
                isPickupOtpEnabled: true,
                isDeliveryOtpEnabled: true,
              });
              setIsEditModal(true);
              setFieldErrors([]);
            }}
          >
            + Third Party Vendors
          </Button>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center w-full py-10">
                  <Loading />
                </div>
              ) : (
                <table
                  className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                  {...getTableProps()}
                >
                  <thead className="bg-slate-200 dark:bg-slate-700">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map((column) => (
                          <th
                            {...column.getHeaderProps()}
                            className="table-th"
                            key={column.id}
                          >
                            {column.render("Header")}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody
                    className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                    {...getTableBodyProps()}
                  >
                    {page.length > 0 ? (
                      page.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} key={row.id}>
                            {row.cells.map((cell) => (
                              <td
                                {...cell.getCellProps()}
                                className="table-td"
                                key={cell.column.id}
                              >
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={headerGroups[0]?.headers.length || 1}
                          className="text-center py-4 text-gray-500"
                        >
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        activeModal={isEditModal}
        uncontrol
        className="max-w-2xl"
        title={isCreating ? "Add Third Party Vendors" : "Third Party Vendors"}
        onClose={() => {
          setIsEditModal(false);
          setIsCreating(false);
          setFieldErrors([]);
        }}
        centered
      >
        <div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
            {Object.entries(modalFormValues)
              .map(([key, value]) => (
                <div key={key}>
                  <label className="block font-medium mb-1">
                    {fieldLabels[key] || key}
                  </label>
                  {key === "active" || key === "isPickupOtpEnabled" || key === "isDeliveryOtpEnabled" ? (
                    <select
                      className="w-full border px-3 py-2 rounded dark:bg-slate-700 dark:text-white"
                      value={value ? "true" : "false"}
                      onChange={(e) =>
                        setModalFormValues((prev) => ({
                          ...prev,
                          [key]: e.target.value === "true",
                        }))
                      }
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <input
                      className="w-full border px-3 py-2 rounded dark:bg-slate-700 dark:text-white"
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setModalFormValues((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      disabled={
                        key === "id" ||
                        key === "thirdPartyEnum" ||
                        (!isCreating && !["userName", "email", "mobileNumber", "clientId"].includes(key)) ||
                        key === "clientId"
                      }
                    />

                  )
                  }
                  {fieldErrors.some((error) => error.fieldName === key) && (
                    <div className="text-red-600 text-sm">
                      {fieldErrors.find((error) => error.fieldName === key)?.fieldError}
                    </div>
                  )}
                </div>
              ))}
          </div>
          <hr className="mt-3" />
          <div className="d-flex gap-2 justify-content-end mt-6">
            <Button className="btn btn-dark" type="button" onClick={handleModalSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Third_Party_Vendors;

