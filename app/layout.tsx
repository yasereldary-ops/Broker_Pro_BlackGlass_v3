"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css";

export const dynamic = "force-dynamic";

// Pages
const navLinks = [
  { name: "🏠 Dashboard", href: "/dashboard", color: "#3b82f6" },
  { name: "💼 Sales", href: "/admin/sales", color: "#22c55e" },
  { name: "👥 Clients", href: "/admin/clients", color: "#a855f7" },
  { name: "🏢 Properties", href: "/admin/properties", color: "#f59e0b" },
  { name: "⚙️ Settings", href: "/admin/settings", color: "#f43f5e" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(3);

  // Theme persistence
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    router.push("/login");
  };

  return (
    <html lang="en">
      <body style={body}>
        {/* NAVBAR */}
        <motion.nav
          style={{
            ...nav,
            background:
              theme === "dark"
                ? "rgba(8,12,18,0.6)"
                : "rgba(255,255,255,0.25)",
            border: theme === "dark"
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.15)",
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring" }}
            style={{
              ...logo,
              color: theme === "dark" ? "#8ecaff" : "#0f172a",
            }}
          >
            Broker Pro
          </motion.div>

          {/* Links */}
          <div style={links}>
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 250, damping: 14 }}
                  style={{ position: "relative" }}
                >
                  <Link
                    href={link.href}
                    style={{
                      ...linkStyle,
                      color:
                        active && theme === "dark"
                          ? "#fff"
                          : active && theme === "light"
                          ? "#0f172a"
                          : theme === "dark"
                          ? "#cde5ff"
                          : "#1e293b",
                    }}
                  >
                    {link.name}
                  </Link>
                  {active && (
                    <motion.div
                      layoutId="underline"
                      style={{
                        ...underline,
                        background: link.color,
                        boxShadow: `0 0 8px ${link.color}`,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={actions}>
            {/* Notifications */}
            <div style={{ position: "relative", cursor: "pointer" }}>
              <span style={bell}>🔔</span>
              {notifications > 0 && (
                <motion.span
                  style={notifBadge}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                >
                  {notifications}
                </motion.span>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
              style={themeBtn}
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.1 }}
              style={logoutBtn}
            >
              🚪
            </motion.button>
          </div>
        </motion.nav>

        {/* MAIN CONTENT */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ marginTop: 90 }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </body>
    </html>
  );
}

/* STYLES */
const body: React.CSSProperties = {
  margin: 0,
  background: "radial-gradient(circle at top left, #071428, #02040a 60%, #000)",
  fontFamily: "Inter, system-ui, sans-serif",
  minHeight: "100vh",
  transition: "0.4s ease",
};

const nav: React.CSSProperties = {
  position: "fixed",
  top: 20,
  left: 20,
  width: "calc(100% - 40px)",
  maxWidth: "100%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 30,
  borderRadius: 14,
  padding: "12px 24px",
  background: "rgba(10,15,25,0.6)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  backdropFilter: "blur(14px)",
  zIndex: 100,
};

const logo: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: 0.3,
  textShadow: "0 0 12px rgba(100,180,255,0.4)",
  cursor: "pointer",
};

const links: React.CSSProperties = {
  display: "flex",
  gap: 18,
  alignItems: "center",
};

const linkStyle: React.CSSProperties = {
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
  padding: "8px 12px",
  borderRadius: 10,
  transition: "all 0.25s ease",
  position: "relative",
};

const underline: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: "10%",
  width: "80%",
  height: 2,
  borderRadius: 999,
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
};

const bell: React.CSSProperties = {
  fontSize: 18,
  opacity: 0.9,
};

const notifBadge: React.CSSProperties = {
  position: "absolute",
  top: -6,
  right: -6,
  background: "#ef4444",
  color: "#fff",
  fontSize: 10,
  borderRadius: "50%",
  padding: "2px 6px",
  fontWeight: 700,
  boxShadow: "0 0 8px rgba(255,0,0,0.6)",
};

const themeBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 20,
};

const logoutBtn: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.08)",
  color: "#ff4c4c",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: 600,
  transition: "0.3s",
};
