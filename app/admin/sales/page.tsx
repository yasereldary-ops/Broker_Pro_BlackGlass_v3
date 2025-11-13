// app/admin/sales/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

type Sale = {
  id: number;
  amount: number;
  date: string;
  user: { name: string; role: string };
  client: { name: string; phone: string };
  property: { name: string; developer: string; price: number };
  commission: { rate: number; amount: number } | null;
};

type Kpis = {
  totalSales: number;
  totalCommission: number;
  dealsCount: number;
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/sales");
      const json = await res.json();
      if (json.success) {
        setSales(json.data);
        setKpis(json.kpis);
      }
      setLoading(false);
    })();
  }, []);

  const filteredSales = useMemo(() => {
    if (!filter) return sales;
    return sales.filter(
      (s) =>
        s.user.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.client.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.property.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, sales]);

  if (loading) return <div style={{ padding: 40 }}>Loading sales data...</div>;

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
            <h1 style={title}>💼 Sales Overview</h1>
            <p style={subtitle}>All transactions · Clients · Properties · Team</p>
          </div>
          <input
            placeholder="Search by name, property, or client..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={search}
          />
        </header>

        {kpis && (
          <section style={grid}>
            <Kpi label="Total Sales" value={`EGP ${kpis.totalSales.toLocaleString()}`} accent="#60a5fa" />
            <Kpi label="Total Commission" value={`EGP ${kpis.totalCommission.toLocaleString()}`} accent="#10b981" />
            <Kpi label="Deals Count" value={kpis.dealsCount.toString()} accent="#facc15" />
          </section>
        )}

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
                <th style={th}>Consultant</th>
                <th style={th}>Client</th>
                <th style={th}>Property</th>
                <th style={{ ...th, textAlign: "right" }}>Amount</th>
                <th style={{ ...th, textAlign: "right" }}>Commission</th>
                <th style={th}>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredSales.map((s) => (
                <tr key={s.id}>
                  <td style={tableCell}>{s.id}</td>
                  <td style={tableCell}>{s.user.name}</td>
                  <td style={tableCell}>{s.client.name}</td>
                  <td style={tableCell}>{s.property.name}</td>

                  <td style={{ ...tableCell, textAlign: "right", fontWeight: 600 }}>
                    EGP {s.amount.toLocaleString()}
                  </td>

                  <td
                    style={{
                      ...tableCell,
                      textAlign: "right",
                      fontWeight: 600,
                      letterSpacing: 0.3,
                    }}
                  >
                    EGP {s.commission?.amount.toLocaleString()}{" "}
                    <span
                      style={{
                        color: "#9db9de",
                        marginLeft: 6,
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      ({(s.commission?.rate * 100).toFixed(2)}%)
                    </span>
                  </td>

                  <td style={tableCell}>{new Date(s.date).toLocaleDateString()}</td>
                </tr>
              ))}

              {kpis && (
                <tr
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    fontWeight: 800,
                  }}
                >
                  <td style={tableCell}>—</td>
                  <td style={tableCell}>TOTAL</td>
                  <td style={tableCell}></td>
                  <td style={tableCell}></td>
                  <td style={{ ...tableCell, textAlign: "right" }}>
                    EGP {kpis.totalSales.toLocaleString()}
                  </td>
                  <td style={{ ...tableCell, textAlign: "right" }}>
                    EGP {kpis.totalCommission.toLocaleString()}
                  </td>
                  <td style={tableCell}></td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.section>
      </motion.main>
    </div>
  );
}

/* KPI card */
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
const th = {
  padding: "10px 14px",
  fontWeight: 700,
  color: "#bcd2f5",
  textAlign: "left" as const,
};
const thead = {
  borderBottom: "1px solid rgba(255,255,255,0.08)",
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
