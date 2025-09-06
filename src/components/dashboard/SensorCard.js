import { useSensorData } from "../../context/SensorContext";
import { Wifi, WifiOff, AlertTriangle, Clock } from "lucide-react";
import { formatValue } from "../../utils/formatValue";

export default function SensorCard({
  title,
  value,
  unit,
  statusColor,
  icon: Icon,
  isConnected,
  weather,
  sensorType,
}) {
  const { getAlertsForSensor, thresholds } = useSensorData();
  const sensorAlerts = sensorType ? getAlertsForSensor(sensorType) : [];
  const hasAlert = sensorAlerts.length > 0;
  const alertSeverity = hasAlert ? sensorAlerts[0].severity : null;

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

  // ✅ Format nilai dengan penanganan khusus untuk boolean
  const formatDisplayValue = (value) => {
    // Handle boolean values (rain detection)
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    // Handle undefined/null values
    if (value === undefined || value === null || value === "") {
      return "--";
    }

    // Use the existing formatValue function for numbers
    return formatValue(value, 2);
  };

  return (
    <div
      className={`bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border transition-all duration-400 transform hover:scale-[1.01] relative overflow-hidden group ${
        hasAlert
          ? alertSeverity === "danger"
            ? "border-red-300 shadow-red-100"
            : "border-yellow-300 shadow-yellow-100"
          : "border-gray-300"
      }`}
    >
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
        <h3 className="text-xs md:text-sm font-semibold text-gray-500">
          {title}
        </h3>
        <Icon
          className={`w-4 h-4 md:w-5 md:h-5 group-hover:scale-125 duration-400 ${
            hasAlert
              ? alertSeverity === "danger"
                ? "text-red-600"
                : "text-yellow-600"
              : statusColor
          }`}
        />
      </div>

      <p
        className={`relative z-10 text-xl md:text-3xl font-extrabold ${
          hasAlert
            ? alertSeverity === "danger"
              ? "text-red-700"
              : "text-yellow-700"
            : "text-gray-900"
        }`}
      >
        {/* ✅ Gunakan format function yang sudah diperbaiki */}
        {formatDisplayValue(value)}
        <span className="text-sm md:text-base font-normal text-gray-500 ml-1">
          {/* ✅ Jangan tampilkan unit untuk boolean values */}
          {typeof value !== "boolean" ? unit : ""}
        </span>
      </p>

      {thresholdInfo && (
        <div className="mt-3">
          <div
            className={`h-2 rounded-full ${
              thresholdInfo.status === "normal"
                ? "bg-green-100"
                : thresholdInfo.status === "below"
                ? "bg-gray-100"
                : "bg-red-100"
            }`}
          >
            <div
              className={`h-full ${
                thresholdInfo.status === "normal"
                  ? "bg-green-300 w-full h-px"
                  : thresholdInfo.status === "below"
                  ? "bg-gray-500 w-full h-px"
                  : "bg-red-500 w-full h-px"
              }`}
            ></div>
          </div>
          <p
            className={`text-xs mt-1 ${
              thresholdInfo.status === "normal"
                ? "text-green-600"
                : thresholdInfo.status === "below"
                ? "text-gray-600"
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
                <AlertTriangle className="w-3 h-3 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium mb-1">
                    Alert {index + 1} - {alert.severity.toUpperCase()}
                  </div>
                  <div className="text-xs break-words">{alert.message}</div>
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

      {/* {weather && weather !== "simulated" && (
        <p className="text-xs text-gray-400 mt-1 capitalize">{weather}</p>
      )} */}
    </div>
  );
}
