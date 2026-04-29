import func2url from "../../backend/func2url.json"

const AUTH_URL = func2url["auth"]
const ANALYZE_URL = func2url["analyze"]
const INSIGHTS_URL = func2url["insights"]
const EXPORT_URL = func2url["export-pdf"]

export { AUTH_URL, ANALYZE_URL, INSIGHTS_URL, EXPORT_URL }

export async function authRequest(action: string, data: object) {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...data }),
  })
  return res.json()
}

export async function analyzeQuery(query: string, userId?: number) {
  const res = await fetch(ANALYZE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, user_id: userId }),
  })
  return res.json()
}

export async function fetchHistory(userId: number) {
  const res = await fetch(`${ANALYZE_URL}/history?user_id=${userId}`)
  return res.json()
}

export async function fetchInsights(userId: number) {
  const res = await fetch(`${INSIGHTS_URL}?user_id=${userId}`)
  return res.json()
}

export async function createInsight(userId: number, text: string) {
  const res = await fetch(INSIGHTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, text }),
  })
  return res.json()
}

export async function deleteInsight(id: number) {
  const res = await fetch(`${INSIGHTS_URL}/${id}`, { method: "DELETE" })
  return res.json()
}

export async function exportReport(data: {
  query: string
  answer: string
  key_numbers: string[]
  chart_label: string
  user_name: string
}) {
  const res = await fetch(EXPORT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, title: "Аналитический отчёт" }),
  })
  return res.json()
}
