"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/reports");
      const json = await res.json();
      if (json.success) setReport(json.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading reports...</div>;
  if (!report) return <div style={{ padding: 40 }}>No report data found.</div>;

  return (
    <div style={root}>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={main}
      >
        <header style={header}>
          <h1 style={title}>📊 Financial Reports</h1>
          <p style={subtitle}>Monthly Analysis — Sales · Expenses · Net Profit</p>
        </header>

        {/* KPIs */}
        <section style={grid}>
          <Kpi label="Total Sales (YTD)" value={`EGP ${report.totalSales.toLocaleString()}`} accent="#60a5fa" />
          <Kpi label="Total Expenses (YTD)" value={`EGP ${report.totalExpenses.toLocaleString()}`} accent="#f59e0b" />
          <Kpi label="Net Profit (YTD)" value={`EGP ${report.netProfit.toLocaleString()}`} accent="#10b981" />
        </section>

        {/* Chart 1 */}
        <motion.section
          style={chartCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 style={chartTitle}>📈 Monthly Sales vs Expenses</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={report.monthly}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,25,35,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.section>

        {/* Chart 2 */}
        <motion.section
          style={chartCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 style={chartTitle}>💸 Net Profit by Month</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={report.monthly}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,25,35,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
const chartCard = {
  marginTop: 30,
  padding: 20,
  borderRadius: 14,
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
};
const chartTitle = { marginBottom: 14, fontWeight: 700, fontSize: 16 };
