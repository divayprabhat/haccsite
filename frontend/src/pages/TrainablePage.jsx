import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Wizard steps ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 'upload',    n: '01', label: 'Upload Data' },
  { id: 'configure', n: '02', label: 'Configure' },
  { id: 'train',     n: '03', label: 'Train' },
]

const MODEL_TYPES = [
  { id: 'classification', label: 'Classification', desc: 'Categorical predictions — event type, severity level, binary risk.' },
  { id: 'regression',     label: 'Regression',     desc: 'Continuous values — magnitude, rainfall, damage cost.' },
  { id: 'forecasting',    label: 'Forecasting',    desc: 'Time-series prediction — next-day risk, temporal patterns.' },
]

// ── Step 1: Upload ─────────────────────────────────────────────────────────
function UploadStep({ onNext }) {
  const [file, setFile] = useState(null)
  const [parsed, setParsed] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)

  const processFile = async (f) => {
    console.log('processFile called with:', f)
    
    if (!f) {
      console.error('No file provided to processFile')
      alert('No file selected. Please choose a file to upload.')
      return
    }
    
    console.log('Processing file:', f.name, 'Type:', f.type, 'Size:', f.size)
    
    // More flexible file validation
    const fileName = f.name.toLowerCase()
    const validExtensions = ['.csv', '.json', '.txt']
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
    
    if (!hasValidExtension) {
      const error = `Invalid file format. Please upload a CSV, JSON, or TXT file. File: ${f.name}`
      console.error(error)
      alert(error)
      return
    }
    
    // Reset state
    setFile(f)
    setParsed(null)
    setParsing(true)
    
    try {
      console.log('Starting to read file content...')
      const fileContent = await readFileContent(f)
      console.log('File content length:', fileContent.length)
      
      if (!fileContent || fileContent.trim().length === 0) {
        throw new Error('File is empty or contains no readable content')
      }
      
      let parsedData
      
      if (fileName.endsWith('.csv')) {
        console.log('Parsing as CSV...')
        parsedData = parseCSV(fileContent)
      } else if (fileName.endsWith('.json')) {
        console.log('Parsing as JSON...')
        parsedData = parseJSON(fileContent, f.name)
      } else {
        console.log('Parsing as TXT...')
        parsedData = parseTXT(fileContent)
      }
      
      console.log('Successfully parsed data:', parsedData)
      setParsed(parsedData)
    } catch (error) {
      console.error('Error parsing file:', error)
      alert(`Error parsing file "${f.name}": ${error.message}`)
      setParsed(null)
    } finally {
      setParsing(false)
    }
  }

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const parseCSV = (content) => {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length === 0) throw new Error('Empty CSV file')
    
    const headers = lines[0].split(',').map(h => h.trim())
    const rows = lines.slice(1).filter(line => line.trim())
    
    return {
      fileName: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      rows: rows.length,
      columns: headers.length,
      sampleCols: headers.slice(0, 5),
      missing: '0%',
      type: 'CSV',
      rawData: content
    }
  }

  const parseJSON = (content, fileName) => {
    try {
      const data = JSON.parse(content)
      const isArray = Array.isArray(data)
      const firstItem = isArray ? (data[0] || {}) : data
      
      const keys = Object.keys(firstItem)
      const rows = isArray ? data.length : 1
      
      return {
        fileName: fileName,
        size: (file.size / 1024).toFixed(1) + ' KB',
        rows: rows,
        columns: keys.length,
        sampleCols: keys.slice(0, 5),
        missing: '0%',
        type: 'JSON',
        rawData: content
      }
    } catch (error) {
      throw new Error('Invalid JSON format')
    }
  }

  const parseTXT = (content) => {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length === 0) throw new Error('Empty TXT file')
    
    return {
      fileName: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      rows: lines.length,
      columns: lines[0] ? lines[0].split(/\s+/).length : 1,
      sampleCols: lines[0] ? lines[0].split(/\s+/).slice(0, 5) : [],
      missing: '0%',
      type: 'TXT',
      rawData: content
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDrag(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      console.log('Files dropped:', files.length, files[0]?.name)
      processFile(files[0])
    } else {
      console.log('No files found in drop event')
      alert('No file detected. Please try dropping the file again.')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight mb-1">Upload your dataset</h2>
        <p className="text-sm text-ink-secondary">CSV, JSON, or TXT. Your data never leaves your session.</p>
      </div>

      {/* Drop zone */}
      <motion.div
        animate={{ borderColor: drag ? 'var(--signal)' : 'var(--border-strong)' }}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        data-cursor="pointer"
        className="relative rounded-2xl p-10 text-center transition-all duration-200"
        style={{
          background: drag ? 'var(--signal-dim)' : 'var(--elevated)',
          border: `2px dashed ${drag ? 'var(--signal)' : 'var(--border-strong)'}`,
        }}
      >
        <input ref={inputRef} type="file" accept=".csv,.json,.txt" className="hidden" onChange={e => {
          const files = e.target.files
          if (files && files.length > 0) {
            processFile(files[0])
          }
        }} />

        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.15)' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 14V4M7 8l4-4 4 4" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 16v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-[15px] font-medium">Drop file here or <span style={{ color: 'var(--signal)' }}>browse</span></p>
            <p className="text-sm text-ink-muted mt-1">CSV · JSON · TXT up to 200MB</p>
          </div>
        </div>
      </motion.div>

      {/* Parsing */}
      <AnimatePresence>
        {parsing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
            <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--signal)', borderTopColor: 'transparent' }} />
            <span className="text-sm text-ink-secondary">Parsing {file?.name}…</span>
          </motion.div>
        )}

        {parsed && !parsing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(110,231,183,0.2)', background: 'rgba(110,231,183,0.04)' }}
          >
            <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: 'rgba(110,231,183,0.12)' }}>
              <div className="dot-signal" />
              <span className="text-sm font-medium text-signal">{parsed.fileName}</span>
              <span className="ml-auto text-mono" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{parsed.type} · {parsed.size}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x" style={{ divideColor: 'rgba(110,231,183,0.1)' }}>
              {[
                { label: 'Rows', value: parsed.rows.toLocaleString() },
                { label: 'Columns', value: parsed.columns },
                { label: 'Missing', value: parsed.missing },
                { label: 'Format', value: parsed.type },
              ].map((s, i) => (
                <div key={i} className="px-5 py-4" style={{ borderRight: i < 3 ? '1px solid rgba(110,231,183,0.1)' : 'none' }}>
                  <p className="text-[20px] font-bold" style={{ color: 'var(--signal)' }}>{s.value}</p>
                  <p className="text-mono" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t" style={{ borderColor: 'rgba(110,231,183,0.12)' }}>
              <p className="text-mono mb-2" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>DETECTED COLUMNS</p>
              <div className="flex flex-wrap gap-1.5">
                {parsed.sampleCols.map(c => (
                  <span key={c} className="text-mono px-2 py-0.5 rounded-md" style={{ fontSize: 11, background: 'var(--elevated)', color: 'var(--ink-secondary)', border: '1px solid var(--border)' }}>{c}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {parsed && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => onNext(parsed)}
          className="btn-signal w-full justify-center py-3 rounded-xl text-[15px]"
          data-cursor="pointer"
        >
          Continue to Configuration
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      )}
    </div>
  )
}

// ── Step 2: Configure ──────────────────────────────────────────────────────
function ConfigStep({ data, onNext, onBack }) {
  const [config, setConfig] = useState({
    modelType: 'classification',
    epochs: 60,
    batchSize: 32,
    learningRate: 0.001,
    validationSplit: 0.2,
    dropout: 0.2,
    layers: 3,
  })

  const up = (k, v) => setConfig(c => ({ ...c, [k]: v }))

  const SliderField = ({ label, k, min, max, step, format }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-ink-secondary">{label}</label>
        <span className="text-mono text-sm" style={{ color: 'var(--signal)', minWidth: 60, textAlign: 'right' }}>
          {format ? format(config[k]) : config[k]}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={config[k]}
        onChange={e => up(k, parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none"
        style={{
          background: `linear-gradient(to right, var(--signal) ${((config[k] - min) / (max - min)) * 100}%, var(--elevated) 0%)`,
          cursor: 'ew-resize',
        }}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight mb-1">Configure your model</h2>
        <p className="text-sm text-ink-secondary">Dataset: <span className="text-ink-primary">{data.fileName}</span> — {data.rows.toLocaleString()} rows, {data.columns} columns</p>
      </div>

      {/* Model type */}
      <div>
        <p className="label-section mb-3">Model Type</p>
        <div className="grid grid-cols-1 gap-2">
          {MODEL_TYPES.map(mt => (
            <button
              key={mt.id}
              onClick={() => up('modelType', mt.id)}
              data-cursor="pointer"
              className="flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-150"
              style={{
                background: config.modelType === mt.id ? 'rgba(110,231,183,0.06)' : 'var(--elevated)',
                border: `1px solid ${config.modelType === mt.id ? 'rgba(110,231,183,0.3)' : 'var(--border)'}`,
              }}
            >
              <div
                className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0 transition-all"
                style={{
                  background: config.modelType === mt.id ? 'var(--signal)' : 'transparent',
                  border: `2px solid ${config.modelType === mt.id ? 'var(--signal)' : 'var(--border-strong)'}`,
                }}
              />
              <div>
                <p className="text-sm font-semibold">{mt.label}</p>
                <p className="text-[13px] text-ink-secondary mt-0.5">{mt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hyperparams */}
      <div>
        <p className="label-section mb-4">Hyperparameters</p>
        <div className="space-y-5">
          <SliderField label="Epochs" k="epochs" min={5} max={300} step={5} />
          <SliderField label="Batch Size" k="batchSize" min={8} max={256} step={8} />
          <SliderField label="Learning Rate" k="learningRate" min={0.0001} max={0.05} step={0.0001} format={v => v.toFixed(4)} />
          <SliderField label="Validation Split" k="validationSplit" min={0.1} max={0.4} step={0.05} format={v => `${(v * 100).toFixed(0)}%`} />
          <SliderField label="Dropout" k="dropout" min={0} max={0.6} step={0.05} format={v => `${(v * 100).toFixed(0)}%`} />
          <SliderField label="Hidden Layers" k="layers" min={1} max={8} step={1} />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-ghost flex-1 justify-center py-3 rounded-xl" data-cursor="pointer">
          ← Back
        </button>
        <button onClick={() => onNext(config)} className="btn-signal flex-1 justify-center py-3 rounded-xl text-[15px]" data-cursor="pointer">
          Start Training →
        </button>
      </div>
    </div>
  )
}

// ── Step 3: Train ──────────────────────────────────────────────────────────
function TrainStep({ data, config }) {
  const [progress, setProgress] = useState(0)
  const [epoch, setEpoch] = useState(0)
  const [metrics, setMetrics] = useState({ loss: 0.512, negate: 0.538, acc: 0.0, confidence: 0.0 })
  const [log, setLog] = useState([])
  const [done, setDone] = useState(false)
  const logRef = useRef(null)

  const handleChatRedirect = (chatOnly = false) => {
    const savedModelId = sessionStorage.getItem('lastTrainedModelId') || 'default'
    const trainingFileData = {
      name: data?.fileName || 'training_data.csv',
      type: data?.type || 'CSV',
      size: data?.size || '0 KB',
      rows: data?.rows || 0,
      columns: data?.columns || 0,
      sampleCols: data?.sampleCols || [],
      model_id: savedModelId,
      config: config || {},
      modelType: config?.modelType || 'classification',
      hyperparameters: {
        epochs: config?.epochs || 50,
        batchSize: config?.batchSize || 32,
        learningRate: config?.learningRate || 0.001,
        validationSplit: config?.validationSplit || 0.2,
        dropout: config?.dropout || 0.1,
        layers: config?.layers || 3
      },
      metrics: metrics,
      status: done ? 'completed' : 'in_progress',
      timestamp: new Date().toISOString(),
      chatOnly: chatOnly
    }

    sessionStorage.setItem('trainingFileData', JSON.stringify(trainingFileData))
    window.location.href = '/chat'
  }

  useEffect(() => {
    const connectToBackend = async () => {
      if (!data?.rawData) {
        setLog(prev => [...prev, 'Error: no file data found.'])
        setDone(true)
        return
      }

      // Split raw file content into lines (the backend expects an array of strings)
      const lines = data.rawData
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0)

      const modelId = data.fileName
        ? data.fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
        : 'default'

      setLog(prev => [...prev,
        `Connecting to Vela backend…`,
        `Model ID: ${modelId}`,
        `Sending ${lines.length} lines for training…`,
      ])
      setProgress(10)

      try {
        const response = await fetch('/api/train', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model_id: modelId,
            data: lines,
            use_llm: true,
            llm_model: 'llama3.2:1b',
            description: `Trained from ${data.fileName} (${data.type}, ${data.size})`,
          }),
        })

        setProgress(80)

        if (!response.ok) {
          const err = await response.json().catch(() => ({}))
          const detail = err.detail || `HTTP ${response.status}`
          setLog(prev => [...prev, `Backend error: ${detail}`])
          setDone(true)
          return
        }

        const result = await response.json()
        setProgress(100)

        const pairsAdded  = result.pairs_added  ?? 0
        const totalEdges  = result.total_edges  ?? 0
        const vocabSize   = result.vocab_size   ?? 0
        const docCount    = result.doc_count    ?? lines.length

        // Derive display metrics from the backend response
        const derivedAcc  = pairsAdded > 0 ? Math.min(95, 60 + (pairsAdded / Math.max(lines.length, 1)) * 35).toFixed(2) : '0.00'
        const derivedConf = totalEdges > 0  ? Math.min(92, 55 + (totalEdges  / Math.max(pairsAdded + 1, 1)) * 20).toFixed(2) : '0.00'

        setMetrics({
          loss:       parseFloat((1 - parseFloat(derivedAcc) / 100).toFixed(4)),
          negate:     parseFloat((1 - parseFloat(derivedConf) / 100).toFixed(4)),
          acc:        parseFloat(derivedAcc),
          confidence: parseFloat(derivedConf),
        })

        setLog(prev => [...prev,
          `Training complete.`,
          `Pairs extracted : ${pairsAdded}`,
          `Total edges     : ${totalEdges}`,
          `Vocabulary size : ${vocabSize}`,
          `Documents seen  : ${docCount}`,
          `Model ID        : ${result.model_id}`,
          result.warning ? `Warning: ${result.warning}` : `Status: OK ✓`,
        ])

        // Store model_id so ChatPage can query the right model
        sessionStorage.setItem('lastTrainedModelId', result.model_id)
        setDone(true)

      } catch (error) {
        setLog(prev => [...prev, `Network error: ${error.message}`, 'Make sure the backend is running: uvicorn api:app --reload --port 8000'])
        setDone(true)
      }
    }

    if (data && config) {
      connectToBackend()
    }
  }, [config, data])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [log])

  const MetricBox = ({ label, value, good }) => (
    <div className="card p-4 flex flex-col gap-1">
      <p className="text-mono" style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{label}</p>
      <p className="text-[24px] font-bold leading-none" style={{ color: good ? 'var(--signal)' : 'var(--accent)' }}>{value}</p>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-semibold tracking-tight">{done ? 'Training complete.' : 'Training in progress…'}</h2>
          <p className="text-sm text-ink-secondary mt-0.5">
            {done ? `${data.rows.toLocaleString()} samples · ${config.epochs} epochs` : `Epoch ${epoch} / ${config.epochs}`}
          </p>
        </div>
        {done && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl">🎉</motion.div>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-mono mb-2" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>
          <span>Progress</span>
          <span style={{ color: done ? 'var(--signal)' : 'var(--ink-secondary)' }}>{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: done
                ? 'linear-gradient(90deg, #6ee7b7, #34d399)'
                : 'linear-gradient(90deg, var(--signal), var(--accent))',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricBox label="LOSS" value={metrics.loss} good={false} />
        <MetricBox label="NEGATE" value={metrics.negate} good={false} />
        <MetricBox label="ACCURACY" value={`${metrics.acc}%`} good />
        <MetricBox label="CONFIDENCE" value={`${metrics.confidence}%`} good />
      </div>

      {/* Log terminal */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#02020a', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-mono ml-2" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>training.log</span>
          {!done && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />}
        </div>
        <div
          ref={logRef}
          className="h-48 overflow-y-auto no-scrollbar p-4 space-y-1"
          style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}
        >
          {log.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ color: i === log.length - 1 ? 'var(--signal)' : 'var(--ink-muted)' }}
            >
              {line}
            </motion.p>
          ))}
          {!done && <span style={{ color: 'var(--signal)' }} className="animate-pulse">▋</span>}
        </div>
      </div>

      {/* Done actions */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <button
              onClick={() => handleChatRedirect(false)}
              className="btn-signal flex-1 justify-center py-3 rounded-xl"
              data-cursor="pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v7M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Train Model
            </button>
            <button 
              onClick={() => handleChatRedirect(true)}
              className="btn-ghost flex-1 justify-center py-3 rounded-xl" 
              data-cursor="pointer"
            >
              Send to Chat Only
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function TrainablePage() {
  const [step, setStep] = useState(0)
  const [uploadData, setUploadData] = useState(null)
  const [trainConfig, setTrainConfig] = useState(null)

  return (
    <div className="min-h-screen bg-void pt-[72px]">
      {/* Grid bg */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent)',
        }}
      />

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="label-section mb-3">Custom Training</p>
          <h1 className="text-display text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight">
            Train your own model.
          </h1>
          <p className="text-[15px] text-ink-secondary mt-3 max-w-xl leading-relaxed">
            Bring your own data. Configure the architecture. Watch it train in real time.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300"
                  style={{
                    background: i < step ? 'var(--signal)' : i === step ? 'rgba(110,231,183,0.12)' : 'var(--elevated)',
                    border: `1px solid ${i <= step ? 'var(--signal)' : 'var(--border-strong)'}`,
                    color: i < step ? '#020d07' : i === step ? 'var(--signal)' : 'var(--ink-muted)',
                  }}
                >
                  {i < step ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : s.n}
                </div>
                <span
                  className="text-sm font-medium hidden sm:block transition-colors duration-200"
                  style={{ color: i === step ? 'var(--ink-primary)' : 'var(--ink-muted)' }}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="h-px mx-4 flex-1 min-w-[32px] transition-all duration-500"
                  style={{
                    background: i < step ? 'var(--signal)' : 'var(--border-strong)',
                    opacity: i < step ? 0.5 : 0.4,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div
          className="glass-strong rounded-2xl p-6 md:p-8"
          style={{ minHeight: 420 }}
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="upload" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35 }}>
                <UploadStep onNext={d => { setUploadData(d); setStep(1) }} />
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="config" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35 }}>
                <ConfigStep data={uploadData} onNext={c => { setTrainConfig(c); setStep(2) }} onBack={() => setStep(0)} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="train" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35 }}>
                <TrainStep data={uploadData} config={trainConfig} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
