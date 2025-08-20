// src/pages/dashboard/thresholds.js - Updated dengan Context Integration
import Layout from "../../components/common/Layout";
import { useState, useEffect } from "react";
import { useSensorData } from "../../context/SensorContext";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import { useRouter } from "next/router"; // Import useRouter
import {
  AlertTriangle,
  CheckCircle,
  Sliders,
  Bell,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ThresholdSettingsPage() {
  const { isAuthenticated } = useAuth(); // Dapatkan status autentikasi
  const router = useRouter(); // Dapatkan instance router

  // Efek untuk memeriksa autentikasi saat komponen dimuat
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login"); // Arahkan ke halaman login jika tidak terautentikasi
    }
  }, [isAuthenticated, router]);

  // Hentikan rendering jika pengguna belum terautentikasi
  if (!isAuthenticated) {
    return null;
  }

  const { thresholds, updateThresholds, alerts, currentData, clearAllAlerts } =
    useSensorData();
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Update local state ketika thresholds dari context berubah
  useEffect(() => {
    setLocalThresholds(thresholds);
  }, [thresholds]);

  // Cek apakah ada perubahan
  useEffect(() => {
    const hasChanged =
      JSON.stringify(localThresholds) !== JSON.stringify(thresholds);
    setHasChanges(hasChanged);
  }, [localThresholds, thresholds]);

  const handleThresholdChange = (sensor, type, value) => {
    setLocalThresholds((prev) => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [type]: parseFloat(value) || 0,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    // Validasi threshold values
    const isValid = validateThresholds(localThresholds);
    if (!isValid.valid) {
      setMessage(isValid.message);
      setIsSuccess(false);
      return;
    }

    try {
      updateThresholds(localThresholds);
      setMessage("Pengaturan threshold berhasil disimpan dan diterapkan!");
      setIsSuccess(true);
      setHasChanges(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("Gagal menyimpan pengaturan threshold!");
      setIsSuccess(false);
    }
  };

  const handleReset = () => {
    setLocalThresholds(thresholds);
    setHasChanges(false);
    setMessage("Perubahan dibatalkan");
    setIsSuccess(true);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  const validateThresholds = (thresholds) => {
    for (const [sensorName, values] of Object.entries(thresholds)) {
      if (values.min !== undefined && values.max !== undefined) {
        if (values.min >= values.max) {
          return {
            valid: false,
            message: `Nilai minimum harus lebih kecil dari maksimum untuk ${getSensorDisplayName(
              sensorName
            )}`,
          };
        }
      }

      // Validasi range yang masuk akal
      if (sensorName === "temperature") {
        if (values.min < -50 || values.max > 80) {
          return {
            valid: false,
            message: "Threshold suhu harus dalam range -50°C hingga 80°C",
          };
        }
      }

      if (sensorName === "humidity" || sensorName === "soilHumidity") {
        if (values.min < 0 || values.max > 100) {
          return {
            valid: false,
            message: "Threshold kelembapan harus dalam range 0% hingga 100%",
          };
        }
      }

      if (sensorName === "windSpeed") {
        if (values.max < 0 || values.max > 200) {
          return {
            valid: false,
            message: "Threshold kecepatan angin harus dalam range 0-200 km/h",
          };
        }
      }
    }

    return { valid: true };
  };

  const getSensorDisplayName = (sensorName) => {
    const displayNames = {
      temperature: "Suhu Udara",
      humidity: "Kelembapan Udara",
      soilHumidity: "Kelembapan Tanah",
      windSpeed: "Kecepatan Angin",
    };
    return displayNames[sensorName] || sensorName;
  };

  const getUnit = (sensorName) => {
    const units = {
      temperature: "°C",
      humidity: "%",
      soilHumidity: "%",
      windSpeed: "km/h",
    };
    return units[sensorName] || "";
  };

  // Simulasi preview bagaimana threshold akan mempengaruhi data saat ini
  const getPreviewStatus = (sensorName) => {
    if (!currentData || !currentData[sensorName]) return null;

    const currentValue = parseFloat(currentData[sensorName]);
    const threshold = localThresholds[sensorName];

    let status = "normal";
    let message = `Nilai saat ini: ${currentValue}${getUnit(
      sensorName
    )} - Normal`;

    if (threshold.min !== undefined && currentValue < threshold.min) {
      status = "warning";
      message = `Nilai saat ini: ${currentValue}${getUnit(
        sensorName
      )} - AKAN MEMICU ALERT: Di bawah minimum (${threshold.min}${getUnit(
        sensorName
      )})`;
    } else if (threshold.max !== undefined && currentValue > threshold.max) {
      status = "danger";
      message = `Nilai saat ini: ${currentValue}${getUnit(
        sensorName
      )} - AKAN MEMICU ALERT: Melebihi maksimum (${threshold.max}${getUnit(
        sensorName
      )})`;
    }

    return { status, message };
  };

  const activeAlerts = alerts.filter((alert) => alert.isActive);
  const getAlertsForSensor = (sensorType) => {
    return activeAlerts.filter((alert) => alert.type === sensorType);
  };

  return (
    <Layout title="Pengaturan Threshold">
      <div className="w-full">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 font-calistoga">
            Pengaturan Threshold
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${
                showPreview
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              title={showPreview ? "Sembunyikan preview" : "Tampilkan preview"}
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            {activeAlerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                title="Clear semua alert"
              >
                <Bell className="w-4 h-4 inline mr-1" />
                Clear {activeAlerts.length} Alert
                {activeAlerts.length > 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>

        {/* Active Alerts Summary */}
        {activeAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-semibold text-red-800">
                {activeAlerts.length} Peringatan Aktif
              </h3>
            </div>
            <div className="text-sm text-red-700 space-y-1">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {alert.message}
                </div>
              ))}
              {activeAlerts.length > 3 && (
                <div className="text-red-600 font-medium">
                  +{activeAlerts.length - 3} peringatan lainnya
                </div>
              )}
            </div>
          </div>
        )}

        {message && (
          <div
            className={`flex items-center p-4 mb-6 rounded-lg shadow-md transition-all duration-300 ${
              isSuccess
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            <span className="font-semibold text-sm md:text-base">
              {message}
            </span>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 font-calistoga">
              Batas Ambang Peringatan
            </h2>
            {hasChanges && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-amber-600 font-medium">
                  Ada perubahan belum disimpan
                </span>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-6 font-inter">
            Atur batas nilai minimum dan maksimum untuk setiap sensor yang akan
            memicu peringatan.
            {currentData && (
              <span className="block mt-2 text-sm text-blue-600">
                💡 Data sensor saat ini akan digunakan untuk preview dampak
                pengaturan threshold.
              </span>
            )}
          </p>

          <form onSubmit={handleSubmit}>
            {Object.entries(localThresholds).map(([sensorName, values]) => {
              const sensorAlerts = getAlertsForSensor(sensorName);
              const previewStatus = showPreview
                ? getPreviewStatus(sensorName)
                : null;

              return (
                <div
                  key={sensorName}
                  className={`mb-6 p-6 rounded-xl shadow-inner transition-all duration-300 ${
                    sensorAlerts.length > 0
                      ? "border-2 border-red-300 bg-red-50"
                      : "border border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 font-inter flex items-center">
                      <Sliders className="inline-block w-5 h-5 mr-2" />
                      {getSensorDisplayName(sensorName)}
                      {sensorAlerts.length > 0 && (
                        <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                          {sensorAlerts.length} Alert
                          {sensorAlerts.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </h3>
                    {getUnit(sensorName) && (
                      <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded">
                        Unit: {getUnit(sensorName)}
                      </span>
                    )}
                  </div>

                  {/* Active Alerts untuk sensor ini */}
                  {sensorAlerts.length > 0 && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-2">
                        Alert Aktif:
                      </p>
                      {sensorAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="text-xs text-red-700 mb-1"
                        >
                          • {alert.message}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {"min" in values && (
                      <div>
                        <label
                          htmlFor={`${sensorName}-min`}
                          className="block text-gray-700 text-sm font-medium mb-2"
                        >
                          Batas Minimum{" "}
                          {getUnit(sensorName) && `(${getUnit(sensorName)})`}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          id={`${sensorName}-min`}
                          className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
                          value={values.min}
                          onChange={(e) =>
                            handleThresholdChange(
                              sensorName,
                              "min",
                              e.target.value
                            )
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
                          Batas Maksimum{" "}
                          {getUnit(sensorName) && `(${getUnit(sensorName)})`}
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          id={`${sensorName}-max`}
                          className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
                          value={values.max}
                          onChange={(e) =>
                            handleThresholdChange(
                              sensorName,
                              "max",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Preview Status */}
                  {showPreview && previewStatus && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-sm ${
                        previewStatus.status === "normal"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : previewStatus.status === "warning"
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        <strong>Preview Dampak:</strong>
                      </div>
                      <p className="mt-1">{previewStatus.message}</p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                disabled={!hasChanges}
                className="flex-1 sm:flex-none bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center transform hover:scale-[1.02] disabled:transform-none"
              >
                <Save className="mr-2 w-5 h-5" />
                Simpan Pengaturan
                {hasChanges && (
                  <span className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </button>

              {hasChanges && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center transform hover:scale-[1.02]"
                >
                  <RotateCcw className="mr-2 w-5 h-5" /> Batal Perubahan
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            💡 Tips Penggunaan Threshold:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • <strong>Temperature:</strong> Atur sesuai kondisi optimal
              tanaman (umumnya 20-30°C)
            </li>
            <li>
              • <strong>Humidity:</strong> Kelembapan udara ideal biasanya
              50-70%
            </li>
            <li>
              • <strong>Soil Moisture:</strong> Kelembapan tanah 40-60% cocok
              untuk kebanyakan tanaman
            </li>
            <li>
              • <strong>Wind Speed:</strong> Angin terlalu kencang (&gt;20 km/h)
              dapat merusak tanaman
            </li>
            <li>
              • Sistem akan memberikan peringatan real-time ketika nilai
              melebihi batas yang ditentukan
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
