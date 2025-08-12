// src/pages/dashboard/index.js
import Layout from "../../components/common/Layout";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Thermometer,
  Droplets,
  Sprout,
  Wind,
  CloudRain,
  Gauge,
  Zap,
  BellRing,
  Clock,
} from "lucide-react";

// Registrasi ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Custom hook untuk mengambil data secara real-time dari API menggunakan WebSocket.
 */
function _useRealtime(setData) {
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || "";
    const WS = process.env.NEXT_PUBLIC_WS_URL || "";

    // Initial fetch
    fetch(`${API}/latest`)
      .then((r) => r.json())
      .then((d) => setData && setData(d))
      .catch(() => {});

    // WebSocket
    try {
      const wsUrl =
        (WS ||
          (typeof window !== "undefined"
            ? window.location.origin.replace(/^http/, "ws")
            : "")) + "/realtime";

      const ws = new WebSocket(wsUrl);

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          setData && setData(data);
        } catch (e) {}
      };

      ws.onopen = () => console.log("WebSocket connection opened.");
      ws.onclose = () => console.log("WebSocket connection closed.");
      ws.onerror = (error) => console.error("WebSocket error:", error);

      return () => ws.close();
    } catch (e) {
      console.error("WebSocket connection failed:", e);
    }
  }, [setData]);
}

/**
 * Komponen kartu sensor tunggal.
 */
const SensorCard = ({ title, value, unit, statusColor, icon }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl relative overflow-hidden group">
      <div className="relative z-10 flex items-center justify-between mb-2">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 font-inter">
          {title}
        </h3>
        <Icon
          className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 transform group-hover:scale-125 ${statusColor}`}
        />
      </div>
      <p className="relative z-10 text-xl md:text-3xl font-extrabold text-gray-900 font-calistoga">
        {value}
        <span className="text-sm md:text-base font-normal text-gray-500 ml-1 font-inter">
          {unit}
        </span>
      </p>
    </div>
  );
};

// Data awal untuk simulasi
const initialSensorData = {
  temperature: 25.5,
  humidity: 60.2,
  soilHumidity: 45.1,
  windSpeed: 10.3,
  rainDetection: "No Rain",
  temperatureHistory: Array.from({ length: 15 }, () => Math.random() * 10 + 20),
  humidityHistory: Array.from({ length: 15 }, () => Math.random() * 20 + 50),
};

export default function DashboardPage() {
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");

  // _useRealtime(setSensorData); // Untuk koneksi real API

  // Simulasi update data setiap 3 detik
  useEffect(() => {
    setLastUpdatedTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setSensorData((prevData) => ({
        ...prevData,
        temperature: (Math.random() * 5 + 23).toFixed(1),
        humidity: (Math.random() * 10 + 55).toFixed(1),
        soilHumidity: (Math.random() * 15 + 30).toFixed(1),
        windSpeed: (Math.random() * 5 + 8).toFixed(1),
        rainDetection: Math.random() > 0.85 ? "Rain Detected" : "No Rain",
        temperatureHistory: [
          ...prevData.temperatureHistory.slice(1),
          parseFloat((Math.random() * 5 + 23).toFixed(1)),
        ],
        humidityHistory: [
          ...prevData.humidityHistory.slice(1),
          parseFloat((Math.random() * 10 + 55).toFixed(1)),
        ],
      }));
      setLastUpdatedTime(new Date().toLocaleTimeString());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Buat data untuk ChartJS dengan gradasi warna.
   */
  const getChartData = (label, data, color) => ({
    labels: Array.from(
      { length: data.length },
      (_, i) => `T-${data.length - 1 - i}`
    ),
    datasets: [
      {
        label,
        data,
        fill: true,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(
            0,
            color.replace("rgb", "rgba").replace(")", ", 0.0)")
          );
          gradient.addColorStop(
            1,
            color.replace("rgb", "rgba").replace(")", ", 0.5)")
          );
          return gradient;
        },
        borderColor: color,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgb(55, 65, 81)",
          font: { family: "Calistoga", size: 12 },
        },
      },
      tooltip: {
        titleColor: "rgb(24, 30, 48)",
        bodyColor: "rgb(55, 65, 81)",
        backgroundColor: "rgb(255, 255, 255)",
        borderColor: "rgb(229, 231, 235)",
        borderWidth: 1,
        boxPadding: 4,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgb(107, 114, 128)",
          font: { family: "Inter", size: 10 },
        },
        grid: { color: "rgba(229, 231, 235, 0.5)" },
      },
      y: {
        ticks: {
          color: "rgb(107, 114, 128)",
          font: { family: "Inter", size: 10 },
        },
        grid: { color: "rgba(229, 231, 235, 0.5)" },
      },
    },
  };

  return (
    <Layout title="G-Connect Dashboard">
      <div className="w-full">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 md:mb-8 font-calistoga animate-fade-in">
          G-Connect Dashboard
        </h1>

        {/* Sensor Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6 mb-8">
          <SensorCard
            title="Air Temperature"
            value={sensorData.temperature}
            unit="°C"
            statusColor={
              parseFloat(sensorData.temperature) > 28 ||
              parseFloat(sensorData.temperature) < 20
                ? "text-red-600"
                : "text-green-600"
            }
            icon={Thermometer}
          />
          <SensorCard
            title="Air Humidity"
            value={sensorData.humidity}
            unit="%"
            statusColor={
              parseFloat(sensorData.humidity) < 50 ||
              parseFloat(sensorData.humidity) > 70
                ? "text-yellow-600"
                : "text-green-600"
            }
            icon={Droplets}
          />
          <SensorCard
            title="Soil Moisture"
            value={sensorData.soilHumidity}
            unit="%"
            statusColor={
              parseFloat(sensorData.soilHumidity) < 20 ||
              parseFloat(sensorData.soilHumidity) > 60
                ? "text-blue-600"
                : "text-green-600"
            }
            icon={Sprout}
          />
          <SensorCard
            title="Wind Speed"
            value={sensorData.windSpeed}
            unit="km/h"
            statusColor={
              parseFloat(sensorData.windSpeed) > 15
                ? "text-blue-600"
                : "text-green-600"
            }
            icon={Wind}
          />
          <SensorCard
            title="Rain Detection"
            value={
              sensorData.rainDetection === "Rain Detected" ? "Rain" : "No Rain"
            }
            unit=""
            statusColor={
              sensorData.rainDetection === "Rain Detected"
                ? "text-blue-600"
                : "text-green-600"
            }
            icon={CloudRain}
          />
        </div>

        {/* Charts & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Temperature Chart */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
              Air Temperature
            </h3>
            <div className="flex-1 min-h-[200px] md:min-h-[250px]">
              <Line
                data={getChartData(
                  "Air Temperature",
                  sensorData.temperatureHistory,
                  "rgb(59, 130, 246)"
                )}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Humidity Chart */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
              Air Humidity
            </h3>
            <div className="flex-1 min-h-[200px] md:min-h-[250px]">
              <Line
                data={getChartData(
                  "Air Humidity",
                  sensorData.humidityHistory,
                  "rgb(99, 102, 241)"
                )}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Quick Summary */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
              Quick Summary
            </h3>
            <ul className="space-y-4 text-gray-600 text-sm font-inter flex-1">
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Gauge className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                  <span>Status</span>
                </div>
                <span className="font-semibold text-green-600">Optimal</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 text-yellow-600" />
                  <span>Performance</span>
                </div>
                <span className="font-semibold text-yellow-600">Moderate</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <BellRing className="w-4 h-4 md:w-5 md:h-5 mr-2 text-rose-600 animate-pulse" />
                  <span>Alerts</span>
                </div>
                <span className="font-semibold text-rose-600">0</span>
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-800" />
                  <span>Updated</span>
                </div>
                <span className="font-semibold text-gray-800 text-xs">
                  {lastUpdatedTime || "Loading..."}
                </span>
              </li>
            </ul>
            <Link href="/dashboard/history">
              <button className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2 md:py-3 rounded-md transition-colors duration-200 font-inter">
                View Full Report
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
