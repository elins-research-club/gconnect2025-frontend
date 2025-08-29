// src/pages/dashboard/thresholds.js - Fixed and Combined Version
import Layout from "../../components/common/Layout";
import { useState, useEffect } from "react";
import { useSensorData } from "../../context/SensorContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import {
  AlertTriangle,
  CheckCircle,
  Sliders,
  Bell,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
} from "lucide-react";

export default function ThresholdSettingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // SEMUA HOOKS HARUS DIPANGGIL DI AWAL - TIDAK BOLEH SETELAH EARLY RETURN
  const {
    thresholds,
    updateThresholds,
    resetThresholds,
    alerts,
    currentData,
    clearAllAlerts,
  } = useSensorData();

  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Redirect jika belum autentikasi
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

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

  // EARLY RETURN SETELAH SEMUA HOOKS
  if (!isAuthenticated) {
    return null;
  }

  // Enhanced threshold change handler
  const handleThresholdChange = (sensor, type, value) => {
    setLocalThresholds((prev) => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [type]: value === "" ? undefined : parseFloat(value) || 0,
      },
    }));
  };

  // Clear threshold value
  const clearThresholdValue = (sensor, type) => {
    setLocalThresholds((prev) => {
      const newThresholds = { ...prev };
      if (newThresholds[sensor]) {
        delete newThresholds[sensor][type];
      }
      return newThresholds;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    // Enhanced validation
    const validation = validateThresholds(localThresholds);
    if (!validation.valid) {
      setMessage(validation.message);
      setIsSuccess(false);
      return;
    }

    try {
      updateThresholds(localThresholds);
      setMessage("Pengaturan threshold berhasil disimpan dan diterapkan!");
      setIsSuccess(true);
      setHasChanges(false);

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

  const handleResetToDefaults = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin mengembalikan semua threshold ke pengaturan default?"
      )
    ) {
      resetThresholds();
      setMessage("Threshold berhasil direset ke pengaturan default");
      setIsSuccess(true);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  // Enhanced validation function
  const validateThresholds = (thresholds) => {
    for (const [sensorName, values] of Object.entries(thresholds)) {
      // Skip validation if no values are set
      const hasMin =
        values.min !== undefined && values.min !== null && values.min !== "";
      const hasMax =
        values.max !== undefined && values.max !== null && values.max !== "";

      if (!hasMin && !hasMax) {
        continue; // It's okay to have no thresholds set
      }

      // If both are set, min should be less than max
      if (hasMin && hasMax) {
        const minVal = parseFloat(values.min);
        const maxVal = parseFloat(values.max);

        if (isNaN(minVal) || isNaN(maxVal)) {
          return {
            valid: false,
            message: `Nilai threshold harus berupa angka untuk ${getSensorDisplayName(
              sensorName
            )}`,
          };
        }

        if (minVal >= maxVal) {
          return {
            valid: false,
            message: `Nilai minimum harus lebih kecil dari maksimum untuk ${getSensorDisplayName(
              sensorName
            )}`,
          };
        }
      }

      // Validate individual values
      if (hasMin && isNaN(parseFloat(values.min))) {
        return {
          valid: false,
          message: `Nilai minimum harus berupa angka untuk ${getSensorDisplayName(
            sensorName
          )}`,
        };
      }

      if (hasMax && isNaN(parseFloat(values.max))) {
        return {
          valid: false,
          message: `Nilai maksimum harus berupa angka untuk ${getSensorDisplayName(
            sensorName
          )}`,
        };
      }

      // Validate reasonable ranges
      if (sensorName === "temperature") {
        if (
          (hasMin &&
            (parseFloat(values.min) < -50 || parseFloat(values.min) > 80)) ||
          (hasMax &&
            (parseFloat(values.max) < -50 || parseFloat(values.max) > 80))
        ) {
          return {
            valid: false,
            message: "Threshold suhu harus dalam range -50°C hingga 80°C",
          };
        }
      }

      if (sensorName === "humidity" || sensorName === "soilHumidity") {
        if (
          (hasMin &&
            (parseFloat(values.min) < 0 || parseFloat(values.min) > 100)) ||
          (hasMax &&
            (parseFloat(values.max) < 0 || parseFloat(values.max) > 100))
        ) {
          return {
            valid: false,
            message: "Threshold kelembapan harus dalam range 0% hingga 100%",
          };
        }
      }

      if (sensorName === "windSpeed") {
        if (
          hasMax &&
          (parseFloat(values.max) < 0 || parseFloat(values.max) > 200)
        ) {
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

  // Enhanced preview status
  const getPreviewStatus = (sensorName) => {
    if (!currentData || !currentData[sensorName]) return null;

    const currentValue = parseFloat(currentData[sensorName]);
    const threshold = localThresholds[sensorName];

    if (!threshold) return null;

    let status = "normal";
    let message = `Nilai saat ini: ${currentValue}${getUnit(
      sensorName
    )} - Normal`;

    const hasMin =
      threshold.min !== undefined &&
      threshold.min !== null &&
      threshold.min !== "";
    const hasMax =
      threshold.max !== undefined &&
      threshold.max !== null &&
      threshold.max !== "";

    if (hasMin && currentValue < parseFloat(threshold.min)) {
      status = "warning";
      message = `Nilai saat ini: ${currentValue}${getUnit(
        sensorName
      )} - AKAN MEMICU ALERT: Di bawah minimum (${threshold.min}${getUnit(
        sensorName
      )})`;
    } else if (hasMax && currentValue > parseFloat(threshold.max)) {
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-600 font-calistoga">
            Pengaturan Threshold
          </h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-2 rounded-lg transition-colors ${
                showPreview
                  ? "bg-gray-400 text-white"
                  : "bg-white hover:bg-gray-50 border border-gray-300"
              }`}
              title={showPreview ? "Sembunyikan preview" : "Tampilkan preview"}
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={handleResetToDefaults}
              className="px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-300"
              title="Reset ke default"
            >
              <RefreshCw className="w-4 h-4 inline mr-1" />
              Default
            </button>

            {activeAlerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                title="Clear semua alert"
              >
                <Bell className="w-4 h-4 inline mr-1" />
                Clear {activeAlerts.length}
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
            <div className="text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
              {activeAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                  <span className="truncate">{alert.message}</span>
                  <span className="ml-2 text-xs text-red-500 flex-shrink-0">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {activeAlerts.length > 5 && (
                <div className="text-red-600 font-medium">
                  +{activeAlerts.length - 5} peringatan lainnya
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

        <div className="p-6">
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

          <div className="bg-sky-200/25 backdrop-blur-sm border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-gray-600 text-sm">
              💡 <strong>Tips:</strong> Kosongkan field untuk tidak menggunakan
              batas tersebut. Anda bisa mengatur hanya batas minimum, maksimum,
              atau keduanya sesuai kebutuhan.
            </p>
          </div>

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
                      : "border border-gray-200 bg-white/50 backdrop-blur-sm"
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
                      <div className="max-h-20 overflow-y-auto">
                        {sensorAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="text-xs text-red-700 mb-1"
                          >
                            • {alert.message}
                            <span className="ml-2 text-red-500">
                              ({new Date(alert.timestamp).toLocaleTimeString()})
                            </span>
                          </div>
                        ))}
                      </div>
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
                          <span className="text-gray-500 text-xs ml-1">
                            - Opsional
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            id={`${sensorName}-min`}
                            className="w-full p-3 pr-10 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
                            value={values.min !== undefined ? values.min : ""}
                            onChange={(e) =>
                              handleThresholdChange(
                                sensorName,
                                "min",
                                e.target.value
                              )
                            }
                            placeholder="Kosong = tidak ada batas"
                          />
                          {values.min !== undefined && values.min !== "" && (
                            <button
                              type="button"
                              onClick={() =>
                                clearThresholdValue(sensorName, "min")
                              }
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Hapus batas minimum"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
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
                          <span className="text-gray-500 text-xs ml-1">
                            - Opsional
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            id={`${sensorName}-max`}
                            className="w-full p-3 pr-10 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
                            value={values.max !== undefined ? values.max : ""}
                            onChange={(e) =>
                              handleThresholdChange(
                                sensorName,
                                "max",
                                e.target.value
                              )
                            }
                            placeholder="Kosong = tidak ada batas"
                          />
                          {values.max !== undefined && values.max !== "" && (
                            <button
                              type="button"
                              onClick={() =>
                                clearThresholdValue(sensorName, "max")
                              }
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Hapus batas maksimum"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Current threshold status */}
                  <div className="mt-4 p-3 bg-sky-300/50 rounded-lg text-sm text-gray-700">
                    <strong>Status Threshold:</strong>
                    {(() => {
                      const hasMin =
                        values.min !== undefined &&
                        values.min !== "" &&
                        values.min !== null;
                      const hasMax =
                        values.max !== undefined &&
                        values.max !== "" &&
                        values.max !== null;

                      if (!hasMin && !hasMax) {
                        return (
                          <span className="text-gray-500 ml-2">
                            Tidak ada batas yang diset
                          </span>
                        );
                      }

                      const parts = [];
                      if (hasMin)
                        parts.push(`Min: ${values.min}${getUnit(sensorName)}`);
                      if (hasMax)
                        parts.push(`Max: ${values.max}${getUnit(sensorName)}`);

                      return (
                        <span className="text-blue-600 ml-2">
                          {parts.join(", ")}
                        </span>
                      );
                    })()}
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
        <div className="mt-6 bg-sky-200/50 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-sky-900 mb-2">
            💡 Tips Penggunaan Threshold:
          </h3>
          <ul className="text-sm text-sky-700 space-y-1">
            <li>
              • <strong>Field Kosong:</strong> Biarkan kosong jika tidak ingin
              menggunakan batas tersebut
            </li>
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
              • <strong>Penyimpanan:</strong> Pengaturan akan tersimpan secara
              otomatis di browser Anda
            </li>
            <li>
              • <strong>Alert System:</strong> Sistem akan memberikan peringatan
              real-time ketika nilai melebihi batas
            </li>
          </ul>
        </div>

        {/* Storage Info */}
        <div className="mt-4 bg-sky-200/50 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-sky-900 mb-2">
            Informasi Penyimpanan:
          </h3>
          <p className="text-sm text-sky-700">
            Pengaturan threshold dan alert history disimpan secara lokal di
            browser Anda. Data akan tetap tersimpan bahkan setelah menutup
            aplikasi, namun akan hilang jika Anda membersihkan cache browser
            atau menggunakan mode incognito.
          </p>
        </div>
      </div>
    </Layout>
  );
}
