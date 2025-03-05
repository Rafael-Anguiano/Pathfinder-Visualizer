import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Board from './components/Board'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <header>
      <h1>Algorithm Visualizer</h1>
    </header>
    <main>
      <Board />
    </main>
  </StrictMode>,
)
