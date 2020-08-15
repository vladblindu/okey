import React from 'react'
import { HTTP, useHttp } from '@bitbrother/fetch-dog-hooks'
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

export const AuthContext = React.createContext({})

export const AuthProvider = ({ config, children }) => {
  const {
    tokenKey = TOKEN_KEY,
    userKey = USER_KEY,
    loginRedirect,
    loginEndpoint,
    registerEnabled,
    registerEndpoint
  } = config

  const [user, setUser] = React.useState({})
  const httpAgent = useHttp(HTTP)

  const clearLocalStorage = () => {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(userKey)
  }

  const setToken = (jwt) => localStorage.setItem(tokenKey, jwt)
  const setAuthData = (payload) => {
    setToken(payload.jwt)
    setUser({ ...user, ...payload.user })
    localStorage.setItem(userKey, JSON.stringify(payload.user))
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
    if (loginRedirect) loginRedirect()
  }

  const context = {
    login,
    logout,
    register,
    user,
    isAuthenticated: !isEmpty(user)
  }

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context || isEmpty(context))
    throw new Error('DEVERR: No available Auth context in useAuth hook.')
}
export const useLogin = () => useAuth().login
export const useLogout = () => useAuth().logout
export const useRegister = () => useAuth().register
export const useIsAuth = () => useAuth().isAuthenticated
export const useUser = () => useAuth().user
