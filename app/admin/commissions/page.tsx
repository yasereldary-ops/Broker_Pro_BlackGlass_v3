"use client";

import { useState } from "react";

type Commission = {
  id: number;
  agent: string;
  sale: string;
  amount: number;
  percentage: number;
  total: number;
};

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([
    { id: 1, agent: "Sarah Nabil", sale: "SkyTower", amount: 4000000, percentage: 0.6, total: 24000 },
  ]);

  const [form, setForm] = useState({
    agent: "",
    sale: "",
    amount: "",
    percentage: "",
  });

  const addCommission = () => {
    if (!form.agent || !form.amount || !form.percentage) return;
    const id = commissions.length ? commissions[commissions.length - 1].id + 1 : 1;
    const total = (Number(form.amount) * Number(form.percentage)) / 100;
    setCommissions([
      ...commissions,
      {
        id,
        agent: form.agent,
        sale: form.sale || "N/A",
        amount: Number(form.amount),
        percentage: Number(form.percentage),
        total,
      },
    ]);
    setForm({ agent: "", sale: "", amount: "", percentage: "" });
  };

  const removeCommission = (id: number) => {
    setCommissions(commissions.filter((c) => c.id !== id));
  };

  const totalCommissionSum = commissions.reduce((sum, c) => sum + c.total, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#03050b,#070e1a)",
        color: "#e6eef8",
        padding: 40,
      }}
    >
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>💰 Commissions Management</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Calculate and track commissions per sale or agent.
      </p>

      {/* Add Commission Form */}
      <div style={{ marginTop: 30, display: "flex", gap: 24 }}>
        <div
          style={{
            width: 400,
            background: "rgba(255,255,255,0.04)",
            padding: 20,
            borderRadius: 10,
          }}
        >
          <h3 style={{ marginBottom: 12 }}>➕ Add Commission</h3>
          <input
            placeholder="Agent Name"
            value={form.agent}
            onChange={(e) => setForm({ ...form, agent: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Sale/Project"
            value={form.sale}
            onChange={(e) => setForm({ ...form, sale: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Sale Amount (EGP)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Commission %"
            type="number"
            value={form.percentage}
            onChange={(e) => setForm({ ...form, percentage: e.target.value })}
            style={inputStyle}
          />
          <button onClick={addCommission} style={btnStyle}>
            Calculate & Add
          </button>
        </div>

        {/* Commission Table */}
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 12 }}>📊 Commission Records</h3>
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            {commissions.length === 0 && (
              <div style={{ padding: 20, opacity: 0.8 }}>No commissions yet.</div>
            )}
            {commissions.map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{c.agent}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>
                    {c.sale} • {c.percentage}% on EGP {c.amount.toLocaleString()}
                  </div>
                  <div style={{ marginTop: 4, color: "#00ffcc" }}>
                    Earned: <b>EGP {c.total.toLocaleString()}</b>
                  </div>
                </div>
                <button
                  onClick={() => removeCommission(c.id)}
                  style={{ ...smallBtn, background: "#ff5c5c" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              marginTop: 20,
              background: "rgba(0,255,255,0.08)",
              borderRadius: 10,
              padding: 16,
            }}
          >
            <strong>Total Commissions:</strong>{" "}
            <span style={{ color: "#00ffcc" }}>
              EGP {totalCommissionSum.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginBottom: 10,
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: 14,
};

const btnStyle: React.CSSProperties = {
  marginTop: 8,
  padding: "10px 12px",
  borderRadius: 8,
  border: "none",
  background: "#00bfff",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const smallBtn: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 6,
  border: "none",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};
