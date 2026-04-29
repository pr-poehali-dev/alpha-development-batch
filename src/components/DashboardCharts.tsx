import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar,
  CartesianGrid, Legend,
} from "recharts"

const C = {
  red: "#F03224",
  orange: "#ff6b35",
  blue: "#4e7fff",
  purple: "#8b5cf6",
  green: "#22c55e",
  yellow: "#eab308",
  dim: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.07)",
  text: "#6b7280",
  textLight: "#9ca3af",
}

// ─── mock data ───────────────────────────────────────────────
const financialData = [
  { segment: "Premium", revenue: 4200, clients: 38 },
  { segment: "Business", revenue: 7800, clients: 124 },
  { segment: "Standard", revenue: 3100, clients: 286 },
  { segment: "Economy", revenue: 890, clients: 512 },
]

const avgCheckData = [
  { month: "Янв", check: 12400, cross: 8200 },
  { month: "Фев", check: 13100, cross: 9100 },
  { month: "Мар", check: 11800, cross: 8700 },
  { month: "Апр", check: 14500, cross: 10200 },
  { month: "Май", check: 15200, cross: 11800 },
  { month: "Июн", check: 13900, cross: 10500 },
]

const marketShareData = [
  { name: "Альфа Инсайт", value: 34, color: C.red },
  { name: "Конкурент А", value: 28, color: C.blue },
  { name: "Конкурент Б", value: 21, color: C.purple },
  { name: "Прочие", value: 17, color: "#374151" },
]

const walletData = [
  { month: "Янв", share: 41 },
  { month: "Фев", share: 44 },
  { month: "Мар", share: 43 },
  { month: "Апр", share: 48 },
  { month: "Май", share: 52 },
  { month: "Июн", share: 55 },
]

const categoriesData = [
  { cat: "Электроника", self: 38, comp: 24 },
  { cat: "Одежда", self: 22, comp: 31 },
  { cat: "Продукты", self: 17, comp: 19 },
  { cat: "Услуги", self: 14, comp: 8 },
  { cat: "Прочее", self: 9, comp: 18 },
]

const crossBuyData = [
  { name: "Только у нас", value: 58, color: C.red },
  { name: "Кросс-покупки", value: 42, color: C.orange },
]

// ─── tooltip style ────────────────────────────────────────────
const ttStyle = {
  contentStyle: { background: "#1a1e27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 12 },
  cursor: { fill: "rgba(255,255,255,0.03)" },
}

// ─── card wrapper ─────────────────────────────────────────────
function Card({ title, subtitle, children, span = 1 }: { title: string; subtitle: string; children: React.ReactNode; span?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        gridColumn: span > 1 ? `span ${span}` : undefined,
        background: "#13161d",
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: "20px 22px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <p style={{ color: "#fff", fontWeight: 600, fontSize: 13, margin: 0 }}>{title}</p>
      <p style={{ color: C.text, fontSize: 11, margin: "0 0 14px", lineHeight: 1.4 }}>{subtitle}</p>
      <div style={{ flex: 1 }}>{children}</div>
    </motion.div>
  )
}

// ─── custom pie label ─────────────────────────────────────────
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; value: number }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos((-midAngle * Math.PI) / 180)
  const y = cy + r * Math.sin((-midAngle * Math.PI) / 180)
  return value > 8 ? <text x={x} y={y} fill="#fff" fontSize={11} fontWeight={600} textAnchor="middle" dominantBaseline="central">{value}%</text> : null
}

export function DashboardCharts() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
      }}
    >
      {/* 1 — Финансовый сегмент */}
      <Card
        title="Финансовый сегмент"
        subtitle="Концентрация выручки по группам платёжеспособности"
      >
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={financialData} barSize={28}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="segment" tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.text, fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip {...ttStyle} formatter={(v: number) => [`${(v / 1000).toFixed(1)}M ₽`, "Выручка"]} />
            <Bar dataKey="revenue" fill={C.red} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {financialData.map((d) => (
            <div key={d.segment} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{d.clients}</div>
              <div style={{ color: C.text, fontSize: 10 }}>{d.segment}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2 — Средний чек */}
      <Card
        title="Средний чек"
        subtitle="Конверсия перекрёстных продаж внутри сегмента"
      >
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={avgCheckData}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.text, fontSize: 10 }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip {...ttStyle} formatter={(v: number) => [`${v.toLocaleString("ru-RU")} ₽`]} />
            <Line type="monotone" dataKey="check" stroke={C.red} strokeWidth={2} dot={false} name="Средний чек" />
            <Line type="monotone" dataKey="cross" stroke={C.orange} strokeWidth={2} dot={false} strokeDasharray="4 3" name="Кросс-продажи" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <Leg color={C.red} label="Средний чек" />
          <Leg color={C.orange} label="Кросс-продажи" dashed />
        </div>
      </Card>

      {/* 3 — Доля рынка */}
      <Card
        title="Доля рынка"
        subtitle="Доля трат клиентов у конкретного ИНН vs совокупные траты"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flexShrink: 0 }}>
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={marketShareData} cx="50%" cy="50%" innerRadius={36} outerRadius={60} dataKey="value" labelLine={false} label={renderPieLabel}>
                  {marketShareData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            {marketShareData.map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <span style={{ color: C.textLight, fontSize: 11, flex: 1 }}>{d.name}</span>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 4 — Доля кошелька */}
      <Card
        title="Доля кошелька клиента"
        subtitle="Глубина взаимоотношений — рост = снижение угрозы оттока"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={walletData}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[30, 65]} tick={{ fill: C.text, fontSize: 10 }} axisLine={false} tickLine={false} width={30} tickFormatter={(v) => `${v}%`} />
                <Tooltip {...ttStyle} formatter={(v: number) => [`${v}%`, "Доля кошелька"]} />
                <Line type="monotone" dataKey="share" stroke={C.green} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.green, lineHeight: 1 }}>55%</div>
            <div style={{ color: C.text, fontSize: 11, marginTop: 4 }}>Июн</div>
            <div style={{ color: C.green, fontSize: 11, marginTop: 6, background: "rgba(34,197,94,0.1)", borderRadius: 6, padding: "2px 8px" }}>↑ 14 пп</div>
          </div>
        </div>
      </Card>

      {/* 5 — Доминирующие категории */}
      <Card
        title="Доминирующие категории"
        subtitle="Фактическая специализация конкурента vs ваша"
      >
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={categoriesData} layout="vertical" barSize={10} barGap={3}>
            <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis type="number" tick={{ fill: C.text, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="cat" tick={{ fill: C.textLight, fontSize: 11 }} axisLine={false} tickLine={false} width={58} />
            <Tooltip {...ttStyle} formatter={(v: number) => [`${v}%`]} />
            <Bar dataKey="self" fill={C.red} radius={[0, 3, 3, 0]} name="Мы" />
            <Bar dataKey="comp" fill={C.blue} radius={[0, 3, 3, 0]} name="Конкурент" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          <Leg color={C.red} label="Мы" />
          <Leg color={C.blue} label="Конкурент" />
        </div>
      </Card>

      {/* 6 — Доля кросс-покупок */}
      <Card
        title="Доля кросс-покупок"
        subtitle="Клиенты, покупавшие у >1 ИНН из списка vs только у нас"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flexShrink: 0 }}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={crossBuyData} cx="50%" cy="50%" innerRadius={32} outerRadius={55} dataKey="value" labelLine={false} label={renderPieLabel}>
                  {crossBuyData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {crossBuyData.map((d) => (
                <div key={d.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: C.textLight, fontSize: 12 }}>{d.name}</span>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{d.value}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: d.color, width: `${d.value}%`, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
              <p style={{ color: C.text, fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
                42% клиентов покупают у конкурентов — уникальная ниша под угрозой
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Leg({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 16, height: 2, background: dashed ? `repeating-linear-gradient(90deg, ${color} 0, ${color} 4px, transparent 4px, transparent 7px)` : color, borderRadius: 2 }} />
      <span style={{ color: "#6b7280", fontSize: 11 }}>{label}</span>
    </div>
  )
}