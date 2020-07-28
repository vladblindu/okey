const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.options('*', cors())

app.post('/login', (req, res) => {
  res.json({
    jwt: 'dummy-jwt-token', user: {
      username: 'test_username',
      email: 'test@test.com'
    }
  })
})

app.post('/register', (req, res) => {
  const email = req.body.identifier
  const username = 'test-buddy'
  res.json({
    jwt: 'dummy-jwt-token', user: {
      username,
      email
    }
  })
})

const server = app.listen(3003, () => {
  console.log('Mock server listening on 3003.')
})

module.exports = server.close
