import React from "react";
import { Link } from "react-router-dom";
import useSidebar from "@/hooks/useSidebar";

// import images
import Logo from "@/assets/images/logo/logo.png";
//import MobileLogoWhite from "@/assets/images/logo/logo-c-white.svg";

const SidebarLogo = ({ menuHover }) => {
  const [collapsed, setMenuCollapsed] = useSidebar();
  
  return (
    <div
      className={` logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] py-6  px-4 
      ${menuHover ? "logo-hovered" : ""}
      
      
      `}
    >
      <Link to="/dashboard">
        <div className="flex items-center space-x-4">
          <div className="logo-icon">
          <img src={Logo} alt="Scooton Logo" width={170}  />
            {/* {!isDark && !isSemiDark ? (
              <img src={MobileLogo} alt="Spakrs Logo" width={170}  />
            ) : (
              <img src={MobileLogoWhite} alt="erere" />
            )} */}
          </div>

          {/* {(!collapsed || menuHover) && (
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                S
              </h1>
            </div>
          )} */}
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <div
          onClick={() => setMenuCollapsed(!collapsed)}
          className={`h-4 w-4 border-[1.5px] border-slate-900 dark:border-slate-700 rounded-full transition-all duration-150
          ${
            collapsed
              ? ""
              : "ring-2 ring-inset ring-offset-4 ring-black-900 dark:ring-slate-400 bg-scooton-900 dark:bg-slate-400 dark:ring-offset-slate-700"
          }
          `}
        ></div>
      )}
    </div>
  );
};

export default SidebarLogo;
