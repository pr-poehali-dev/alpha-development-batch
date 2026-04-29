import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const FILTERS = [
  { id: "month", label: "За последний месяц", active: true },
  { id: "region", label: "Регион: Москва", active: true },
  { id: "turnover", label: "Оборот > 5 млн руб.", active: false },
  { id: "status", label: "Статус: активный", active: false },
]

interface SmartFiltersProps {
  visible: boolean
  inline?: boolean
}

export function SmartFilters({ visible, inline }: SmartFiltersProps) {
  const [filters, setFilters] = useState(FILTERS)
  const toggle = (id: string) => setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f)))

  const inner = (
    <div style={{ background: "#13161d", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
        {filters.map((f, i) => (
          <motion.div
            key={f.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              background: "transparent",
              borderRight: i < filters.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
              cursor: "pointer",
              position: "relative",
            }}
            whileHover={{ background: "rgba(255,255,255,0.03)" }}
            onClick={() => toggle(f.id)}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: f.active ? "#F03224" : "transparent",
                border: f.active ? "2px solid #F03224" : "2px solid #374151",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              {f.active && (
                <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ color: f.active ? "#fff" : "#6b7280", fontSize: 12, fontWeight: f.active ? 600 : 400, transition: "color 0.15s", whiteSpace: "nowrap" }}>
              {f.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )

  if (inline) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {inner}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
          style={{ marginTop: 20, marginLeft: 80, marginRight: 80 }} className="flex justify-center">
          <div style={{ width: "70%" }}>{inner}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
