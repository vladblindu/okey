function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var TOKEN_KEY = 'token';
var USER_KEY = 'user';

var isEmpty = function isEmpty(o) {
  return !Object.keys(o).length;
};

var AuthContext = React.createContext({});
var AuthProvider = function AuthProvider(_ref) {
  var config = _ref.config,
      children = _ref.children;
  var _config$tokenKey = config.tokenKey,
      tokenKey = _config$tokenKey === void 0 ? TOKEN_KEY : _config$tokenKey,
      _config$userKey = config.userKey,
      userKey = _config$userKey === void 0 ? USER_KEY : _config$userKey,
      loginRedirect = config.loginRedirect,
      loginEndpoint = config.loginEndpoint,
      registerEnabled = config.registerEnabled,
      registerEndpoint = config.registerEndpoint,
      httpAgent = config.httpAgent;

  var _React$useState = React.useState({}),
      user = _React$useState[0],
      setUser = _React$useState[1];

  var clearLocalStorage = function clearLocalStorage() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
  };

  var setToken = function setToken(jwt) {
    return localStorage.setItem(tokenKey, jwt);
  };

  var setAuthData = function setAuthData(payload) {
    setToken(payload.jwt);
    setUser(_extends({}, user, payload.user));
    localStorage.setItem(userKey, JSON.stringify(payload.user));
  };

  var login = function login(identifier, password) {
    try {
      return Promise.resolve(httpAgent(loginEndpoint, {
        identifier: identifier,
        password: password
      })).then(function (authData) {
        console.log(authData);
        if (!authData.error) setAuthData(authData);
        return authData;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var register = function register(registerData) {
    try {
      console.log(config);
      return Promise.resolve(httpAgent(registerEndpoint, registerData)).then(function (regData) {
        if (regData.error) return regData;
        if (!regData.error && registerEnabled && regData.jwt && regData.user) setAuthData(regData);
        return regData;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var logout = function logout() {
    setUser({});
    clearLocalStorage();
    if (loginRedirect) loginRedirect();
  };

  var context = {
    login: login,
    logout: logout,
    register: register,
    user: user,
    isAuthenticated: !isEmpty(user)
  };
  return /*#__PURE__*/React.createElement(AuthContext.Provider, {
    value: context
  }, children);
};
var useAuth = function useAuth() {
  return React.useContext(AuthContext);
};
var useLogin = function useLogin() {
  return React.useContext(AuthContext).login;
};
var useLogout = function useLogout() {
  return React.useContext(AuthContext).logout;
};
var useRegister = function useRegister() {
  return React.useContext(AuthContext).register;
};
var useIsAuth = function useIsAuth() {
  return React.useContext(AuthContext).isAuthenticated;
};
var useUser = function useUser() {
  return React.useContext(AuthContext).user;
};

exports.AuthContext = AuthContext;
exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
exports.useIsAuth = useIsAuth;
exports.useLogin = useLogin;
exports.useLogout = useLogout;
exports.useRegister = useRegister;
exports.useUser = useUser;
//# sourceMappingURL=index.js.map
