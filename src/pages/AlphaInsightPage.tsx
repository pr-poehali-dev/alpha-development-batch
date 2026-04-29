import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LogIn, LogOut, Bell, Search } from "lucide-react"
import { QueryBar } from "@/components/QueryBar"
import { InsightChips } from "@/components/InsightChips"
import { SmartFilters } from "@/components/SmartFilters"
import { ResultsArea } from "@/components/ResultsArea"
import { LeftNav } from "@/components/LeftNav"
import { DashboardCharts } from "@/components/DashboardCharts"
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
  const [activeNav, setActiveNav] = useState<string | null>(null)

  useEffect(() => {
    const u = getUser()
    if (u) { setUser(u); loadUserData(u.id) }
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
      if (user) { const hRes = await fetchHistory(user.id); if (hRes.history) setHistory(hRes.history) }
    }
  }

  const handleChipSelect = (chip: string) => { setActiveChip(chip); setQuery(chip); handleSubmit(chip) }
  const handleHistorySelect = (q: string) => { setQuery(q); handleSubmit(q) }

  const handleExport = async () => {
    setExporting(true)
    const res = await exportReport({ query, answer, key_numbers: keyNumbers, chart_label: chartLabel, user_name: user?.name || "Пользователь" })
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

  const handleAuthSuccess = (u: User) => { setUser(u); loadUserData(u.id) }
  const handleLogout = () => { logout(); setUser(null); setHistory([]); setInsights([]) }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0e1016", color: "#fff", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Left navigation */}
      <LeftNav
        history={history}
        insights={insights}
        onHistorySelect={handleHistorySelect}
        onDeleteInsight={handleDeleteInsight}
        activeNav={activeNav}
        onNavSelect={setActiveNav}
      />

      {/* Main area */}
      <div style={{ flex: 1, marginLeft: 64, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Top bar */}
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          height: 60,
          background: "rgba(14,16,22,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 28,
          paddingRight: 24,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg, #F03224, #c0271b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>А</div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px" }}>Альфа Инсайт</span>
            <span style={{ background: "rgba(240,50,36,0.15)", border: "1px solid rgba(240,50,36,0.3)", borderRadius: 4, padding: "1px 6px", color: "#F03224", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" }}>BETA</span>
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.button style={{ background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex" }} whileHover={{ color: "#aaa" }}>
              <Bell size={17} />
            </motion.button>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #F03224, #c0271b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <span style={{ color: "#aaa", fontSize: 13 }}>{user.name}</span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, padding: "5px 12px", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}
                  whileHover={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
                >
                  <LogOut size={13} /> Выйти
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => setAuthOpen(true)}
                style={{ background: "linear-gradient(135deg, #F03224, #c0271b)", border: "none", borderRadius: 7, padding: "6px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 600 }}
                whileHover={{ opacity: 0.9 }}
                whileTap={{ scale: 0.97 }}
              >
                <LogIn size={13} /> Войти
              </motion.button>
            )}
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "32px 32px 60px", overflowY: "auto" }}>

          {/* Page title */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
              {activeNav === "portrait" ? "Портрет клиента"
                : activeNav === "avg-check" ? "Средний чек"
                : activeNav === "dynamics" ? "Динамика клиентов"
                : activeNav === "market" ? "Рынок конкурентов"
                : activeNav === "basket" ? "Корзина покупателя"
                : "Аналитическая панель"}
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#4b5563" }}>
              Аналитика больших данных для корпоративных решений
            </p>
          </div>

          {/* Search area */}
          <div style={{ background: "#13161d", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 28px", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Search size={13} color="#4b5563" />
              <span style={{ color: "#4b5563", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>NLP-запрос</span>
            </div>

            {/* Query bar — fullwidth inside card */}
            <div style={{ marginTop: 12 }}>
              <QueryBarInline
                value={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <InsightChips onSelect={handleChipSelect} activeChip={activeChip} inline />
            </div>
          </div>

          {/* Smart filters + Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SmartFilters visible={showResults} inline />
                <div style={{ marginTop: 16 }}>
                  <ResultsArea
                    visible={showResults}
                    answer={answer}
                    keyNumbers={keyNumbers}
                    chartLabel={chartLabel}
                    exporting={exporting}
                    onExport={handleExport}
                    onSaveInsight={handleSaveInsight}
                    inline
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard charts — always visible */}
          <div style={{ marginTop: showResults ? 32 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ color: "#4b5563", fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Аналитика</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>
            <DashboardCharts />
          </div>
        </div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  )
}

// ─── Inline QueryBar (без отступов страницы) ──────────────────
import { useRef, useState as useLocalState } from "react"
import { Mic, Loader2 } from "lucide-react"

function QueryBarInline({ value, onChange, onSubmit, isLoading }: { value: string; onChange: (v: string) => void; onSubmit: (v: string) => void; isLoading: boolean }) {
  const [focused, setFocused] = useLocalState(false)
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div
      style={{
        height: 52,
        background: "#0e1016",
        borderRadius: 10,
        border: focused ? "1.5px solid #F03224" : "1.5px solid rgba(255,255,255,0.08)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: focused ? "0 0 0 3px rgba(240,50,36,0.10)" : "none",
        display: "flex",
        alignItems: "center",
        paddingLeft: 16,
        paddingRight: 12,
        cursor: "text",
      }}
      onClick={() => ref.current?.focus()}
    >
      <Search size={15} color={focused ? "#F03224" : "#374151"} style={{ marginRight: 10, flexShrink: 0, transition: "color 0.2s" }} />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && onSubmit(value.trim())}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Задайте вопрос на естественном языке…"
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14, caretColor: "#fff" }}
        className="placeholder-[#374151]"
      />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader2 size={17} color="#F03224" className="animate-spin" />
          </motion.div>
        ) : (
          <motion.button key="mic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", display: "flex" }}
            whileHover={{ color: "#F03224" }}
          >
            <Mic size={17} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
