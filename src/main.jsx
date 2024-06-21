import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Store from './redux/Store'



ReactDOM.createRoot(document.getElementById('root')).render(
  <Store>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Store>,
)
