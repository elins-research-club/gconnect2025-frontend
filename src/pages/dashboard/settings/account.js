// src/pages/dashboard/settings/account.js
import Layout from "../../../components/common/Layout";
import { useState } from "react";
import { User, KeyRound, CheckCircle, AlertTriangle } from "lucide-react";

export default function AccountSettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState(""); // For success/error notifications
  const [isSuccess, setIsSuccess] = useState(false);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    // Dummy logic for profile update
    console.log("Update Profile:", { name, email });
    setMessage("Profil berhasil diperbarui!");
    setIsSuccess(true);
    // Here you would call a backend API to update the profile
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);
    // Dummy logic for password change
    if (currentPassword === "password123" && password.length >= 6) {
      // Example of dummy validation
      console.log("Change Password:", {
        currentPassword,
        newPassword: password,
      });
      setMessage("Password berhasil diubah!");
      setIsSuccess(true);
      setPassword("");
      setCurrentPassword("");
    } else {
      setMessage(
        "Gagal mengubah password. Pastikan password lama benar dan password baru minimal 6 karakter."
      );
      setIsSuccess(false);
    }
    // Here you would call a backend API to change the password
  };

  return (
    <Layout title="Pengaturan Akun">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 font-calistoga">
        Pengaturan Akun
      </h1>

      {message && (
        <div
          className={`flex items-center p-4 mb-6 rounded-lg shadow-md transition-all duration-300 ${
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isSuccess ? (
            <CheckCircle className="w-5 h-5 mr-3" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-3" />
          )}
          <span className="font-semibold">{message}</span>
        </div>
      )}

      {/* Profile Update Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-8 ">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 font-calistoga border-b border-gray-200 pb-3">
          Informasi Profil
        </h2>
        <form onSubmit={handleProfileUpdate}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center transform hover:scale-[1.02]"
          >
            <User className="mr-2 w-5 h-5" /> Perbarui Profil
          </button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 font-calistoga border-b border-gray-200 pb-3">
          Ganti Password
        </h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password Saat Ini
            </label>
            <input
              type="password"
              id="currentPassword"
              className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="newPassword"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password Baru
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full p-3 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center transform hover:scale-[1.02]"
          >
            <KeyRound className="mr-2 w-5 h-5" /> Ubah Password
          </button>
        </form>
      </div>
    </Layout>
  );
}
