// src/components/common/Layout.js
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer"; // IMPORT FOOTER INI
import Head from "next/head";

const Layout = ({ children, title = "Environmental Dashboard" }) => {
  return (
    <div className="flex min-h-screen bg-background text-text font-sans">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {" "}
        {/* Pastikan ini 'flex-col' untuk menumpuk header, main, dan footer */}
        <Header />
        <main className="flex-1 p-6 lg:p-10 animate-fadeIn">{children}</main>
        <Footer /> {/* TAMBAHKAN FOOTER DI SINI */}
      </div>
    </div>
  );
};

export default Layout;
