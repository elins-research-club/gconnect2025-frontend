// src/components/common/Footer.js

const Footer = () => {
  return (
    <footer className="bg-background-card p-4 text-center text-text-dark text-sm border-t border-background-border mt-auto animate-fadeIn">
      <p>
        &copy; {new Date().getFullYear()} Environmental Monitoring Dashboard.
        All rights reserved.
      </p>
      <p>
        Powered by{" "}
        <span className="text-primary font-semibold">Smart IoT Solutions</span>
      </p>
    </footer>
  );
};

export default Footer;
