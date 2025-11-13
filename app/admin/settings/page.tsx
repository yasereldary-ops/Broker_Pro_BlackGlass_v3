"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [config, setConfig] = useState({
    commissionRate: 0.0075,
    targetQuarterConsultant: 25_000_000,
    targetQuarterSenior: 40_000_000,
    expenses: {
      rent: 125_000,
      hr: 16_000,
      admin: 10_000,
      officeBoy: 6_000,
      utilities: 10_000,
      marketing: 120_000,
    },
  });

  const [saved, setSaved] = useState(false);

  const totalExpenses = Object.values(config.expenses).reduce((a, b) => a + b, 0);

  const handleChange = (path: string, value: number) => {
    setConfig((prev) => {
      const updated = structuredClone(prev);
      const parts = path.split(".");
      let obj: any = updated;
      while (parts.length > 1) obj = obj[parts.shift()!];
      obj[parts[0]] = value;
      return updated;
    });
    setSaved(false);
  };

  const saveConfig = async () => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaved(true);
  };

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.data) setConfig(json.data);
    })();
  }, []);

  return (
    <div style={root}>
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={main}
      >
        <h1 style={title}>⚙️ System Settings</h1>
        <p style={subtitle}>Manage sales targets, commissions & monthly expenses</p>

        <section style={card}>
          <h3>🎯 Sales Targets</h3>
          <div style={grid}>
            <SettingInput
              label="Consultant Target / Quarter"
              value={config.targetQuarterConsultant}
              onChange={(v) => handleChange("targetQuarterConsultant", v)}
            />
            <SettingInput
              label="Senior Target / Quarter"
              value={config.targetQuarterSenior}
              onChange={(v) => handleChange("targetQuarterSenior", v)}
            />
          </div>
        </section>

        <section style={card}>
          <h3>💰 Commission Scheme</h3>
          <SettingInput
            label="Base Commission Rate"
            value={config.commissionRate * 100}
            suffix="%"
            onChange={(v) => handleChange("commissionRate", v / 100)}
          />
        </section>

        <section style={card}>
          <h3>🏢 Monthly Expenses</h3>
          <div style={grid}>
            {Object.entries(config.expenses).map(([k, v]) => (
              <SettingInput
                key={k}
                label={k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                value={v}
                onChange={(val) => handleChange(`expenses.${k}`, val)}
              />
            ))}
          </div>
          <div style={{ marginTop: 10, fontWeight: 600, color: "#60a5fa" }}>
            Total Monthly Expenses: EGP {totalExpenses.toLocaleString()}
          </div>
        </section>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={saveConfig}
          style={saveBtn}
        >
          {saved ? "✅ Saved Successfully" : "💾 Save Settings"}
        </motion.button>
      </motion.main>
    </div>
  );
}

/* Small component for input fields */
function SettingInput({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div style={inputWrap}>
      <label style={labelStyle}>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={input}
      />
      {suffix && <span style={{ marginLeft: 6, opacity: 0.8 }}>{suffix}</span>}
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
const main = { width: "min(1000px, calc(100% - 40px))", margin: "0 auto", padding: "100px 0 80px" };
const title = { fontSize: 28, fontWeight: 800, marginBottom: 4 };
const subtitle = { opacity: 0.7, fontSize: 15, marginBottom: 20 };
const card = {
  padding: 20,
  borderRadius: 14,
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
  backdropFilter: "blur(6px)",
  marginBottom: 24,
};
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 12 };
const inputWrap = { display: "flex", flexDirection: "column", gap: 6 };
const labelStyle = { fontSize: 13, opacity: 0.8 };
const input = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#e6eef8",
  padding: "8px 10px",
  fontSize: 14,
  outline: "none",
};
const saveBtn = {
  marginTop: 20,
  padding: "10px 20px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#9be3ff",
  fontWeight: 700,
  cursor: "pointer",
  transition: "0.3s",
};
