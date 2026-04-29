import { useState } from "react"
import { motion } from "framer-motion"
import { QueryBar } from "@/components/QueryBar"
import { InsightChips } from "@/components/InsightChips"
import { SmartFilters } from "@/components/SmartFilters"
import { ResultsArea } from "@/components/ResultsArea"
import { SidePanel } from "@/components/SidePanel"

export function AlphaInsightPage() {
  const [query, setQuery] = useState("")
  const [activeChip, setActiveChip] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = (val: string) => {
    setIsLoading(true)
    setShowResults(false)
    setTimeout(() => {
      setIsLoading(false)
      setShowResults(true)
    }, 1400)
  }

  const handleChipSelect = (chip: string) => {
    setActiveChip(chip)
    setQuery(chip)
    handleSubmit(chip)
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1a1a1a",
        position: "relative",
        overflowX: "hidden",
        paddingBottom: 60,
      }}
    >
      {/* Animated gradient orbs — бирюза/оранжевый под бренд */}
      <motion.div
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,209,178,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "-10%",
          right: "-10%",
          zIndex: 0,
          pointerEvents: "none",
        }}
        animate={{ x: [0, -60, 30, 0], y: [0, 60, -30, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "fixed",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.10) 0%, transparent 70%)",
          filter: "blur(100px)",
          bottom: "-15%",
          left: "-15%",
          zIndex: 0,
          pointerEvents: "none",
        }}
        animate={{ x: [0, 80, 40, 0], y: [0, -60, 30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "fixed",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,209,178,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "50%",
          left: "40%",
          zIndex: 0,
          pointerEvents: "none",
        }}
        animate={{ x: [0, -40, 20, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />

      {/* Sidebar */}
      <SidePanel />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #00d1b2, #00a896)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
              color: "#1a1a1a",
            }}
          >
            А
          </div>
          <span
            style={{
              color: "#ffffff",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            Альфа Инсайт
          </span>
          <span
            style={{
              background: "rgba(0,209,178,0.15)",
              border: "1px solid rgba(0,209,178,0.3)",
              borderRadius: 6,
              padding: "2px 8px",
              color: "#00d1b2",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            BETA
          </span>
        </div>
        <p style={{ color: "#555", fontSize: 13, marginTop: 6 }}>
          Аналитика больших данных для корпоративных решений
        </p>
      </motion.div>

      {/* Content — relative z-index выше фона */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <QueryBar
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <InsightChips onSelect={handleChipSelect} activeChip={activeChip} />

        <SmartFilters visible={showResults} />

        <ResultsArea visible={showResults} />
      </div>
    </main>
  )
}
