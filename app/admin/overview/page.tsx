"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminOverview() {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/overview");
      const json = await res.json();
      if (json.success) setOverview(json.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading admin dashboard...</div>;

  return (
    <div style={root}>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={main}
      >
        <header style={header}>
          <h1 style={title}>🧭 Admin Overview Portal</h1>
          <p style={subtitle}>Company-wide insights — sales, profit, team, and growth</p>
        </header>

        {/* KPIs Summary */}
        <section style={grid}>
          <Kpi label="Total Sales" value={`EGP ${overview.totalSales.toLocaleString()}`} accent="#60a5fa" />
          <Kpi label="Total Commission" value={`EGP ${overview.totalCommission.toLocaleString()}`} accent="#10b981" />
          <Kpi label="Total Clients" value={overview.totalClients} accent="#facc15" />
          <Kpi label="Active Team" value={overview.activeTeam} accent="#a855f7" />
          <Kpi label="Net Profit" value={`EGP ${overview.netProfit.toLocaleString()}`} accent="#ef4444" />
        </section>

        {/* Quick Links */}
        <section style={linksGrid}>
          {[
            { name: "💼 Sales Reports", href: "/admin/sales" },
            { name: "👥 Clients List", href: "/admin/clients" },
            { name: "🏢 Properties", href: "/admin/properties" },
            { name: "👨‍💼 Team Performance", href: "/admin/team" },
            { name: "📊 Analytics", href: "/admin/analytics" },
          ].map((link, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              style={linkCard}
            >
              <Link href={link.href} style={linkStyle}>
                {link.name}
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Chart Overview */}
        <motion.section style={chartCard}>
          <h3 style={{ marginBottom: 14 }}>📈 Company Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overview.monthlyGrowth}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  background: "rgba(20,25,35,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#60a5fa"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
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
const subtitle = { opacity: 0.7, fontSize: 14, marginBottom: 20 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 18, marginBottom: 30 };
const card = {
  padding: 18,
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
  backdropFilter: "blur(6px)",
};
const linksGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 20, marginBottom: 40 };
const linkCard = {
  borderRadius: 12,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  textAlign: "center" as const,
  padding: "18px 10px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
};
const linkStyle = {
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 15,
  color: "#cfe8ff",
};
const chartCard = {
  marginTop: 20,
  padding: 20,
  borderRadius: 14,
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
};
