// src/pages/dashboard/lights.js
import Layout from "../../components/common/Layout";
import { useState } from "react";
import { Lightbulb, Power, Sun, Moon } from "lucide-react"; // Import ikon tambahan

export default function LightsControlPage() {
  const [lights, setLights] = useState([
    {
      id: 1,
      name: "Lampu Teras Depan",
      status: "Off",
      brightness: 50,
      color: "#FFFFFF",
    },
    {
      id: 2,
      name: "Lampu Ruang Tamu",
      status: "On",
      brightness: 80,
      color: "#F0E68C",
    },
    {
      id: 3,
      name: "Lampu Taman",
      status: "Off",
      brightness: 0,
      color: "#FFFFFF",
    },
  ]);
  const [message, setMessage] = useState("");

  const toggleLight = (id) => {
    setMessage("");
    setLights((prevLights) =>
      prevLights.map((light) =>
        light.id === id
          ? { ...light, status: light.status === "On" ? "Off" : "On" }
          : light
      )
    );
    const lightName = lights.find((light) => light.id === id)?.name;
    const newStatus =
      lights.find((light) => light.id === id)?.status === "On" ? "Off" : "On";
    setMessage(
      `${lightName} berhasil di${newStatus === "On" ? "nyalakan" : "matikan"}!`
    );
    // Di sini Anda akan memanggil API backend/IoT untuk mengontrol lampu
  };

  const setBrightness = (id, value) => {
    setLights((prevLights) =>
      prevLights.map((light) =>
        light.id === id
          ? { ...light, brightness: value, status: value > 0 ? "On" : "Off" }
          : light
      )
    );
    // Di sini Anda akan memanggil API backend/IoT untuk mengatur kecerahan
  };

  const setColor = (id, value) => {
    setLights((prevLights) =>
      prevLights.map((light) =>
        light.id === id ? { ...light, color: value, status: "On" } : light
      )
    );
    // Di sini Anda akan memanggil API backend/IoT untuk mengatur warna
  };

  return (
    <Layout title="Kontrol Lampu">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-text-light border-b-2 border-primary pb-4 ">
        Kontrol Lampu Pintar
      </h1>

      {message && (
        <div className="bg-success/20 text-success p-4 rounded-lg mb-6 border ">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lights.map((light) => (
          <div
            key={light.id}
            className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border "
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-light flex items-center">
                <Lightbulb
                  className={`mr-3 ${
                    light.status === "On" ? "text-primary" : "text-text-dark"
                  }`}
                />
                {light.name}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  light.status === "On"
                    ? "bg-success text-text-light"
                    : "bg-error text-text-light"
                }`}
              >
                {light.status}
              </span>
            </div>

            {/* Brightness Control */}
            <div className="mb-4">
              <label
                htmlFor={`brightness-${light.id}`}
                className="block text-text text-sm font-medium mb-2"
              >
                Kecerahan: {light.brightness}%
              </label>
              <input
                type="range"
                id={`brightness-${light.id}`}
                min="0"
                max="100"
                value={light.brightness}
                onChange={(e) =>
                  setBrightness(light.id, parseInt(e.target.value))
                }
                className="w-full h-2 bg-background-hover rounded-lg appearance-none cursor-pointer range-slider"
                style={{
                  "--track-color": "var(--color-background-hover)",
                  "--thumb-color": "var(--color-primary-DEFAULT)", // Menggunakan variabel CSS custom
                }}
              />
            </div>

            {/* Color Control (Basic) */}
            <div className="mb-6">
              <label
                htmlFor={`color-${light.id}`}
                className="block text-text text-sm font-medium mb-2"
              >
                Warna
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id={`color-${light.id}`}
                  value={light.color}
                  onChange={(e) => setColor(light.id, e.target.value)}
                  className="w-10 h-10 rounded-full border border-background-border cursor-pointer mr-3"
                />
                <span className="text-text">{light.color}</span>
              </div>
            </div>

            {/* Power Toggle */}
            <button
              onClick={() => toggleLight(light.id)}
              className={`w-full py-3 rounded-lg font-bold transition-all duration-200 shadow-md flex items-center justify-center
                ${
                  light.status === "On"
                    ? "bg-primary hover:bg-primary-dark text-text-light"
                    : "bg-background-hover hover:bg-background-border text-text-dark"
                }`}
            >
              <Power className="mr-2 w-5 h-5" />
              {light.status === "On" ? "Matikan" : "Nyalakan"}
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
