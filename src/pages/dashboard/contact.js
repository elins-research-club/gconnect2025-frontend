// src/pages/dashboard/contact.js
import Layout from "../../components/common/Layout";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <Layout title="Kontak Support">
      <h1 className="text-3xl font-bold mb-8 text-gray-600 text-center">
        Hubungi Customer Support
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">
            Informasi Kontak
          </h2>
          <div className="space-y-4 text-gray-600">
            <p className="flex items-center text-lg">
              <Mail className="mr-3 w-6 h-6 text-sky-300" />{" "}
              erc.elinsugm@gmail.com
            </p>
            <p className="flex items-center text-lg">
              <Phone className="mr-3 w-6 h-6 text-sky-300" /> +62 811-1602-901
              (Jesslyne)
            </p>
            <p className="flex items-center text-lg">
              <MapPin className="mr-3 w-10 h-10 text-sky-300" /> Gedung C,
              Lantai 4, Sekip Utara, Bulaksumur, Sendowo, Sinduadi, Kec. Mlati,
              Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">
            Lokasi Kami
          </h2>
          <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d831.0600830504861!2d110.37603005342164!3d-7.767514751490117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59ac8a96315d%3A0xe45ba13d2276b7d4!2sLaboratorium%20Riset%20Elektronika%20dan%20Instrumentasi%20(Lab%20Elins)%20Departemen%20Ilmu%20Komputer%20dan%20Elektronika%2C%20FMIPA%20UGM!5e0!3m2!1sid!2sid!4v1755657726775!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
}
