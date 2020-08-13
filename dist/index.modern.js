import React from 'react';
import { useHttp, HTTP } from '@bitbrother/fetch-dog-hooks';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

const isEmpty = o => !Object.keys(o).length;

const AuthContext = React.createContext({});
const AuthProvider = ({
  config,
  children
}) => {
  const {
    tokenKey = TOKEN_KEY,
    userKey = USER_KEY,
    loginRedirect,
    loginEndpoint,
    registerEnabled,
    registerEndpoint
  } = config;
  const [user, setUser] = React.useState({});
  const httpAgent = useHttp(HTTP);

  const clearLocalStorage = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  };

  const setToken = jwt => localStorage.setItem(tokenKey, jwt);

  const setAuthData = payload => {
    setToken(payload.jwt);
    setUser({ ...user,
      ...payload.user
    });
    localStorage.setItem(userKey, JSON.stringify(payload.user));
  };

  const login = async (identifier, password) => {
    const authData = await httpAgent(loginEndpoint, {
      identifier,
      password
    });
    if (!authData.error) setAuthData(authData);
    return authData;
  };

  const register = async registerData => {
    const regData = await httpAgent(registerEndpoint, registerData);
    if (regData.error) return regData;
    if (!regData.error && registerEnabled && regData.jwt && regData.user) setAuthData(regData);
    return regData;
  };

  const logout = () => {
    setUser({});
    clearLocalStorage();
    if (loginRedirect) loginRedirect();
  };

  const context = {
    login,
    logout,
    register,
    user,
    isAuthenticated: !isEmpty(user)
  };
  return /*#__PURE__*/React.createElement(AuthContext.Provider, {
    value: context
  }, children);
};
const useAuth = () => React.useContext(AuthContext);
const useLogin = () => React.useContext(AuthContext).login;
const useLogout = () => React.useContext(AuthContext).logout;
const useRegister = () => React.useContext(AuthContext).register;
const useIsAuth = () => React.useContext(AuthContext).isAuthenticated;
const useUser = () => React.useContext(AuthContext).user;

export { AuthContext, AuthProvider, useAuth, useIsAuth, useLogin, useLogout, useRegister, useUser };
//# sourceMappingURL=index.modern.js.map
