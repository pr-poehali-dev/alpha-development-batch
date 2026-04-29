import { motion } from "framer-motion"

const CHIPS = [
  "Прогноз прибыли на июнь",
  "Клиенты с риском оттока",
  "Кэш-флоу на неделю",
  "Топ-5 регионов по обороту",
]

interface InsightChipsProps {
  onSelect: (text: string) => void
  activeChip: string | null
  inline?: boolean
}

export function InsightChips({ onSelect, activeChip, inline }: InsightChipsProps) {
  const chips = (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map((chip) => (
        <motion.button
          key={chip}
          onClick={() => onSelect(chip)}
          style={{
            background: activeChip === chip ? "rgba(240,50,36,0.12)" : "rgba(255,255,255,0.05)",
            border: activeChip === chip ? "1px solid rgba(240,50,36,0.5)" : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 12,
            paddingRight: 12,
            color: activeChip === chip ? "#F03224" : "#6b7280",
            fontSize: 12,
            cursor: "pointer",
            transition: "all 0.15s",
            fontWeight: activeChip === chip ? 600 : 400,
          }}
          whileHover={{ color: "#F03224", background: "rgba(240,50,36,0.08)" }}
          whileTap={{ scale: 0.97 }}
        >
          {chip}
        </motion.button>
      ))}
    </div>
  )

  if (inline) return chips

  return (
    <div style={{ marginTop: 20, marginLeft: 80, marginRight: 80 }} className="flex justify-center">
      <div style={{ width: "70%" }}>{chips}</div>
    </div>
  )
}
