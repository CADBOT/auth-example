let base64 = require('base-64')
let model = require('../app/models/User')

function authenticator(req, res, next){
  if (!req.headers.authorization) return next(new Error('Authorization header missing')) 
  let [authScheme, authString] = req.headers.authorization.split(' ')
  switch (authScheme) {
    case 'Basic':
      basicAuth(authString)
        .then(matches => {
          if (!matches) return next(new Error('Invalid password'))
          next()
        })
        .catch(err => next(err))
      break
    case 'Bearer':
      req.token = bearerAuth(authString)
      next()
      break
    default:
      return next(new Error(`${authScheme} is not a supported auth scheme`))
  }
}

function basicAuth(authString) {
  let [username, password] = base64.decode(authString).split(':')
  let user = model.findUser(username)
  if (!user) throw new Error('User not found')
  return model.comparePassword(user, password)
}

function bearerAuth(authString) {
  let decodedToken = model.verifyToken(authString)
  return decodedToken
}

module.exports = authenticator
