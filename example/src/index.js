import React from 'react'
import ReactDOM from 'react-dom'
import {AuthProvider} from '@vladblindu/okey'
import httpAgent from './http-agent'
import App from './App'

const authCfg = {
  loginEndpoint: 'login',
  registerEndpoint:'register',
  httpAgent: httpAgent,
  registerEnabled: true
}

ReactDOM.render(
  <AuthProvider config={authCfg}>
    <App />
  </AuthProvider>,
  document.getElementById('root')
)
