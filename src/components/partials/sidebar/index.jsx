import React, { useRef, useEffect, useState } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import useVendors from "../../../store/vendorContext";

const Sidebar = () => {
  const { Vendors, loading } = useVendors(); 
  const [scroll, setScroll] = useState(false);
  const scrollableNodeRef = useRef();

  const [collapsed, setMenuCollapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);
  const [dynamicMenu, setDynamicMenu] = useState(menuItems);

  const [isSemiDark] = useSemiDark();
  const [skin] = useSkin();

  const handleVendorList = async () => {
    if (!loading && Vendors.length > 0) {
      const vendorChildItems = Vendors.map((vendor) => ({
        childtitle: vendor.userName || vendor.title || "Vendor",
        childlink: vendor.userName?.toLowerCase() || "vendor",
        childicon: "heroicons:presentation-chart-line",
      }));

      const updatedMenu = menuItems.map((item) => {
        if (item.title === "Orders") {
          const updatedChild = item.child.map((subItem) => {
            if (subItem.childtitle === "Vendor") {
              return {
                ...subItem,
                child: vendorChildItems,
              };
            }
            return subItem;
          });
          return { ...item, child: updatedChild };
        }
        return item;
      });

      setDynamicMenu(updatedMenu);
    }
  }

  useEffect(() => {
   
    if(Vendors.length > 0){
       handleVendorList();
    }
  }, [Vendors]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current?.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    const node = scrollableNodeRef.current;
    node?.addEventListener("scroll", handleScroll);
    return () => node?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={`sidebar-wrapper bg-white dark:bg-slate-800 ${
          collapsed ? "w-[72px] close_sidebar" : "w-[248px]"
        } ${menuHover ? "sidebar-hovered" : ""} ${
          skin === "bordered"
            ? "border-r border-slate-200 dark:border-slate-700"
            : "shadow-base"
        }`}
        onMouseEnter={() => setMenuHover(true)}
        onMouseLeave={() => setMenuHover(false)}
      >
        <SidebarLogo menuHover={menuHover} />
        <div
          className={`h-[60px] absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
            scroll ? "opacity-100" : "opacity-0"
          }`}
        />
        <SimpleBar
          className="sidebar-menu px-4 h-[calc(100%-80px)]"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <Navmenu menus={dynamicMenu} />
        </SimpleBar>
      </div>
    </div>
  );
};

export default Sidebar;
