// src/components/common/Footer.js
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 mt-16 bg-gradient-to-t ">
      {/* Garis minimalis di atas */}
      <div className="w-1/6 h-px bg-gray-400 mx-auto mb-8"></div>

      <div className="max-w-7xl mx-auto overflow-hidden">
        {/* Konten utama footer: teks di kiri, logo di kanan */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Bagian teks dan copyright (rata kiri) */}
          <div className="text-left text-gray-600">
            <p className="text-sm">
              &copy; {currentYear} PkM Lab Dashboard. All rights reserved.
            </p>
            <p className="mt-2 text-xs">
              Powered by{" "}
              <span className="text-black font-semibold transition-colors duration-300">
                Web Development ERC UGM
              </span>
            </p>
          </div>

          {/* Bagian logo (rata kanan) */}
          <div className="flex items-center space-x-3 pt-3">
            <div className="transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:-rotate-12 cursor-pointer">
              <Image
                src="/img/Logo-UGM.png"
                alt="Logo UGM"
                width={50}
                height={50}
                className="rounded-xl object-contain bg-gray-100 border border-gray-400"
              />
            </div>
            <div className="transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:-rotate-12 cursor-pointer">
              <Image
                src="/img/Logo-DIKE.png"
                alt="Logo DIKE"
                width={50}
                height={50}
                className="rounded-xl object-contain bg-gray-100 border border-gray-400"
              />
            </div>
            <div className="transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:-rotate-12 cursor-pointer">
              <Image
                src="/img/Logo-LabSKJ.png"
                alt="Logo Lab SKJ"
                width={50}
                height={50}
                className="rounded-xl object-contain bg-gray-100 border border-gray-400"
              />
            </div>
            <div className="transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:-rotate-12 cursor-pointer">
              <Image
                src="/img/logo-Labelins.png"
                alt="Logo Lab Elins"
                width={50}
                height={50}
                className="rounded-xl object-contain bg-gray-100 border border-gray-400"
              />
            </div>
            <div className="transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:-rotate-12 cursor-pointer">
              <Image
                src="/img/Logo-ERC.png"
                alt="Logo ERC"
                width={50}
                height={50}
                className="rounded-xl object-contain bg-gray-100 border border-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
