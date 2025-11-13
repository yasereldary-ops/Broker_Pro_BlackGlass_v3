"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", amount: "" });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/expenses");
      const json = await res.json();
      if (json.success) setExpenses(json.data);
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.amount) return alert("Please enter valid expense");
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.success) {
      setExpenses([...expenses, json.data]);
      setForm({ name: "", amount: "" });
    }
  };

  const total = expenses.reduce((s, x) => s + x.amount, 0);

  if (loading) return <div style={{ padding: 40 }}>Loading expenses...</div>;

  return (
    <div style={root}>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={main}
      >
        <h1 style={title}>💸 Company Expenses Management</h1>
        <p style={subtitle}>Add, edit, and track monthly expenses.</p>

        {/* Add Expense Form */}
        <form onSubmit={handleSubmit} style={formBox}>
          <input
            placeholder="Expense name (e.g., Marketing)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={input}
          />
          <input
            placeholder="Amount (EGP)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            style={input}
          />
          <button type="submit" style={btn}>
            + Add
          </button>
        </form>

        {/* Table */}
        <section style={tableCard}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>#</th>
                <th style={th}>Expense</th>
                <th style={th}>Amount (EGP)</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={e.id}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{e.name}</td>
                  <td style={{ ...td, color: "#f97316", fontWeight: 700 }}>
                    {e.amount.toLocaleString()}
                  </td>
                  <td style={td}>
                    {new Date(e.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <td style={td}>—</td>
                <td style={td}>Total</td>
                <td style={{ ...td, fontWeight: 800, color: "#facc15" }}>
                  {total.toLocaleString()}
                </td>
                <td style={td}></td>
              </tr>
            </tbody>
          </table>
        </section>
      </motion.main>
    </div>
  );
}

/* Styles */
const root = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top left, #071428, #02040a 60%, #000)",
  color: "#e6eef8",
  fontFamily: "Inter, system-ui, sans-serif",
};
const main = {
  width: "min(1100px, calc(100% - 40px))",
  margin: "0 auto",
  padding: "100px 0 80px",
};
const title = { fontSize: 26, fontWeight: 800 };
const subtitle = { opacity: 0.7, fontSize: 14, marginBottom: 20 };
const formBox = { display: "flex", gap: 10, marginBottom: 20 };
const input = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "#e6eef8",
  flex: 1,
};
const btn = {
  background: "linear-gradient(90deg,#10b981,#60a5fa)",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontWeight: 700,
  padding: "8px 18px",
  cursor: "pointer",
};
const tableCard = {
  marginTop: 20,
  padding: 20,
  borderRadius: 14,
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
};
const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  fontSize: 14,
};
const th = {
  textAlign: "left" as const,
  padding: "10px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  fontWeight: 700,
};
const td = {
  padding: "8px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};
