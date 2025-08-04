// src/pages/dashboard/history.js
import Layout from "../../components/common/Layout";
import { useState, useEffect } from "react";
import { Search, Calendar, Filter, Download } from "lucide-react"; // Tambahkan ikon Calendar, Filter, Download

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'temperature', 'humidity', 'rain'

  // Dummy historical data (sama dengan di dashboard, tapi bisa lebih banyak)
  const historicalData = Array.from({ length: 50 }, (_, i) => ({
    time: `2025-08-${String(20 - Math.floor(i / 3)).padStart(2, "0")} ${String(
      23 - (i % 3) * 8
    ).padStart(2, "0")}:00`,
    temperature: (Math.random() * 5 + 23).toFixed(1),
    humidity: (Math.random() * 10 + 55).toFixed(1),
    soilHumidity: (Math.random() * 15 + 30).toFixed(1),
    windSpeed: (Math.random() * 5 + 8).toFixed(1),
    rainDetection: Math.random() > 0.8 ? "Ya" : "Tidak",
  })).sort((a, b) => new Date(b.time) - new Date(a.time)); // Urutkan dari terbaru

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
    alert("Fungsi Export Data belum diimplementasikan!");
    // Di sini Anda akan menambahkan logika untuk export data ke CSV/Excel
  };

  return (
    <Layout title="Histori Data">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-text-light border-b-2 border-primary pb-4 animate-fadeInUp">
        Histori Data Sensor
      </h1>

      <div className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border animate-fadeInUp">
        <h2 className="text-2xl font-semibold mb-6 text-text-light border-b border-background-border pb-3">
          Data Log Sensor
        </h2>

        {/* Filter & Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari data..."
              className="w-full p-3 pl-10 rounded-md border border-background-border bg-background-hover text-text focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
          </div>

          <div className="relative">
            <input
              type="date"
              className="w-full p-3 pl-10 rounded-md border border-background-border bg-background-hover text-text focus:outline-none focus:ring-1 focus:ring-primary"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
          </div>

          <div className="relative">
            <input
              type="date"
              className="w-full p-3 pl-10 rounded-md border border-background-border bg-background-hover text-text focus:outline-none focus:ring-1 focus:ring-primary"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
          </div>

          <div className="relative">
            <select
              className="appearance-none w-full p-3 pl-10 pr-10 rounded-md border border-background-border bg-background-hover text-text focus:outline-none focus:ring-1 focus:ring-primary"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Semua Jenis Data</option>
              <option value="temperature">Suhu Udara</option>
              <option value="humidity">Kelembapan Udara</option>
              <option value="rain">Deteksi Hujan</option>
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
          </div>
        </div>

        <button
          onClick={handleExport}
          className="bg-secondary hover:bg-purple-800 text-text-light font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md flex items-center mb-6"
        >
          <Download className="mr-2 w-5 h-5" /> Export Data
        </button>

        {/* Tabel Data Historis */}
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
              {filteredData.length > 0 ? (
                filteredData.map((item, i) => (
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 whitespace-nowrap text-sm text-center text-text-dark"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
