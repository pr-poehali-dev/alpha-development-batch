import { motion, AnimatePresence } from "framer-motion"
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const MOCK_RESULT = {
  text: [
    {
      id: 1,
      content: "Найдено",
      highlight: "14 компаний",
      rest: " с высоким риском оттока, которые платили в прошлом квартале.",
    },
    {
      id: 2,
      content: "Рекомендуем обратить внимание на",
      highlight: "3 из них",
      rest: ", так как их активность упала на",
      highlight2: " 40 %",
      rest2: " — это критический порог для данного сегмента.",
    },
    {
      id: 3,
      content: "Совокупный оборот группы риска составляет",
      highlight: "₽ 127 млн",
      rest: " — своевременное вмешательство позволит удержать до",
      highlight2: " 85 % выручки",
      rest2: ".",
    },
  ],
  chartData: [
    { name: "Янв", value: 42 },
    { name: "Фев", value: 58 },
    { name: "Мар", value: 51 },
    { name: "Апр", value: 67 },
    { name: "Май", value: 48 },
    { name: "Июн", value: 34 },
  ],
}

interface ResultsAreaProps {
  visible: boolean
}

export function ResultsArea({ visible }: ResultsAreaProps) {
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
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {MOCK_RESULT.text.map((para) => (
                  <p
                    key={para.id}
                    style={{ color: "#ffffff", fontSize: 15, lineHeight: 1.7, margin: 0 }}
                  >
                    {para.content}{" "}
                    <span style={{ color: "#ff6b35", fontWeight: 600 }}>{para.highlight}</span>
                    {para.rest}
                    {para.highlight2 && (
                      <span style={{ color: "#ff6b35", fontWeight: 600 }}>{para.highlight2}</span>
                    )}
                    {para.rest2}
                  </p>
                ))}
              </div>

              <div style={{ marginTop: 24, height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_RESULT.chartData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#666", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#2a2a2a",
                        border: "1px solid #3a3a3a",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: 12,
                      }}
                      cursor={{ stroke: "#00d1b2", strokeWidth: 1 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00d1b2"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: "#00d1b2" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p style={{ color: "#555", fontSize: 12, marginTop: 8, margin: "8px 0 0" }}>
                Активность клиентов за последние 6 месяцев
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
