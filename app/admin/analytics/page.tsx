"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type UserAnalytics = {
  name: string;
  role: string;
  totalSales: number;
  totalCommission: number;
  deals: number;
};

export default function TeamAnalytics() {
  const [data, setData] = useState<UserAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/analytics");
      const json = await res.json();
      if (json.success) setData(json.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading analytics...</div>;

  const COLORS = ["#60a5fa", "#10b981", "#facc15", "#f97316", "#a855f7"];

  return (
    <div style={root}>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={main}
      >
        <h1 style={title}>📈 Team Analytics Dashboard</h1>
        <p style={subtitle}>Compare team leaders & consultants performance visually</p>

        {/* KPIs */}
        <section style={grid}>
          <Kpi
            label="Total Company Sales"
            value={`EGP ${data.reduce((s, x) => s + x.totalSales, 0).toLocaleString()}`}
            accent="#60a5fa"
          />
          <Kpi
            label="Total Commissions"
            value={`EGP ${data.reduce((s, x) => s + x.totalCommission, 0).toLocaleString()}`}
            accent="#10b981"
          />
          <Kpi
            label="Total Deals"
            value={data.reduce((s, x) => s + x.deals, 0).toString()}
            accent="#facc15"
          />
        </section>

        {/* Chart 1 - Sales by Team */}
        <motion.section style={chartCard}>
          <h3 style={chartTitle}>💼 Total Sales by Member</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,25,35,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar dataKey="totalSales" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.section>

        {/* Chart 2 - Commission Line */}
        <motion.section style={chartCard}>
          <h3 style={chartTitle}>💰 Commissions Trend</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,25,35,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalCommission"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.section>

        {/* Chart 3 - Deals Distribution */}
        <motion.section style={chartCard}>
          <h3 style={chartTitle}>📊 Deals Distribution</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                dataKey="deals"
                nameKey="name"
                outerRadius={120}
                label
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(20,25,35,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </PieChart>
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
const title = { fontSize: 26, fontWeight: 800 };
const subtitle = { opacity: 0.7, fontSize: 14, marginBottom: 20 };
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
