import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Download, Loader2, Star } from "lucide-react"

const MOCK_CHART = [
  { name: "Янв", value: 42 },
  { name: "Фев", value: 58 },
  { name: "Мар", value: 51 },
  { name: "Апр", value: 67 },
  { name: "Май", value: 48 },
  { name: "Июн", value: 34 },
]

interface ResultsAreaProps {
  visible: boolean
  answer?: string
  keyNumbers?: string[]
  chartLabel?: string
  exporting?: boolean
  onExport?: () => void
  onSaveInsight?: (text: string) => void
}

export function ResultsArea({
  visible,
  answer,
  keyNumbers = [],
  chartLabel = "Динамика",
  exporting = false,
  onExport,
  onSaveInsight,
}: ResultsAreaProps) {
  const paragraphs = answer ? answer.split("\n").filter((p) => p.trim()) : []

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ marginTop: 30, marginLeft: 80, marginRight: 80 }}
          className="flex justify-center"
        >
          <div style={{ width: "70%" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
                borderRadius: 14,
                padding: 28,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {paragraphs.map((para, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <p style={{ color: "#ffffff", fontSize: 15, lineHeight: 1.7, margin: 0, flex: 1 }}>
                      {para}
                    </p>
                    {onSaveInsight && (
                      <motion.button
                        title="Сохранить в блокнот"
                        onClick={() => onSaveInsight(para)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: "4px 0", flexShrink: 0, marginTop: 2 }}
                        whileHover={{ color: "#F03224" }}
                      >
                        <Star size={14} />
                      </motion.button>
                    )}
                  </div>
                ))}
              </div>

              {keyNumbers.length > 0 && (
                <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {keyNumbers.map((num, i) => (
                    <span
                      key={i}
                      style={{
                        background: "rgba(240,50,36,0.12)",
                        border: "1px solid rgba(240,50,36,0.3)",
                        borderRadius: 8,
                        padding: "4px 12px",
                        color: "#F03224",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 24, height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_CHART}>
                    <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: 8, color: "#fff", fontSize: 12 }}
                      cursor={{ stroke: "#F03224", strokeWidth: 1 }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#F03224" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#F03224" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p style={{ color: "#555", fontSize: 12, margin: "8px 0 0" }}>{chartLabel}</p>

              {onExport && (
                <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                  <motion.button
                    onClick={onExport}
                    disabled={exporting}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(240,50,36,0.12)",
                      border: "1px solid rgba(240,50,36,0.3)",
                      borderRadius: 8,
                      padding: "8px 16px",
                      color: "#F03224",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: exporting ? "not-allowed" : "pointer",
                      opacity: exporting ? 0.7 : 1,
                    }}
                    whileHover={{ background: "rgba(240,50,36,0.2)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    {exporting ? "Генерация…" : "Скачать отчёт"}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
