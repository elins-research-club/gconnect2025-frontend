// components/common/Layout.js
import { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
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
    <div className="flex min-h-screen relative overflow-hidden bg-gray-50 dark:bg-background-DEFAULT">
      {/* Background SVG Waves */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        <svg
          className="wave-animation"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="rgb(224, 231, 255)" // Warna gelombang pertama (light indigo)
            fillOpacity="0.8"
            d="M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,218.7C672,224,768,192,864,176C960,160,1056,160,1152,181.3C1248,203,1344,245,1392,266.7L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="rgb(199, 210, 254)" // Warna gelombang kedua (indigo)
            fillOpacity="0.5"
            d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,218.7C672,235,768,213,864,213.3C960,213,1056,235,1152,240C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Head untuk title halaman */}
      <Head>
        <title>{title}</title>
      </Head>

      {/* Overlay untuk mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 overlay-transparan backdrop-blur-sm z-40 md:hidden transition-all duration-300 ease-in-out"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 md:relative md:z-auto transition-all duration-300 ease-in-out ${
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
      <div
        className={`relative z-10 flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed && !isMobile ? "ml-4" : isMobile ? "ml-0" : "ml-4"
        }`}
      >
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white shadow-sm border-b border-gray-200 p-4 md:hidden transform transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-200 hover:scale-105 transform ${
                  !isCollapsed ? "rotate-180" : ""
                }`}
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
          className={`flex-1 p-3 md:p-5 transition-all duration-300 ease-in-out ${
            isMobile && !isCollapsed
              ? "transform translate-x-2 opacity-90"
              : "transform translate-x-0 opacity-100"
          }`}
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
