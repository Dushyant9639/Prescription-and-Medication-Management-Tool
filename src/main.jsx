import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useStore } from './store'
import './utils/testReminders'

// Expose store globally for debugging and testing
if (typeof window !== 'undefined') {
  window.useStore = useStore;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
