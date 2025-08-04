// src/pages/dashboard/thresholds.js
import Layout from "../../components/common/Layout";
import { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

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
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-text-light border-b-2 border-primary pb-4 animate-fadeInUp">
        Pengaturan Threshold
      </h1>

      {message && (
        <div className="bg-success/20 text-success p-4 rounded-lg mb-6 border animate-pulse">
          {message}
        </div>
      )}

      <div className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border animate-fadeInUp">
        <h2 className="text-2xl font-semibold mb-6 text-text-light border-b border-background-border pb-3">
          Batas Ambang Peringatan
        </h2>
        <p className="text-text-dark mb-6">
          Atur batas nilai minimum dan maksimum untuk setiap sensor yang akan
          memicu peringatan.
        </p>

        <form onSubmit={handleSubmit}>
          {Object.entries(thresholds).map(([sensorName, values]) => (
            <div
              key={sensorName}
              className="mb-6 p-4 border border-background-border rounded-lg bg-background-hover"
            >
              <h3 className="text-xl font-semibold mb-4 text-text-light capitalize">
                {sensorName.replace(/([A-Z])/g, " $1")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {"min" in values && (
                  <div>
                    <label
                      htmlFor={`${sensorName}-min`}
                      className="block text-text text-sm font-medium mb-2"
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
                      className="w-full p-3 rounded-md bg-background-card border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
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
                      className="block text-text text-sm font-medium mb-2"
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
                      className="w-full p-3 rounded-md bg-background-card border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="mt-6 bg-primary hover:bg-primary-dark text-text-light font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md flex items-center"
          >
            <CheckCircle className="mr-2 w-5 h-5" /> Simpan Pengaturan
          </button>
        </form>
      </div>
    </Layout>
  );
}
