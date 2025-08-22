// src/components/common/Footer.js

const Footer = () => {
  return (
    <footer className="bg-background-card p-4 text-center text-text-dark text-sm border-t border-background-border mt-auto ">
      <p>
        &copy; {new Date().getFullYear()} PkM Lab Dashboard. All rights
        reserved.
      </p>
      <p>
        Powered by{" "}
        <span className="text-primary font-semibold">
          Web Development ERC UGM
        </span>
      </p>
    </footer>
  );
};

export default Footer;
