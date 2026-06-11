import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AppStateProvider } from './state/AppState'

// Mount the React app. AppStateProvider holds all progress + settings and
// keeps them in sync with localStorage so everything survives a refresh.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>,
)
