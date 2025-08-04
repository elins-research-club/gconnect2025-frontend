/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Penting untuk Dark Mode
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0D0D0D", // Hampir hitam
          card: "#1A1A1A", // Latar belakang kartu/komponen
          hover: "#2A2A2A", // Hover state untuk elemen interaktif
          border: "#3A3A3A", // Warna border yang subtle
        },
        primary: {
          lighter: "#66CCFF", // Untuk teks di atas primary.dark
          DEFAULT: "#00BFFF", // Biru cerah
          dark: "#008CC9", // Biru lebih gelap
        },
        secondary: {
          DEFAULT: "#9333EA", // Ungu
        },
        text: {
          light: "#F8F8F8", // Hampir putih untuk heading/teks penting
          DEFAULT: "#EAEAEA", // Putih keabuan untuk teks biasa
          dark: "#A0A0A0", // Abu-abu untuk teks sekunder/placeholder
        },
        success: "#10B981", // Hijau
        warning: "#FBBF24", // Kuning
        error: "#EF4444", // Merah
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        fadeInUp: "fadeInUp 0.6s ease-out forwards",
        pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      // === BAGIAN INI PENTING UNTUK BACKDROP FILTER DI NAVBAR ===
      backdropFilter: {
        "none": "none",
        "blur-sm": "blur(4px)",
        "blur-md": "blur(8px)", // Ini yang dipakai di Header.js
        "blur-lg": "blur(12px)",
      },
      // =========================================================
    },
  },
  plugins: [
    // === PLUGIN INI WAJIB ADA UNTUK BACKDROP FILTER ===
    require("tailwindcss-filters"),
  ],
};
