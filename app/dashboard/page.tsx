"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar,
} from "recharts";
import Link from "next/link";
import GlassNavbar from "../components/GlassNavbar";

export const dynamic = "force-dynamic";

type KPIs = {
  sales: number;
  commission: number;
  expenses: number;
  target: number;
  netProfit: number;
};

type DataPoint = { month: string; sales: number; profit: number };

function formatEGP(n: number) {
  return "EGP " + n.toLocaleString();
}

export default function DashboardPage() {
  const [data, setData] = useState<KPIs>({
    sales: 5_000_000,
    commission: 37_500,
    expenses: 287_000,
    target: 65_000_000,
    netProfit: 0,
  });

  const [chartData] = useState<DataPoint[]>([
    { month: "Jul", sales: 8_000_000, profit: 350_000 },
    { month: "Aug", sales: 12_000_000, profit: 580_000 },
    { month: "Sep", sales: 15_000_000, profit: 720_000 },
    { month: "Oct", sales: 20_000_000, profit: 1_000_000 },
    { month: "Nov", sales: 22_000_000, profit: 1_300_000 },
  ]);

  const expensesData = [
    { name: "Marketing", value: 120_000 },
    { name: "Office Rent", value: 125_000 },
    { name: "HR + Admin", value: 32_000 },
    { name: "Utilities", value: 10_000 },
  ];

  const quartersData = [
    { quarter: "Q1", sales: 25_000_000, profit: 1_200_000 },
    { quarter: "Q2", sales: 35_000_000, profit: 2_000_000 },
    { quarter: "Q3", sales: 50_000_000, profit: 2_800_000 },
    { quarter: "Q4", sales: 65_000_000, profit: 3_600_000 },
  ];

  const COLORS = ["#60a5fa", "#38bdf8", "#10b981", "#f59e0b"];

  useEffect(() => {
    const net = Math.round(data.sales * 0.0075 - data.expenses);
    setData((p) => ({ ...p, netProfit: net }));
  }, [data.sales, data.expenses]);

  const progress = useMemo(() => Math.min((data.sales / data.target) * 100, 100), [data.sales, data.target]);

  return (
    <div style={root}>
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ ...main, paddingTop: "120px" }}
      >
        <header style={header}>
          <div>
            <h1 style={title}>Broker Pro — BlackGlass Dashboard</h1>
            <p style={subtitle}>Live overview — Sales · Commissions · Expenses · Profit</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/admin/sales" style={ghostBtn}>Open Sales</Link>
            <button
              onClick={() => {
                localStorage.removeItem("auth");
                window.location.href = "/login";
              }}
              style={dangerBtn}
            >
              Logout
            </button>
          </div>
        </header>

        {/* KPIs */}
        <section style={grid}>
          <KpiCard label="Total Sales" value={formatEGP(data.sales)} accent="#7dd3fc" />
          <KpiCard label="Commission" value={formatEGP(data.commission)} accent="#60a5fa" />
          <KpiCard label="Expenses" value={formatEGP(data.expenses)} accent="#f97316" />
          <KpiCard label="Net Profit" value={formatEGP(data.netProfit)} accent={data.netProfit >= 0 ? "#10b981" : "#ef4444"} />
        </section>

        {/* Progress */}
        <motion.section style={progressCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <h3 style={{ margin: 0 }}>🎯 Quarterly Target Progress</h3>
          <div style={{ marginTop: 14 }}>
            <div style={progressTrack}>
              <motion.div style={{ ...progressFill, background: progress >= 100 ? "#10b981" : "#3b82f6" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
            </div>
            <p style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>{progress.toFixed(2)}% achieved</p>
          </div>
        </motion.section>

        {/* Charts Section */}
        <ChartsSection chartData={chartData} expensesData={expensesData} quartersData={quartersData} COLORS={COLORS} />
      </motion.main>
    </div>
  );
}

/* KPI Card Component */
function KpiCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} style={card}>
      <div style={{ fontSize: 13, opacity: 0.75 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 10, color: accent }}>{value}</div>
    </motion.div>
  );
}

/* Chart section */
function ChartsSection({ chartData, expensesData, quartersData, COLORS }: any) {
  return (
    <>
      <motion.section style={chartCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 style={{ marginBottom: 14 }}>📈 Monthly Sales & Profit</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ background: "rgba(20,25,35,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
            <Line type="monotone" dataKey="sales" stroke="#60a5fa" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.section>

      <motion.section style={chartCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 style={{ marginBottom: 14 }}>💰 Expenses Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={expensesData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
              {expensesData.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "rgba(20,25,35,0.9)", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.section>

      <motion.section style={chartCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 style={{ marginBottom: 14 }}>📊 Quarterly Sales & Profit Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={quartersData}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="quarter" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ background: "rgba(20,25,35,0.9)", border: "1px solid rgba(255,255,255,0.1)" }} />
            <Legend />
            <Bar dataKey="sales" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            <Bar dataKey="profit" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.section>
    </>
  );
}

/* Styles */
const root = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top left, #071428, #02040a 60%, #000)",
  color: "#e6eef8",
  fontFamily: "Inter, system-ui, sans-serif",
};

const main = { width: "min(1200px, calc(100% - 40px))", margin: "0 auto", paddingBottom: 80 };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const title = { fontSize: 26, fontWeight: 800 };
const subtitle = { marginTop: 4, opacity: 0.7 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 18, marginTop: 28 };
const card = { padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 8px 20px rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" };
const progressCard = { marginTop: 28, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", boxShadow: "0 8px 30px rgba(2,6,23,0.5)" };
const chartCard = { marginTop: 30, padding: 20, borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 8px 30px rgba(0,0,0,0.45)" };
const progressTrack = { height: 12, width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden" };
const progressFill = { height: "100%", width: "0%" };
const ghostBtn = { padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)", color: "#cfe8ff", textDecoration: "none", fontWeight: 700 };
const dangerBtn = { padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#ff7b7b", fontWeight: 800, cursor: "pointer" };
