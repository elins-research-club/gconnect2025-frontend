// src/pages/dashboard/index.js - Revised Alert System with Pop-ups
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
  Settings,
  TrendingUp,
  Activity,
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
 * Mobile-style Alert Icon Notification
 */
const AlertIcon = ({ alert, position, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Animate in
    const timer1 = setTimeout(() => setIsVisible(true), 100);

    // Auto dismiss after 4 seconds
    const timer2 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(alert.id), 300); // Wait for exit animation
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [alert.id, onDismiss]);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "danger":
        return {
          bg: "bg-red-500",
          border: "border-red-600",
          shadow: "shadow-red-200",
          pulse: "animate-pulse",
        };
      case "warning":
        return {
          bg: "bg-yellow-500",
          border: "border-yellow-600",
          shadow: "shadow-yellow-200",
          pulse: "animate-bounce",
        };
      default:
        return {
          bg: "bg-blue-500",
          border: "border-blue-600",
          shadow: "shadow-blue-200",
          pulse: "",
        };
    }
  };

  const getSensorIcon = (sensorType) => {
    switch (sensorType) {
      case "temperature":
        return <Thermometer className="w-4 h-4 text-white" />;
      case "humidity":
        return <Droplets className="w-4 h-4 text-white" />;
      case "soilHumidity":
        return <Sprout className="w-4 h-4 text-white" />;
      case "windSpeed":
        return <Wind className="w-4 h-4 text-white" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-white" />;
    }
  };

  const styles = getSeverityStyles(alert.severity);

  return (
    <div
      className={`fixed w-12 h-12 rounded-full ${styles.bg} ${
        styles.border
      } border-2 ${
        styles.shadow
      } shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 z-50 ${
        isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
      } ${styles.pulse}`}
      style={{
        right: `${position?.right || 20}px`,
        top: `${position?.top || 20}px`,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => {
        setIsVisible(false);
        setTimeout(() => onDismiss(alert.id), 300);
      }}
    >
      {getSensorIcon(alert.sensorType)}

      {/* Alert indicator dot */}
      <div
        className={`absolute -top-1 -right-1 w-4 h-4 ${styles.bg} border-2 border-white rounded-full ${styles.pulse}`}
      >
        <div className="w-full h-full bg-white rounded-full opacity-80"></div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          {alert.message || `${alert.sensorType} alert`}
        </div>
      )}
    </div>
  );
};

/**
 * Mobile-style Alert Notification Manager
 */
const MobileAlertManager = () => {
  const { alerts, dismissAlert } = useSensorData();
  const [activeIcons, setActiveIcons] = useState([]);

  useEffect(() => {
    const activeAlerts = alerts.filter((alert) => alert.isActive);

    // Group alerts by sensor type to avoid duplicates for same sensor
    const alertsBySensor = activeAlerts.reduce((acc, alert) => {
      if (
        !acc[alert.sensorType] ||
        (acc[alert.sensorType].severity === "warning" &&
          alert.severity === "danger")
      ) {
        acc[alert.sensorType] = alert;
      }
      return acc;
    }, {});

    const uniqueAlerts = Object.values(alertsBySensor);

    // Add new alert icons
    uniqueAlerts.forEach((alert) => {
      if (!activeIcons.some((icon) => icon.sensorType === alert.sensorType)) {
        setActiveIcons((prev) => [...prev, alert]);
      }
    });

    // Remove icons for alerts that are no longer active
    setActiveIcons((prev) =>
      prev.filter((icon) =>
        uniqueAlerts.some((alert) => alert.sensorType === icon.sensorType)
      )
    );
  }, [alerts]);

  const handleDismiss = (alertId) => {
    setActiveIcons((prev) => prev.filter((icon) => icon.id !== alertId));
    dismissAlert(alertId);
  };

  const getIconPosition = (index) => {
    const spacing = 60; // Space between icons
    return {
      right: 20, // Fixed: changed from -450 to 20
      top: 20 + index * spacing, // Start from top with spacing
    };
  };

  return (
    <>
      {activeIcons.map((alert, index) => (
        <AlertIcon
          key={`${alert.sensorType}-${alert.id}`}
          alert={alert}
          position={getIconPosition(index)}
          onDismiss={handleDismiss}
        />
      ))}
    </>
  );
};

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
    const interval = setInterval(fetchWeatherData, 60000);
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
 * Enhanced Sensor Card dengan alert icons dan pesan lengkap
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

    if (
      threshold.min !== undefined &&
      threshold.min !== null &&
      threshold.min !== "" &&
      numValue < threshold.min
    ) {
      return { status: "below", limit: threshold.min };
    }
    if (
      threshold.max !== undefined &&
      threshold.max !== null &&
      threshold.max !== "" &&
      numValue > threshold.max
    ) {
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
            ? "border-red-300 shadow-red-100"
            : "border-yellow-300 shadow-yellow-100"
          : "border-gray-200"
      }`}
    >
      {/* Icon alert pada sensor - hanya icon, tanpa badge count */}
      {hasAlert && (
        <div className="absolute top-2 right-2">
          <AlertTriangle
            className={`w-6 h-6 ${
              alertSeverity === "danger"
                ? "text-red-500 animate-pulse"
                : "text-yellow-500 animate-bounce"
            }`}
          />
        </div>
      )}

      <div className="absolute top-2 left-2 flex items-center space-x-1">
        {isConnected ? (
          <Wifi className="w-3 h-3 text-green-500" />
        ) : (
          <WifiOff className="w-3 h-3 text-red-500" />
        )}
        {weather && (
          <span className="text-xs text-gray-400 bg-gray-100 px-1 rounded">
            {weather === "simulated" ? "SIM" : "API"}
          </span>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between mb-2 mt-4">
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

      {/* Threshold status bar */}
      {thresholdInfo && (
        <div className="mt-3">
          <div
            className={`h-2 rounded-full overflow-hidden ${
              thresholdInfo.status === "normal"
                ? "bg-green-100"
                : thresholdInfo.status === "below"
                ? "bg-blue-100"
                : "bg-red-100"
            }`}
          >
            <div
              className={`h-full transition-all duration-500 ${
                thresholdInfo.status === "normal"
                  ? "bg-green-500 w-full"
                  : thresholdInfo.status === "below"
                  ? "bg-blue-500 w-1/4"
                  : "bg-red-500 w-full"
              }`}
            ></div>
          </div>
          <p
            className={`text-xs mt-1 ${
              thresholdInfo.status === "normal"
                ? "text-green-600"
                : thresholdInfo.status === "below"
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {thresholdInfo.status === "normal"
              ? "Normal"
              : thresholdInfo.status === "below"
              ? `< ${thresholdInfo.limit}${unit}`
              : `> ${thresholdInfo.limit}${unit}`}
          </p>
        </div>
      )}

      {/* Alert messages pada card - tampil penuh tanpa terpotong */}
      {hasAlert && sensorAlerts.length > 0 && (
        <div className="mt-3 space-y-2">
          {sensorAlerts.map((alert, index) => (
            <div
              key={alert.id}
              className={`text-xs p-3 rounded-lg border ${
                alert.severity === "danger"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium mb-1">
                    Alert {index + 1} - {alert.severity.toUpperCase()}
                  </div>
                  {/* Pesan alert terlihat penuh tanpa terpotong */}
                  <div className="text-xs leading-relaxed break-words whitespace-pre-wrap">
                    {alert.message}
                  </div>
                  <div className="text-xs opacity-75 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {weather && weather !== "simulated" && (
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
  const dangerAlerts = activeAlerts.filter(
    (alert) => alert.severity === "danger"
  );
  const warningAlerts = activeAlerts.filter(
    (alert) => alert.severity === "warning"
  );

  return (
    <Layout title="PkM Lab Dashboard">
      {/* Mobile-style Alert Icons */}
      <MobileAlertManager />

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
            <div className="flex flex-col items-end">
              <span className={`text-sm font-medium ${connectionStatus.color}`}>
                {connectionStatus.text}
              </span>
              {lastUpdatedTime && (
                <span className="text-xs text-gray-400">{lastUpdatedTime}</span>
              )}
            </div>
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
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
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
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
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
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
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
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
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

        {/* Enhanced Quick Summary */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 font-calistoga">
            Quick Summary & System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Gauge className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                <span className="text-sm">Connection</span>
              </div>
              <span
                className={`font-semibold text-sm ${
                  isConnected ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {isConnected ? "Online" : "Demo"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                <span className="text-sm">Data Source</span>
              </div>
              <span className="font-semibold text-blue-600 text-sm">
                Weather API
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <BellRing className="w-4 h-4 md:w-5 md:h-5 mr-2 text-rose-600" />
                <span className="text-sm">Active Alerts</span>
              </div>
              <span
                className={`font-semibold text-sm ${
                  activeAlerts.length > 0 ? "text-rose-600" : "text-green-600"
                }`}
              >
                {activeAlerts.length}
                {activeAlerts.length > 0 && (
                  <span className="ml-1 text-xs">
                    ({dangerAlerts.length}D/{warningAlerts.length}W)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-600" />
                <span className="text-sm">Last Update</span>
              </div>
              <span className="font-semibold text-gray-800 text-xs">
                {lastUpdatedTime || "Loading..."}
              </span>
            </div>
          </div>

          {/* Alert Breakdown */}
          {activeAlerts.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg mb-4 border border-red-200">
              <h4 className="font-semibold text-red-800 text-sm mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Alert Breakdown by Sensor:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {["temperature", "humidity", "soilHumidity", "windSpeed"].map(
                  (sensorType) => {
                    const sensorAlerts = activeAlerts.filter(
                      (alert) => alert.type === sensorType
                    );
                    const sensorName = {
                      temperature: "Temperature",
                      humidity: "Humidity",
                      soilHumidity: "Soil Moisture",
                      windSpeed: "Wind Speed",
                    }[sensorType];

                    return (
                      <div
                        key={sensorType}
                        className={`p-2 rounded ${
                          sensorAlerts.length > 0
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <div className="font-medium">{sensorName}</div>
                        <div>
                          {sensorAlerts.length} alert
                          {sensorAlerts.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* System Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              💡 <strong>System Info:</strong> Using OpenWeatherMap API for
              real-time weather data. Soil moisture is simulated based on
              humidity. Alert system monitors thresholds in real-time with
              pop-up notifications.
              {activeAlerts.length > 0 && (
                <span className="block mt-1 text-blue-600">
                  🔧 Manage alert thresholds in Settings to customize monitoring
                  parameters.
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/dashboard/history" className="flex-1">
              <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold py-2 md:py-3 rounded-md transition-colors duration-200 font-inter">
                View Full Report
              </button>
            </Link>

            <Link href="/dashboard/thresholds" className="flex-1">
              <button
                className={`w-full text-sm font-bold py-2 md:py-3 rounded-md transition-colors duration-200 font-inter ${
                  activeAlerts.length > 0
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "bg-gray-500 hover:bg-gray-600 text-white"
                }`}
              >
                <Settings className="inline w-4 h-4 mr-2" />
                {activeAlerts.length > 0 ? "Manage Alerts" : "Settings"}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* CSS untuk animasi */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </Layout>
  );
}
