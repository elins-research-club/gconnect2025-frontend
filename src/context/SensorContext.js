// src/context/SensorContext.js - Fixed Version
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
  // Default thresholds
  const defaultThresholds = {
    temperature: { min: 20, max: 30 },
    humidity: { min: 50, max: 70 },
    soilHumidity: { min: 40, max: 60 },
    windSpeed: { max: 20 },
  };

  // Load thresholds from localStorage or use defaults
  const [thresholds, setThresholds] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedThresholds = localStorage.getItem("sensorThresholds");
        if (savedThresholds) {
          const parsed = JSON.parse(savedThresholds);
          // Validate parsed data structure
          if (parsed && typeof parsed === "object") {
            return { ...defaultThresholds, ...parsed };
          }
        }
      } catch (error) {
        console.warn("Error loading thresholds from localStorage:", error);
      }
    }
    return defaultThresholds;
  });

  const [sensorHistory, setSensorHistory] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [alerts, setAlerts] = useState(() => {
    // Load alerts from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedAlerts = localStorage.getItem("sensorAlerts");
        if (savedAlerts) {
          const parsed = JSON.parse(savedAlerts);
          // Filter out old alerts (older than 24 hours)
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return Array.isArray(parsed)
            ? parsed.filter((alert) => new Date(alert.timestamp) > oneDayAgo)
            : [];
        }
      } catch (error) {
        console.warn("Error loading alerts from localStorage:", error);
      }
    }
    return [];
  });

  // Save thresholds to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("sensorThresholds", JSON.stringify(thresholds));
      } catch (error) {
        console.warn("Error saving thresholds to localStorage:", error);
      }
    }
  }, [thresholds]);

  // Save alerts to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("sensorAlerts", JSON.stringify(alerts));
      } catch (error) {
        console.warn("Error saving alerts to localStorage:", error);
      }
    }
  }, [alerts]);

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

  // Function untuk cek threshold violations - FIXED VERSION
  const checkThresholds = (data) => {
    const newAlerts = [];
    const timestamp = new Date();
    const currentTime = timestamp.getTime();

    // Helper function to validate threshold values
    const isValidThreshold = (value) => {
      return (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !isNaN(parseFloat(value))
      );
    };

    // Check temperature
    if (data.temperature && isValidThreshold(data.temperature)) {
      const temp = parseFloat(data.temperature);

      if (
        isValidThreshold(thresholds.temperature.min) &&
        temp < parseFloat(thresholds.temperature.min)
      ) {
        newAlerts.push({
          id: `temp-low-${currentTime}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "temperature",
          severity: "warning",
          message: `Suhu terlalu rendah: ${temp}°C (Min: ${thresholds.temperature.min}°C)`,
          timestamp: timestamp.toISOString(),
          value: temp,
          threshold: thresholds.temperature.min,
          thresholdType: "min",
          isActive: true,
        });
      }

      if (
        isValidThreshold(thresholds.temperature.max) &&
        temp > parseFloat(thresholds.temperature.max)
      ) {
        newAlerts.push({
          id: `temp-high-${currentTime}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "temperature",
          severity: "danger",
          message: `Suhu terlalu tinggi: ${temp}°C (Max: ${thresholds.temperature.max}°C)`,
          timestamp: timestamp.toISOString(),
          value: temp,
          threshold: thresholds.temperature.max,
          thresholdType: "max",
          isActive: true,
        });
      }
    }

    // Check humidity
    if (data.humidity && isValidThreshold(data.humidity)) {
      const humidity = parseFloat(data.humidity);

      if (
        isValidThreshold(thresholds.humidity.min) &&
        humidity < parseFloat(thresholds.humidity.min)
      ) {
        newAlerts.push({
          id: `humidity-low-${currentTime}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "humidity",
          severity: "warning",
          message: `Kelembapan udara terlalu rendah: ${humidity}% (Min: ${thresholds.humidity.min}%)`,
          timestamp: timestamp.toISOString(),
          value: humidity,
          threshold: thresholds.humidity.min,
          thresholdType: "min",
          isActive: true,
        });
      }

      if (
        isValidThreshold(thresholds.humidity.max) &&
        humidity > parseFloat(thresholds.humidity.max)
      ) {
        newAlerts.push({
          id: `humidity-high-${currentTime}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "humidity",
          severity: "warning",
          message: `Kelembapan udara terlalu tinggi: ${humidity}% (Max: ${thresholds.humidity.max}%)`,
          timestamp: timestamp.toISOString(),
          value: humidity,
          threshold: thresholds.humidity.max,
          thresholdType: "max",
          isActive: true,
        });
      }
    }

    // Check soil humidity
    if (data.soilHumidity && isValidThreshold(data.soilHumidity)) {
      const soilHumidity = parseFloat(data.soilHumidity);

      if (
        isValidThreshold(thresholds.soilHumidity.min) &&
        soilHumidity < parseFloat(thresholds.soilHumidity.min)
      ) {
        newAlerts.push({
          id: `soil-low-${currentTime}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "soilHumidity",
          severity: "danger",
          message: `Kelembapan tanah terlalu rendah: ${soilHumidity}% (Min: ${thresholds.soilHumidity.min}%)`,
          timestamp: timestamp.toISOString(),
          value: soilHumidity,
          threshold: thresholds.soilHumidity.min,
          thresholdType: "min",
          isActive: true,
        });
      }

      if (
        isValidThreshold(thresholds.soilHumidity.max) &&
        soilHumidity > parseFloat(thresholds.soilHumidity.max)
      ) {
        newAlerts.push({
          id: `soil-high-${currentTime}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "soilHumidity",
          severity: "warning",
          message: `Kelembapan tanah terlalu tinggi: ${soilHumidity}% (Max: ${thresholds.soilHumidity.max}%)`,
          timestamp: timestamp.toISOString(),
          value: soilHumidity,
          threshold: thresholds.soilHumidity.max,
          thresholdType: "max",
          isActive: true,
        });
      }
    }

    // Check wind speed
    if (data.windSpeed && isValidThreshold(data.windSpeed)) {
      const windSpeed = parseFloat(data.windSpeed);

      if (
        isValidThreshold(thresholds.windSpeed.max) &&
        windSpeed > parseFloat(thresholds.windSpeed.max)
      ) {
        newAlerts.push({
          id: `wind-high-${currentTime}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          type: "windSpeed",
          severity: "danger",
          message: `Kecepatan angin terlalu tinggi: ${windSpeed} km/h (Max: ${thresholds.windSpeed.max} km/h)`,
          timestamp: timestamp.toISOString(),
          value: windSpeed,
          threshold: thresholds.windSpeed.max,
          thresholdType: "max",
          isActive: true,
        });
      }
    }

    // Update alerts - FIXED: Don't replace, but add to existing alerts
    if (newAlerts.length > 0) {
      setAlerts((prevAlerts) => {
        // Remove duplicate alerts for the same sensor type and threshold type
        const filteredPrevAlerts = prevAlerts.filter((prevAlert) => {
          return !newAlerts.some(
            (newAlert) =>
              prevAlert.type === newAlert.type &&
              prevAlert.thresholdType === newAlert.thresholdType &&
              Math.abs(
                new Date(newAlert.timestamp).getTime() -
                  new Date(prevAlert.timestamp).getTime()
              ) < 60000 // Same minute
          );
        });

        // Keep only recent alerts (last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentAlerts = filteredPrevAlerts.filter(
          (alert) => new Date(alert.timestamp) > oneDayAgo
        );

        // Combine and limit to max 100 alerts
        return [...newAlerts, ...recentAlerts].slice(0, 100);
      });
    }
  };

  // Function untuk update thresholds - ENHANCED VERSION
  const updateThresholds = (newThresholds) => {
    // Validate and clean threshold values
    const cleanedThresholds = {};

    Object.keys(newThresholds).forEach((sensorKey) => {
      cleanedThresholds[sensorKey] = {};
      const sensorThresholds = newThresholds[sensorKey];

      // Only set values that are not empty/null/undefined
      Object.keys(sensorThresholds).forEach((thresholdKey) => {
        const value = sensorThresholds[thresholdKey];
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !isNaN(parseFloat(value))
        ) {
          cleanedThresholds[sensorKey][thresholdKey] = parseFloat(value);
        }
      });
    });

    setThresholds(cleanedThresholds);

    // Re-check current data against new thresholds
    if (currentData) {
      // Clear existing alerts for changed thresholds
      setAlerts((prev) => prev.filter((alert) => !alert.isActive));
      // Check with new thresholds
      setTimeout(() => checkThresholds(currentData), 100);
    }
  };

  // Function untuk dismiss alert
  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  // Function untuk clear all alerts
  const clearAllAlerts = () => {
    setAlerts([]);
    // Also clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("sensorAlerts");
    }
  };

  // Get active alerts untuk sensor tertentu
  const getAlertsForSensor = (sensorType) => {
    return alerts.filter(
      (alert) => alert.type === sensorType && alert.isActive
    );
  };

  // Function to reset thresholds to defaults
  const resetThresholds = () => {
    setThresholds(defaultThresholds);
  };

  // Clean up old alerts on component mount
  useEffect(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    setAlerts((prev) =>
      prev.filter((alert) => new Date(alert.timestamp) > oneDayAgo)
    );
  }, []);

  const value = {
    thresholds,
    updateThresholds,
    resetThresholds,
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
