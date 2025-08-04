// src/components/common/Sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  Home,
  Settings,
  History,
  Lightbulb,
  Thermometer,
  Sliders,
  Users,
  Mail,
  Sun,
  Moon,
} from "lucide-react"; // Pastikan semua ikon ini diimpor

const Sidebar = () => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
    setIsDarkMode(!isDarkMode);
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "Pengaturan Akun",
      href: "/dashboard/settings/account",
      icon: Settings,
    }, // Path baru
    { name: "Histori Data", href: "/dashboard/history", icon: History }, // Path baru
    { name: "Kontrol Lampu", href: "/dashboard/lights", icon: Lightbulb }, // Path baru
    {
      name: "Status Sensor",
      href: "/dashboard/sensor-status",
      icon: Thermometer,
    }, // Path baru
    {
      name: "Pengaturan Threshold",
      href: "/dashboard/thresholds",
      icon: Sliders,
    }, // Path baru
    { name: "Manajemen User", href: "/dashboard/users", icon: Users }, // Path baru
    { name: "Kontak CS", href: "/dashboard/contact", icon: Mail }, // Path baru
  ];

  return (
    <div className="w-64 bg-background-card text-text p-6 flex flex-col min-h-screen shadow-2xl border-r border-background-border">
      <div className="text-3xl font-extrabold mb-10 text-primary text-center tracking-wide">
        G-Connect
      </div>
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              // Menggunakan `startsWith` untuk aktifkan link parent seperti /dashboard/settings/*
              className={`flex items-center p-3 rounded-lg text-lg font-medium transition-colors duration-200 group
                ${
                  router.pathname.startsWith(item.href) &&
                  item.href !== "/dashboard" // Ini untuk sub-menu
                    ? "bg-primary-dark text-text-light shadow-md"
                    : router.pathname === item.href &&
                      item.href === "/dashboard" // Ini khusus dashboard
                    ? "bg-primary-dark text-text-light shadow-md"
                    : "text-text-dark hover:bg-background-hover hover:text-text-light"
                }`}
            >
              <Icon className="mr-3 w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-background-border">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center p-3 rounded-md bg-background-hover hover:bg-background-border text-text-light font-medium transition-colors duration-200 mb-2"
        >
          {isDarkMode ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() => {
            router.push("/auth/login");
          }}
          className="w-full flex items-center justify-center p-3 rounded-md bg-error hover:bg-red-700 text-text-light font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
