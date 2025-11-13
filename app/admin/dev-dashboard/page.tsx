// app/admin/dev-dashboard/page.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type TeamRow = {
  id: string;
  name: string;
  role: string;
  sales: number;
  deals: number;
  commissionRate: number; // as decimal e.g. 0.0075
};

const sampleKpis = {
  sales: 5_000_000,
  commission: 37_500,
  expenses: 287_000,
  target: 65_000_000,
};

const monthlySeries = [
  { month: "Jul", sales: 8_000_000 },
  { month: "Aug", sales: 12_000_000 },
  { month: "Sep", sales: 15_000_000 },
  { month: "Oct", sales: 20_000_000 },
  { month: "Nov", sales: 22_000_000 },
];

const team: TeamRow[] = [
  { id: "t1", name: "Ahmed", role: "Senior Sales", sales: 18_000_000, deals: 12, commissionRate: 0.01 },
  { id: "t2", name: "Mina", role: "Property Consultant", sales: 6_000_000, deals: 8, commissionRate: 0.006 },
  { id: "t3", name: "Sara", role: "Senior Sales", sales: 9_000_000, deals: 6, commissionRate: 0.009 },
  { id: "t4", name: "Khaled", role: "Consultant", sales: 2_000_000, deals: 2, commissionRate: 0.006 },
];

const expenseBreakdown = [
  { name: "Marketing", value: 120_000 },
  { name: "Office Rent", value: 125_000 },
  { name: "HR + Admin", value: 32_000 },
  { name: "Utilities", value: 10_000 },
];

const COLORS = ["#60a5fa", "#38bdf8", "#10b981", "#f59e0b"];

function fmt(n: number) {
  return "EGP " + n.toLocaleString();
}

/* --- Simple linear projection for next month based on last N months --- */
function linearForecast(series: { month: string; sales: number }[], steps = 3) {
  if (series.length < 2) return [];
  // convert to x=0..n-1, y=sales
  const n = series.length;
  const xs = series.map((_, i) => i);
  const ys = series.map((s) => s.sales);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;
  // slope = sum( (xi - xm)*(yi - ym) ) / sum( (xi - xm)^2 )
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = yMean - slope * xMean;
  const forecasts: { label: string; value: number }[] = [];
  for (let s = 1; s <= steps; s++) {
    const xi = n - 1 + s;
    const val = Math.round(intercept + slope * xi);
    forecasts.push({ label: `+${s}m`, value: val });
  }
  return forecasts;
}

/* --- Simple alerts detector --- */
function computeAlerts(kpis: typeof sampleKpis, monthly: typeof monthlySeries) {
  const alerts: string[] = [];
  // alert if expenses > 60% of commission (example rule)
  if (kpis.expenses > kpis.commission * 4) {
    alerts.push("Expenses are high relative to commissions — check marketing / payroll.");
  }
  // alert if last month drop >20%
  if (monthly.length >= 2) {
    const last = monthly[monthly.length - 1].sales;
    const prev = monthly[monthly.length - 2].sales;
    if (prev > 0) {
      const drop = (prev - last) / prev;
      if (drop > 0.2) alerts.push("Sales dropped by over 20% month-over-month.");
    }
  }
  return alerts;
}

/* ----------------- Page ----------------- */
export default function DevDashboardPage() {
  const forecasts = useMemo(() => linearForecast(monthlySeries, 3), []);
  const alerts = useMemo(() => computeAlerts(sampleKpis, monthlySeries), []);

  const teamWithCommission = useMemo(
    () =>
      team.map((t) => ({
        ...t,
        commission: Math.round(t.sales * t.commissionRate),
        avgDeal: t.deals ? Math.round(t.sales / t.deals) : 0,
      })),
    []
  );

  // key summary numbers
  const totalTeamSales = team.reduce((s, r) => s + r.sales, 0);
  const teamCommissionTotal = teamWithCommission.reduce((s, r) => s + r.commission, 0);

  return (
    <div style={root}>
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        style={{ ...main, paddingTop: 110 }}
      >
        <header style={header}>
          <div>
            <h1 style={title}>Developer / Ops Dashboard</h1>
            <p style={subtitle}>Advanced analytics · Team performance · Forecasts · Alerts</p>
          </div>
        </header>

        {/* top KPIs */}
        <section style={grid}>
          <Kpi label="Total Sales" value={fmt(sampleKpis.sales)} help="Current realized sales" accent="#7dd3fc" />
          <Kpi label="Commission (calc)" value={fmt(teamCommissionTotal)} help="Sum of team commissions" accent="#60a5fa" />
          <Kpi label="Expenses" value={fmt(sampleKpis.expenses)} help="This period's expenses" accent="#f97316" />
          <Kpi label="Target Progress" value={`${Math.min((sampleKpis.sales / sampleKpis.target) * 100, 100).toFixed(1)}%`} help="Quarterly target" accent="#10b981" />
        </section>

        {/* charts */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 26 }}>
          <motion.section style={chartCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ marginBottom: 12 }}>Monthly Sales (actual) & Forecast</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={[
                  ...monthlySeries.map((m) => ({ label: m.month, value: m.sales })),
                  ...forecasts.map((f, i) => ({ label: `F${i + 1}`, value: f.value })),
                ]}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" stroke="#9fb6d9" />
                <YAxis stroke="#9fb6d9" />
                <Tooltip
                  contentStyle={{ background: "rgba(18,22,30,0.95)", border: "1px solid rgba(255,255,255,0.06)" }}
                />
                <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2.6} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
              {forecasts.map((f, i) => (
                <div key={i} style={{ ...smallCard }}>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>Forecast {f.label}</div>
                  <div style={{ fontWeight: 800, marginTop: 6 }}>{fmt(f.value)}</div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.aside style={chartCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 style={{ marginBottom: 10 }}>Expense Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expenseBreakdown} dataKey="value" innerRadius={40} outerRadius={80} label>
                  {expenseBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(18,22,30,0.95)" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 8 }}>Alerts</div>
              {alerts.length === 0 ? (
                <div style={{ color: "#9fb6d9" }}>No critical alerts — all systems nominal.</div>
              ) : (
                alerts.map((a, i) => (
                  <div key={i} style={{ ...alertItem }}>
                    ⚠️ {a}
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </div>

        {/* team performance table */}
        <motion.section style={{ marginTop: 28 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ marginBottom: 12 }}>Team Performance</h3>
          <div style={tableWrap}>
            <table style={table}>
              <thead style={thead}>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Sales</th>
                  <th>Deals</th>
                  <th>Avg / Deal</th>
                  <th>Commission</th>
                </tr>
              </thead>
              <tbody>
                {teamWithCommission.map((r) => (
                  <tr key={r.id}>
                    <td style={tdName}>{r.name}</td>
                    <td style={tdCell}>{r.role}</td>
                    <td style={tdRight}>{fmt(r.sales)}</td>
                    <td style={tdRight}>{r.deals}</td>
                    <td style={tdRight}>{fmt(r.avgDeal)}</td>
                    <td style={{ ...tdRight, fontWeight: 800 }}>{fmt(r.commission)}</td>
                  </tr>
                ))}
                {/* summary */}
                <tr>
                  <td style={tdName}>TOTAL</td>
                  <td style={tdCell}>—</td>
                  <td style={tdRight}>{fmt(totalTeamSales)}</td>
                  <td style={tdRight}>—</td>
                  <td style={tdRight}>—</td>
                  <td style={{ ...tdRight, fontWeight: 900 }}>{fmt(teamCommissionTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}

/* --------- small components & styles ---------- */
function Kpi({ label, value, help, accent }: { label: string; value: string; help?: string; accent?: string }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} style={{ ...card }}>
      <div style={{ fontSize: 13, opacity: 0.8 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8, color: accent ?? "#cfe8ff" }}>{value}</div>
      {help && <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>{help}</div>}
    </motion.div>
  );
}

/* ---------- styles (similar to dashboard) ---------- */
const root = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top left, #071428, #02040a 60%, #000)",
  color: "#e6eef8",
  fontFamily: "Inter, system-ui, sans-serif",
} as React.CSSProperties;

const main = { width: "min(1200px, calc(100% - 40px))", margin: "0 auto", paddingBottom: 80 } as React.CSSProperties;
const header = { display: "flex", justifyContent: "space-between", alignItems: "center" } as React.CSSProperties;
const title = { fontSize: 26, fontWeight: 800 } as React.CSSProperties;
const subtitle = { marginTop: 4, opacity: 0.7 } as React.CSSProperties;
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))", gap: 18, marginTop: 18 } as React.CSSProperties;
const card = { padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 8px 20px rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" } as React.CSSProperties;
const chartCard = { padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", boxShadow: "0 8px 30px rgba(0,0,0,0.45)" } as React.CSSProperties;
const smallCard = { padding: 10, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.03)", minWidth: 140 } as React.CSSProperties;
const alertItem = { background: "rgba(244,63,94,0.06)", padding: 10, borderRadius: 8, border: "1px solid rgba(244,63,94,0.12)", marginBottom: 8 } as React.CSSProperties;

const tableWrap = { overflowX: "auto", borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", padding: 8 } as React.CSSProperties;
const table = { width: "100%", borderCollapse: "collapse" } as React.CSSProperties;
const thead = { textAlign: "left", color: "#a7c2e6", fontSize: 13 } as React.CSSProperties;
const tdCell = { padding: "10px 12px", color: "#cfe8ff" } as React.CSSProperties;
const tdRight = { padding: "10px 12px", textAlign: "right", color: "#cfe8ff" } as React.CSSProperties;
const tdName = { padding: "10px 12px", color: "#e6eef8", fontWeight: 700 } as React.CSSProperties;
