"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

type Property = {
  id: number;
  name: string;
  developer: string;
  price: number;
  commission: number;
  sales: {
    id: number;
    amount: number;
    commission?: { amount: number };
    client: { name: string };
    date: string;
  }[];
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/properties");
      const json = await res.json();
      if (json.success) setProperties(json.data);
      setLoading(false);
    })();
  }, []);

  const filteredProps = useMemo(() => {
    if (!filter) return properties;
    return properties.filter((p) =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, properties]);

  if (loading) return <div style={{ padding: 40 }}>Loading properties...</div>;

  // KPIs
  const totalProps = properties.length;
  const totalSales = properties.reduce(
    (sum, p) => sum + p.sales.reduce((s, x) => s + x.amount, 0),
    0
  );
  const totalCommission = properties.reduce(
    (sum, p) =>
      sum + p.sales.reduce((s, x) => s + (x.commission?.amount || 0), 0),
    0
  );

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
            <h1 style={title}>🏠 Properties Overview</h1>
            <p style={subtitle}>All projects · Developers · Sales performance</p>
          </div>
          <input
            placeholder="Search by property name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={search}
          />
        </header>

        {/* KPIs */}
        <section style={grid}>
          <Kpi label="Total Properties" value={totalProps.toString()} accent="#60a5fa" />
          <Kpi label="Total Sales Volume" value={`EGP ${totalSales.toLocaleString()}`} accent="#10b981" />
          <Kpi label="Total Commissions" value={`EGP ${totalCommission.toLocaleString()}`} accent="#facc15" />
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
                <th style={th}>Project</th>
                <th style={th}>Developer</th>
                <th style={{ ...th, textAlign: "right" }}>Base Price</th>
                <th style={{ ...th, textAlign: "right" }}>Commission %</th>
                <th style={{ ...th, textAlign: "right" }}>Total Sales</th>
                <th style={{ ...th, textAlign: "right" }}>Total Commission</th>
                <th style={th}>Deals</th>
              </tr>
            </thead>

            <tbody>
              {filteredProps.map((p) => {
                const salesSum = p.sales.reduce((s, x) => s + x.amount, 0);
                const commSum = p.sales.reduce(
                  (s, x) => s + (x.commission?.amount || 0),
                  0
                );
                return (
                  <tr key={p.id}>
                    <td style={tableCell}>{p.id}</td>
                    <td style={tableCell}>{p.name}</td>
                    <td style={tableCell}>{p.developer}</td>
                    <td style={{ ...tableCell, textAlign: "right" }}>
                      EGP {p.price.toLocaleString()}
                    </td>
                    <td style={{ ...tableCell, textAlign: "right" }}>
                      {(p.commission * 100).toFixed(2)}%
                    </td>
                    <td
                      style={{
                        ...tableCell,
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      EGP {salesSum.toLocaleString()}
                    </td>
                    <td
                      style={{
                        ...tableCell,
                        textAlign: "right",
                        fontWeight: 600,
                      }}
                    >
                      EGP {commSum.toLocaleString()}
                    </td>
                    <td style={{ ...tableCell, textAlign: "center" }}>
                      {p.sales.length}
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
