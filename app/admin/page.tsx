"use client";

export default function AdminPage() {
  const tabs = [
    { name: "Sales", link: "/admin/sales", emoji: "💼" },
    { name: "Clients", link: "/admin/clients", emoji: "👥" },
    { name: "Properties", link: "/admin/properties", emoji: "🏙️" },
    { name: "Settings", link: "/admin/settings", emoji: "⚙️" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#03050b,#070e1a)",
        color: "#e6eef8",
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: 34, fontWeight: 700, marginBottom: 30 }}>
        🚀 Broker Pro <span style={{ color: "#00bfff" }}>BlackGlass</span> Admin
      </h1>
      <p style={{ marginBottom: 40, opacity: 0.8, fontSize: 16 }}>
        Welcome back, Admin. Choose a section to manage below 👇
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          width: "80%",
          maxWidth: 900,
        }}
      >
        {tabs.map((tab) => (
          <a
            key={tab.name}
            href={tab.link}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(8px)",
              borderRadius: "16px",
              padding: "25px 20px",
              color: "#e6eef8",
              textDecoration: "none",
              textAlign: "center",
              boxShadow: "0 0 12px rgba(0,0,0,0.4)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 191, 255, 0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)")}
          >
            <div style={{ fontSize: 30 }}>{tab.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 10 }}>
              {tab.name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
