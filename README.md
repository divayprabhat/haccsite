# Vela Causal Reasoning Platform

A powerful causal inference engine with LLM-powered bias removal and universal model access.

## Features

- **Causal Graph Engine**: Directed cause-effect relationship modeling
- **LLM Integration**: Ollama-powered text normalization (Mistral model)
- **Universal Model Access**: Switch between trained models in chat interface
- **Real-time Training**: Upload and train custom datasets
- **Modern UI**: React-based frontend with Tailwind CSS

## Project Structure

```
vela-integrated/
|
backend/                 # Python FastAPI backend
  api.py                # Main API routes
  core/                 # Core engine modules
    engine.py          # Causal graph engine
    inference.py       # Query inference
    extractor.py       # Causal pair extraction
    tokenizer.py       # Text tokenization
    llm_normalizer.py  # Ollama integration
  models/              # Trained model storage
  tests/               # Backend tests
  utils/               # Utilities (REPL, etc.)
  
frontend/              # React frontend
  src/
    components/        # UI components
    pages/            # Application pages
    styles/           # CSS/styling
    utils/            # Frontend utilities
  public/
    assets/           # Static assets
    
scripts/              # Development scripts
  setup.sh           # Environment setup
  start.sh           # Development startup
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Ollama (optional, for LLM features)

### Setup

```bash
# Clone and setup
git clone <repository-url>
cd vela-integrated
./scripts/setup.sh
```

### Development

```bash
# Start both backend and frontend
./scripts/start.sh

# Or start individually:
cd backend && python api.py          # Backend: http://localhost:8000
cd frontend && npm run dev          # Frontend: http://localhost:3000
```

## Usage

### Training Models

1. Navigate to `/train` in the frontend
2. Upload your dataset (CSV, JSON, or TXT)
3. Configure training parameters
4. Start training
5. Access trained models from chat interface

### Chat Interface

1. Navigate to `/chat`
2. Select a model from the dropdown
3. Ask causal questions
4. View confidence scores and causal paths

### API Endpoints

- `POST /train` - Train a new model
- `POST /query` - Query causal relationships
- `GET /models` - List available models
- `GET /health` - System health check

## Configuration

### Ollama Setup (Optional)

```bash
# Install Ollama
# Visit: https://ollama.ai/download

# Pull Mistral model
ollama pull llama3

# Start Ollama server
ollama serve
```

### Environment Variables

```bash
# Backend
OLLAMA_URL=http://localhost:11434
DEFAULT_MODEL=mistral
TIMEOUT=60

# Frontend
VITE_API_BASE=http://localhost:8000
```

## Development

### Backend Development

```bash
cd backend
python api.py                    # Development server
python -m pytest tests/         # Run tests
python utils/repl.py            # Interactive REPL
```

### Frontend Development

```bash
cd frontend
npm run dev                      # Development server
npm run build                    # Production build
npm run preview                  # Preview build
```

## Model Training

The system supports three types of training data:

1. **CSV**: Structured data with headers
2. **JSON**: Array of objects or single object
3. **TXT**: Plain text causal sentences

### Training Pipeline

1. **LLM Normalization**: Raw text processed through Ollama
2. **Causal Extraction**: Identify cause-effect pairs
3. **Graph Construction**: Build directed causal graph
4. **Strength Calculation**: Normalize edge strengths
5. **Model Persistence**: Save to JSON storage

## Troubleshooting

### Common Issues

1. **Ollama Connection Failed**
   - Ensure Ollama is installed and running
   - Check port 11434 is available
   - System will fallback to raw processing

2. **Model Training Fails**
   - Check data format and headers
   - Ensure causal language is explicit
   - Review console logs for errors

3. **Frontend Build Issues**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all dependencies installed

### Debug Mode

Enable debug logging by setting environment variable:

```bash
export DEBUG=vela
python api.py
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub
