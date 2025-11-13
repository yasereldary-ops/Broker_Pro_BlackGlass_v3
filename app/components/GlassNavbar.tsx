"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

export default function GlassNavbar() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.9]);

  return (
    <motion.nav
      style={{ opacity }}
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="
        fixed top-5 left-8 z-50
        flex items-center gap-8
        px-7 py-3 rounded-xl
        bg-[rgba(10,15,25,0.6)] border border-white/10
        shadow-lg shadow-black/50 text-slate-100 font-medium text-[15px]
        backdrop-blur-md
      "
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-slate-300 hover:text-white hover:bg-white/10 rounded-md px-3 py-1.5 transition-all duration-300"
        >
          {item.label}
        </Link>
      ))}
    </motion.nav>
  );
}

const navItems = [
  { href: "/dashboard", label: "📊 Dashboard" },
  { href: "/admin/sales", label: "💼 Sales" },
  { href: "/admin/clients", label: "👥 Clients" },
  { href: "/admin/properties", label: "🏠 Properties" },
];
