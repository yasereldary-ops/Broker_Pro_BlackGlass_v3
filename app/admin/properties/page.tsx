"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error("Error loading properties:", err);
      }
    }
    load();
  }, []);

  // Card style (important: not on motion.section)
  const tableCard: React.CSSProperties = {
    borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 0 20px rgba(0,0,0,0.35)",
    padding: 20,
    overflowX: "auto",
  };

  return (
    <main style={{ padding: 30 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
        Properties List
      </h1>

      {/* FIX: wrap motion.section inside a styled div */}
      <div style={tableCard}>
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Developer</th>
                <th style={th}>Price</th>
                <th style={th}>Commission</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((p: any) => (
                <tr key={p.id}>
                  <td style={td}>{p.name}</td>
                  <td style={td}>{p.developer}</td>
                  <td style={td}>EGP {p.price.toLocaleString()}</td>
                  <td style={td}>{(p.commission * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.section>
      </div>
    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 10px",
  fontWeight: 700,
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  color: "#cfe8ff",
};

const td: React.CSSProperties = {
  padding: "10px 10px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  color: "#e5f0ff",
};
