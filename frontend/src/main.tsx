import React from 'react'
import ReactDOM from 'react-dom/client'
import { QidreDashboard } from './components/qidre-dashboard'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QidreDashboard />
  </React.StrictMode>,
)
