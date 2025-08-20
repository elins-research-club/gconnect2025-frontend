// src/pages/dashboard/index.js - Updated dengan Alert System
import Layout from "../../components/common/Layout";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSensorData } from "../../context/SensorContext";
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
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  X,
  AlertCircle,
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
 * Custom hook untuk mengambil data dari Weather API (demo)
 */
function useWeatherDemo() {
  const { addToHistory, setCurrentData } = useSensorData();
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState({
    temperature: [],
    humidity: [],
    soilHumidity: [],
    windSpeed: [],
    timestamps: [],
  });

  // Fungsi untuk fetch data dari OpenWeatherMap API
  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "demo_key";
      const CITY = "Yogyakarta,ID";

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "API Key tidak valid. Silakan daftar di openweathermap.org"
          );
        }
        throw new Error(`Weather API Error: ${response.status}`);
      }

      const weatherData = await response.json();

      const sensorData = {
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        soilHumidity: Math.max(
          20,
          Math.min(
            80,
            weatherData.main.humidity * 0.7 + (Math.random() * 2 - 1) // random -1% sampai +1%
          )
        ),
        windSpeed: weatherData.wind?.speed
          ? (weatherData.wind.speed * 3.6).toFixed(1)
          : 0,
        rainDetection:
          weatherData.weather[0].main.toLowerCase().includes("rain") ||
          weatherData.weather[0].main.toLowerCase().includes("storm"),
        location: weatherData.name,
        weather: weatherData.weather[0].description,
        timestamp: new Date().toISOString(),
      };

      setData(sensorData);
      setCurrentData(sensorData);
      addToHistory(sensorData);
      setIsConnected(true);

      // Update local history for charts
      const now = new Date();
      setHistory((prev) => {
        const maxPoints = 15;
        return {
          temperature: [
            ...prev.temperature.slice(-(maxPoints - 1)),
            parseFloat(sensorData.temperature),
          ],
          humidity: [
            ...prev.humidity.slice(-(maxPoints - 1)),
            parseFloat(sensorData.humidity),
          ],
          soilHumidity: [
            ...prev.soilHumidity.slice(-(maxPoints - 1)),
            parseFloat(sensorData.soilHumidity),
          ],
          windSpeed: [
            ...prev.windSpeed.slice(-(maxPoints - 1)),
            parseFloat(sensorData.windSpeed),
          ],
          timestamps: [
            ...prev.timestamps.slice(-(maxPoints - 1)),
            now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          ],
        };
      });

      return sensorData;
    } catch (err) {
      console.error("Weather API Error:", err);
      setError(err.message);
      setIsConnected(false);

      // Fallback data
      const fallbackData = {
        temperature: (Math.random() * 5 + 23).toFixed(1),
        humidity: (Math.random() * 10 + 55).toFixed(1),
        soilHumidity: (Math.random() * 15 + 30).toFixed(1),
        windSpeed: (Math.random() * 5 + 8).toFixed(1),
        rainDetection: Math.random() > 0.8,
        location: "Demo Mode",
        weather: "simulated data",
        timestamp: new Date().toISOString(),
      };

      setData(fallbackData);
      setCurrentData(fallbackData);
      addToHistory(fallbackData);

      const now = new Date();
      setHistory((prev) => {
        const maxPoints = 15;
        return {
          temperature: [
            ...prev.temperature.slice(-(maxPoints - 1)),
            parseFloat(fallbackData.temperature),
          ],
          humidity: [
            ...prev.humidity.slice(-(maxPoints - 1)),
            parseFloat(fallbackData.humidity),
          ],
          soilHumidity: [
            ...prev.soilHumidity.slice(-(maxPoints - 1)),
            parseFloat(fallbackData.soilHumidity),
          ],
          windSpeed: [
            ...prev.windSpeed.slice(-(maxPoints - 1)),
            parseFloat(fallbackData.windSpeed),
          ],
          timestamps: [
            ...prev.timestamps.slice(-(maxPoints - 1)),
            now.toLocaleTimeString(),
          ],
        };
      });

      return fallbackData;
    } finally {
      setLoading(false);
    }
  }, [addToHistory, setCurrentData]);

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    history,
    isConnected,
    error,
    loading,
    refetch: fetchWeatherData,
  };
}

/**
 * Komponen Alert Banner
 */
const AlertBanner = () => {
  const { alerts, dismissAlert } = useSensorData();
  const activeAlerts = alerts.filter((alert) => alert.isActive);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="mb-6 space-y-2">
      {activeAlerts.slice(0, 3).map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-md animate-pulse ${
            alert.severity === "danger"
              ? "bg-red-100 border-l-4 border-red-500 text-red-800"
              : "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800"
          }`}
        >
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-3" />
            <div>
              <p className="font-semibold text-sm">{alert.message}</p>
              <p className="text-xs opacity-75">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="p-1 hover:bg-white hover:bg-opacity-30 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      {activeAlerts.length > 3 && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            +{activeAlerts.length - 3} peringatan lainnya
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Komponen kartu sensor dengan alert system
 */
const SensorCard = ({
  title,
  value,
  unit,
  statusColor,
  icon,
  isConnected,
  weather,
  sensorType,
}) => {
  const { getAlertsForSensor, thresholds } = useSensorData();
  const Icon = icon;
  const sensorAlerts = getAlertsForSensor(sensorType);
  const hasAlert = sensorAlerts.length > 0;
  const alertSeverity =
    sensorAlerts.length > 0 ? sensorAlerts[0].severity : null;

  const getThresholdInfo = () => {
    if (!thresholds[sensorType] || !value) return null;

    const numValue = parseFloat(value);
    const threshold = thresholds[sensorType];

    if (threshold.min !== undefined && numValue < threshold.min) {
      return { status: "below", limit: threshold.min };
    }
    if (threshold.max !== undefined && numValue > threshold.max) {
      return { status: "above", limit: threshold.max };
    }
    return { status: "normal" };
  };

  const thresholdInfo = getThresholdInfo();

  return (
    <div
      className={`bg-white p-4 md:p-6 rounded-2xl shadow-xl border transition-all duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl relative overflow-hidden group ${
        hasAlert
          ? alertSeverity === "danger"
            ? "border-red-300 animate-pulse"
            : "border-yellow-300 animate-pulse"
          : "border-gray-200"
      }`}
    >
      {/* Alert indicator */}
      {hasAlert && (
        <div
          className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] border-l-transparent ${
            alertSeverity === "danger"
              ? "border-b-red-500"
              : "border-b-yellow-500"
          }`}
        >
          <AlertCircle
            className={`absolute -top-[18px] -right-[18px] w-3 h-3 text-white`}
          />
        </div>
      )}

      <div className="absolute top-2 right-2 flex items-center space-x-1">
        {isConnected ? (
          <Wifi className="w-3 h-3 text-green-500" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-500" />
        )}
        {weather && (
          <span className="text-xs text-gray-400 bg-gray-100 px-1 rounded">
            API
          </span>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between mb-2">
        <h3 className="text-xs md:text-sm font-semibold text-gray-500 font-inter">
          {title}
        </h3>
        <Icon
          className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 transform group-hover:scale-125 ${
            hasAlert
              ? alertSeverity === "danger"
                ? "text-red-600"
                : "text-yellow-600"
              : statusColor
          }`}
        />
      </div>

      <p
        className={`relative z-10 text-xl md:text-3xl font-extrabold font-calistoga ${
          hasAlert
            ? alertSeverity === "danger"
              ? "text-red-700"
              : "text-yellow-700"
            : "text-gray-900"
        }`}
      >
        {value || "--"}
        <span className="text-sm md:text-base font-normal text-gray-500 ml-1 font-inter">
          {unit}
        </span>
      </p>

      {/* Threshold info */}
      {thresholdInfo && thresholdInfo.status !== "normal" && (
        <div
          className={`mt-2 text-xs p-2 rounded ${
            thresholdInfo.status === "below"
              ? "bg-blue-100 text-blue-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {thresholdInfo.status === "below"
            ? `Di bawah batas minimum (${thresholdInfo.limit}${unit})`
            : `Melebihi batas maksimum (${thresholdInfo.limit}${unit})`}
        </div>
      )}

      {/* Alert details */}
      {hasAlert && (
        <div className="mt-2 text-xs space-y-1">
          {sensorAlerts.slice(0, 2).map((alert) => (
            <div
              key={alert.id}
              className={`p-2 rounded ${
                alert.severity === "danger"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-yellow-50 text-yellow-700 border border-yellow-200"
              }`}
            >
              <div className="flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                <span className="font-medium">Peringatan!</span>
              </div>
              <p className="mt-1">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      {weather && (
        <p className="text-xs text-gray-400 mt-1 capitalize">{weather}</p>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const { alerts } = useSensorData();
  const {
    data: sensorData,
    history,
    isConnected,
    error,
    loading,
    refetch,
  } = useWeatherDemo();
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");

  useEffect(() => {
    if (sensorData) {
      setLastUpdatedTime(new Date().toLocaleTimeString());
    }
  }, [sensorData]);

  const getChartData = (label, data, color) => ({
    labels:
      history.timestamps.length > 0
        ? history.timestamps
        : Array.from(
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
          maxTicksLimit: 8,
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

  const getConnectionStatus = () => {
    if (loading) return { text: "Loading...", color: "text-blue-600" };
    if (error) return { text: "Demo Mode", color: "text-yellow-600" };
    if (isConnected) return { text: "Weather API", color: "text-green-600" };
    return { text: "Offline", color: "text-red-600" };
  };

  const connectionStatus = getConnectionStatus();
  const activeAlerts = alerts.filter((alert) => alert.isActive);

  return (
    <Layout title="G-Connect Dashboard">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 font-calistoga animate-fade-in">
            PkM Lab SKJ X ELINS
            {sensorData?.location && (
              <span className="block text-sm font-normal text-gray-500 mt-1">
                📍 {sensorData.location}
              </span>
            )}
          </h1>

          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${connectionStatus.color}`}>
              {connectionStatus.text}
            </span>
            <button
              onClick={refetch}
              disabled={loading}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        <AlertBanner />

        {/* Sensor Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6 mb-8">
          <SensorCard
            title="Air Temperature"
            value={
              sensorData?.temperature
                ? parseFloat(sensorData.temperature).toFixed(1)
                : "--"
            }
            unit="°C"
            statusColor="text-blue-600"
            icon={Thermometer}
            isConnected={isConnected}
            weather={sensorData?.weather}
            sensorType="temperature"
          />
          <SensorCard
            title="Air Humidity"
            value={
              sensorData?.humidity
                ? parseFloat(sensorData.humidity).toFixed(1)
                : "--"
            }
            unit="%"
            statusColor="text-purple-600"
            icon={Droplets}
            isConnected={isConnected}
            weather={sensorData?.weather}
            sensorType="humidity"
          />
          <SensorCard
            title="Soil Moisture"
            value={
              sensorData?.soilHumidity
                ? parseFloat(sensorData.soilHumidity).toFixed(1)
                : "--"
            }
            unit="%"
            statusColor="text-green-600"
            icon={Sprout}
            isConnected={isConnected}
            weather="simulated"
            sensorType="soilHumidity"
          />
          <SensorCard
            title="Wind Speed"
            value={
              sensorData?.windSpeed
                ? parseFloat(sensorData.windSpeed).toFixed(1)
                : "--"
            }
            unit="km/h"
            statusColor="text-indigo-600"
            icon={Wind}
            isConnected={isConnected}
            weather={sensorData?.weather}
            sensorType="windSpeed"
          />
          <SensorCard
            title="Rain Detection"
            value={sensorData?.rainDetection === true ? "Rain" : "No Rain"}
            unit=""
            statusColor={
              sensorData?.rainDetection === true
                ? "text-blue-600"
                : "text-green-600"
            }
            icon={CloudRain}
            isConnected={isConnected}
            weather={sensorData?.weather}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
              Air Temperature
              <span className="text-xs font-normal text-blue-500 ml-2">
                API
              </span>
            </h3>
            <div className="flex-1 min-h-[200px] md:min-h-[250px]">
              <Line
                data={getChartData(
                  "Air Temperature",
                  history.temperature,
                  "rgb(59, 130, 246)"
                )}
                options={chartOptions}
              />
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
              Air Humidity
              <span className="text-xs font-normal text-blue-500 ml-2">
                API
              </span>
            </h3>
            <div className="flex-1 min-h-[200px] md:min-h-[250px]">
              <Line
                data={getChartData(
                  "Air Humidity",
                  history.humidity,
                  "rgb(99, 102, 241)"
                )}
                options={chartOptions}
              />
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
              Soil Moisture
              <span className="text-xs font-normal text-yellow-500 ml-2">
                SIM
              </span>
            </h3>
            <div className="flex-1 min-h-[200px] md:min-h-[250px]">
              <Line
                data={getChartData(
                  "Soil Moisture",
                  history.soilHumidity,
                  "rgb(34, 197, 94)"
                )}
                options={chartOptions}
              />
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
              Wind Speed
              <span className="text-xs font-normal text-blue-500 ml-2">
                API
              </span>
            </h3>
            <div className="flex-1 min-h-[200px] md:min-h-[250px]">
              <Line
                data={getChartData(
                  "Wind Speed",
                  history.windSpeed,
                  "rgb(168, 85, 247)"
                )}
                options={chartOptions}
              />
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
            Quick Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Gauge className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                <span>Status</span>
              </div>
              <span
                className={`font-semibold ${
                  isConnected ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {isConnected ? "Connected" : "Demo Mode"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                <span>Data Source</span>
              </div>
              <span className="font-semibold text-blue-600">Weather API</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellRing className="w-4 h-4 md:w-5 md:h-5 mr-2 text-rose-600" />
                <span>Alerts</span>
              </div>
              <span
                className={`font-semibold ${
                  activeAlerts.length > 0 ? "text-rose-600" : "text-green-600"
                }`}
              >
                {activeAlerts.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-800" />
                <span>Updated</span>
              </div>
              <span className="font-semibold text-gray-800 text-xs">
                {lastUpdatedTime || "Loading..."}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              💡 <strong>Demo Mode:</strong> Menggunakan OpenWeatherMap API
              untuk temperature, humidity, dan wind speed. Soil moisture
              disimulasi berdasarkan humidity. Sistem alert aktif berdasarkan
              threshold.
            </p>
          </div>

          <Link href="/dashboard/history">
            <button className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2 md:py-3 rounded-md transition-colors duration-200 font-inter">
              View Full Report
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
