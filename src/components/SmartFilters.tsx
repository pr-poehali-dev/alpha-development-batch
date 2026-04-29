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
}

export function SmartFilters({ visible }: SmartFiltersProps) {
  const [filters, setFilters] = useState(FILTERS)

  const toggle = (id: string) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ marginTop: 20, marginLeft: 80, marginRight: 80 }}
          className="flex justify-center"
        >
          <div
            style={{
              width: "70%",
              background: "#252525",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid #303030",
            }}
          >
            {filters.map((f, i) => (
              <motion.div
                key={f.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 16,
                  paddingRight: 16,
                  background: "transparent",
                  borderBottom: i < filters.length - 1 ? "1px solid #303030" : "none",
                  cursor: "pointer",
                  position: "relative",
                }}
                whileHover={{ background: "#2e2e2e" }}
                onClick={() => toggle(f.id)}
              >
                {f.active && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: "#F03224",
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                )}
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: f.active ? "#F03224" : "transparent",
                    border: f.active ? "2px solid #F03224" : "2px solid #555",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {f.active && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: f.active ? 600 : 400,
                    borderBottom: f.active ? "1px solid #F03224" : "1px solid transparent",
                    lineHeight: 1.4,
                    transition: "all 0.15s",
                  }}
                >
                  {f.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}