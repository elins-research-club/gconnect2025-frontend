import { useState, useEffect, useCallback } from "react";
import { useSensorData } from "../context/SensorContext";

export default function useWeatherDemo() {
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

  // 🔹 Load history dari localStorage ketika hook pertama kali jalan
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

  // 🔹 Simpan history ke localStorage setiap kali ada perubahan
  useEffect(() => {
    if (history.timestamps.length > 0) {
      localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
  }, [history]);

  // const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.pkmlab.my.id/api/v1/data";

  // const fetchLatest = async () => {
  //   const res = await fetch(`${API_BASE}/latest`);
  //   if (!res.ok) throw new Error("Failed to fetch latest");
  //   return await res.json();
  // };

  // const fetchHistory = async () => {
  //   const res = await fetch(`${API_BASE}/history`);
  //   if (!res.ok) throw new Error("Failed to fetch history");
  //   return await res.json();
  // };

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      //       // 🔹 Ambil data terbaru
      // const latest = await fetchLatest();

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
            weatherData.main.humidity * 0.7 + (Math.random() * 2 - 1)
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

      //   // 🔹 Mapping field backend -> frontend
      //   const sensorData = {
      //   temperature: latest.temperature,
      //   humidity: latest.humidity,
      //   soilHumidity: latest.soil_moisture,
      //   windSpeed: latest.wind_speed,
      //   rainDetection: latest.rain_detection,
      //   lightIntensity: latest.light_intensity,
      //   id: latest.id,
      //   timestamp: latest.timestamp,
      //   location: "PKM Lab Sensor",
      // };

      setData(sensorData);
      setCurrentData(sensorData);
      addToHistory(sensorData);
      setIsConnected(true);

      // // 🔹 Ambil data riwayat untuk chart
      // const historyData = await fetchHistory();

      const now = new Date();
      setHistory((prev) => {
        const maxPoints = 10; // 🔹 bisa diperbesar supaya chart lebih panjang
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

      //   // Asumsikan historyData berupa array of records
      // setHistory({
      //   temperature: historyData.map((d) => d.temperature),
      //   humidity: historyData.map((d) => d.humidity),
      //   soilHumidity: historyData.map((d) => d.soil_moisture),
      //   windSpeed: historyData.map((d) => d.wind_speed),
      //   timestamps: historyData.map((d) =>
      //     new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      //   ),
      // });

      return sensorData;
    } catch (err) {
      console.error("Weather API Error:", err);
      setError(err.message);
      setIsConnected(false);
      return null;
      // catch (err) {
      //   console.error("Backend API Error:", err);
      //   setError(err.message);
      //   setIsConnected(false);
      //   return null;
    } finally {
      setLoading(false);
    }
  }, [addToHistory, setCurrentData]);

  // Jalankan pertama kali + interval
  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 60000); // setiap 1 menit
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

// ============== Pakai kode dibawah kalo mau data nya selalu ke refresh jadi tidak tersimpan di local =====================

// // src/hooks/useWeatherData.js - Custom hook for Weather API
// import { useState, useEffect, useCallback } from "react";
// import { useSensorData } from "../context/SensorContext";

// /**
//  * Custom hook untuk mengambil data dari Weather API
//  * Handles both real API calls and demo/fallback data
//  */
// export function useWeatherData() {
//   const { addToHistory, setCurrentData } = useSensorData();
//   const [data, setData] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [history, setHistory] = useState({
//     temperature: [],
//     humidity: [],
//     soilHumidity: [],
//     windSpeed: [],
//     timestamps: [],
//   });

//   // Fungsi untuk fetch data dari OpenWeatherMap API
//   const fetchWeatherData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "demo_key";
//       const CITY = "Yogyakarta,ID";

//       const response = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
//       );

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error(
//             "API Key tidak valid. Silakan daftar di openweathermap.org"
//           );
//         }
//         throw new Error(`Weather API Error: ${response.status}`);
//       }

//       const weatherData = await response.json();
//       const processedData = processWeatherData(weatherData);

//       setData(processedData);
//       setCurrentData(processedData);
//       addToHistory(processedData);
//       setIsConnected(true);

//       updateLocalHistory(processedData);
//       return processedData;
//     } catch (err) {
//       console.error("Weather API Error:", err);
//       setError(err.message);
//       setIsConnected(false);

//       // Fallback data
//       const fallbackData = generateFallbackData();
//       setData(fallbackData);
//       setCurrentData(fallbackData);
//       addToHistory(fallbackData);
//       updateLocalHistory(fallbackData);

//       return fallbackData;
//     } finally {
//       setLoading(false);
//     }
//   }, [addToHistory, setCurrentData]);

//   // Process weather API response
//   const processWeatherData = (weatherData) => {
//     return {
//       temperature: weatherData.main.temp,
//       humidity: weatherData.main.humidity,
//       soilHumidity: Math.max(
//         20,
//         Math.min(80, weatherData.main.humidity * 0.7 + (Math.random() * 2 - 1))
//       ),
//       windSpeed: weatherData.wind?.speed
//         ? (weatherData.wind.speed * 3.6).toFixed(1)
//         : 0,
//       rainDetection:
//         weatherData.weather[0].main.toLowerCase().includes("rain") ||
//         weatherData.weather[0].main.toLowerCase().includes("storm"),
//       location: weatherData.name,
//       weather: weatherData.weather[0].description,
//       timestamp: new Date().toISOString(),
//     };
//   };

//   // Generate fallback data when API fails
//   const generateFallbackData = () => {
//     return {
//       temperature: (Math.random() * 5 + 23).toFixed(1),
//       humidity: (Math.random() * 10 + 55).toFixed(1),
//       soilHumidity: (Math.random() * 15 + 30).toFixed(1),
//       windSpeed: (Math.random() * 5 + 8).toFixed(1),
//       rainDetection: Math.random() > 0.8,
//       location: "Demo Mode",
//       weather: "simulated data",
//       timestamp: new Date().toISOString(),
//     };
//   };

//   // Update local history for charts
//   const updateLocalHistory = (sensorData) => {
//     const now = new Date();
//     setHistory((prev) => {
//       const maxPoints = 15;
//       return {
//         temperature: [
//           ...prev.temperature.slice(-(maxPoints - 1)),
//           parseFloat(sensorData.temperature),
//         ],
//         humidity: [
//           ...prev.humidity.slice(-(maxPoints - 1)),
//           parseFloat(sensorData.humidity),
//         ],
//         soilHumidity: [
//           ...prev.soilHumidity.slice(-(maxPoints - 1)),
//           parseFloat(sensorData.soilHumidity),
//         ],
//         windSpeed: [
//           ...prev.windSpeed.slice(-(maxPoints - 1)),
//           parseFloat(sensorData.windSpeed),
//         ],
//         timestamps: [
//           ...prev.timestamps.slice(-(maxPoints - 1)),
//           now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//         ],
//       };
//     });
//   };

//   useEffect(() => {
//     fetchWeatherData();
//     const interval = setInterval(fetchWeatherData, 60000); // Update every minute
//     return () => clearInterval(interval);
//   }, [fetchWeatherData]);

//   return {
//     data,
//     history,
//     isConnected,
//     error,
//     loading,
//     refetch: fetchWeatherData,
//   };
// }
