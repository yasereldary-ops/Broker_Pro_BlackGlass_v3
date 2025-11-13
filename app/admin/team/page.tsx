"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

type User = {
  id: number;
  name: string;
  role: string;
  sales: {
    id: number;
    amount: number;
    commission?: { amount: number };
  }[];
};

export default function TeamPerformance() {
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/team");
      const json = await res.json();
      if (json.success) setTeam(json.data);
      setLoading(false);
    })();
  }, []);

  const ranking = useMemo(() => {
    return [...team].sort((a, b) => {
      const aSales = a.sales.reduce((s, x) => s + x.amount, 0);
      const bSales = b.sales.reduce((s, x) => s + x.amount, 0);
      return bSales - aSales;
    });
  }, [team]);

  if (loading) return <div style={{ padding: 40 }}>Loading team performance...</div>;

  const totalSales = ranking.reduce(
    (sum, u) => sum + u.sales.reduce((s, x) => s + x.amount, 0),
    0
  );
  const totalCommissions = ranking.reduce(
    (sum, u) => sum + u.sales.reduce((s, x) => s + (x.commission?.amount || 0), 0),
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
          <h1 style={title}>👥 Team Performance</h1>
          <p style={subtitle}>Quarterly rankings — sales · commissions · targets</p>
        </header>

        {/* KPIs */}
        <section style={grid}>
          <Kpi label="Total Team Sales" value={`EGP ${totalSales.toLocaleString()}`} accent="#60a5fa" />
          <Kpi label="Total Commissions" value={`EGP ${totalCommissions.toLocaleString()}`} accent="#10b981" />
          <Kpi label="Active Members" value={team.length.toString()} accent="#facc15" />
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
                <th style={th}>Rank</th>
                <th style={th}>Name</th>
                <th style={th}>Role</th>
                <th style={{ ...th, textAlign: "right" }}>Total Sales</th>
                <th style={{ ...th, textAlign: "right" }}>Commission</th>
                <th style={{ ...th, textAlign: "center" }}>Deals</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((u, i) => {
                const totalSales = u.sales.reduce((s, x) => s + x.amount, 0);
                const totalCommission = u.sales.reduce(
                  (s, x) => s + (x.commission?.amount || 0),
                  0
                );
                return (
                  <tr key={u.id}>
                    <td style={tableCell}>{i + 1}</td>
                    <td style={tableCell}>{u.name}</td>
                    <td style={tableCell}>{u.role}</td>
                    <td style={{ ...tableCell, textAlign: "right", fontWeight: 600 }}>
                      EGP {totalSales.toLocaleString()}
                    </td>
                    <td style={{ ...tableCell, textAlign: "right", fontWeight: 600 }}>
                      EGP {totalCommission.toLocaleString()}
                    </td>
                    <td style={{ ...tableCell, textAlign: "center" }}>{u.sales.length}</td>
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
const header = { marginBottom: 24 };
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
