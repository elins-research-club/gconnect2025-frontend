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
//   const getChartData = (label, data, color) => ({
//     labels:
//       history.timestamps.length > 0
//         ? history.timestamps
//         : Array.from(
//             { length: data.length },
//             (_, i) => `T-${data.length - 1 - i}`
//           ),
//     datasets: [
//       {
//         label,
//         data,
//         fill: true,
//         backgroundColor: (context) => {
//           const { ctx, chartArea } = context.chart;
//           if (!chartArea) return;
//           const gradient = ctx.createLinearGradient(
//             0,
//             chartArea.bottom,
//             0,
//             chartArea.top
//           );
//           gradient.addColorStop(
//             0,
//             color.replace("rgb", "rgba").replace(")", ", 0.0)")
//           );
//           gradient.addColorStop(
//             1,
//             color.replace("rgb", "rgba").replace(")", ", 0.5)")
//           );
//           return gradient;
//         },
//         borderColor: color,
//         tension: 0.4,
//         pointRadius: 4,
//         pointBackgroundColor: color,
//         pointBorderColor: "#fff",
//         pointHoverRadius: 6,
//       },
//     ],
//   });

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: { legend: { position: "top" } },
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
//     return (
//       <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl border border-gray-300 flex flex-col hover:scale-[1.01] transition-all duration-400">
//         <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
//           <TrendingUp className="w-5 h-5 mr-2" style={{ color }} />
//           {title}
//         </h3>
//         <div className="flex-1 min-h-[200px]">
//           <Line data={getChartData(title, data, color)} options={options} />
//         </div>
//       </div>
//     );
//   }
// }

import { Line } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
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

export default function Charts({ history }) {
  // Fungsi untuk membatasi data maksimal 1 jam (60 data points)
  const limitDataToOneHour = (data, maxDataPoints = 60) => {
    if (data.length <= maxDataPoints) {
      return data;
    }
    return data.slice(-maxDataPoints); // Ambil data terakhir sesuai limit
  };

  // Fungsi untuk membatasi timestamps sesuai dengan data yang dibatasi
  const getLimitedTimestamps = (timestamps, dataLength, maxDataPoints = 60) => {
    if (timestamps.length > 0) {
      if (timestamps.length <= maxDataPoints) {
        return timestamps;
      }
      return timestamps.slice(-maxDataPoints);
    }
    // Jika tidak ada timestamps, buat label default
    return Array.from(
      { length: Math.min(dataLength, maxDataPoints) },
      (_, i) => `T-${Math.min(dataLength, maxDataPoints) - 1 - i}`
    );
  };

  const getChartData = (label, data, color) => {
    const limitedData = limitDataToOneHour(data);
    const limitedTimestamps = getLimitedTimestamps(
      history.timestamps,
      data.length
    );

    return {
      labels: limitedTimestamps,
      datasets: [
        {
          label,
          data: limitedData,
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
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          title: function (context) {
            // Menampilkan info bahwa data dibatasi 1 jam
            return `${context[0].label} (Last 1 hour)`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (Last 60 minutes)",
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <ChartCard
        title="Air Temperature"
        color="rgb(184, 230, 254)"
        data={history.temperature}
        options={chartOptions}
      />
      <ChartCard
        title="Air Humidity"
        color="rgb(130, 102, 241)"
        data={history.humidity}
        options={chartOptions}
      />
      <ChartCard
        title="Soil Moisture"
        color="rgb(34, 197, 94)"
        data={history.soilHumidity}
        options={chartOptions}
      />
      <ChartCard
        title="Wind Speed"
        color="rgb(168, 85, 247)"
        data={history.windSpeed}
        options={chartOptions}
      />
    </div>
  );

  function ChartCard({ title, color, data, options }) {
    const limitedData = limitDataToOneHour(data);
    const dataCount = limitedData.length;

    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl border border-gray-300 flex flex-col hover:scale-[1.01] transition-all duration-400">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" style={{ color }} />
          {title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Showing last {dataCount} data points (1 hour max)
        </p>
        <div className="flex-1 min-h-[200px]">
          <Line data={getChartData(title, data, color)} options={options} />
        </div>
      </div>
    );
  }
}
