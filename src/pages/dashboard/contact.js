// src/pages/dashboard/contact.js
import Layout from "../../components/common/Layout";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(""); // 'success', 'error', ''

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionStatus("");
    // Dummy submission logic
    console.log("Contact form submitted:", { name, email, subject, message });

    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // 90% success rate dummy
        setSubmissionStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setSubmissionStatus("error");
      }
    }, 1000);

    // Di sini Anda akan memanggil API backend untuk mengirim pesan
  };

  return (
    <Layout title="Kontak Support">
      <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-text-light border-b-2 border-primary pb-4 animate-fadeInUp">
        Hubungi Customer Support
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Form */}
        <div className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border animate-fadeInUp">
          <h2 className="text-2xl font-semibold mb-6 text-text-light border-b border-background-border pb-3">
            Kirim Pesan
          </h2>
          {submissionStatus === "success" && (
            <div className="bg-success/20 text-success p-4 rounded-lg mb-4 border animate-pulse">
              Pesan Anda berhasil terkirim! Kami akan segera menghubungi Anda.
            </div>
          )}
          {submissionStatus === "error" && (
            <div className="bg-error/20 text-error p-4 rounded-lg mb-4 border animate-pulse">
              Gagal mengirim pesan. Mohon coba lagi nanti.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-text text-sm font-medium mb-2"
              >
                Nama Anda
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 rounded-md bg-background-hover border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-text text-sm font-medium mb-2"
              >
                Email Anda
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 rounded-md bg-background-hover border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-text text-sm font-medium mb-2"
              >
                Subjek
              </label>
              <input
                type="text"
                id="subject"
                className="w-full p-3 rounded-md bg-background-hover border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block text-text text-sm font-medium mb-2"
              >
                Pesan Anda
              </label>
              <textarea
                id="message"
                rows="5"
                className="w-full p-3 rounded-md bg-background-hover border border-background-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-text-light font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md flex items-center"
            >
              <Send className="mr-2 w-5 h-5" /> Kirim Pesan
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-background-card p-6 rounded-lg shadow-xl border border-background-border animate-fadeInUp">
          <h2 className="text-2xl font-semibold mb-6 text-text-light border-b border-background-border pb-3">
            Informasi Kontak
          </h2>
          <div className="space-y-4 text-text">
            <p className="flex items-center text-lg">
              <Mail className="mr-3 text-primary" /> support@gconnect.com
            </p>
            <p className="flex items-center text-lg">
              <Phone className="mr-3 text-primary" /> +62 812 3456 7890
            </p>
            <p className="flex items-center text-lg">
              <MapPin className="mr-3 text-primary" /> Jl. Teknologi Inovasi No.
              1, Bandung, Indonesia
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-text-light">
              Jam Operasional
            </h3>
            <ul className="text-text space-y-2">
              <li>Senin - Jumat: 09:00 - 17:00 WIB</li>
              <li>Sabtu: 09:00 - 12:00 WIB</li>
              <li>Minggu: Tutup</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
