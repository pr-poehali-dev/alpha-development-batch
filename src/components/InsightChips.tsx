import { useState } from "react"
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
}

export function InsightChips({ onSelect, activeChip }: InsightChipsProps) {
  return (
    <div
      style={{ marginTop: 20, marginLeft: 80, marginRight: 80 }}
      className="flex justify-center"
    >
      <div style={{ width: "70%" }} className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <motion.button
            key={chip}
            onClick={() => onSelect(chip)}
            style={{
              background: activeChip === chip ? "rgba(255,107,53,0.15)" : "#3a3a3a",
              border: activeChip === chip ? "1px solid #ff6b35" : "1px solid transparent",
              borderRadius: 8,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 12,
              paddingRight: 12,
              color: activeChip === chip ? "#ff6b35" : "#ffffff",
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            whileHover={{
              background: activeChip === chip ? "rgba(255,107,53,0.2)" : "#4a4a4a",
            }}
            whileTap={{ scale: 0.97 }}
          >
            {chip}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
