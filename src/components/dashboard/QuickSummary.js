import Link from "next/link";
import {
  Gauge,
  Zap,
  BellRing,
  Clock,
  AlertTriangle,
  Settings,
} from "lucide-react";

export default function QuickSummary({ alerts, lastUpdatedTime, isConnected }) {
  const activeAlerts = alerts.filter((a) => a.isActive);
  const dangerAlerts = activeAlerts.filter((a) => a.severity === "danger");
  const warningAlerts = activeAlerts.filter((a) => a.severity === "warning");

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl border border-gray-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Ringkasan Singkat & Status Sistem
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatusItem
          icon={<Gauge className="w-5 text-green-600" />}
          label="Koneksi"
          value={isConnected ? "Online" : "Tidak Terhubung"}
        />
        <StatusItem
          icon={<Zap className="w-5 text-black" />}
          label="Sumber Data"
          value="PkM Lab Sensor"
        />
        <StatusItem
          icon={<BellRing className="w-5 text-rose-600" />}
          label="Pemberitahuan"
          value={`${activeAlerts.length} (${dangerAlerts.length}D/${warningAlerts.length}W)`}
        />
        <StatusItem
          icon={<Clock className="w-5 text-gray-600" />}
          label="Update Terakhir"
          value={lastUpdatedTime || "Loading..."}
        />
      </div>

      {activeAlerts.length > 0 && (
        <div className="p-3 bg-red-50 rounded-lg mb-4 border border-red-200">
          <h4 className="font-semibold text-red-800 text-sm mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Alert Breakdown by Sensor
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {["temperature", "humidity", "soilHumidity", "windSpeed"].map(
              (type) => {
                const count = activeAlerts.filter(
                  (a) => a.type === type
                ).length;
                return (
                  <div
                    key={type}
                    className={`p-2 rounded ${
                      count > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div className="font-medium capitalize">{type}</div>
                    <div>
                      {count} alert{count !== 1 ? "s" : ""}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        💡<strong>Informasi Sistem:</strong> Menggunakan sensor PkM Lab di
        Sringharjo untuk data cuaca.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Link href="/dashboard/history" className="flex-1">
          <button className="w-full bg-sky-300 hover:bg-sky-200 duration-300 text-white text-sm font-bold py-2 rounded-md cursor-pointer">
            Lihat Laporan Lengkap
          </button>
        </Link>
        <Link href="/dashboard/thresholds" className="flex-1">
          <button
            className={`w-full text-sm font-bold py-2 rounded-md ${
              activeAlerts.length > 0
                ? "bg-red-500 hover:bg-red-600 animate-pulse duration-300 cursor-pointer text-white"
                : "bg-gray-100 hover:bg-gray-50 duration-300 cursor-pointer text-gray-500"
            } `}
          >
            <Settings className="inline w-4 h-4 mr-2" />
            {activeAlerts.length > 0 ? "Pengaturan Thresholds" : "Pengaturan"}
          </button>
        </Link>
      </div>
    </div>
  );

  function StatusItem({ icon, label, value }) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          {icon}
          <span className="text-sm ml-2">{label}</span>
        </div>
        <span className="font-semibold text-sm">{value}</span>
      </div>
    );
  }
}
