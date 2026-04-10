import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'What earthquakes hit Japan in the last decade?',
  'Analyze flood risk in Bangladesh',
  'Tell me about Hurricane Katrina',
  'Compare wildfire frequency in California vs Australia',
]

// ── Mock NLP — swap with real API call ────────────────────────────────────
async function callNLP(text) {
  await new Promise(r => setTimeout(r, 900 + Math.random() * 600))
  const t = text.toLowerCase()
  if (t.includes('earthquake') || t.includes('quake') || t.includes('seismic'))
    return { text: 'Based on historical seismic data, the most significant earthquakes in recent memory include the 2011 Tōhoku (9.0 Mw), the 2010 Haiti (7.0 Mw), and the 2008 Sichuan (7.9 Mw) events. Each had profoundly different impacts due to infrastructure quality, population density, and emergency preparedness. Would you like a deeper analysis of any of these?', sources: ['USGS Seismic Monitor', 'NOAA Hazard Data'] }
  if (t.includes('flood'))
    return { text: 'Flood risk assessment depends on several converging factors: river discharge rates, catchment area topography, soil saturation, and urbanization patterns. Bangladesh, for instance, faces compound flooding from monsoon rainfall and upstream Himalayan snowmelt, affecting 70% of its land area in severe years. My pre-trained flood model can provide location-specific risk scores.', sources: ['FEMA Flood Maps', 'Global Flood Database'] }
  if (t.includes('hurricane') || t.includes('cyclone') || t.includes('typhoon'))
    return { text: 'Tropical cyclones are classified by sustained wind speed using scales like Saffir-Simpson (Atlantic) or JTWC (Pacific). The 2005 Atlantic season remains the most active on record with 28 named storms. Sea surface temperature, atmospheric shear, and Coriolis force are primary formation drivers. Want me to run intensity predictions for a specific basin?', sources: ['NOAA NHC', 'IBTrACS Database'] }
  if (t.includes('wildfire') || t.includes('fire'))
    return { text: 'Wildfire behavior is modeled using the McArthur Fire Danger Rating System and the Canadian FWI. Key drivers include vapor pressure deficit, fuel moisture content, terrain aspect, and wind speed. California has seen a 600% increase in area burned since the 1970s, largely attributed to prolonged drought and urban-wildland interface expansion.', sources: ['CAL FIRE Statistics', 'NIFC Data Portal'] }
  return { text: `I understand you're asking about "${text}". I specialize in natural disaster analysis, risk assessment, and geospatial intelligence. I can help with earthquake prediction, flood modeling, hurricane tracking, wildfire behavior, and more. Try asking about a specific event, location, or disaster type for detailed analysis.`, sources: [] }
}

// ── Components ─────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 0.2, 0.4].map((d, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--signal)' }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1, delay: d, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 ${
        isUser
          ? 'bg-accent-dim border border-accent/20 text-accent'
          : 'bg-signal-dim border border-signal/20 text-signal'
      }`}>
        {isUser ? 'U' : 'V'}
      </div>

      <div className={`flex flex-col gap-1.5 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-[14.5px] leading-relaxed ${
            isUser
              ? 'bg-elevated border border-border-strong text-ink-primary rounded-tr-sm'
              : 'bg-surface border border-border text-ink-primary rounded-tl-sm'
          }`}
        >
          {msg.content}
        </div>

        {msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {msg.sources.map((s, i) => (
              <span
                key={i}
                className="text-mono px-2 py-0.5 rounded-full"
                style={{
                  fontSize: 10,
                  background: 'rgba(110,231,183,0.07)',
                  color: 'var(--signal)',
                  border: '1px solid rgba(110,231,183,0.15)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <span className="text-mono px-1" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>
          {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'assistant',
      content: "Hello. I'm Vela's NLP engine — trained on global disaster data, geospatial intelligence, and event analysis. What would you like to explore today?",
      sources: [],
      ts: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { id: Date.now(), role: 'user', content: text, sources: [], ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await callNLP(text)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.text,
        sources: res.sources,
        ts: Date.now(),
      }])
    } finally {
      setLoading(false)
    }
  }, [loading])

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length <= 1

  return (
    <div className="flex flex-col h-screen bg-void pt-[72px]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-3xl mx-auto px-4 py-8">

          {/* Empty state */}
          <AnimatePresence>
            {isEmpty && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 pt-8"
              >
                <div
                  className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-5"
                  style={{ background: 'var(--signal-dim)', border: '1px solid rgba(110,231,183,0.2)' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3C6.5 3 2 6.6 2 11c0 2.2 1.1 4.2 2.9 5.7L4 20l4.3-1.8c1.1.4 2.4.7 3.7.7 5.5 0 10-3.6 10-8s-4.5-8-10-8z" stroke="#6ee7b7" strokeWidth="1.5" fill="none"/>
                  </svg>
                </div>
                <h2 className="text-[22px] font-semibold tracking-tight mb-2">Ask anything.</h2>
                <p className="text-sm text-ink-secondary mb-8 max-w-sm mx-auto leading-relaxed">
                  Natural language interface to disaster intelligence, risk modeling, and event analysis.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      onClick={() => send(s)}
                      data-cursor="pointer"
                      className="text-left px-4 py-3 rounded-xl text-sm text-ink-secondary transition-all duration-150 hover:text-ink-primary group"
                      style={{
                        background: 'var(--elevated)',
                        border: '1px solid var(--border)',
                      }}
                      whileHover={{ borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(30,30,35,1)' }}
                    >
                      <span className="group-hover:text-ink-primary transition-colors">{s}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="space-y-5">
            {messages.map(msg => <Message key={msg.id} msg={msg} />)}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-signal-dim border border-signal/20 flex items-center justify-center text-[11px] font-bold text-signal mt-0.5">V</div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-surface border border-border">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </div>

          <div ref={endRef} />
        </div>
      </div>

      {/* Sticky input */}
      <div className="flex-shrink-0 pb-6 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Hint above input on initial */}
          <div
            className="glass-strong rounded-2xl p-2 shadow-[0_-8px_32px_rgba(0,0,0,0.3)]"
            style={{ border: '1px solid var(--border-strong)' }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask about any disaster, location, or event…"
                rows={1}
                disabled={loading}
                className="flex-1 bg-transparent px-3 py-2.5 text-[14.5px] text-ink-primary placeholder:text-ink-muted focus:outline-none resize-none leading-relaxed min-h-[44px] max-h-[160px] overflow-y-auto no-scrollbar"
                style={{ fontFamily: 'var(--font-sans)' }}
                onInput={e => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
                }}
              />
              <motion.button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mb-0.5 transition-all duration-150 disabled:opacity-30"
                style={{
                  background: input.trim() && !loading ? 'var(--signal)' : 'var(--elevated)',
                  border: '1px solid var(--border-strong)',
                }}
                data-cursor="pointer"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14L14 8 2 2v4l8 2-8 2v4z" fill={input.trim() && !loading ? '#020d07' : 'var(--ink-muted)'} />
                </svg>
              </motion.button>
            </div>
          </div>
          <p className="text-center text-mono mt-2" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
