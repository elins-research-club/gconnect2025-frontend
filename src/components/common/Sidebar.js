// components/common/Sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Home,
  Settings,
  History,
  Thermometer,
  Menu,
  Sliders,
  X,
} from "lucide-react";

// The GConnectIcon component has been removed as requested.

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile = false }) => {
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Threshold", href: "/dashboard/thresholds", icon: Sliders },
    {
      name: "Account Settings",
      href: "/dashboard/settings/account",
      icon: Settings,
    },
    { name: "Data History", href: "/dashboard/history", icon: History },
    {
      name: "Sensor Status",
      href: "/dashboard/sensor-status",
      icon: Thermometer,
    },
  ];

  // Close sidebar when navigating on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <div
      className={`bg-white text-gray-800 flex flex-col min-h-screen shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out transform ${
        isCollapsed && !isMobile ? "w-16" : "w-56" // Reduced from w-20 and w-64
      } ${isMobile ? "h-screen" : ""}`}
    >
      {/* Header with improved animations */}
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ${
          isMobile
            ? "py-4 px-4 border-b border-gray-200"
            : `mb-8 py-4 ${isCollapsed ? "px-4" : "px-4"}`
        } ${isCollapsed && !isMobile ? "justify-start" : "justify-between"}`}
      >
        {/* The G-Connect title is now only displayed when the sidebar is not collapsed */}
        {!isCollapsed && (
          <div className="text-xl font-extrabold text-gray-900 tracking-wide transition-all duration-300 transform hover:scale-105">
            G-Connect
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-300 hover:scale-110 transform`}
        >
          {isMobile ? (
            <X className="w-4 h-4 transition-transform duration-300" />
          ) : (
            <Menu
              className={`w-4 h-4 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
      </div>

      {/* Navigation - Expanded */}
      {(!isCollapsed || isMobile) && (
        <nav className="flex-1 space-y-2 px-4 transition-all duration-300">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = router.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center p-3 rounded-lg font-medium transition-all duration-300 group transform hover:translate-x-1
                  ${
                    isActive
                      ? "bg-indigo-100 text-indigo-600 shadow-md scale-105"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900 hover:scale-102"
                  }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <Icon className="w-5 h-5 mr-3 transition-all duration-300 group-hover:scale-110 flex-shrink-0" />
                <span className="text-base transition-all duration-300">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Collapsed Navigation for Desktop */}
      {isCollapsed && !isMobile && (
        <nav className="flex-1 space-y-2 px-2 transition-all duration-300">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = router.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-center p-3 rounded-lg font-medium transition-all duration-300 group relative transform hover:scale-110
                  ${
                    isActive
                      ? "bg-indigo-100 text-indigo-600 shadow-md"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                title={item.name}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <Icon className="w-5 h-5 transition-all duration-300 group-hover:scale-125" />

                {/* Tooltip with improved animations */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 transform scale-90 group-hover:scale-100 pointer-events-none">
                  {item.name}
                  {/* Arrow */}
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-800"></div>
                </div>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Logout button - Expanded */}
      {(!isCollapsed || isMobile) && (
        <div className="mt-auto p-4 border-t border-gray-200">
          <button
            onClick={() => {
              router.push("/auth/login");
            }}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md"
          >
            <svg
              className="w-4 h-4 mr-2 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}

      {/* Collapsed Logout for Desktop */}
      {isCollapsed && !isMobile && (
        <div className="mt-auto p-2 border-t border-gray-200">
          <button
            onClick={() => {
              router.push("/auth/login");
            }}
            className="w-full flex items-center justify-center p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-md"
            title="Logout"
          >
            <svg
              className="w-4 h-4 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
