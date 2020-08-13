import React from 'react'
import ReactDOM from 'react-dom'
import { AuthProvider } from '@vladblindu/okey'
import httpConfig from './http.config.json'
import App from './App'
import { HttpProvider } from '@bitbrother/fetch-dog-hooks'

const authCfg = {
  loginEndpoint: 'login',
  registerEndpoint: 'register',
  registerEnabled: true
}

httpConfig.redirect = pth => {
  alert('REDIRECTED TO: ' + pth)
}

ReactDOM.render(
  <HttpProvider config={httpConfig}>
    <AuthProvider config={authCfg}>
      <App/>
    </AuthProvider>
  </HttpProvider>,
  document.getElementById('root')
)
