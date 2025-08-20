// src/context/SensorContext.js
import { createContext, useContext, useState, useEffect } from "react";

const SensorContext = createContext();

export const useSensorData = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error("useSensorData must be used within a SensorProvider");
  }
  return context;
};

export const SensorProvider = ({ children }) => {
  const [thresholds, setThresholds] = useState({
    temperature: { min: 20, max: 30 },
    humidity: { min: 50, max: 70 },
    soilHumidity: { min: 40, max: 60 },
    windSpeed: { max: 20 },
  });

  const [sensorHistory, setSensorHistory] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Function untuk menambah data ke history
  const addToHistory = (data) => {
    const historyEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    };

    setSensorHistory((prev) => {
      const newHistory = [historyEntry, ...prev].slice(0, 1000); // Keep last 1000 entries
      return newHistory;
    });

    // Check untuk alerts
    checkThresholds(data);
  };

  // Function untuk cek threshold violations
  const checkThresholds = (data) => {
    const newAlerts = [];
    const timestamp = new Date();

    // Check temperature
    if (data.temperature) {
      const temp = parseFloat(data.temperature);
      if (temp < thresholds.temperature.min) {
        newAlerts.push({
          id: `temp-low-${timestamp.getTime()}`,
          type: "temperature",
          severity: "warning",
          message: `Suhu terlalu rendah: ${temp}°C (Min: ${thresholds.temperature.min}°C)`,
          timestamp: timestamp.toISOString(),
          value: temp,
          threshold: thresholds.temperature.min,
          isActive: true,
        });
      } else if (temp > thresholds.temperature.max) {
        newAlerts.push({
          id: `temp-high-${timestamp.getTime()}`,
          type: "temperature",
          severity: "danger",
          message: `Suhu terlalu tinggi: ${temp}°C (Max: ${thresholds.temperature.max}°C)`,
          timestamp: timestamp.toISOString(),
          value: temp,
          threshold: thresholds.temperature.max,
          isActive: true,
        });
      }
    }

    // Check humidity
    if (data.humidity) {
      const humidity = parseFloat(data.humidity);
      if (humidity < thresholds.humidity.min) {
        newAlerts.push({
          id: `humidity-low-${timestamp.getTime()}`,
          type: "humidity",
          severity: "warning",
          message: `Kelembapan udara terlalu rendah: ${humidity}% (Min: ${thresholds.humidity.min}%)`,
          timestamp: timestamp.toISOString(),
          value: humidity,
          threshold: thresholds.humidity.min,
          isActive: true,
        });
      } else if (humidity > thresholds.humidity.max) {
        newAlerts.push({
          id: `humidity-high-${timestamp.getTime()}`,
          type: "humidity",
          severity: "warning",
          message: `Kelembapan udara terlalu tinggi: ${humidity}% (Max: ${thresholds.humidity.max}%)`,
          timestamp: timestamp.toISOString(),
          value: humidity,
          threshold: thresholds.humidity.max,
          isActive: true,
        });
      }
    }

    // Check soil humidity
    if (data.soilHumidity) {
      const soilHumidity = parseFloat(data.soilHumidity);
      if (soilHumidity < thresholds.soilHumidity.min) {
        newAlerts.push({
          id: `soil-low-${timestamp.getTime()}`,
          type: "soilHumidity",
          severity: "danger",
          message: `Kelembapan tanah terlalu rendah: ${soilHumidity}% (Min: ${thresholds.soilHumidity.min}%)`,
          timestamp: timestamp.toISOString(),
          value: soilHumidity,
          threshold: thresholds.soilHumidity.min,
          isActive: true,
        });
      } else if (soilHumidity > thresholds.soilHumidity.max) {
        newAlerts.push({
          id: `soil-high-${timestamp.getTime()}`,
          type: "soilHumidity",
          severity: "warning",
          message: `Kelembapan tanah terlalu tinggi: ${soilHumidity}% (Max: ${thresholds.soilHumidity.max}%)`,
          timestamp: timestamp.toISOString(),
          value: soilHumidity,
          threshold: thresholds.soilHumidity.max,
          isActive: true,
        });
      }
    }

    // Check wind speed
    if (data.windSpeed) {
      const windSpeed = parseFloat(data.windSpeed);
      if (windSpeed > thresholds.windSpeed.max) {
        newAlerts.push({
          id: `wind-high-${timestamp.getTime()}`,
          type: "windSpeed",
          severity: "danger",
          message: `Kecepatan angin terlalu tinggi: ${windSpeed} km/h (Max: ${thresholds.windSpeed.max} km/h)`,
          timestamp: timestamp.toISOString(),
          value: windSpeed,
          threshold: thresholds.windSpeed.max,
          isActive: true,
        });
      }
    }

    // Update alerts - keep only recent alerts (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    setAlerts((prev) => {
      const recentAlerts = prev.filter(
        (alert) => new Date(alert.timestamp) > oneDayAgo
      );
      return [...newAlerts, ...recentAlerts].slice(0, 50); // Keep max 50 alerts
    });
  };

  // Function untuk update thresholds
  const updateThresholds = (newThresholds) => {
    setThresholds(newThresholds);

    // Re-check current data against new thresholds
    if (currentData) {
      checkThresholds(currentData);
    }
  };

  // Function untuk dismiss alert
  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  // Function untuk clear all alerts
  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Get active alerts untuk sensor tertentu
  const getAlertsForSensor = (sensorType) => {
    return alerts.filter(
      (alert) => alert.type === sensorType && alert.isActive
    );
  };

  const value = {
    thresholds,
    updateThresholds,
    sensorHistory,
    currentData,
    setCurrentData,
    addToHistory,
    alerts,
    dismissAlert,
    clearAllAlerts,
    getAlertsForSensor,
    checkThresholds,
  };

  return (
    <SensorContext.Provider value={value}>{children}</SensorContext.Provider>
  );
};
