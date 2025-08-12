// src/components/common/Header.js
import { Search } from "lucide-react"; // Import Search icon

const Header = () => {
  return (
    // Tambahkan 'backdrop-blur-sm' dan ubah background menjadi rgba untuk efek blur yang terlihat
    <header className="bg-background-card/80 backdrop-blur-md shadow-lg p-4 flex justify-between items-center z-10 sticky top-0 border-b border-background-border ">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="p-2 pl-10 rounded-full border border-background-border bg-background-hover text-text focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-all duration-200"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-dark w-5 h-5" />
      </div>
    </header>
  );
};

export default Header;
