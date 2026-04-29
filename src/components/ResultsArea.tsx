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
  inline?: boolean
}

function ResultsContent({ paragraphs, keyNumbers, chartLabel, exporting, onExport, onSaveInsight }: {
  paragraphs: string[]
  keyNumbers: string[]
  chartLabel: string
  exporting: boolean
  onExport?: () => void
  onSaveInsight?: (text: string) => void
}) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {paragraphs.map((para, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <p style={{ color: "#e5e7eb", fontSize: 14, lineHeight: 1.7, margin: 0, flex: 1 }}>{para}</p>
            {onSaveInsight && (
              <motion.button
                title="Сохранить в блокнот"
                onClick={() => onSaveInsight(para)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: "4px 0", flexShrink: 0, marginTop: 2 }}
                whileHover={{ color: "#F03224" }}
              >
                <Star size={13} />
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {keyNumbers.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {keyNumbers.map((num, i) => (
            <span key={i} style={{ background: "rgba(240,50,36,0.10)", border: "1px solid rgba(240,50,36,0.25)", borderRadius: 6, padding: "3px 10px", color: "#F03224", fontWeight: 600, fontSize: 12 }}>
              {num}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, height: 90 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_CHART}>
            <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#1a1e27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 11 }} cursor={{ stroke: "#F03224", strokeWidth: 1 }} />
            <Line type="monotone" dataKey="value" stroke="#F03224" strokeWidth={2} dot={false} activeDot={{ r: 3, fill: "#F03224" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p style={{ color: "#4b5563", fontSize: 11, margin: "6px 0 0" }}>{chartLabel}</p>

      {onExport && (
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <motion.button
            onClick={onExport}
            disabled={exporting}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(240,50,36,0.10)", border: "1px solid rgba(240,50,36,0.25)", borderRadius: 7, padding: "7px 14px", color: "#F03224", fontWeight: 600, fontSize: 12, cursor: exporting ? "not-allowed" : "pointer", opacity: exporting ? 0.7 : 1 }}
            whileHover={{ background: "rgba(240,50,36,0.18)" }}
            whileTap={{ scale: 0.97 }}
          >
            {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            {exporting ? "Генерация…" : "Скачать отчёт"}
          </motion.button>
        </div>
      )}
    </>
  )
}

export function ResultsArea({ visible, answer, keyNumbers = [], chartLabel = "Динамика", exporting = false, onExport, onSaveInsight, inline }: ResultsAreaProps) {
  const paragraphs = answer ? answer.split("\n").filter((p) => p.trim()) : []

  const cardStyle: React.CSSProperties = inline
    ? { background: "#13161d", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.07)" }
    : { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", borderRadius: 14, padding: 28, border: "1px solid rgba(255,255,255,0.08)" }

  if (inline) {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div style={cardStyle}>
              <ResultsContent paragraphs={paragraphs} keyNumbers={keyNumbers} chartLabel={chartLabel} exporting={exporting} onExport={onExport} onSaveInsight={onSaveInsight} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3, delay: 0.1 }}
          style={{ marginTop: 30, marginLeft: 80, marginRight: 80 }} className="flex justify-center">
          <div style={{ width: "70%" }}>
            <div style={cardStyle}>
              <ResultsContent paragraphs={paragraphs} keyNumbers={keyNumbers} chartLabel={chartLabel} exporting={exporting} onExport={onExport} onSaveInsight={onSaveInsight} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
