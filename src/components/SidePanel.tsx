import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Star, Pencil, Trash2 } from "lucide-react"

interface HistoryItem { id: number; query: string; created_at: string }
interface InsightItem { id: number; text: string }

interface SidePanelProps {
  history: HistoryItem[]
  insights: InsightItem[]
  onHistorySelect: (query: string) => void
  onDeleteInsight: (id: number) => void
}

export function SidePanel({ history, insights, onHistorySelect, onDeleteInsight }: SidePanelProps) {
  const [open, setOpen] = useState(false)
  const [hoveredHistory, setHoveredHistory] = useState<number | null>(null)

  const displayHistory = history.length > 0 ? history : []

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        style={{ position: "fixed", top: 20, left: 20, zIndex: 100, background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ffffff" }}
        whileHover={{ background: "#3a3a3a" }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 90 }}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 300, background: "#202020", borderRight: "1px solid #303030", zIndex: 95, overflowY: "auto", paddingTop: 72, paddingBottom: 24 }}
            >
              <div style={{ padding: "0 20px" }}>
                <p style={{ color: "#ffffff", fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
                  История запросов
                </p>
                {displayHistory.length === 0 ? (
                  <p style={{ color: "#555", fontSize: 13 }}>Войдите, чтобы видеть историю</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {displayHistory.map((h) => (
                      <motion.div
                        key={h.id}
                        onHoverStart={() => setHoveredHistory(h.id)}
                        onHoverEnd={() => setHoveredHistory(null)}
                        onClick={() => { onHistorySelect(h.query); setOpen(false) }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, cursor: "pointer" }}
                        whileHover={{ background: "#2a2a2a" }}
                      >
                        <span style={{ color: "#ffffff", fontSize: 14, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.query}</span>
                        <AnimatePresence>
                          {hoveredHistory === h.id && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} title="Повторить">
                              <Star size={14} color="#888" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div style={{ borderTop: "1px solid #303030", marginTop: 24, paddingTop: 20 }}>
                  <p style={{ color: "#F03224", fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
                    Блокнот инсайтов ★
                  </p>
                  {insights.length === 0 ? (
                    <p style={{ color: "#555", fontSize: 13 }}>Нажмите ★ у абзаца ответа, чтобы сохранить инсайт</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {insights.map((s) => (
                        <motion.div
                          key={s.id}
                          layout
                          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, background: "#252525", gap: 8 }}
                          whileHover={{ background: "#2a2a2a" }}
                        >
                          <span style={{ color: "#ffffff", fontSize: 14, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>
                            {s.text.length > 80 ? s.text.slice(0, 80) + "…" : s.text}
                          </span>
                          <motion.button
                            whileHover={{ color: "#F03224" }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: 0, flexShrink: 0, marginTop: 2 }}
                            title="Удалить"
                            onClick={() => onDeleteInsight(s.id)}
                          >
                            <Trash2 size={13} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
