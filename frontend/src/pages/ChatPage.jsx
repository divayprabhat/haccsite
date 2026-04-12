import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Types ──────────────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'What earthquakes hit Japan in the last decade?',
  'Analyze flood risk in Bangladesh',
  'Tell me about Hurricane Katrina',
  'Compare wildfire frequency in California vs Australia',
]

// ── Real NLP via Vela backend ─────────────────────────────────────────────
const API_BASE = '/api'
const DEFAULT_MODEL_ID = 'default'

// ── Model Management ───────────────────────────────────────────────────────
async function fetchAvailableModels() {
  try {
    const response = await fetch(`${API_BASE}/models`)
    if (!response.ok) return []
    const data = await response.json()
    return data.models || []
  } catch (error) {
    console.error('Error fetching models:', error)
    return []
  }
}

async function callNLP(text, modelId = DEFAULT_MODEL_ID) {
  const response = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model_id: modelId,
      query: text,
      use_llm: true,
      llm_model: 'llama3.2:1b',
      top_n: 8,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const detail = err.detail || `HTTP ${response.status}`
    if (response.status === 404) {
      return {
        text: `No trained model found for "${modelId}". Please train a model first on the Train page, or upload data to teach Vela about this domain.`,
        sources: [],
      }
    }
    throw new Error(detail)
  }

  const data = await response.json()
  const predictions = data.predictions || []

  let responseText = ''
  if (predictions.length === 0) {
    responseText = `No strong causal connections found in the model for: "${data.normalized || text}". Try training more data or rephrasing your query.`
  } else {
    const top = predictions.slice(0, 5)
    const lines = top.map(p => {
      const dir = p.direction === 'increase' ? '↑' : p.direction === 'decrease' ? '↓' : '~'
      const conf = (p.confidence * 100).toFixed(1)
      const hops = p.hops > 1 ? ` (${p.hops} hops)` : ''
      return `• ${dir} ${p.token} — ${conf}% confidence${hops}`
    })
    responseText =
      `Causal analysis for: "${data.normalized || text}"\n\n` +
      `Top predicted effects:\n${lines.join('\n')}` +
      (predictions.length > 5 ? `\n\n…and ${predictions.length - 5} more effects.` : '')
  }

  const sources = data.tokens?.length
    ? [`Model: ${data.model_id}`, `Tokens: ${data.tokens.join(', ')}`]
    : [`Model: ${data.model_id}`]

  return { text: responseText, sources, raw: data }
}

// ── Components ─────────────────────────────────────────────────────────────
function ModelSelector({ availableModels, selectedModel, setSelectedModel, showModelSelector, setShowModelSelector }) {
  return (
    <div className="relative model-selector">
      <button
        onClick={() => setShowModelSelector(!showModelSelector)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
        style={{
          background: 'var(--elevated)',
          border: '1px solid var(--border)',
          color: 'var(--ink-secondary)'
        }}
        data-cursor="pointer"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4h8M4 2v4M6 6h4M8 8v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-medium">{selectedModel}</span>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={`transition-transform duration-200 ${showModelSelector ? 'rotate-180' : ''}`}>
          <path d="M2 2l2 2 2-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {showModelSelector && (
        <div className="absolute top-full left-0 mt-1 w-48 rounded-lg shadow-lg border z-50" style={{
          background: 'var(--elevated)',
          border: '1px solid var(--border-strong)'
        }}>
          <div className="p-1">
            {availableModels.length === 0 ? (
              <div className="px-3 py-2 text-xs" style={{ color: 'var(--ink-muted)' }}>
                No models available
              </div>
            ) : (
              availableModels.map((model) => (
                <button
                  key={model.model_id}
                  onClick={() => {
                    setSelectedModel(model.model_id)
                    setShowModelSelector(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded text-xs transition-colors duration-150 hover:bg-surface"
                  style={{
                    color: selectedModel === model.model_id ? 'var(--signal)' : 'var(--ink-secondary)',
                    background: selectedModel === model.model_id ? 'rgba(110,231,183,0.1)' : 'transparent'
                  }}
                  data-cursor="pointer"
                >
                  <div className="font-medium">{model.model_id}</div>
                  {model.description && (
                    <div className="text-mono mt-0.5" style={{ fontSize: 9, color: 'var(--ink-muted)' }}>
                      {model.description}
                    </div>
                  )}
                  <div className="flex gap-3 mt-1 text-mono" style={{ fontSize: 9, color: 'var(--ink-muted)' }}>
                    <span>{model.doc_count || 0} docs</span>
                    <span>{model.edge_count || 0} edges</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

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

        {/* Training File Attachment */}
        {msg.attachment && (
          <div className="mt-2 p-3 rounded-xl" style={{ 
            background: 'rgba(110,231,183,0.06)', 
            border: '1px solid rgba(110,231,183,0.15)' 
          }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded flex items-center justify-center" style={{ 
                background: 'var(--signal)', 
                border: '1px solid rgba(110,231,183,0.2)' 
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4h6M7 2l2 2-2 2" stroke="#020d07" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--signal)' }}>
                Training File Attached
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-mono" style={{ color: 'var(--ink-muted)' }}>FILE:</span>
                <p className="font-medium">{msg.attachment.name}</p>
              </div>
              <div>
                <span className="text-mono" style={{ color: 'var(--ink-muted)' }}>TYPE:</span>
                <p className="font-medium">{msg.attachment.type}</p>
              </div>
              <div>
                <span className="text-mono" style={{ color: 'var(--ink-muted)' }}>SIZE:</span>
                <p className="font-medium">{msg.attachment.size}</p>
              </div>
              <div>
                <span className="text-mono" style={{ color: 'var(--ink-muted)' }}>STATUS:</span>
                <p className="font-medium capitalize" style={{ 
                  color: msg.attachment.status === 'completed' ? 'var(--signal)' : 'var(--accent)' 
                }}>
                  {msg.attachment.status.replace('_', ' ')}
                </p>
              </div>
            </div>

            {msg.attachment.rows > 0 && (
              <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(110,231,183,0.1)' }}>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-mono" style={{ color: 'var(--ink-muted)' }}>ROWS:</span>
                    <p className="font-medium">{msg.attachment.rows.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-mono" style={{ color: 'var(--ink-muted)' }}>COLUMNS:</span>
                    <p className="font-medium">{msg.attachment.columns}</p>
                  </div>
                </div>
              </div>
            )}

            {msg.attachment.hyperparameters && (
              <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(110,231,183,0.1)' }}>
                <p className="text-mono mb-2" style={{ color: 'var(--ink-muted)' }}>HYPERPARAMETERS:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(msg.attachment.hyperparameters).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-mono" style={{ color: 'var(--ink-muted)' }}>
                        {key.toUpperCase().replace('_', ' ')}:
                      </span>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {msg.attachment.metrics && (
              <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(110,231,183,0.1)' }}>
                <p className="text-mono mb-2" style={{ color: 'var(--ink-muted)' }}>METRICS:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(msg.attachment.metrics).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-mono" style={{ color: 'var(--ink-muted)' }}>
                        {key === 'valLoss' ? 'NEGATE' : key === 'valAcc' ? 'CONFIDENCE' : key.toUpperCase()}:
                      </span>
                      <p className="font-medium">{typeof value === 'number' ? value.toFixed(4) : value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {msg.attachment.fileData && (
              <div className="mt-2 pt-2 border-t" style={{ borderColor: 'rgba(110,231,183,0.1)' }}>
                <p className="text-mono mb-2" style={{ color: 'var(--ink-muted)' }}>FILE CONTENT:</p>
                <div className="text-xs font-mono p-2 rounded max-h-32 overflow-y-auto no-scrollbar" style={{ 
                  background: 'var(--elevated)', 
                  border: '1px solid var(--border)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}>
                  {msg.attachment.fileData.substring(0, 500)}{msg.attachment.fileData.length > 500 ? '...' : ''}
                </div>
              </div>
            )}
          </div>
        )}

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
  const [attachedTrainingFile, setAttachedTrainingFile] = useState(null)
  const [availableModels, setAvailableModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  // Fetch available models on component mount
  useEffect(() => {
    const loadModels = async () => {
      const models = await fetchAvailableModels()
      setAvailableModels(models)
    }
    loadModels()
  }, [])

  // Check for training file data from train page
  useEffect(() => {
    const trainingData = sessionStorage.getItem('trainingFileData')
    if (trainingData) {
      try {
        const parsedData = JSON.parse(trainingData)
        setAttachedTrainingFile(parsedData)
        // Set model from training file if available
        if (parsedData.model_id) {
          setSelectedModel(parsedData.model_id)
        }
        
        // Add appropriate message based on chatOnly flag
        const systemMessage = {
          id: Date.now(),
          role: 'assistant',
          content: parsedData.chatOnly 
            ? `I've attached your training file "${parsedData.name}" (${parsedData.type}, ${parsedData.size}). You can now ask me questions about this model or request analysis.`
            : `I've attached your training file "${parsedData.name}" (${parsedData.type}, ${parsedData.size}) with ${parsedData.rows} rows and ${parsedData.columns} columns. The model appears to be ${parsedData.status === 'completed' ? 'completed' : 'in progress'}. You can ask me questions about this model or request analysis.`,
          sources: parsedData.config ? ['Training Configuration', 'Model Metrics'] : ['Training File'],
          ts: Date.now(),
          attachment: parsedData.chatOnly ? null : {
            ...parsedData,
            fileData: parsedData.fileData ? atob(parsedData.fileData) : null,
          },
        }
        setMessages(prev => [...prev, systemMessage])
        
        // Clear sessionStorage after processing
        sessionStorage.removeItem('trainingFileData')
      } catch (error) {
        console.error('Error parsing training file data:', error)
      }
    }
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Close model selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showModelSelector && !event.target.closest('.model-selector')) {
        setShowModelSelector(false)
      }
    }
    
    if (showModelSelector) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModelSelector])

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { id: Date.now(), role: 'user', content: text, sources: [], ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const modelId = attachedTrainingFile?.model_id || selectedModel
      const res = await callNLP(text, modelId)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.text,
        sources: res.sources,
        ts: Date.now(),
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error contacting Vela backend: ${err.message}. Make sure the backend is running on port 8000.`,
        sources: [],
        ts: Date.now(),
      }])
    } finally {
      setLoading(false)
    }
  }, [loading, selectedModel])

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
          {/* Model selector and input */}
          <div className="flex items-center gap-3 mb-3">
            <ModelSelector
              availableModels={availableModels}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              showModelSelector={showModelSelector}
              setShowModelSelector={setShowModelSelector}
            />
            <div className="text-mono" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>
              Active Model
            </div>
          </div>
          
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
