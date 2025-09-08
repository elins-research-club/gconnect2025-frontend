// src/components/common/Layout.js - Background awan vector
import { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const CloudBackground = () => {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: "#d1ffff" }}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Cloud pattern untuk variasi bentuk */}
          <g id="cloud1">
            <ellipse
              cx="70"
              cy="40"
              rx="70"
              ry="40"
              fill="white"
              opacity="0.8"
            />
            <ellipse
              cx="42"
              cy="40"
              rx="49"
              ry="35"
              fill="white"
              opacity="0.8"
            />
            <ellipse
              cx="98"
              cy="40"
              rx="56"
              ry="39"
              fill="white"
              opacity="0.8"
            />
            <ellipse
              cx="63"
              cy="21"
              rx="35"
              ry="25"
              fill="white"
              opacity="0.8"
            />
            <ellipse
              cx="91"
              cy="17"
              rx="39"
              ry="28"
              fill="white"
              opacity="0.8"
            />
          </g>

          <g id="cloud2">
            <ellipse
              cx="56"
              cy="35"
              rx="56"
              ry="35"
              fill="white"
              opacity="0.7"
            />
            <ellipse
              cx="35"
              cy="35"
              rx="39"
              ry="28"
              fill="white"
              opacity="0.7"
            />
            <ellipse
              cx="77"
              cy="35"
              rx="45"
              ry="31"
              fill="white"
              opacity="0.7"
            />
            <ellipse
              cx="56"
              cy="17"
              rx="31"
              ry="21"
              fill="white"
              opacity="0.7"
            />
          </g>

          <g id="cloud3">
            <ellipse
              cx="49"
              cy="28"
              rx="49"
              ry="28"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="28"
              cy="28"
              rx="35"
              ry="21"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="70"
              cy="28"
              rx="42"
              ry="25"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="49"
              cy="11"
              rx="25"
              ry="17"
              fill="white"
              opacity="0.9"
            />
          </g>

          <g id="cloud4">
            <ellipse
              cx="63"
              cy="39"
              rx="63"
              ry="39"
              fill="white"
              opacity="0.6"
            />
            <ellipse
              cx="39"
              cy="39"
              rx="45"
              ry="31"
              fill="white"
              opacity="0.6"
            />
            <ellipse
              cx="87"
              cy="39"
              rx="49"
              ry="35"
              fill="white"
              opacity="0.6"
            />
            <ellipse
              cx="63"
              cy="20"
              rx="34"
              ry="22"
              fill="white"
              opacity="0.6"
            />
            <ellipse
              cx="84"
              cy="14"
              rx="28"
              ry="20"
              fill="white"
              opacity="0.6"
            />
          </g>

          <g id="smallCloud">
            <ellipse
              cx="35"
              cy="21"
              rx="35"
              ry="21"
              fill="white"
              opacity="0.5"
            />
            <ellipse
              cx="21"
              cy="21"
              rx="25"
              ry="17"
              fill="white"
              opacity="0.5"
            />
            <ellipse
              cx="49"
              cy="21"
              rx="28"
              ry="18"
              fill="white"
              opacity="0.5"
            />
            <ellipse
              cx="35"
              cy="8"
              rx="17"
              ry="11"
              fill="white"
              opacity="0.5"
            />
          </g>
        </defs>

        {/* Baris pertama awan */}
        <use href="#cloud1" x="50" y="50" transform="scale(1.2)" />
        <use href="#cloud2" x="250" y="30" transform="scale(0.8)" />
        <use href="#cloud3" x="450" y="70" transform="scale(1.5)" />
        <use href="#cloud4" x="650" y="40" transform="scale(1.0)" />
        <use href="#cloud1" x="850" y="80" transform="scale(1.3)" />
        <use href="#smallCloud" x="1050" y="60" transform="scale(1.1)" />
        <use href="#cloud2" x="1250" y="35" transform="scale(0.9)" />

        {/* Baris kedua awan */}
        <use href="#cloud3" x="100" y="180" transform="scale(1.1)" />
        <use href="#smallCloud" x="300" y="160" transform="scale(0.7)" />
        <use href="#cloud4" x="500" y="200" transform="scale(1.4)" />
        <use href="#cloud1" x="700" y="170" transform="scale(0.9)" />
        <use href="#cloud2" x="900" y="190" transform="scale(1.2)" />
        <use href="#cloud3" x="1100" y="150" transform="scale(1.0)" />
        <use href="#smallCloud" x="1300" y="180" transform="scale(0.8)" />

        {/* Baris ketiga awan */}
        <use href="#cloud4" x="0" y="300" transform="scale(1.0)" />
        <use href="#cloud2" x="200" y="280" transform="scale(1.3)" />
        <use href="#smallCloud" x="400" y="320" transform="scale(0.9)" />
        <use href="#cloud1" x="600" y="290" transform="scale(1.1)" />
        <use href="#cloud3" x="800" y="310" transform="scale(1.4)" />
        <use href="#cloud4" x="1000" y="270" transform="scale(0.8)" />
        <use href="#cloud2" x="1200" y="300" transform="scale(1.2)" />

        {/* Baris keempat awan */}
        <use href="#cloud1" x="150" y="420" transform="scale(1.3)" />
        <use href="#smallCloud" x="350" y="400" transform="scale(0.6)" />
        <use href="#cloud3" x="550" y="440" transform="scale(1.0)" />
        <use href="#cloud4" x="750" y="410" transform="scale(1.2)" />
        <use href="#cloud2" x="950" y="430" transform="scale(0.9)" />
        <use href="#cloud1" x="1150" y="400" transform="scale(1.1)" />

        {/* Baris kelima awan */}
        <use href="#cloud2" x="50" y="550" transform="scale(1.4)" />
        <use href="#cloud4" x="300" y="530" transform="scale(1.0)" />
        <use href="#smallCloud" x="500" y="570" transform="scale(0.8)" />
        <use href="#cloud3" x="700" y="540" transform="scale(1.2)" />
        <use href="#cloud1" x="900" y="560" transform="scale(0.9)" />
        <use href="#cloud2" x="1100" y="530" transform="scale(1.3)" />

        {/* Baris keenam awan */}
        <use href="#smallCloud" x="100" y="680" transform="scale(0.7)" />
        <use href="#cloud1" x="350" y="660" transform="scale(1.1)" />
        <use href="#cloud4" x="550" y="690" transform="scale(1.5)" />
        <use href="#cloud3" x="800" y="670" transform="scale(0.8)" />
        <use href="#cloud2" x="1000" y="680" transform="scale(1.0)" />
        <use href="#smallCloud" x="1250" y="650" transform="scale(0.9)" />

        {/* Awan tambahan untuk mengisi celah */}
        <use href="#smallCloud" x="1350" y="120" transform="scale(0.6)" />
        <use href="#smallCloud" x="-20" y="220" transform="scale(0.8)" />
        <use href="#smallCloud" x="1320" y="380" transform="scale(0.7)" />
        <use href="#smallCloud" x="-30" y="480" transform="scale(0.9)" />
        <use href="#smallCloud" x="1340" y="520" transform="scale(0.8)" />
        <use href="#smallCloud" x="25" y="720" transform="scale(1.0)" />
        <use href="#smallCloud" x="1300" y="750" transform="scale(0.7)" />
      </svg>
    </div>
  );
};

const Layout = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Atur isCollapsed hanya jika di desktop
      if (!mobile) {
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex min-h-screen relative bg-gray-50 dark:bg-background-DEFAULT">
      {/* Background Awan */}
      <CloudBackground />

      {/* Head untuk title halaman */}
      <Head>
        <title>{title}</title>
      </Head>

      {/* Overlay untuk mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 overlay-transparan bg-black/5 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-in-out"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar - Fix: Gunakan fixed dan top-0 untuk sidebar mobile */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 ease-in-out ${
          isMobile ? (isCollapsed ? "-translate-x-full" : "translate-x-0") : ""
        }`}
      >
        <Sidebar
          isCollapsed={isCollapsed && !isMobile}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
      </div>

      {/* Main Content dengan z-index di atas background */}
      {/* Fix: Tambahkan `ml-0` untuk mobile dan perbaiki margin desktop */}
      <div
        className={`relative z-10 flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed && !isMobile ? "md:ml-16" : "md:ml-56"
        }`}
      >
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white shadow-sm border-b border-gray-200 p-4 transform transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-200 hover:scale-105 transform"
              >
                <svg
                  className="w-5 h-5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Konten Halaman */}
        <main
          className={`flex-1 p-3 md:p-5 transition-all duration-300 ease-in-out`}
        >
          <div className="animate-fadeIn">{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
