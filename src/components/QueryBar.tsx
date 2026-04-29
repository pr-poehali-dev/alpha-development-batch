import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Loader2 } from "lucide-react"

interface QueryBarProps {
  value: string
  onChange: (val: string) => void
  onSubmit: (val: string) => void
  isLoading: boolean
}

export function QueryBar({ value, onChange, onSubmit, isLoading }: QueryBarProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit(value.trim())
    }
  }

  return (
    <div
      style={{ marginTop: 60, marginLeft: 80, marginRight: 80 }}
      className="flex justify-center"
    >
      <div
        style={{
          width: "70%",
          height: 56,
          background: "#2a2a2a",
          borderRadius: 12,
          border: focused ? "2px solid #00d1b2" : "2px solid transparent",
          transition: "border-color 0.2s",
          display: "flex",
          alignItems: "center",
          paddingLeft: 20,
          paddingRight: 16,
          boxShadow: focused ? "0 0 0 3px rgba(0,209,178,0.15)" : "none",
          position: "relative",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Задайте вопрос на естественном языке…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#ffffff",
            fontSize: 15,
            caretColor: "#ffffff",
            fontStyle: value ? "normal" : "italic",
          }}
          className="placeholder-[#888888]"
        />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2 size={20} color="#00d1b2" className="animate-spin" />
            </motion.div>
          ) : (
            <motion.button
              key="mic"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                borderRadius: 6,
                color: "#888888",
                display: "flex",
                alignItems: "center",
              }}
              whileHover={{ color: "#00d1b2" }}
              title="Голосовой ввод"
            >
              <Mic size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
