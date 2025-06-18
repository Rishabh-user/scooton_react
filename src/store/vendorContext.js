import { useEffect, useState } from "react";
import axiosInstance from "../api";
import { BASE_URL } from "../api";

const useVendors = () => {
  const [Vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
         await axiosInstance.get(`${BASE_URL}/api/v1/admin/third-party-users`) .then((response) => {
          console.log("response",response)
          setVendors(response.data || []);
        }
      )
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return { Vendors, loading };
};

export default useVendors;
