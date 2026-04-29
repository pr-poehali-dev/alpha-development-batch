import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Star, Pencil, Trash2 } from "lucide-react"

const HISTORY = [
  "Прогноз прибыли на июнь",
  "Клиенты с риском оттока",
  "Кэш-флоу на неделю",
  "Топ-5 регионов по обороту",
  "Анализ конкурентов — Q1",
]

const SAVED = [
  "↑ Выручка растёт на 18 % кв/кв",
  "3 клиента в зоне риска — срочно",
  "Москва даёт 42 % оборота",
]

export function SidePanel() {
  const [open, setOpen] = useState(false)
  const [hoveredHistory, setHoveredHistory] = useState<string | null>(null)
  const [saved, setSaved] = useState(SAVED)

  const removeInsight = (idx: number) => {
    setSaved((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 100,
          background: "#2a2a2a",
          border: "1px solid #3a3a3a",
          borderRadius: 8,
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "#ffffff",
        }}
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
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 90,
              }}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                bottom: 0,
                width: 300,
                background: "#202020",
                borderRight: "1px solid #303030",
                zIndex: 95,
                overflowY: "auto",
                paddingTop: 72,
                paddingBottom: 24,
              }}
            >
              <div style={{ padding: "0 20px" }}>
                <p style={{ color: "#ffffff", fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
                  История запросов
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {HISTORY.map((h) => (
                    <motion.div
                      key={h}
                      onHoverStart={() => setHoveredHistory(h)}
                      onHoverEnd={() => setHoveredHistory(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 10px",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                      whileHover={{ background: "#2a2a2a" }}
                    >
                      <span style={{ color: "#ffffff", fontSize: 14 }}>{h}</span>
                      <AnimatePresence>
                        {hoveredHistory === h && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            title="Сохранить"
                          >
                            <Star size={14} color="#888" style={{ cursor: "pointer" }} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                <div
                  style={{
                    borderTop: "1px solid #303030",
                    marginTop: 24,
                    paddingTop: 20,
                  }}
                >
                  <p
                    style={{
                      color: "#00d1b2",
                      fontWeight: 600,
                      fontSize: 16,
                      marginBottom: 12,
                    }}
                  >
                    Блокнот инсайтов ★
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {saved.map((s, i) => (
                      <motion.div
                        key={s}
                        layout
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          borderRadius: 8,
                          background: "#252525",
                          gap: 8,
                        }}
                        whileHover={{ background: "#2a2a2a" }}
                      >
                        <span
                          style={{
                            color: "#ffffff",
                            fontSize: 14,
                            fontWeight: 600,
                            flex: 1,
                            lineHeight: 1.4,
                          }}
                        >
                          {s}
                        </span>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                          <motion.button
                            whileHover={{ color: "#00d1b2" }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#555",
                              padding: 0,
                            }}
                            title="Редактировать"
                          >
                            <Pencil size={13} />
                          </motion.button>
                          <motion.button
                            whileHover={{ color: "#ff6b35" }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#555",
                              padding: 0,
                            }}
                            title="Удалить"
                            onClick={() => removeInsight(i)}
                          >
                            <Trash2 size={13} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                    {saved.length === 0 && (
                      <p style={{ color: "#555", fontSize: 13 }}>Нет сохранённых инсайтов</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
