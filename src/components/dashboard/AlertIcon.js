import { useEffect, useState } from "react";
import {
  Thermometer,
  Droplets,
  Sprout,
  Wind,
  AlertTriangle,
} from "lucide-react";

export default function AlertIcon({ alert, position, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(alert.id), 300);
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
      <div
        className={`absolute -top-1 -right-1 w-4 h-4 ${styles.bg} border-2 border-white rounded-full ${styles.pulse}`}
      >
        <div className="w-full h-full bg-white rounded-full opacity-80"></div>
      </div>
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          {alert.message || `${alert.sensorType} alert`}
        </div>
      )}
    </div>
  );
}
