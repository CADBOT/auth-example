let express = require('express')
let bodyParser = require('body-parser')
let base64 = require('base-64')
let app = express()
let auth = require('./lib/authenticate')
let User = require('./app/models/User')

app.use(bodyParser.json({
  extended: true
}))

app.post('/signup', (req, res, next) => {
  if(!req.body.username || !req.body.password) {
    return next(new Error('username and password required'))
  }
  let user = new User(req.body.username, req.body.password)
  user.save()
    .then(() => res.json({user}))
    .catch((err) => next(err))
})

app.post('/login', (req, res, next) => {
  console.log('in /login')
  console.log(req.headers)
  if (!req.headers.authorization) {
    return next(new Error('authorization header required'))
  }
  let authString = req.headers.authorization.split(' ')[1]
  let [username, password] = base64.decode(authString).split(':')
  console.log('user', username)
  console.log('pass', password)
  let user = User.findUser(username)
  if (!user) return next(new Error('User not found'))
  user.comparePassword(password)
    .then(matches => {
      if (!matches) next(new Error('Invalid password'))
      let token = user.generateToken()
      res.json({token})
    })
    .catch(err => next(err))
})

app.use(auth)

app.get('/', (req, res) => {
  res.json({msg: 'welcome authenticated user'})
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.json({msg: err.message})
})

app.listen(3000, () => {
  console.log('app up')
})
