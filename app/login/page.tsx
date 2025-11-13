"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // لو المستخدم بالفعل داخل، رجعه عالداشبورد
  useEffect(() => {
    if (localStorage.getItem("auth") === "true") {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validEmail = "admin@brokerpro.com";
    const validPassword = "123456";

    if (email === validEmail && password === validPassword) {
      localStorage.setItem("auth", "true");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#03050b,#070e1a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e6eef8",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "40px 50px",
          borderRadius: 12,
          boxShadow: "0 0 25px rgba(0,0,0,0.4)",
          width: 350,
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 22, marginBottom: 20 }}>
          🔐 Broker Pro BlackGlass Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "#e6eef8",
          }}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "#e6eef8",
          }}
          required
        />

        {error && (
          <p style={{ color: "#ff4c4c", marginBottom: 15, fontSize: 14 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            background: "#007bff",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
