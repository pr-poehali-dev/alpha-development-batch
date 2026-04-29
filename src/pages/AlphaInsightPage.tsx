import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LogIn, LogOut } from "lucide-react"
import { QueryBar } from "@/components/QueryBar"
import { InsightChips } from "@/components/InsightChips"
import { SmartFilters } from "@/components/SmartFilters"
import { ResultsArea } from "@/components/ResultsArea"
import { SidePanel } from "@/components/SidePanel"
import { AuthModal } from "@/components/AuthModal"
import { analyzeQuery, exportReport, fetchHistory, fetchInsights, createInsight, deleteInsight } from "@/lib/api"
import { getUser, logout, type User } from "@/lib/auth"

export interface HistoryItem { id: number; query: string; created_at: string }
export interface InsightItem { id: number; text: string }

export function AlphaInsightPage() {
  const [query, setQuery] = useState("")
  const [activeChip, setActiveChip] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [answer, setAnswer] = useState("")
  const [keyNumbers, setKeyNumbers] = useState<string[]>([])
  const [chartLabel, setChartLabel] = useState("")
  const [exporting, setExporting] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [insights, setInsights] = useState<InsightItem[]>([])

  useEffect(() => {
    const u = getUser()
    if (u) {
      setUser(u)
      loadUserData(u.id)
    }
  }, [])

  const loadUserData = async (userId: number) => {
    const [histRes, insRes] = await Promise.all([fetchHistory(userId), fetchInsights(userId)])
    if (histRes.history) setHistory(histRes.history)
    if (insRes.insights) setInsights(insRes.insights)
  }

  const handleSubmit = async (val: string) => {
    if (!val.trim()) return
    setIsLoading(true)
    setShowResults(false)
    const res = await analyzeQuery(val, user?.id)
    setIsLoading(false)
    if (res.answer) {
      setAnswer(res.answer)
      setKeyNumbers(res.key_numbers || [])
      setChartLabel(res.chart_label || "Динамика")
      setShowResults(true)
      if (user) {
        const hRes = await fetchHistory(user.id)
        if (hRes.history) setHistory(hRes.history)
      }
    }
  }

  const handleChipSelect = (chip: string) => {
    setActiveChip(chip)
    setQuery(chip)
    handleSubmit(chip)
  }

  const handleHistorySelect = (q: string) => {
    setQuery(q)
    handleSubmit(q)
  }

  const handleExport = async () => {
    setExporting(true)
    const res = await exportReport({
      query,
      answer,
      key_numbers: keyNumbers,
      chart_label: chartLabel,
      user_name: user?.name || "Пользователь",
    })
    setExporting(false)
    if (res.url) window.open(res.url, "_blank")
  }

  const handleSaveInsight = async (text: string) => {
    if (!user) { setAuthOpen(true); return }
    const res = await createInsight(user.id, text)
    if (res.id) setInsights((prev) => [{ id: res.id, text }, ...prev])
  }

  const handleDeleteInsight = async (id: number) => {
    await deleteInsight(id)
    setInsights((prev) => prev.filter((i) => i.id !== id))
  }

  const handleAuthSuccess = (u: User) => {
    setUser(u)
    loadUserData(u.id)
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    setHistory([])
    setInsights([])
  }

  return (
    <main style={{ minHeight: "100vh", background: "#1a1a1a", position: "relative", overflowX: "hidden", paddingBottom: 60 }}>
      {/* Animated gradient orbs */}
      <motion.div
        style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,50,36,0.10) 0%, transparent 70%)", filter: "blur(80px)", top: "-10%", right: "-10%", zIndex: 0, pointerEvents: "none" }}
        animate={{ x: [0, -60, 30, 0], y: [0, 60, -30, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ position: "fixed", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.10) 0%, transparent 70%)", filter: "blur(100px)", bottom: "-15%", left: "-15%", zIndex: 0, pointerEvents: "none" }}
        animate={{ x: [0, 80, 40, 0], y: [0, -60, 30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ position: "fixed", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,50,36,0.07) 0%, transparent 70%)", filter: "blur(60px)", top: "50%", left: "40%", zIndex: 0, pointerEvents: "none" }}
        animate={{ x: [0, -40, 20, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, opacity: 0.03 }} />

      <SidePanel
        history={history}
        insights={insights}
        onHistorySelect={handleHistorySelect}
        onDeleteInsight={handleDeleteInsight}
      />

      {/* Auth button top-right */}
      <div style={{ position: "fixed", top: 16, right: 20, zIndex: 100 }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#888", fontSize: 13 }}>{user.name}</span>
            <motion.button
              onClick={handleLogout}
              style={{ background: "#2a2a2a", border: "1px solid #3a3a3a", borderRadius: 8, padding: "6px 12px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
              whileHover={{ background: "#3a3a3a" }}
            >
              <LogOut size={14} /> Выйти
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={() => setAuthOpen(true)}
            style={{ background: "linear-gradient(135deg, #F03224, #c0271b)", border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
          >
            <LogIn size={14} /> Войти
          </motion.button>
        )}
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "relative", zIndex: 10, textAlign: "center", paddingTop: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #F03224, #c0271b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#ffffff" }}>
            А
          </div>
          <span style={{ color: "#ffffff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>
            Альфа Инсайт
          </span>
          <span style={{ background: "rgba(240,50,36,0.15)", border: "1px solid rgba(240,50,36,0.3)", borderRadius: 6, padding: "2px 8px", color: "#F03224", fontSize: 11, fontWeight: 600, letterSpacing: "0.5px" }}>
            BETA
          </span>
        </div>
        <p style={{ color: "#555", fontSize: 13, marginTop: 6 }}>
          Аналитика больших данных для корпоративных решений
        </p>
      </motion.div>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <QueryBar value={query} onChange={setQuery} onSubmit={handleSubmit} isLoading={isLoading} />
        <InsightChips onSelect={handleChipSelect} activeChip={activeChip} />
        <SmartFilters visible={showResults} />
        <ResultsArea
          visible={showResults}
          answer={answer}
          keyNumbers={keyNumbers}
          chartLabel={chartLabel}
          exporting={exporting}
          onExport={handleExport}
          onSaveInsight={handleSaveInsight}
        />
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </main>
  )
}
