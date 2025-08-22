// src/components/layout/Sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Home,
  Settings,
  History,
  Thermometer,
  Menu,
  Sliders,
  X,
  LogIn,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  MessageCircle, // Menggunakan ikon untuk halaman kontak
} from "lucide-react";

// The GConnectIcon component has been removed as requested.

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile = false }) => {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Redirect ke halaman login setelah logout
    router.push("/auth/login");
  };

  // Navigasi yang hanya akan ditampilkan jika pengguna sudah login
  // Menu "Account Settings" telah dihapus sesuai permintaan
  const authenticatedNavItems = [
    { name: "Threshold", href: "/dashboard/thresholds", icon: Sliders },
    { name: "Data History", href: "/dashboard/history", icon: History },
    {
      name: "Sensor Status",
      href: "/dashboard/sensor-status",
      icon: Thermometer,
    },
  ];

  // Navigasi yang selalu ditampilkan
  // Menambahkan link ke halaman kontak baru
  const publicNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Contact", href: "/dashboard/contact", icon: MessageCircle },
  ];

  // Menggabungkan item navigasi berdasarkan status autentikasi
  const navItems = isAuthenticated
    ? [...publicNavItems, ...authenticatedNavItems]
    : publicNavItems;

  // Close sidebar when navigating on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <div
      className={`bg-white text-gray-800 flex flex-col min-h-screen shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out transform ${
        isCollapsed && !isMobile ? "w-16" : "w-56"
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
        {/* The PkM Lab title is now only displayed when the sidebar is not collapsed */}
        {!isCollapsed && (
          <div className="text-xl font-extrabold text-gray-900 tracking-wide transition-all duration-300 transform hover:scale-105">
            PkM Lab
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

      {/* Bagian Bawah Sidebar (Login/Logout) */}
      <div
        className={`mt-auto pt-4 border-t border-gray-200 ${
          isCollapsed && !isMobile ? "p-2" : "p-4"
        }`}
      >
        {isAuthenticated ? (
          <div className="space-y-2">
            {!isCollapsed && (
              <div className="flex items-center p-3 rounded-lg bg-gray-200 text-gray-800">
                <User className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium truncate">
                  {user?.email || "User"}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                isCollapsed ? "w-12 h-12 mx-auto" : ""
              }`}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut
                className={`w-4 h-4 transition-transform duration-300 ${
                  isCollapsed ? "w-5 h-5" : "mr-2"
                }`}
              />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        ) : (
          <Link href="/auth/login" passHref legacyBehavior>
            <button
              className={`w-full flex items-center justify-center p-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                isCollapsed ? "w-12 h-12 mx-auto" : ""
              }`}
              title={isCollapsed ? "Login" : ""}
            >
              <LogIn
                className={`w-4 h-4 transition-transform duration-300 ${
                  isCollapsed ? "w-5 h-5" : "mr-2"
                }`}
              />
              {!isCollapsed && <span>Login</span>}
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
