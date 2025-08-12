// src/pages/dashboard/thresholds.js
import Layout from "../../components/common/Layout";
import { useState } from "react";
import { AlertTriangle, CheckCircle, Sliders } from "lucide-react";

export default function ThresholdSettingsPage() {
  const [thresholds, setThresholds] = useState({
    temperature: { min: 20, max: 30 },
    humidity: { min: 50, max: 70 },
    soilHumidity: { min: 40, max: 60 },
    windSpeed: { max: 20 },
  });
  const [message, setMessage] = useState("");

  const handleThresholdChange = (sensor, type, value) => {
    setThresholds((prev) => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [type]: parseFloat(value), // Pastikan nilai adalah float
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    console.log("Thresholds updated:", thresholds);
    setMessage("Pengaturan threshold berhasil disimpan!");
    // Di sini Anda akan memanggil API backend untuk menyimpan threshold
  };

  return (
    <Layout title="Pengaturan Threshold">
      <h1 className="text-3xl font-extrabold mb-8 font-calistoga">
        Pengaturan Threshold
      </h1>

      {message && (
        <div className="flex items-center p-4 mb-6 text-green-700 bg-green-100 rounded-lg shadow-md transition-all duration-300">
          <CheckCircle className="w-5 h-5 mr-3" />
          <span className="font-semibold">{message}</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 font-calistoga border-b border-gray-200 pb-3">
          Batas Ambang Peringatan
        </h2>
        <p className="text-gray-600 mb-6 font-inter">
          Atur batas nilai minimum dan maksimum untuk setiap sensor yang akan
          memicu peringatan.
        </p>

        <form onSubmit={handleSubmit}>
          {Object.entries(thresholds).map(([sensorName, values]) => (
            <div
              key={sensorName}
              className="mb-6 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-inner"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800 capitalize font-inter">
                <Sliders className="inline-block w-5 h-5 mr-2" />
                {sensorName.replace(/([A-Z])/g, " $1")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {"min" in values && (
                  <div>
                    <label
                      htmlFor={`${sensorName}-min`}
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Minimum (
                      {sensorName === "temperature"
                        ? "°C"
                        : sensorName === "humidity" ||
                          sensorName === "soilHumidity"
                        ? "%"
                        : ""}
                      )
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id={`${sensorName}-min`}
                      className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
                      value={values.min}
                      onChange={(e) =>
                        handleThresholdChange(sensorName, "min", e.target.value)
                      }
                    />
                  </div>
                )}
                {"max" in values && (
                  <div>
                    <label
                      htmlFor={`${sensorName}-max`}
                      className="block text-gray-700 text-sm font-medium mb-2"
                    >
                      Maksimum (
                      {sensorName === "temperature"
                        ? "°C"
                        : sensorName === "humidity" ||
                          sensorName === "soilHumidity"
                        ? "%"
                        : sensorName === "windSpeed"
                        ? "km/h"
                        : ""}
                      )
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id={`${sensorName}-max`}
                      className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
                      value={values.max}
                      onChange={(e) =>
                        handleThresholdChange(sensorName, "max", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="mt-6 w-full md:w-auto bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center transform hover:scale-[1.02]"
          >
            <CheckCircle className="mr-2 w-5 h-5" /> Simpan Pengaturan
          </button>
        </form>
      </div>
    </Layout>
  );
}
