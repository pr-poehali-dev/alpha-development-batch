import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { History, BookMarked, User, Receipt, TrendingUp, Swords, ShoppingCart } from "lucide-react"

const NAV_ITEMS = [
  { icon: User, label: "Портрет клиента", id: "portrait" },
  { icon: Receipt, label: "Средний чек", id: "avg-check" },
  { icon: TrendingUp, label: "Динамика клиентов", id: "dynamics" },
  { icon: Swords, label: "Рынок конкурентов", id: "market" },
  { icon: ShoppingCart, label: "Корзина покупателя", id: "basket" },
]

interface LeftNavProps {
  history: { id: number; query: string }[]
  insights: { id: number; text: string }[]
  onHistorySelect: (q: string) => void
  onDeleteInsight: (id: number) => void
  activeNav: string | null
  onNavSelect: (id: string) => void
}

export function LeftNav({ history, insights, onHistorySelect, onDeleteInsight, activeNav, onNavSelect }: LeftNavProps) {
  const [panelOpen, setPanelOpen] = useState<"history" | "insights" | null>(null)
  const [hoveredNav, setHoveredNav] = useState<string | null>(null)

  return (
    <>
      {/* Fixed left sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 64,
          background: "#111318",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 72,
          paddingBottom: 24,
          gap: 4,
        }}
      >
        {/* History */}
        <NavIcon
          icon={History}
          label="История запросов"
          active={panelOpen === "history"}
          hovered={hoveredNav === "history"}
          onHover={(v) => setHoveredNav(v ? "history" : null)}
          onClick={() => setPanelOpen(panelOpen === "history" ? null : "history")}
        />

        {/* Insights */}
        <NavIcon
          icon={BookMarked}
          label="Блокнот инсайтов"
          active={panelOpen === "insights"}
          hovered={hoveredNav === "insights"}
          onHover={(v) => setHoveredNav(v ? "insights" : null)}
          onClick={() => setPanelOpen(panelOpen === "insights" ? null : "insights")}
          accent
        />

        <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />

        {NAV_ITEMS.map((item) => (
          <NavIcon
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeNav === item.id}
            hovered={hoveredNav === item.id}
            onHover={(v) => setHoveredNav(v ? item.id : null)}
            onClick={() => onNavSelect(activeNav === item.id ? "" : item.id)}
          />
        ))}
      </div>

      {/* Slide-out panel */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPanelOpen(null)}
              style={{ position: "fixed", inset: 0, zIndex: 40 }}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 64 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: 280,
                background: "#161920",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                zIndex: 45,
                overflowY: "auto",
                paddingTop: 64,
                paddingBottom: 24,
              }}
            >
              <div style={{ padding: "0 20px" }}>
                {panelOpen === "history" ? (
                  <>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 16, letterSpacing: "0.5px", textTransform: "uppercase", opacity: 0.5 }}>
                      История запросов
                    </p>
                    {history.length === 0 ? (
                      <p style={{ color: "#444", fontSize: 13 }}>Войдите, чтобы видеть историю</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {history.map((h) => (
                          <motion.div
                            key={h.id}
                            onClick={() => { onHistorySelect(h.query); setPanelOpen(null) }}
                            style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", color: "#aaa", fontSize: 13, lineHeight: 1.4 }}
                            whileHover={{ background: "rgba(255,255,255,0.05)", color: "#fff" }}
                          >
                            {h.query.length > 55 ? h.query.slice(0, 55) + "…" : h.query}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p style={{ color: "#F03224", fontWeight: 600, fontSize: 14, marginBottom: 16, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      Блокнот инсайтов
                    </p>
                    {insights.length === 0 ? (
                      <p style={{ color: "#444", fontSize: 13 }}>Нажмите ★ у абзаца ответа, чтобы сохранить</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {insights.map((s) => (
                          <motion.div
                            key={s.id}
                            style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "10px 12px", borderRadius: 8, background: "rgba(240,50,36,0.06)", border: "1px solid rgba(240,50,36,0.12)", gap: 8 }}
                            whileHover={{ background: "rgba(240,50,36,0.10)" }}
                          >
                            <span style={{ color: "#ddd", fontSize: 13, flex: 1, lineHeight: 1.5 }}>
                              {s.text.length > 80 ? s.text.slice(0, 80) + "…" : s.text}
                            </span>
                            <motion.button
                              onClick={() => onDeleteInsight(s.id)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#444", padding: 0, flexShrink: 0 }}
                              whileHover={{ color: "#F03224" }}
                            >
                              ×
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

interface NavIconProps {
  icon: React.ElementType
  label: string
  active: boolean
  hovered: boolean
  onHover: (v: boolean) => void
  onClick: () => void
  accent?: boolean
}

function NavIcon({ icon: Icon, label, active, hovered, onHover, onClick, accent }: NavIconProps) {
  return (
    <div style={{ position: "relative", width: "100%" }} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      <motion.button
        onClick={onClick}
        style={{
          width: "100%",
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: active ? "rgba(240,50,36,0.12)" : "none",
          border: "none",
          borderRadius: 0,
          cursor: "pointer",
          color: active ? "#F03224" : accent ? "#F03224" : "#666",
          position: "relative",
          transition: "color 0.15s",
        }}
        whileHover={{ color: "#F03224" }}
      >
        {active && (
          <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2, height: 20, background: "#F03224", borderRadius: "0 2px 2px 0" }} />
        )}
        <Icon size={18} />
      </motion.button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute",
              left: 70,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#1e2128",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              padding: "6px 12px",
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
              whiteSpace: "nowrap",
              zIndex: 200,
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              pointerEvents: "none",
            }}
          >
            {label}
            <div style={{ position: "absolute", left: -5, top: "50%", transform: "translateY(-50%)", width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderRight: "5px solid #1e2128" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
