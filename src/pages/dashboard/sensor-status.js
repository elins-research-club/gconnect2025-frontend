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
      name: "Kelembaban Tanah",
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
      name: "Pendeteksi Hujan",
      status: "Online",
      lastReport: "Baru saja",
      health: "Normal",
      issues: [],
    },
  ];

  const getHealthColor = (health) => {
    switch (health) {
      case "Normal":
        return "text-green-500";
      case "Perlu Kalibrasi":
        return "text-yellow-500";
      case "Tidak Terhubung":
        return "text-rose-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Layout title="Status Sensor">
      <h1 className="text-3xl font-extrabold mb-8 font-calistoga">
        Status Sensor
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sensorStatuses.map((sensor) => (
          <div
            key={sensor.id}
            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02]"
          >
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                {sensor.status === "Online" && sensor.health === "Normal" && (
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                )}
                {sensor.status === "Online" && sensor.health !== "Normal" && (
                  <Info className="text-yellow-500 mr-2" size={20} />
                )}
                {sensor.status === "Offline" && (
                  <Bug className="text-rose-500 mr-2" size={20} />
                )}
                {sensor.name}
              </h2>
              <p className="text-gray-500 text-sm mb-1.5">
                Status:{" "}
                <span
                  className={`font-medium ${
                    sensor.status === "Online"
                      ? "text-green-500"
                      : "text-rose-500"
                  }`}
                >
                  {sensor.status}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-1.5">
                Terakhir Lapor:{" "}
                <span className="text-gray-700 font-medium">
                  {sensor.lastReport}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Kondisi:{" "}
                <span
                  className={`font-medium ${getHealthColor(sensor.health)}`}
                >
                  {sensor.health}
                </span>
              </p>
            </div>

            {sensor.issues.length > 0 && (
              <div className="mt-2 p-3 bg-gray-100 text-gray-700 rounded-lg">
                <p className="font-semibold mb-1">Masalah Ditemukan:</p>
                <ul className="list-disc list-inside text-sm pl-2">
                  {sensor.issues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <button className="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md">
              Detail Laporan
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
