// src/pages/dashboard/settings/account.js
import Layout from "../../../components/common/Layout";
import { useState } from "react";

export default function AccountSettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState(""); // Untuk notifikasi sukses/error

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setMessage("");
    // Logika dummy untuk update profil
    console.log("Update Profile:", { name, email });
    setMessage("Profil berhasil diperbarui!");
    // Di sini Anda akan memanggil API backend untuk update profil
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setMessage("");
    // Logika dummy untuk ganti password
    if (currentPassword === "password123" && password.length >= 6) {
      // Contoh validasi dummy
      console.log("Change Password:", {
        currentPassword,
        newPassword: password,
      });
      setMessage("Password berhasil diubah!");
      setPassword("");
      setCurrentPassword("");
    } else {
      setMessage(
        "Gagal mengubah password. Pastikan password lama benar dan password baru minimal 6 karakter."
      );
    }
    // Di sini Anda akan memanggil API backend untuk ganti password
  };

  return (
    <Layout title="Pengaturan Akun">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-text-light border-b-2 border-primary pb-4 animate-fadeInUp">
        Pengaturan Akun
      </h1>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.includes("berhasil")
              ? "bg-success/20 text-success"
              : "bg-error/20 text-error"
          } border animate-pulse`}
        >
          {message}
        </div>
      )}

      {/* Bagian Update Profil */}
      <div className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border mb-8 animate-fadeInUp">
        <h2 className="text-2xl font-semibold mb-6 text-text-light border-b border-background-border pb-3">
          Informasi Profil
        </h2>
        <form onSubmit={handleProfileUpdate}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-text text-sm font-medium mb-2"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 rounded-md bg-background-hover border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-text text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-md bg-background-hover border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-text-light font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md"
          >
            Perbarui Profil
          </button>
        </form>
      </div>

      {/* Bagian Ganti Password */}
      <div className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border animate-fadeInUp">
        <h2 className="text-2xl font-semibold mb-6 text-text-light border-b border-background-border pb-3">
          Ganti Password
        </h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-text text-sm font-medium mb-2"
            >
              Password Saat Ini
            </label>
            <input
              type="password"
              id="currentPassword"
              className="w-full p-3 rounded-md bg-background-hover border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="newPassword"
              className="block text-text text-sm font-medium mb-2"
            >
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full p-3 rounded-md bg-background-hover border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-secondary hover:bg-purple-800 text-text-light font-bold py-2 px-5 rounded-lg transition-colors duration-200 shadow-md"
          >
            Ubah Password
          </button>
        </form>
      </div>
    </Layout>
  );
}
