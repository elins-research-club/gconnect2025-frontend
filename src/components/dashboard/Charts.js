// import { Line } from "react-chartjs-2";
// import { TrendingUp } from "lucide-react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function Charts({ history }) {
//   // Fungsi untuk membatasi data maksimal 1 jam (60 data points)
//   const limitDataToOneHour = (data, maxDataPoints = 60) => {
//     if (data.length <= maxDataPoints) {
//       return data;
//     }
//     return data.slice(-maxDataPoints); // Ambil data terakhir sesuai limit
//   };

//   // Fungsi untuk membatasi timestamps sesuai dengan data yang dibatasi
//   const getLimitedTimestamps = (timestamps, dataLength, maxDataPoints = 60) => {
//     if (timestamps.length > 0) {
//       if (timestamps.length <= maxDataPoints) {
//         return timestamps;
//       }
//       return timestamps.slice(-maxDataPoints);
//     }
//     // Jika tidak ada timestamps, buat label default
//     return Array.from(
//       { length: Math.min(dataLength, maxDataPoints) },
//       (_, i) => `T-${Math.min(dataLength, maxDataPoints) - 1 - i}`
//     );
//   };

//   const getChartData = (label, data, color) => {
//     const limitedData = limitDataToOneHour(data);
//     const limitedTimestamps = getLimitedTimestamps(
//       history.timestamps,
//       data.length
//     );

//     return {
//       labels: limitedTimestamps,
//       datasets: [
//         {
//           label,
//           data: limitedData,
//           fill: true,
//           backgroundColor: (context) => {
//             const { ctx, chartArea } = context.chart;
//             if (!chartArea) return;
//             const gradient = ctx.createLinearGradient(
//               0,
//               chartArea.bottom,
//               0,
//               chartArea.top
//             );
//             gradient.addColorStop(
//               0,
//               color.replace("rgb", "rgba").replace(")", ", 0.0)")
//             );
//             gradient.addColorStop(
//               1,
//               color.replace("rgb", "rgba").replace(")", ", 0.5)")
//             );
//             return gradient;
//           },
//           borderColor: color,
//           tension: 0.4,
//           pointRadius: 4,
//           pointBackgroundColor: color,
//           pointBorderColor: "#fff",
//           pointHoverRadius: 6,
//         },
//       ],
//     };
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { position: "top" },
//       tooltip: {
//         callbacks: {
//           title: function (context) {
//             // Menampilkan info bahwa data dibatasi 1 jam
//             return `${context[0].label} (Last 1 hour)`;
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Time (Last 60 minutes)",
//         },
//       },
//     },
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
//       <ChartCard
//         title="Air Temperature"
//         color="rgb(184, 230, 254)"
//         data={history.temperature}
//         options={chartOptions}
//       />
//       <ChartCard
//         title="Air Humidity"
//         color="rgb(130, 102, 241)"
//         data={history.humidity}
//         options={chartOptions}
//       />
//       <ChartCard
//         title="Soil Moisture"
//         color="rgb(34, 197, 94)"
//         data={history.soilHumidity}
//         options={chartOptions}
//       />
//       <ChartCard
//         title="Wind Speed"
//         color="rgb(168, 85, 247)"
//         data={history.windSpeed}
//         options={chartOptions}
//       />
//     </div>
//   );

//   function ChartCard({ title, color, data, options }) {
//     const limitedData = limitDataToOneHour(data);
//     const dataCount = limitedData.length;

//     return (
//       <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl border border-gray-300 flex flex-col hover:scale-[1.01] transition-all duration-400">
//         <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
//           <TrendingUp className="w-5 h-5 mr-2" style={{ color }} />
//           {title}
//         </h3>
//         <p className="text-xs text-gray-500 mb-3">
//           Showing last {dataCount} data points (1 hour max)
//         </p>
//         <div className="flex-1 min-h-[200px]">
//           <Line data={getChartData(title, data, color)} options={options} />
//         </div>
//       </div>
//     );
//   }
// }

import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { TrendingUp, Calendar, Clock } from "lucide-react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Data dummy untuk demo
const generateDummyData = () => {
  const now = new Date();
  const data = {
    temperature: [],
    humidity: [],
    soilHumidity: [],
    windSpeed: [],
    timestamps: [],
  };

  // Generate data untuk 7 hari terakhir (setiap 30 menit)
  for (let i = 7 * 24 * 2; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
    data.timestamps.push(timestamp.toISOString());

    // Generate random data dengan variasi realistis
    data.temperature.push(22 + Math.random() * 8 + Math.sin(i * 0.1) * 3);
    data.humidity.push(45 + Math.random() * 30 + Math.cos(i * 0.08) * 10);
    data.soilHumidity.push(30 + Math.random() * 40 + Math.sin(i * 0.05) * 15);
    data.windSpeed.push(5 + Math.random() * 15 + Math.cos(i * 0.12) * 5);
  }

  return data;
};

// Fungsi untuk memproses data berdasarkan range waktu
const processDataForTimeRange = (data, timestamps, timeRange) => {
  const now = new Date();

  if (timeRange === "day") {
    // Menampilkan data 24 jam terakhir, dikelompokkan per jam
    const hourlyData = new Map();
    const hours = [];

    // Inisialisasi 24 jam terakhir
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourKey = hour.getHours();
      // Format jam dengan cara yang lebih sederhana
      const hourLabel = hourKey.toString().padStart(2, "0") + ":00";

      hours.push(hourLabel);
      hourlyData.set(hourKey, { sum: 0, count: 0, values: [] });
    }

    // Agregasi data per jam
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = new Date(timestamps[i]);
      const timeDiff = now.getTime() - timestamp.getTime();

      // Hanya ambil data 24 jam terakhir
      if (timeDiff <= 24 * 60 * 60 * 1000 && timeDiff >= 0) {
        const hour = timestamp.getHours();
        if (hourlyData.has(hour)) {
          const hourData = hourlyData.get(hour);
          hourData.sum += data[i];
          hourData.count++;
          hourData.values.push(data[i]);
        }
      }
    }

    // Hitung rata-rata per jam
    const processedData = Array.from(hourlyData.values()).map((hourData) =>
      hourData.count > 0 ? hourData.sum / hourData.count : null
    );

    return { labels: hours, data: processedData };
  }

  if (timeRange === "week") {
    // Menampilkan data 7 hari terakhir, rata-rata per hari
    const dailyData = new Map();
    const days = [];
    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    // Inisialisasi 7 hari terakhir
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const dayKey = day.toDateString();
      const dayLabel = dayNames[day.getDay()];

      days.push(dayLabel);
      dailyData.set(dayKey, { sum: 0, count: 0, values: [] });
    }

    // Agregasi data per hari
    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = new Date(timestamps[i]);
      const dayKey = new Date(
        timestamp.getFullYear(),
        timestamp.getMonth(),
        timestamp.getDate()
      ).toDateString();

      if (dailyData.has(dayKey)) {
        const dayData = dailyData.get(dayKey);
        dayData.sum += data[i];
        dayData.count++;
        dayData.values.push(data[i]);
      }
    }

    // Hitung rata-rata per hari
    const processedData = Array.from(dailyData.values()).map((dayData) =>
      dayData.count > 0 ? dayData.sum / dayData.count : null
    );

    return { labels: days, data: processedData };
  }

  return { labels: [], data: [] };
};

function ChartCard({ title, color, data, options, unit = "" }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-gray-300 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" style={{ color }} />
        {title}
        {unit && <span className="text-sm text-gray-500 ml-1">({unit})</span>}
      </h3>
      <div className="h-64 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default function FlexibleCharts() {
  const [timeRange, setTimeRange] = useState("day");
  const [history] = useState(generateDummyData());

  // Memproses data berdasarkan range waktu yang dipilih
  const processedData = useMemo(() => {
    return {
      temperature: processDataForTimeRange(
        history.temperature,
        history.timestamps,
        timeRange
      ),
      humidity: processDataForTimeRange(
        history.humidity,
        history.timestamps,
        timeRange
      ),
      soilHumidity: processDataForTimeRange(
        history.soilHumidity,
        history.timestamps,
        timeRange
      ),
      windSpeed: processDataForTimeRange(
        history.windSpeed,
        history.timestamps,
        timeRange
      ),
    };
  }, [history, timeRange]);

  // Fungsi untuk membuat data chart
  const createChartData = (label, processedDataSet, color) => {
    return {
      labels: processedDataSet.labels,
      datasets: [
        {
          label,
          data: processedDataSet.data,
          fill: true,
          backgroundColor: (context) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea)
              return color.replace("rgb", "rgba").replace(")", ", 0.1)");

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
              color.replace("rgb", "rgba").replace(")", ", 0.3)")
            );
            return gradient;
          },
          borderColor: color,
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: color,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  };

  // Opsi chart yang responsif
  const chartOptions = useMemo(() => {
    const xAxisTitle =
      timeRange === "day" ? "Jam (24 Jam Terakhir)" : "Hari (7 Hari Terakhir)";

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            padding: 15,
          },
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          titleColor: "#374151",
          bodyColor: "#374151",
          borderColor: "#d1d5db",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: function (context) {
              const value = context.parsed.y;
              if (value === null)
                return `${context.dataset.label}: Tidak ada data`;
              return `${context.dataset.label}: ${value.toFixed(1)}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xAxisTitle,
            color: "#6b7280",
            font: {
              size: 12,
              weight: "bold",
            },
          },
          grid: {
            color: "rgba(156, 163, 175, 0.2)",
          },
          ticks: {
            color: "#6b7280",
            maxTicksLimit: timeRange === "day" ? 12 : 7,
          },
        },
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(156, 163, 175, 0.2)",
          },
          ticks: {
            color: "#6b7280",
          },
        },
      },
    };
  }, [timeRange]);

  return (
    <div className="w-full pb-8 bg-none">
      {/* Time Range Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setTimeRange("day")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              timeRange === "day"
                ? "bg-sky-300 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Per Hari
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              timeRange === "week"
                ? "bg-sky-300 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Per Minggu
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <ChartCard
          title="Suhu Udara"
          color="rgb(59, 130, 246)"
          data={createChartData(
            "Suhu (°C)",
            processedData.temperature,
            "rgb(59, 130, 246)"
          )}
          options={chartOptions}
          unit="°C"
        />
        <ChartCard
          title="Kelembapan Udara"
          color="rgb(74, 85, 101)"
          data={createChartData(
            "Kelembapan (%)",
            processedData.humidity,
            "rgb(74, 85, 101)"
          )}
          options={chartOptions}
          unit="%"
        />
        <ChartCard
          title="Kelembapan Tanah"
          color="rgb(34, 197, 94)"
          data={createChartData(
            "Kelembapan Tanah (%)",
            processedData.soilHumidity,
            "rgb(34, 197, 94)"
          )}
          options={chartOptions}
          unit="%"
        />
        <ChartCard
          title="Kecepatan Angin"
          color="rgb(116, 212, 255)"
          data={createChartData(
            "Kecepatan (m/s)",
            processedData.windSpeed,
            "rgb(116, 212, 255)"
          )}
          options={chartOptions}
          unit="m/s"
        />
      </div>
    </div>
  );
}
