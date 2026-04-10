import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Data ───────────────────────────────────────────────────────────────────
const MODELS = [
  {
    id: 'eq',
    name: 'Seismic Risk',
    subtitle: 'Earthquake Predictor',
    icon: '🌋',
    accuracy: 87.3,
    samples: 125000,
    locations: ['Japan', 'California', 'Nepal', 'Turkey', 'Chile'],
    accent: '#fb923c',
    description: 'Multi-layer seismic model trained on fault-line data, historical magnitude distributions, and USGS telemetry.',
    metrics: { precision: 88.1, recall: 86.4, f1: 87.2 },
    outputs: ['Magnitude forecast', 'Epicenter probability', 'Aftershock sequence'],
  },
  {
    id: 'fl',
    name: 'Flood Risk',
    subtitle: 'Hydrological Analyzer',
    icon: '🌊',
    accuracy: 84.6,
    samples: 98000,
    locations: ['Bangladesh', 'Netherlands', 'Vietnam', 'India', 'Germany'],
    accent: '#38bdf8',
    description: 'River basin and coastal flood modeling using terrain elevation, rainfall records, and drainage infrastructure data.',
    metrics: { precision: 85.2, recall: 83.9, f1: 84.5 },
    outputs: ['Inundation extent', 'Peak discharge', 'Return period'],
  },
  {
    id: 'hu',
    name: 'Hurricane Track',
    subtitle: 'Tropical Cyclone Model',
    icon: '🌀',
    accuracy: 89.2,
    samples: 76000,
    locations: ['Florida', 'Philippines', 'Taiwan', 'Mexico', 'Texas'],
    accent: '#818cf8',
    description: 'NWP-augmented path prediction with intensity forecasting using sea surface temperature and wind shear gradients.',
    metrics: { precision: 90.1, recall: 88.2, f1: 89.1 },
    outputs: ['Track forecast', 'Landfall probability', 'Storm surge height'],
  },
  {
    id: 'wf',
    name: 'Wildfire Danger',
    subtitle: 'Fire Behavior Engine',
    icon: '🔥',
    accuracy: 91.5,
    samples: 54000,
    locations: ['California', 'Australia', 'Greece', 'Portugal', 'Canada'],
    accent: '#f87171',
    description: 'Fire behavior simulation using vegetation, drought indices, wind speed, topography, and ignition history.',
    metrics: { precision: 92.3, recall: 90.7, f1: 91.5 },
    outputs: ['Spread rate', 'Perimeter forecast', 'Danger index'],
  },
  {
    id: 'ts',
    name: 'Tsunami Warning',
    subtitle: 'Ocean Wave Propagation',
    icon: '⚡',
    accuracy: 86.8,
    samples: 32000,
    locations: ['Indonesia', 'Japan', 'Chile', 'Alaska', 'Hawaii'],
    accent: '#34d399',
    description: 'Sub-ocean earthquake detection with wave propagation physics for coastal inundation time estimates.',
    metrics: { precision: 87.5, recall: 86.1, f1: 86.8 },
    outputs: ['Wave arrival time', 'Run-up height', 'Evacuation window'],
  },
  {
    id: 'ls',
    name: 'Landslide Monitor',
    subtitle: 'Slope Stability Engine',
    icon: '⛰️',
    accuracy: 83.9,
    samples: 28000,
    locations: ['Nepal', 'Colombia', 'Switzerland', 'China', 'Italy'],
    accent: '#a78bfa',
    description: 'Rainfall-triggered and seismically-induced landslide probability using DEM data and soil saturation models.',
    metrics: { precision: 84.6, recall: 83.1, f1: 83.8 },
    outputs: ['Failure probability', 'Volume estimate', 'Runout distance'],
  },
]

// ── Mock analysis ──────────────────────────────────────────────────────────
async function runAnalysis(modelId, location) {
  await new Promise(r => setTimeout(r, 2200))
  const model = MODELS.find(m => m.id === modelId)
  const risk = ['Low', 'Moderate', 'High', 'Severe'][Math.floor(Math.random() * 4)]
  const confidence = (74 + Math.random() * 22).toFixed(1)
  const score = (Math.random() * 100).toFixed(0)
  return {
    model: model.name,
    location,
    risk,
    confidence,
    score,
    outputs: model.outputs.map(o => ({
      label: o,
      value: ['Low', 'Moderate', 'High', '14.2', '6.8', '2.3 hrs', '87%', '12m', '4.1 MW', '340 km/h'].sort(() => 0.5 - Math.random())[0],
    })),
    timestamp: new Date().toISOString(),
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────
function ModelCard({ model, selected, onSelect }) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      data-cursor="pointer"
      className="relative text-left w-full transition-all duration-200 focus:outline-none"
    >
      <div
        className={`card p-5 h-full flex flex-col gap-3 transition-all duration-200 ${
          selected ? 'border-opacity-60' : 'hover:border-opacity-20'
        }`}
        style={selected ? {
          borderColor: model.accent + '55',
          boxShadow: `0 0 0 1px ${model.accent}22, 0 8px 32px ${model.accent}0d`,
        } : {}}
      >
        {/* Subtle glow on select */}
        {selected && (
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{ background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${model.accent}08, transparent)` }}
          />
        )}

        <div className="flex items-start justify-between">
          <span className="text-2xl">{model.icon}</span>
          {selected && (
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: model.accent }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        <div>
          <p className="text-[13px] font-medium" style={{ color: model.accent }}>{model.subtitle}</p>
          <h3 className="text-[16px] font-semibold tracking-tight mt-0.5">{model.name}</h3>
        </div>

        {/* Accuracy bar */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-mono" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>Accuracy</span>
            <span className="text-mono" style={{ fontSize: 11, color: model.accent }}>{model.accuracy}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: model.accent }}
              initial={{ width: 0 }}
              whileInView={{ width: `${model.accuracy}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-1">
          {model.locations.slice(0, 3).map(loc => (
            <span key={loc} className="text-mono px-1.5 py-0.5 rounded-md" style={{ fontSize: 10, background: 'var(--elevated)', color: 'var(--ink-muted)', border: '1px solid var(--border)' }}>
              {loc}
            </span>
          ))}
          {model.locations.length > 3 && (
            <span className="text-mono px-1.5 py-0.5 rounded-md" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>
              +{model.locations.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  )
}

function AnalysisPanel({ model, onClose }) {
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done
  const [result, setResult] = useState(null)

  const analyze = async () => {
    if (!location.trim()) return
    setStatus('loading')
    const res = await runAnalysis(model.id, location)
    setResult(res)
    setStatus('done')
  }

  const riskColors = { Low: '#34d399', Moderate: '#fbbf24', High: '#f87171', Severe: '#dc2626' }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong rounded-2xl overflow-hidden flex flex-col"
      style={{ border: `1px solid ${model.accent}22` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border)', background: `${model.accent}06` }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{model.icon}</span>
          <div>
            <p className="text-[13px] font-semibold">{model.name}</p>
            <p className="text-mono" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{model.subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} data-cursor="pointer" className="text-ink-muted hover:text-ink-primary transition-colors p-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5">
        {/* Model info */}
        <div>
          <p className="text-sm text-ink-secondary leading-relaxed">{model.description}</p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {Object.entries(model.metrics).map(([k, v]) => (
              <div key={k} className="card p-3 text-center">
                <p className="text-[17px] font-bold" style={{ color: model.accent }}>{v}%</p>
                <p className="text-mono mt-0.5 capitalize" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{k}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <p className="label-section mb-3">Run Analysis</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="Enter location (e.g. Tokyo, Nepal, Southern California…)"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-void focus:outline-none transition-all"
              style={{
                border: '1px solid var(--border-strong)',
                color: 'var(--ink-primary)',
                caretColor: 'var(--signal)',
              }}
              onFocus={e => e.target.style.borderColor = model.accent + '66'}
              onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
            />
            <motion.button
              onClick={analyze}
              disabled={!location.trim() || status === 'loading'}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-cursor="pointer"
              className="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{
                background: model.accent,
                color: '#050507',
              }}
            >
              {status === 'loading' ? (
                <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
              ) : 'Analyze'}
            </motion.button>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="h-20 rounded-xl shimmer" />
              <div className="h-14 rounded-xl shimmer" />
              <div className="h-14 rounded-xl shimmer" />
            </motion.div>
          )}

          {status === 'done' && result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Risk summary */}
              <div
                className="rounded-xl p-4 flex items-center justify-between"
                style={{ background: `${riskColors[result.risk]}10`, border: `1px solid ${riskColors[result.risk]}30` }}
              >
                <div>
                  <p className="text-mono mb-1" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>RISK LEVEL — {result.location.toUpperCase()}</p>
                  <p className="text-[22px] font-bold" style={{ color: riskColors[result.risk] }}>{result.risk}</p>
                </div>
                <div className="text-right">
                  <p className="text-mono" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>CONFIDENCE</p>
                  <p className="text-[22px] font-bold text-ink-primary">{result.confidence}%</p>
                </div>
              </div>

              {/* Output values */}
              <div>
                <p className="label-section mb-3">Model Outputs</p>
                <div className="space-y-2">
                  {result.outputs.map((o, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}
                    >
                      <span className="text-sm text-ink-secondary">{o.label}</span>
                      <span className="text-sm font-semibold" style={{ color: model.accent }}>{o.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <p className="text-mono text-center" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>
                Analyzed at {new Date(result.timestamp).toLocaleTimeString()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function PretrainedPage() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-void pt-[72px]">
      {/* Subtle background grid */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="label-section mb-3">Pre-trained Models</p>
          <h1 className="text-display text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight">
            Select a model to analyze.
          </h1>
          <p className="text-[15px] text-ink-secondary mt-3 max-w-xl leading-relaxed">
            Each model was trained on domain-specific disaster data. Click any card to open the analysis panel.
          </p>
        </motion.div>

        {/* Layout: grid left + panel right */}
        <div className={`flex gap-6 ${selected ? 'flex-col lg:flex-row' : ''}`}>
          {/* Grid */}
          <div className={`grid gap-4 ${
            selected
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 lg:flex-shrink-0 lg:w-[calc(60%-12px)]'
              : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
          } flex-1`}>
            {MODELS.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <ModelCard
                  model={m}
                  selected={selected?.id === m.id}
                  onSelect={() => setSelected(selected?.id === m.id ? null : m)}
                />
              </motion.div>
            ))}
          </div>

          {/* Analysis panel */}
          <AnimatePresence>
            {selected && (
              <div className="lg:w-[40%] lg:min-h-[600px]">
                <AnalysisPanel
                  model={selected}
                  onClose={() => setSelected(null)}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
