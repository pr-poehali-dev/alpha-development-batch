import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"
import { authRequest } from "@/lib/api"
import { saveSession } from "@/lib/auth"

interface AuthModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (user: { id: number; email: string; name: string }) => void
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const submit = async () => {
    setError("")
    if (!email || !password || (mode === "register" && !name)) {
      setError("Заполните все поля")
      return
    }
    setLoading(true)
    const data = mode === "register"
      ? { email, password, name }
      : { email, password }
    const res = await authRequest(mode, data)
    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      saveSession(res.token, res.user)
      onSuccess(res.user)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 380,
              background: "#242424",
              borderRadius: 16,
              border: "1px solid #333",
              padding: 32,
              zIndex: 201,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #F03224, #c0271b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>А</div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Альфа Инсайт</span>
                </div>
                <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
                  {mode === "login" ? "Войдите в аккаунт" : "Создайте аккаунт"}
                </p>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#555", padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mode === "register" && (
                <input
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              )}
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ color: "#F03224", fontSize: 13, marginTop: 10 }}>{error}</p>
            )}

            <motion.button
              onClick={submit}
              disabled={loading}
              style={{
                marginTop: 20,
                width: "100%",
                height: 44,
                background: "linear-gradient(135deg, #F03224, #c0271b)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: loading ? 0.7 : 1,
              }}
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "login" ? "Войти" : "Зарегистрироваться"}
            </motion.button>

            <p style={{ textAlign: "center", marginTop: 16, color: "#666", fontSize: 13 }}>
              {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
              <span
                style={{ color: "#F03224", cursor: "pointer" }}
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError("") }}
              >
                {mode === "login" ? "Зарегистрироваться" : "Войти"}
              </span>
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  background: "#2a2a2a",
  border: "1px solid #3a3a3a",
  borderRadius: 10,
  padding: "0 14px",
  color: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
}
