// src/pages/_app.js
import { SensorProvider } from "../context/SensorContext";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SensorProvider>
        <Component {...pageProps} />
      </SensorProvider>
    </AuthProvider>
  );
}
