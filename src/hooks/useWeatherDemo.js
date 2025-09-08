import { useState, useEffect, useCallback, useRef } from "react";
import { useSensorData } from "../context/SensorContext";

export default function useWeatherDemo() {
  const { addToHistory, setCurrentData } = useSensorData();
  const [data, setData] = useState(null);
  const [history, setHistory] = useState({
    temperature: [],
    humidity: [],
    soilHumidity: [],
    windSpeed: [],
    timestamps: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // ✅ Tambah state khusus initial loading
  const [error, setError] = useState(null);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const intervalRef = useRef(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "https://api.pkmlab.my.id/api/v1";
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://api.pkmlab.my.id/ws";
  const MAX_RECONNECT_ATTEMPTS = 5;

  const contextCallbacks = useRef({ addToHistory, setCurrentData });
  useEffect(() => {
    contextCallbacks.current = { addToHistory, setCurrentData };
  }, [addToHistory, setCurrentData]);

  // format raw data
  const processSensorData = useCallback((rawData) => {
    if (!rawData || typeof rawData !== "object") return null;

    console.log("🔍 Raw data received:", rawData); // ✅ Debug log

    const processed = {
      temperature: rawData.temperature,
      humidity: rawData.humidity,
      soilHumidity: rawData.soil_moisture,
      windSpeed: rawData.wind_speed
        ? parseFloat(rawData.wind_speed) / 10
        : null, //data dari database akan dibagi 10 terlebih dahulu sebelum ditampilkan di fe
      rainDetection:
        rawData.rain_detection !== undefined
          ? rawData.rain_detection === true || rawData.rain_detection === "true"
          : false, // ✅ Default ke false jika undefined
      lightIntensity: rawData.light_intensity,
      id: rawData.id,
      timestamp: rawData.timestamp || new Date().toISOString(),
      location: "PKM Lab Sensor",
    };

    console.log("✅ Processed data:", processed); // ✅ Debug log
    return processed;
  }, []);

  // update chart history
  const updateHistoryState = useCallback((newSensorData) => {
    const formattedTimestamp = new Date(
      newSensorData.timestamp
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setHistory((prev) => {
      const maxPoints = 20;
      const trim = (arr) => arr.slice(-(maxPoints - 1));

      return {
        temperature: [...trim(prev.temperature), newSensorData.temperature],
        humidity: [...trim(prev.humidity), newSensorData.humidity],
        soilHumidity: [...trim(prev.soilHumidity), newSensorData.soilHumidity],
        windSpeed: [...trim(prev.windSpeed), newSensorData.windSpeed],
        timestamps: [...trim(prev.timestamps), formattedTimestamp],
      };
    });
  }, []);

  // fetch API awal (latest + history)
  const fetchInitialData = useCallback(async () => {
    setError(null);
    // ✅ Hanya set loading true untuk initial load atau refetch manual
    if (isInitialLoading) {
      setIsLoading(true);
    }

    try {
      const [latestRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/data/latest`, {
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${API_BASE}/data/history`, {
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (!latestRes.ok) throw new Error(`Latest failed: ${latestRes.status}`);
      if (!historyRes.ok)
        throw new Error(`History failed: ${historyRes.status}`);

      const latestData = await latestRes.json();
      const historyData = await historyRes.json();

      const latestSensorData = processSensorData(latestData);
      if (latestSensorData) {
        setData(latestSensorData);
        console.log("API latest data:", latestSensorData);
        contextCallbacks.current.setCurrentData(latestSensorData);
        contextCallbacks.current.addToHistory(latestSensorData);
      }

      if (Array.isArray(historyData)) {
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
      }
    } catch (err) {
      console.error("API error:", err);
      setError(`Failed to fetch: ${err.message}`);
    } finally {
      // ✅ Set loading false setelah initial data dimuat
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [API_BASE, processSensorData, isInitialLoading]);

  // WebSocket
  const setupWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => {
      setIsWsConnected(true);
      reconnectAttemptsRef.current = 0;
      console.log("✅ WS connected");

      // ✅ Setelah WS terhubung, pastikan loading false
      if (!isInitialLoading) {
        setIsLoading(false);
      }
    };

    wsRef.current.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        const sensorData = processSensorData(rawData);
        if (sensorData) {
          // ✅ Update data tanpa mengubah loading state
          setData(sensorData);
          console.log("WS incoming data:", sensorData);
          contextCallbacks.current.setCurrentData(sensorData);
          contextCallbacks.current.addToHistory(sensorData);
          updateHistoryState(sensorData);

          // ✅ Pastikan loading false saat data masuk
          if (isLoading) {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    wsRef.current.onclose = () => {
      setIsWsConnected(false);
      console.log("❌ WS disconnected");
      if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = 1000 * Math.pow(2, reconnectAttemptsRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          setupWebSocket();
        }, delay);
      } else {
        setError("WebSocket lost. Please reload.");
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("WS error:", err);
      setError("WebSocket error.");
    };
  }, [
    WS_URL,
    processSensorData,
    updateHistoryState,
    isLoading,
    isInitialLoading,
  ]);

  // lifecycle
  useEffect(() => {
    fetchInitialData();
    setupWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
    };
  }, [fetchInitialData, setupWebSocket]);

  // localStorage sync
  useEffect(() => {
    const saved = localStorage.getItem("weatherHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (history.timestamps.length > 0) {
      localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
  }, [history]);

  // ✅ Manual refetch function yang akan set loading true
  const manualRefetch = useCallback(async () => {
    setIsLoading(true);
    await fetchInitialData();
  }, [fetchInitialData]);

  return {
    data,
    history,
    isLoading: isInitialLoading || isLoading, // ✅ Loading true hanya saat initial atau manual refetch
    error,
    isApiConnected: !!data && !isInitialLoading,
    isWsConnected,
    refetch: manualRefetch, // ✅ Gunakan manual refetch
  };
}
