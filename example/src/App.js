import React from 'react'
import cn from 'classnames'
import { useUser, useIsAuth, useLogin, useLogout, useRegister } from '@vladblindu/okey'
import './App.css'

const IsAuth = () => {
  const isAuth = useIsAuth()
  return <div style={{ padding: '12px' }}>
    <div style={{
      display: 'inline-block',
      padding: '5px'
    }}>
      <h1>
        <div className={cn('ball', {
          green: isAuth,
          red: !isAuth
        })}/>
        {isAuth ? ' AUTHENTICATED' : ' NOT AUTHENTICATED'}
      </h1>
    </div>
    }
  </div>
}

const ControlButtons = () => {
  const login = useLogin()
  const logout = useLogout()
  const register = useRegister()
  return <div className="buttons-container">
    <button onClick={() => {
      login({
        identifier: 'test@test.com',
        password: 'testPassword'
      })
    }}>
      LOGIN
    </button>
    <button onClick={logout}>
      LOGOUT
    </button>
    <button
      onClick={() => {
        register({
          identifier: 'new-user@test.com'
        })
      }}>
      REGISTER
    </button>
  </div>
}


const App = () => {

  const user = useUser()

  return <div>
    <IsAuth/>
    <div className="current-user">
      Current user:
      <span>{user.username ? user.username : 'Anonymous'}</span>
    </div>
    <ControlButtons/>
    <pre style={{ padding: '20px' }}>{JSON.stringify(user, null, 2)}</pre>
  </div>
}

export default App
