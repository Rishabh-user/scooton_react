import React, {useState, useEffect} from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/pages/auth/common/store";

import UserAvatar from "@/assets/images/all-img/user.png";
import { BASE_URL } from "../../../../api";
import axiosInstance from "../../../../api";
import requestFCMToken from "../../../../requestFCMToken";

const profileLabel = () => {
  const [userData, setUserData] = useState({
    user: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      requestFCMToken(userData.id);
   }
  }, [userData]);
  
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axiosInstance.post(`${BASE_URL}/auth/refresh/admin`, { auth: token }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })      
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {       
        console.error('Error fetching protected data:', error);       
      });
    } 
  }, []);
  const[tokenexpires, setTokenExpire] = useState([]);
  const serviceAreaId = localStorage.getItem('serviceAreaId');
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      axiosInstance.post(`${BASE_URL}/order-history/orders/count-total/${serviceAreaId}`,{ type: "INCOMING" }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })      
      .then(response => {
        setTokenExpire(response.data);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          handleLogoutAndRedirect();
        } else {
          console.error('Error fetching protected data:', error);
        }
      });
    } 
  }, []);
  
  const handleLogoutAndRedirect = () => {
    window.localStorage.clear();
    navigate('/');
  };

  
  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img
            src={UserAvatar}
            alt=""
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          {userData.user}
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const ProfileMenu = [
    // {
    //   label: "Profile",
    //   icon: "heroicons-outline:user",

    //   action: () => {
    //     navigate("/profile");
    //   },
    // },
    // {
    //   label: "Settings",
    //   icon: "heroicons-outline:cog",
    //   action: () => {
    //     navigate("/settings");
    //   },
    // },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: () => {
        dispatch(handleLogout(false));
      },
    },
  ];

  return (
    <Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block     ${
                item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
