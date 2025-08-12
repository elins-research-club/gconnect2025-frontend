// src/pages/dashboard/history.js
import Layout from "../../components/common/Layout";
import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Filter,
  Download,
  CheckCircle,
  AlertTriangle,
  Eye,
  ChevronDown,
} from "lucide-react";

export default function HistoryPage() {
  // State untuk kontrol pencarian dan filter
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' atau 'cards'
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Dummy historical data
  const historicalData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    time: `2025-08-${String(20 - Math.floor(i / 3)).padStart(2, "0")} ${String(
      23 - (i % 3) * 8
    ).padStart(2, "0")}:00`,
    temperature: (Math.random() * 5 + 23).toFixed(1),
    humidity: (Math.random() * 10 + 55).toFixed(1),
    soilHumidity: (Math.random() * 15 + 30).toFixed(1),
    windSpeed: (Math.random() * 5 + 8).toFixed(1),
    rainDetection: Math.random() > 0.8 ? "Ya" : "Tidak",
  })).sort((a, b) => new Date(b.time) - new Date(a.time));

  // Logika filter untuk data histori
  const filteredData = historicalData.filter((item) => {
    // Filter berdasarkan search term
    const matchesSearch = Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter berdasarkan tanggal
    const itemDate = new Date(item.time);
    const matchesStartDate = startDate ? itemDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? itemDate <= new Date(endDate) : true;

    // Filter berdasarkan jenis data
    let matchesType = true;
    if (filterType !== "all") {
      if (filterType === "temperature" && !item.temperature)
        matchesType = false;
      if (filterType === "humidity" && !item.humidity) matchesType = false;
      if (filterType === "rain" && item.rainDetection === "Tidak")
        matchesType = false;
    }

    return matchesSearch && matchesStartDate && matchesEndDate && matchesType;
  });

  const handleExport = () => {
    setMessage("Fungsi Export Data belum diimplementasikan!");
    setIsSuccess(false);
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Komponen Card untuk tampilan mobile
  const DataCard = ({ item }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-sm">
          {new Date(item.time).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </h3>
        <span className="text-xs text-gray-500">
          {new Date(item.time).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Suhu:</span>
          <span className="font-medium text-gray-900">
            {item.temperature}°C
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Kelembapan:</span>
          <span className="font-medium text-gray-900">{item.humidity}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Soil:</span>
          <span className="font-medium text-gray-900">
            {item.soilHumidity}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Angin:</span>
          <span className="font-medium text-gray-900">
            {item.windSpeed} km/h
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-gray-600 text-sm">Hujan:</span>
        <span
          className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
            item.rainDetection === "Ya"
              ? "bg-rose-100 text-rose-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {item.rainDetection}
        </span>
      </div>
    </div>
  );

  return (
    <Layout title="Histori Data">
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6 md:mb-8 font-calistoga">
        Histori Data Sensor
      </h1>

      {message && (
        <div
          className={`flex items-center p-4 mb-6 rounded-lg shadow-md transition-all duration-300 ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
          )}
          <span className="font-semibold text-sm md:text-base">{message}</span>
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 pb-3 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 font-calistoga mb-2 sm:mb-0">
            Data Log Sensor
          </h2>

          {/* Toggle View Mode - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tabel
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Kartu
            </button>
          </div>
        </div>

        {/* Filter & Search Controls - Improved mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari data..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          <div className="relative">
            <input
              type="date"
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200 text-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          <div className="relative">
            <input
              type="date"
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200 text-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          <div className="relative">
            <select
              className="appearance-none w-full p-3 pl-10 pr-10 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Semua Jenis Data</option>
              <option value="temperature">Air Temperature</option>
              <option value="humidity">Air Humidity</option>
              <option value="rain">Rain Detection</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>

        <button
          onClick={handleExport}
          className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-3 px-4 md:px-6 rounded-lg transition-all duration-300 flex items-center justify-center mb-6 cursor-pointer transform hover:scale-[1.02] w-full sm:w-auto text-sm"
        >
          <Download className="mr-2 w-4 h-4" /> Export Data
        </button>

        {/* Data Display - Conditional rendering based on screen size and view mode */}
        <div className="block md:hidden">
          {/* Mobile Card View */}
          {filteredData.length > 0 ? (
            <div className="space-y-3">
              {filteredData.map((item) => (
                <DataCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data yang ditemukan.
            </div>
          )}
        </div>

        <div className="hidden md:block">
          {/* Desktop View - Table or Cards based on viewMode */}
          {viewMode === "table" ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Suhu °C
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kelembapan (%)
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Soil Moisture (%)
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wind Speed (km/h)
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hujan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex flex-col">
                            <span>
                              {new Date(item.time).toLocaleDateString("id-ID")}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(item.time).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.temperature}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.humidity}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.soilHumidity}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.windSpeed}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.rainDetection === "Ya"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.rainDetection}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Tidak ada data yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Desktop Card View */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <DataCard key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Tidak ada data yang ditemukan.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination info */}
        {filteredData.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="mb-2 sm:mb-0">
              Menampilkan {filteredData.length} data dari total{" "}
              {historicalData.length} data
            </div>
            <div className="text-xs text-gray-500">
              * Gulir horizontal pada tabel untuk melihat semua kolom
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
