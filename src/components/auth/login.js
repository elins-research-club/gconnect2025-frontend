// src/pages/auth/login.js
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Dummy login logic
    // Ganti ini dengan logika autentikasi backend Anda yang sebenarnya
    if (username === "user" && password === "password") {
      console.log("Login successful!");
      router.push("/dashboard"); // Arahkan ke dashboard setelah berhasil login
    } else {
      setError("Username atau password salah. Coba: user / password");
    }
  };

  return (
    // Kontainer utama halaman login: background terang, teks default gelap, posisi relatif untuk animasi
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 font-sans relative overflow-hidden">
      <Head>
        <title>Login - PkM Lab</title> {/* Judul halaman untuk browser */}
      </Head>

      {/* Kontainer untuk elemen animasi background (lingkaran) */}
      <div className="animated-background">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
        <div className="circle circle-5"></div>
        <div className="circle circle-6"></div>
      </div>
      {/* Akhir Bagian Animasi Background */}

      {/* Kartu login: tetap gelap untuk kontras dengan background terang */}
      <div className="bg-background-card p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105 border border-background-border  z-10 relative">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Selamat Datang Kembali di PkM Lab
        </h1>
        {error && (
          <p className="bg-error text-text-light p-3 rounded-md mb-4 text-center border border-error ">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-text text-sm font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 bg-background-hover text-text leading-tight focus:outline-none focus:ring-2 focus:ring-primary border-background-border transition-colors duration-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-text text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 bg-background-hover text-text leading-tight focus:outline-none focus:ring-2 focus:ring-primary border-background-border transition-colors duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-text-light font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
            >
              Masuk ke Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
