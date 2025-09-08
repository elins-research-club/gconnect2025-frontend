import React, { useState, useRef } from "react";
import Layout from "../../components/common/Layout";
import {
  Thermometer,
  Droplets,
  Sprout,
  Wind,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const parameters = [
  {
    id: "temp",
    icon: Thermometer,
    title: "Suhu Udara",
    ideal: { min: 18, max: 30, unit: "°C" },
    color: { text: "text-sky-400", bg: "bg-sky-400/10", bar: "bg-sky-400" },
    description:
      "Suhu krusial untuk proses fotosintesis dan pertumbuhan vegetatif tanaman.",
    recommendations: {
      high: "Risiko penguapan tinggi.",
      low: "Pertumbuhan melambat.",
    },
  },
  {
    id: "humidity",
    icon: Droplets,
    title: "Kelembapan Udara",
    ideal: { min: 50, max: 70, unit: "%" },
    color: { text: "text-gray-400", bg: "bg-gray-400/10", bar: "bg-gray-400" },
    description:
      "Mempengaruhi laju transpirasi tanaman dan risiko serangan penyakit jamur.",
    recommendations: {
      high: "Waspada penyakit jamur. Jaga sirkulasi udara dengan jarak tanam yang ideal.",
      low: "Tanaman cepat kehilangan cairan. Siram rutin pada pagi/sore hari.",
    },
  },
  {
    id: "soil",
    icon: Sprout,
    title: "Kelembapan Tanah",
    ideal: { min: 60, max: 80, unit: "%" },
    color: {
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
      bar: "bg-emerald-400",
    },
    description:
      "Ketersediaan air di zona akar adalah kunci utama penyerapan nutrisi tanaman.",
    recommendations: {
      high: "Risiko busuk akar. Pastikan sistem drainase lahan berfungsi dengan baik.",
      low: "Tanaman layu & pertumbuhan kerdil. Segera lakukan penyiraman.",
    },
  },
  {
    id: "wind",
    icon: Wind,
    title: "Kecepatan Angin",
    ideal: { min: 5, max: 15, unit: " km/h" },
    color: { text: "text-blue-400", bg: "bg-blue-400/10", bar: "bg-blue-400" },
    description:
      "Penting untuk penyerbukan, mengurangi jamur, dan memperkuat struktur tanaman.",
    recommendations: {
      high: "Risiko kerusakan fisik & dehidrasi. Pasang jaring pemecah angin.",
      low: "Sirkulasi buruk memicu jamur. Atur jarak tanam agar tidak terlalu rapat.",
    },
  },
];

const InteractiveRange = ({ ideal, color }) => (
  <div className="group w-full text-center">
    <p className={`font-semibold mb-2 ${color.text}`}>Rentang Ideal</p>
    <div className="relative flex items-center justify-between bg-gray-100 p-2 rounded-lg">
      <span className="font-bold text-gray-800 text-lg">
        {ideal.min}
        {ideal.unit}
      </span>
      <div className="relative w-full h-1 mx-4 bg-gray-300 rounded-full overflow-hidden">
        <div className={`absolute h-full ${color.bar} opacity-50 w-full`}></div>
        <div className="absolute h-full w-2 bg-white rounded-full shadow-md transform -translate-x-1/2 transition-all duration-500 ease-out group-hover:left-full left-0"></div>
      </div>
      <span className="font-bold text-gray-800 text-lg">
        {ideal.max}
        {ideal.unit}
      </span>
    </div>
  </div>
);

const ParameterCard = ({ param, isCurrent }) => (
  <div
    className={`w-full h-full p-6 flex flex-col transition-opacity duration-300 ${
      isCurrent
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="flex flex-col items-center mb-4">
      <div className={`mb-2 p-3 rounded-xl ${param.color.bg}`}>
        <param.icon className={`w-8 h-8 ${param.color.text}`} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 text-center">
        {param.title}
      </h3>
    </div>
    <InteractiveRange ideal={param.ideal} color={param.color} />
    <p className="text-sm text-gray-600 my-4 flex-grow text-center">
      {param.description}
    </p>
    <div className="text-xs space-y-2 bg-gray-50 p-3 rounded-lg">
      <p>
        <strong className="text-red-400">Jika Tinggi:</strong>{" "}
        {param.recommendations.high}
      </p>
      <p>
        <strong className="text-blue-400">Jika Rendah:</strong>{" "}
        {param.recommendations.low}
      </p>
    </div>
  </div>
);

export default function GalleryGuidePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dragRef = useRef({ startX: 0, isDragging: false });

  const goToNext = () =>
    setCurrentIndex((prev) => (prev + 1) % parameters.length);
  const goToPrevious = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + parameters.length) % parameters.length
    );

  const handleDragStart = (e) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleDragEnd = (e) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const dragOffset = endX - dragRef.current.startX;
    const threshold = 50; // Jarak minimum geser dalam pixel

    if (dragOffset > threshold) {
      goToPrevious();
    } else if (dragOffset < -threshold) {
      goToNext();
    }
  };

  const getCardStyle = (index) => {
    const offset = index - currentIndex;
    const zIndex = parameters.length - Math.abs(offset);
    const translateX = offset * 50;
    const scale = 1 - Math.abs(offset) * 0.15;
    const rotateY = offset * -25;
    const opacity = Math.abs(offset) > 1 ? 0 : 1 - Math.abs(offset) * 0.4;

    // Sembunyikan kartu yang terlalu jauh untuk performa
    if (Math.abs(offset) > 2) {
      return {
        opacity: 0,
        transform: `translateX(${translateX > 0 ? 150 : -150}%) scale(0.5)`,
      };
    }

    return {
      transform: `translateX(${translateX}%) perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
    };
  };

  return (
    <Layout title="Panduan Interaktif">
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-none overflow-hidden">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-600 mb-2">
            Panduan Parameter Sensor
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Geser, klik, atau gunakan tombol untuk menjelajahi setiap parameter.
          </p>
        </div>

        <div
          className="relative w-full h-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          {parameters.map((param, index) => (
            <div
              key={param.id}
              className="absolute w-[320px] h-[420px] bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-500 ease-out"
              style={getCardStyle(index)}
              onClick={() => {
                if (index !== currentIndex) setCurrentIndex(index);
              }}
            >
              <ParameterCard param={param} isCurrent={currentIndex === index} />
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-6 mt-8">
          <button
            onClick={goToPrevious}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            {parameters.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index
                    ? "bg-sky-500 scale-125"
                    : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
          <button
            onClick={goToNext}
            className="p-3 rounded-full bg-white shadow-md hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
