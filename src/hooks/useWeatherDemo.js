import { useState, useEffect, useCallback, useRef } from "react";
import { useSensorData } from "../context/SensorContext";

export default function useWeatherDemo() {
  const { addToHistory, setCurrentData } = useSensorData();
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [history, setHistory] = useState({
    temperature: [],
    humidity: [],
    soilHumidity: [],
    windSpeed: [],
    timestamps: [],
  });

  // WebSocket reference
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // API Configuration
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1/data";
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000/ws";

  // 📹 Load history dari localStorage ketika hook pertama kali jalan
  useEffect(() => {
    const saved = localStorage.getItem("weatherHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved history:", e);
      }
    }
  }, []);

  // 📹 Simpan history ke localStorage setiap kali ada perubahan
  useEffect(() => {
    if (history.timestamps.length > 0) {
      localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
  }, [history]);

  // API fetch functions
  const fetchLatest = async () => {
    const res = await fetch(`${API_BASE}/latest`);
    if (!res.ok) throw new Error(`Failed to fetch latest: ${res.status}`);
    return await res.json();
  };

  const fetchHistory = async () => {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
    return await res.json();
  };

  // Process sensor data dari backend
  const processSensorData = (rawData) => {
    return {
      temperature: rawData.temperature,
      humidity: rawData.humidity,
      soilHumidity: rawData.soil_moisture,
      windSpeed: rawData.wind_speed,
      rainDetection: rawData.rain_detection,
      lightIntensity: rawData.light_intensity,
      id: rawData.id,
      timestamp: rawData.timestamp,
      location: "PKM Lab Sensor",
    };
  };

  // Update history untuk chart
  const updateHistory = useCallback((newData) => {
    setHistory((prev) => {
      const maxPoints = 20; // Bisa diperbesar untuk chart yang lebih panjang

      return {
        temperature: [
          ...prev.temperature.slice(-(maxPoints - 1)),
          parseFloat(newData.temperature),
        ],
        humidity: [
          ...prev.humidity.slice(-(maxPoints - 1)),
          parseFloat(newData.humidity),
        ],
        soilHumidity: [
          ...prev.soilHumidity.slice(-(maxPoints - 1)),
          parseFloat(newData.soilHumidity),
        ],
        windSpeed: [
          ...prev.windSpeed.slice(-(maxPoints - 1)),
          parseFloat(newData.windSpeed),
        ],
        timestamps: [
          ...prev.timestamps.slice(-(maxPoints - 1)),
          new Date(newData.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        ],
      };
    });
  }, []);

  // WebSocket setup and handlers
  const setupWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      console.log("🔌 Connecting to WebSocket:", WS_URL);
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
        setWsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
          console.log("📡 Received WebSocket data:", rawData);

          const sensorData = processSensorData(rawData);

          // Update state
          setData(sensorData);
          setCurrentData(sensorData);
          addToHistory(sensorData);
          updateHistory(sensorData);
        } catch (err) {
          console.error("❌ Failed to process WebSocket message:", err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("🔌 WebSocket disconnected:", event.code, event.reason);
        setWsConnected(false);

        // Auto-reconnect logic
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000
          );
          console.log(
            `🔄 Reconnecting in ${delay}ms... (attempt ${
              reconnectAttemptsRef.current + 1
            })`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            setupWebSocket();
          }, delay);
        } else {
          console.log("❌ Max reconnection attempts reached");
          setError("WebSocket connection lost. Please refresh the page.");
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setError("WebSocket connection error");
      };
    } catch (err) {
      console.error("❌ Failed to setup WebSocket:", err);
      setError("Failed to setup WebSocket connection");
    }
  }, [WS_URL, setCurrentData, addToHistory, updateHistory]);

  // Initial data fetch
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📊 Fetching initial data...");

      // 📹 Ambil data terbaru
      const latest = await fetchLatest();
      const sensorData = processSensorData(latest);

      setData(sensorData);
      setCurrentData(sensorData);
      addToHistory(sensorData);
      setIsConnected(true);

      // 📹 Ambil data riwayat untuk chart
      const historyData = await fetchHistory();

      setHistory({
        temperature: historyData.map((d) => d.temperature),
        humidity: historyData.map((d) => d.humidity),
        soilHumidity: historyData.map((d) => d.soil_moisture),
        windSpeed: historyData.map((d) => d.wind_speed),
        timestamps: historyData.map((d) =>
          new Date(d.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
      });

      console.log("✅ Initial data loaded successfully");
      return sensorData;
    } catch (err) {
      console.error("❌ Backend API Error:", err);
      setError(`Failed to load initial data: ${err.message}`);
      setIsConnected(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, [addToHistory, setCurrentData]);

  // Manual refresh function
  const refetch = useCallback(async () => {
    await fetchInitialData();
  }, [fetchInitialData]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Main effect: Load initial data then setup WebSocket
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;

      // 1. Fetch initial data first
      await fetchInitialData();

      if (!mounted) return;

      // 2. Setup WebSocket for realtime updates
      setupWebSocket();
    };

    initialize();

    // Cleanup on unmount
    return () => {
      mounted = false;
      cleanup();
    };
  }, []); // Empty dependency array - only run once

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    data,
    history,
    isConnected,
    wsConnected,
    error,
    loading,
    refetch,
  };
}
