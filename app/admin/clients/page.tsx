"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  // 🎨 ستايل الكارد (ممنوع نحطه على motion.section)
  const tableCard: React.CSSProperties = {
    borderRadius: 12,
    background: "#0d0d0d",
    border: "1px solid #222",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    padding: 20,
    overflowX: "auto",
  };

  return (
    <main style={{ padding: 30 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: 20 }}>
        Clients List
      </h1>

      {/* ✔️ نحط الستايل على div مش motion */}
      <div style={tableCard}>
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 10 }}>Name</th>
                <th style={{ textAlign: "left", padding: 10 }}>Phone</th>
                <th style={{ textAlign: "left", padding: 10 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((c: any) => (
                <tr key={c.id}>
                  <td style={{ padding: 10 }}>{c.name}</td>
                  <td style={{ padding: 10 }}>{c.phone}</td>
                  <td style={{ padding: 10 }}>
                    <Link
                      href={`/admin/clients/${c.id}`}
                      style={{ color: "#00bfff" }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.section>
      </div>
    </main>
  );
}
