// src/pages/dashboard/index.js
import Layout from "../../components/common/Layout";
import SensorCard from "../../components/dashboard/SensorCard";
import { useState, useEffect } from "react"; // Pastikan useEffect diimpor
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
import { Line } from "react-chartjs-2";
import { Search, ListFilter, ArrowDownUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const initialSensorData = {
  temperature: 25.5,
  humidity: 60.2,
  soilHumidity: 45.1,
  windSpeed: 10.3,
  rainDetection: "Tidak Hujan",
  temperatureHistory: Array.from({ length: 15 }, () => Math.random() * 10 + 20),
  humidityHistory: Array.from({ length: 15 }, () => Math.random() * 20 + 50),
};

export default function DashboardPage() {
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [sortOrder, setSortOrder] = useState("desc");
  // TAMBAHKAN STATE BARU INI
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");

  // Simulate real-time data updates
  useEffect(() => {
    // Set initial time on client-side mount
    setLastUpdatedTime(new Date().toLocaleTimeString());

    const interval = setInterval(() => {
      setSensorData((prevData) => ({
        temperature: (Math.random() * 5 + 23).toFixed(1),
        humidity: (Math.random() * 10 + 55).toFixed(1),
        soilHumidity: (Math.random() * 15 + 30).toFixed(1),
        windSpeed: (Math.random() * 5 + 8).toFixed(1),
        rainDetection:
          Math.random() > 0.85 ? "Hujan Terdeteksi" : "Tidak Hujan",
        temperatureHistory: [
          ...prevData.temperatureHistory.slice(1),
          parseFloat((Math.random() * 5 + 23).toFixed(1)),
        ],
        humidityHistory: [
          ...prevData.humidityHistory.slice(1),
          parseFloat((Math.random() * 10 + 55).toFixed(1)),
        ],
      }));
      // PERBARUI WAKTU SETIAP KALI DATA SENSOR DIUPDATE
      setLastUpdatedTime(new Date().toLocaleTimeString());
    }, 3000);

    return () => clearInterval(interval);
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount dan cleanup saat unmount

  // ... (getChartData dan chartOptions tetap sama) ...
  const getChartData = (label, data, color) => ({
    labels: Array.from(
      { length: data.length },
      (_, i) => `T-${data.length - 1 - i}`
    ),
    datasets: [
      {
        label: label,
        data: data,
        fill: true,
        backgroundColor: color.replace("rgb", "rgba").replace(")", ", 0.1)"),
        borderColor: color,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgb(160, 160, 160)",
          font: {
            family: "Poppins",
          },
        },
      },
      tooltip: {
        titleColor: "rgb(248, 248, 248)",
        bodyColor: "rgb(234, 234, 234)",
        backgroundColor: "rgb(26, 26, 26)",
        borderColor: "rgb(0, 191, 255)",
        borderWidth: 1,
        boxPadding: 4,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "rgb(160, 160, 160)",
        },
        grid: {
          color: "rgba(58, 58, 58, 0.2)",
        },
      },
      y: {
        ticks: {
          color: "rgb(160, 160, 160)",
        },
        grid: {
          color: "rgba(58, 58, 58, 0.2)",
        },
      },
    },
  };

  // ... (historicalData dan filteredData tetap sama) ...
  const historicalData = Array.from({ length: 20 }, (_, i) => ({
    time: `2025-08-04 ${String(18 - i).padStart(2, "0")}:00`,
    temperature: (Math.random() * 5 + 23).toFixed(1),
    humidity: (Math.random() * 10 + 55).toFixed(1),
    soilHumidity: (Math.random() * 15 + 30).toFixed(1),
    windSpeed: (Math.random() * 5 + 8).toFixed(1),
    rainDetection: Math.random() > 0.8 ? "Ya" : "Tidak",
  }));

  const filteredData = historicalData
    .filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "time") {
        valA = new Date(valA);
        valB = new Date(valB);
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      } else {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }

      if (sortOrder === "asc") {
        if (valA < valB) return -1;
        if (valA > valB) return 1;
      } else {
        if (valA < valB) return 1;
        if (valA > valB) return -1;
      }
      return 0;
    });

  return (
    <Layout title="Dashboard Utama">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-text-light border-b-2 border-primary pb-4 animate-fadeInUp">
        Environment Overview <span className="text-primary-dark">24/7</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
        <SensorCard
          title="Suhu Udara"
          value={sensorData.temperature}
          unit="°C"
          statusColor={
            parseFloat(sensorData.temperature) > 28 ||
            parseFloat(sensorData.temperature) < 20
              ? "text-error"
              : "text-success"
          }
        />
        <SensorCard
          title="Kelembapan Udara"
          value={sensorData.humidity}
          unit="%"
          statusColor={
            parseFloat(sensorData.humidity) < 50 ||
            parseFloat(sensorData.humidity) > 70
              ? "text-warning"
              : "text-success"
          }
        />
        <SensorCard
          title="Kelembapan Tanah"
          value={sensorData.soilHumidity}
          unit="%"
          statusColor={
            parseFloat(sensorData.soilHumidity) < 40 ||
            parseFloat(sensorData.soilHumidity) > 60
              ? "text-secondary"
              : "text-success"
          }
        />
        <SensorCard
          title="Kecepatan Angin"
          value={sensorData.windSpeed}
          unit="km/h"
          statusColor={
            parseFloat(sensorData.windSpeed) > 15
              ? "text-primary"
              : "text-success"
          }
        />
        <SensorCard
          title="Deteksi Hujan"
          value={sensorData.rainDetection}
          unit=""
          statusColor={
            sensorData.rainDetection === "Hujan Terdeteksi"
              ? "text-primary"
              : "text-success"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-background-card p-6 rounded-lg shadow-xl border border-background-border animate-fadeInUp">
          <h3 className="text-xl font-semibold mb-4 text-text-light">
            Grafik Suhu Udara
          </h3>
          <div className="h-64 sm:h-80 lg:h-96">
            <Line
              data={getChartData(
                "Suhu Udara",
                sensorData.temperatureHistory,
                "rgb(0, 191, 255)"
              )}
              options={chartOptions}
            />
          </div>
        </div>

        <div className="lg:col-span-1 bg-background-card p-6 rounded-lg shadow-xl border border-background-border flex flex-col justify-between animate-fadeInUp">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-text-light">
              Ringkasan Cepat
            </h3>
            <ul className="space-y-3 text-text">
              <li className="flex items-center">
                <span className="text-primary mr-2">📈</span> Performa Sistem:{" "}
                <span className="font-bold text-success">Optimal</span>
              </li>
              <li className="flex items-center">
                <span className="text-secondary mr-2">⚡</span> Konsumsi Daya:{" "}
                <span className="font-bold text-warning">Sedang</span>
              </li>
              <li className="flex items-center">
                <span className="text-error mr-2">⚠️</span> Peringatan Aktif:{" "}
                <span className="font-bold">0</span>
              </li>
              {/* UBAH BARIS INI */}
              <li className="flex items-center">
                <span className="text-text-dark mr-2">🗓️</span> Terakhir Update:{" "}
                <span className="font-bold">
                  {lastUpdatedTime || "Loading..."}
                </span>
              </li>
            </ul>
          </div>
          <button className="mt-6 w-full bg-primary hover:bg-primary-dark text-text-light font-bold py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
            Lihat Laporan Lengkap
          </button>
        </div>

        <div className="lg:col-span-3 bg-background-card p-6 rounded-lg shadow-xl border border-background-border animate-fadeInUp">
          <h3 className="text-xl font-semibold mb-4 text-text-light">
            Grafik Kelembapan Udara
          </h3>
          <div className="h-64 sm:h-80 lg:h-96">
            <Line
              data={getChartData(
                "Kelembapan Udara",
                sensorData.humidityHistory,
                "rgb(147, 51, 234)"
              )}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      <div className="p-6 bg-background-card rounded-lg shadow-xl border border-background-border animate-fadeInUp">
        <h3 className="text-xl font-semibold mb-4 text-text-light">
          Data Historis
        </h3>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari data historis..."
              className="w-full p-2 pl-10 rounded-md border border-background-border bg-background-hover text-text focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
          </div>
          <div className="relative">
            <select
              className="appearance-none w-full p-2 pl-8 pr-10 rounded-md border border-background-border bg-background-hover text-text focus:outline-none focus:ring-1 focus:ring-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="time">Waktu</option>
              <option value="temperature">Suhu</option>
              <option value="humidity">Kelembapan Udara</option>
            </select>
            <ListFilter className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text-dark w-4 h-4" />
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center p-2 rounded-md bg-primary hover:bg-primary-dark text-text-light transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowDownUp className="mr-2 w-4 h-4" /> Urutkan{" "}
            {sortOrder === "asc" ? "⬇️" : "⬆️"}
          </button>
        </div>

        <div className="overflow-x-auto horizontal-scroll-container rounded-lg border border-background-border">
          <table className="min-w-full divide-y divide-background-border">
            <thead className="bg-background-hover">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Suhu (°C)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Kelembapan (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Kelembapan Tanah (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Kecepatan Angin (km/h)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dark uppercase tracking-wider">
                  Hujan
                </th>
              </tr>
            </thead>
            <tbody className="bg-background-card divide-y divide-background-border">
              {filteredData.map((item, i) => (
                <tr
                  key={i}
                  className="hover:bg-background-hover transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-light">
                    {item.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {item.temperature}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {item.humidity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {item.soilHumidity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    {item.windSpeed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.rainDetection === "Ya"
                          ? "bg-primary-dark text-primary-lighter"
                          : "bg-success text-text-light"
                      }`}
                    >
                      {item.rainDetection}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
