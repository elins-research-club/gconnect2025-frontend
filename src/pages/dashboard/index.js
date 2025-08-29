// import Layout from "../../components/common/Layout";
// import { useState, useEffect } from "react";
// import {
//   RefreshCw,
//   Thermometer,
//   Droplets,
//   Sprout,
//   Wind,
//   CloudRain,
// } from "lucide-react";
// import { useSensorData } from "../../context/SensorContext";

// import MobileAlertManager from "../../components/dashboard/MobileAlertManager";
// import SensorCard from "../../components/dashboard/SensorCard";
// import Charts from "../../components/dashboard/Charts";
// import QuickSummary from "../../components/dashboard/QuickSummary";
// import useWeatherDemo from "../../hooks/useWeatherDemo";

// export default function DashboardPage() {
//   const { alerts } = useSensorData();
//   const {
//     data: sensorData,
//     history,
//     isWsConnected,
//     error,
//     isLoading,
//     refetch,
//   } = useWeatherDemo();
//   const [lastUpdatedTime, setLastUpdatedTime] = useState("");

//   useEffect(() => {
//     if (sensorData) setLastUpdatedTime(new Date().toLocaleTimeString());
//   }, [sensorData]);

//   const connectionStatus = isLoading
//     ? { text: "Loading...", color: "text-yellow-600" }
//     : error
//     ? { text: "Local Mode", color: "text-gray-500" }
//     : isWsConnected
//     ? { text: "Connected", color: "text-black" }
//     : { text: "Offline", color: "text-red-600" };

//   return (
//     <Layout title="PkM Lab Dashboard">
//       <MobileAlertManager />
//       <div className="w-full">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-600">
//             PkM Lab SKJ X Lab Elins Dashboard
//             {sensorData?.location && (
//               <span className="block text-sm font-normal text-gray-500 mt-1">
//                 📍 {sensorData.location}
//               </span>
//             )}
//           </h1>
//           {/* Connection Status dan Refresh Button */}
//           <div className="flex justify-center items-center space-x-2 mb-6 lg:px-15">
//             <div className="flex flex-col items-end">
//               <span className={`text-sm font-medium ${connectionStatus.color}`}>
//                 {connectionStatus.text}
//               </span>
//               {lastUpdatedTime && (
//                 <span className="text-xs text-gray-400">{lastUpdatedTime}</span>
//               )}
//             </div>
//             <button
//               onClick={refetch}
//               disabled={isLoading}
//               className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-300"
//             >
//               <RefreshCw
//                 className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
//               />
//             </button>
//           </div>
//         </div>

//         {/* Sensor Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
//           <SensorCard
//             title="Air Temperature"
//             value={sensorData?.temperature}
//             unit="°C"
//             statusColor="text-gray-500"
//             icon={Thermometer}
//             isConnected={isWsConnected}
//             weather={sensorData?.weather}
//             sensorType="temperature"
//           />
//           <SensorCard
//             title="Air Humidity"
//             value={sensorData?.humidity}
//             unit="%"
//             statusColor="text-blue-300"
//             icon={Droplets}
//             isConnected={isWsConnected}
//             weather={sensorData?.weather}
//             sensorType="humidity"
//           />
//           <SensorCard
//             title="Soil Moisture"
//             value={sensorData?.soilHumidity}
//             unit="%"
//             statusColor="text-green-600"
//             icon={Sprout}
//             isConnected={isWsConnected}
//             weather="simulated"
//             sensorType="soilHumidity"
//           />
//           <SensorCard
//             title="Wind Speed"
//             value={sensorData?.windSpeed}
//             unit="km/h"
//             statusColor="text-blue-400"
//             icon={Wind}
//             isConnected={isWsConnected}
//             weather={sensorData?.weather}
//             sensorType="windSpeed"
//           />
//           <SensorCard
//             title="Rain Detection"
//             value={sensorData?.rainDetection ? "Rain" : "No Rain"}
//             unit=""
//             statusColor={
//               sensorData?.rainDetection ? "text-blue-600" : "text-gray-500"
//             }
//             icon={CloudRain}
//             isConnected={isWsConnected}
//             weather={sensorData?.weather}
//           />
//         </div>

//         {/* Charts */}
//         <Charts history={history} />

//         {/* Quick Summary */}
//         <QuickSummary
//           alerts={alerts}
//           lastUpdatedTime={lastUpdatedTime}
//           isConnected={isWsConnected}
//         />
//       </div>
//     </Layout>
//   );
// }

import Layout from "../../components/common/Layout";
import { useState, useEffect } from "react";
import {
  RefreshCw,
  Thermometer,
  Droplets,
  Sprout,
  Wind,
  CloudRain,
} from "lucide-react";
import { useSensorData } from "../../context/SensorContext";

import MobileAlertManager from "../../components/dashboard/MobileAlertManager";
import SensorCard from "../../components/dashboard/SensorCard";
import Charts from "../../components/dashboard/Charts";
import QuickSummary from "../../components/dashboard/QuickSummary";
import useWeatherDemo from "../../hooks/useWeatherDemo";

export default function DashboardPage() {
  const { alerts } = useSensorData();
  const {
    data: sensorData,
    history,
    isWsConnected,
    error,
    isLoading,
    refetch,
  } = useWeatherDemo();
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");

  useEffect(() => {
    if (sensorData) setLastUpdatedTime(new Date().toLocaleTimeString());
  }, [sensorData]);

  const connectionStatus = isLoading
    ? { text: "Loading...", color: "text-yellow-600" }
    : error
    ? { text: "Local Mode", color: "text-gray-500" }
    : isWsConnected
    ? { text: "Connected", color: "text-black" }
    : { text: "Offline", color: "text-red-600" };

  return (
    <Layout title="PkM Lab Dashboard">
      <MobileAlertManager />
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-600">
            PkM Lab SKJ X Lab Elins Dashboard
            {sensorData?.location && (
              <span className="block text-sm font-normal text-gray-500 mt-1">
                📍 {sensorData.location}
              </span>
            )}
          </h1>
          {/* Connection Status dan Refresh Button */}
          <div className="flex justify-center items-center space-x-2 mb-6 lg:px-15">
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
              disabled={isLoading}
              className="p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-300"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          <SensorCard
            title="Air Temperature"
            value={sensorData?.temperature}
            unit="°C"
            statusColor="text-gray-500"
            icon={Thermometer}
            isConnected={isWsConnected}
            weather={sensorData?.weather}
            sensorType="temperature"
          />
          <SensorCard
            title="Air Humidity"
            value={sensorData?.humidity}
            unit="%"
            statusColor="text-blue-300"
            icon={Droplets}
            isConnected={isWsConnected}
            weather={sensorData?.weather}
            sensorType="humidity"
          />
          <SensorCard
            title="Soil Moisture"
            value={sensorData?.soilHumidity}
            unit="%"
            statusColor="text-green-600"
            icon={Sprout}
            isConnected={isWsConnected}
            weather="simulated"
            sensorType="soilHumidity"
          />
          <SensorCard
            title="Wind Speed"
            value={sensorData?.windSpeed}
            unit="km/h"
            statusColor="text-blue-400"
            icon={Wind}
            isConnected={isWsConnected}
            weather={sensorData?.weather}
            sensorType="windSpeed"
          />
          <SensorCard
            title="Rain Detection"
            value={sensorData?.rainDetection} // ✅ Pass boolean langsung, biar formatValue yang handle
            unit=""
            statusColor={
              sensorData?.rainDetection ? "text-blue-600" : "text-gray-500"
            }
            icon={CloudRain}
            isConnected={isWsConnected}
            weather={sensorData?.weather}
          />
        </div>

        {/* Charts */}
        <Charts history={history} />

        {/* Quick Summary */}
        <QuickSummary
          alerts={alerts}
          lastUpdatedTime={lastUpdatedTime}
          isConnected={isWsConnected}
        />
      </div>
    </Layout>
  );
}
