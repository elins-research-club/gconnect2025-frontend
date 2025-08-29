// src/components/common/Footer.js

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
          <div className="flex items-center space-x-4">
            {/* Contoh penggunaan tag <img> untuk logo */}
            <img
              src="/img/Logo-DIKE.png"
              alt="Logo DIKE"
              className="w-10 h-10 rounded-lg object-contain bg-gray-500"
            />
            <img
              src="/img/Logo-ERC.png"
              alt="Logo ERC"
              className="w-10 h-10 rounded-lg object-contain bg-gray-500"
            />
            <img
              src="/img/Logo-UGM.png"
              alt="Logo UGM"
              className="w-10 h-10 rounded-lg object-contain bg-gray-500"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
