// src/pages/dashboard/sensor-status.js
import Layout from "../../components/common/Layout";
import { Bug, Info, CheckCircle } from "lucide-react"; // Import ikon

export default function SensorStatusPage() {
  const sensorStatuses = [
    {
      id: 1,
      name: "Suhu Udara",
      status: "Online",
      lastReport: "Baru saja",
      health: "Normal",
      issues: [],
    },
    {
      id: 2,
      name: "Kelembapan Udara",
      status: "Online",
      lastReport: "1 menit lalu",
      health: "Normal",
      issues: [],
    },
    {
      id: 3,
      name: "Kelembapan Tanah",
      status: "Online",
      lastReport: "5 menit lalu",
      health: "Perlu Kalibrasi",
      issues: ["Pembacaan tidak konsisten"],
    },
    {
      id: 4,
      name: "Kecepatan Angin",
      status: "Offline",
      lastReport: "1 jam lalu",
      health: "Tidak Terhubung",
      issues: ["Tidak ada sinyal"],
    },
    {
      id: 5,
      name: "Deteksi Hujan",
      status: "Online",
      lastReport: "Baru saja",
      health: "Normal",
      issues: [],
    },
  ];

  return (
    <Layout title="Status Sensor">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-text-light border-b-2 border-primary pb-4 animate-fadeInUp">
        Status Sensor
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensorStatuses.map((sensor) => (
          <div
            key={sensor.id}
            className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border animate-fadeInUp"
          >
            <h2 className="text-xl font-semibold mb-3 text-text-light flex items-center">
              {sensor.status === "Online" && (
                <CheckCircle className="text-success mr-2" size={20} />
              )}
              {sensor.status === "Offline" && (
                <Bug className="text-error mr-2" size={20} />
              )}
              {sensor.status === "Online" && sensor.health !== "Normal" && (
                <Info className="text-warning mr-2" size={20} />
              )}
              {sensor.name}
            </h2>
            <p className="text-text-dark text-sm mb-2">
              Status:{" "}
              <span
                className={`font-medium ${
                  sensor.status === "Online" ? "text-success" : "text-error"
                }`}
              >
                {sensor.status}
              </span>
            </p>
            <p className="text-text-dark text-sm mb-2">
              Terakhir Lapor:{" "}
              <span className="text-text">{sensor.lastReport}</span>
            </p>
            <p className="text-text-dark text-sm mb-4">
              Kondisi:{" "}
              <span
                className={`font-medium ${
                  sensor.health === "Normal"
                    ? "text-success"
                    : sensor.health === "Perlu Kalibrasi"
                    ? "text-warning"
                    : "text-error"
                }`}
              >
                {sensor.health}
              </span>
            </p>

            {sensor.issues.length > 0 && (
              <div className="mt-4 p-3 bg-error/10 text-error rounded-md border border-error">
                <p className="font-semibold mb-1">Masalah Ditemukan:</p>
                <ul className="list-disc list-inside text-sm">
                  {sensor.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            <button className="mt-4 w-full bg-primary hover:bg-primary-dark text-text-light font-bold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md">
              Detail Laporan
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
