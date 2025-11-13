"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <main
      style={{
        background:
          "radial-gradient(circle at center, #0b1a2b, #050b14 80%)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#9db4d8",
        fontFamily: "Inter, sans-serif",
        fontSize: "1.2rem",
        letterSpacing: "0.5px",
      }}
    >
      🚀 Redirecting to Broker Pro Dashboard...
    </main>
  );
}
