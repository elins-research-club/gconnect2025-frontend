// src/pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Arahkan ke halaman login secara default
    router.push("/auth/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <p className="text-gray-700 dark:text-gray-300">
        Mengalihkan ke halaman login...
      </p>
    </div>
  );
}
