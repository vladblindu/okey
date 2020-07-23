import React from 'react'
import { TOKEN_KEY, USER_KEY } from './constants'
import { isEmpty } from './helpers'

/**
 * @typedef {object} opts
 * @param {function} opts.httpAgent
 * @param {string?} opts.tokenKey
 * @param {function} opts.loginRedirect
 * @param {string?} opts.loginEndpoint
 * @param {string?} opts.registerEndpoint
 * @param {boolean} opts.registerEnabled
 * @param {string?} jwt  - if a valid localstorage session has been found
 * @param {object?} user - if a na authenticated call has been made - see above
 */

export const IS_AUTH = 1
export const LOGIN = 2
export const LOGOUT = 3
export const REGISTER = 4
export const USER = 5

export const AuthContext = React.createContext({})

export const AuthProvider = ({ config, children }) => {
  const {
    tokenKey = TOKEN_KEY,
    userKey = USER_KEY,
    loginRedirect,
    loginEndpoint,
    registerEnabled,
    registerEndpoint,
    httpAgent
  } = config
  const [user, setUser] = React.useState({})

  const clearLocalStorage = () => {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(userKey)
  }

  const setToken = (jwt) => localStorage.setItem(tokenKey, jwt)
  const setAuthData = (jwt, _user) => {
    setToken(jwt)
    setUser({ ...user, ..._user })
  }

  const login = async (identifier, password) => {
    const authData = await httpAgent(loginEndpoint, {
      identifier,
      password
    })
    if (!authData.error) setAuthData(authData)
    return authData
  }

  const register = async (registerData) => {
    const regData = await httpAgent(registerEndpoint, registerData)
    if (regData.error) return regData
    if (!regData.error && registerEnabled && regData.jwt && regData.user)
      setAuthData(regData)
    return regData
  }

  const logout = () => {
    setUser({})
    clearLocalStorage()
    loginRedirect()
  }

  const context = {
    login,
    logout,
    register,
    user,
    isAuthenticated: () => isEmpty(user)
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export const useAuth = (type) => {
  const authContext = React.useContext(AuthContext)
  if (type === IS_AUTH) return authContext.isAuthenticated()
  if (type === LOGIN) return authContext.login
  if (type === LOGOUT) return authContext.logout
  if (type === REGISTER) return authContext.register
  if (type === USER) return authContext.user
}
