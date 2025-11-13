"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

type Client = {
  id: number;
  name: string;
  phone: string;
  email?: string;
  sales: {
    id: number;
    amount: number;
    property: { name: string };
    commission?: { amount: number };
    date: string;
  }[];
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/clients");
      const json = await res.json();
      if (json.success) setClients(json.data);
      setLoading(false);
    })();
  }, []);

  const filteredClients = useMemo(() => {
    if (!filter) return clients;
    return clients.filter((c) =>
      c.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, clients]);

  if (loading) return <div style={{ padding: 40 }}>Loading clients...</div>;

  // KPIs
  const totalClients = clients.length;
  const totalSales = clients.reduce(
    (sum, c) => sum + c.sales.reduce((s, x) => s + x.amount, 0),
    0
  );
  const topClient = clients.sort(
    (a, b) =>
      b.sales.reduce((s, x) => s + x.amount, 0) -
      a.sales.reduce((s, x) => s + x.amount, 0)
  )[0];

  return (
    <div style={root}>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={main}
      >
        <header style={header}>
          <div>
            <h1 style={title}>👥 Clients Overview</h1>
            <p style={subtitle}>Client list · Sales · Commissions</p>
          </div>
          <input
            placeholder="Search by client name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={search}
          />
        </header>

        {/* KPIs */}
        <section style={grid}>
          <Kpi label="Total Clients" value={totalClients.toString()} accent="#60a5fa" />
          <Kpi label="Total Sales" value={`EGP ${totalSales.toLocaleString()}`} accent="#10b981" />
          <Kpi
            label="Top Client"
            value={topClient ? topClient.name : "—"}
            accent="#facc15"
          />
        </section>

        {/* Table */}
        <motion.section
          style={tableCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <table style={table}>
            <thead style={thead}>
              <tr>
                <th style={th}>#</th>
                <th style={th}>Name</th>
                <th style={th}>Phone</th>
                <th style={th}>Email</th>
                <th style={th}>Total Sales</th>
                <th style={th}>Deals</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => {
                const total = c.sales.reduce((s, x) => s + x.amount, 0);
                return (
                  <tr key={c.id}>
                    <td style={tableCell}>{c.id}</td>
                    <td style={tableCell}>{c.name}</td>
                    <td style={tableCell}>{c.phone}</td>
                    <td style={tableCell}>{c.email || "—"}</td>
                    <td style={{ ...tableCell, textAlign: "right", fontWeight: 600 }}>
                      EGP {total.toLocaleString()}
                    </td>
                    <td style={{ ...tableCell, textAlign: "center" }}>
                      {c.sales.length}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.section>
      </motion.main>
    </div>
  );
}

/* KPI Card */
function Kpi({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 200 }} style={card}>
      <div style={{ fontSize: 13, opacity: 0.75 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8, color: accent }}>{value}</div>
    </motion.div>
  );
}

/* Styles */
const root = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top left, #071428, #02040a 60%, #000)",
  color: "#e6eef8",
  fontFamily: "Inter, system-ui, sans-serif",
};
const main = { width: "min(1200px, calc(100% - 40px))", margin: "0 auto", padding: "100px 0 80px" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 };
const title = { fontSize: 26, fontWeight: 800 };
const subtitle = { opacity: 0.7, fontSize: 14 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 18, marginBottom: 26 };
const card = {
  padding: 18,
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
  backdropFilter: "blur(6px)",
};
const tableCard = {
  borderRadius: 14,
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
  padding: 16,
  overflowX: "auto",
};
const table = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#e6eef8",
  fontSize: 14,
  tableLayout: "fixed" as const,
};
const thead = { borderBottom: "1px solid rgba(255,255,255,0.08)" };
const th = {
  padding: "10px 14px",
  fontWeight: 700,
  color: "#bcd2f5",
  textAlign: "left" as const,
};
const tableCell = {
  padding: "10px 14px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  verticalAlign: "middle",
};
const search = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#e6eef8",
  padding: "8px 12px",
  fontSize: 13,
  outline: "none",
  width: 260,
};
