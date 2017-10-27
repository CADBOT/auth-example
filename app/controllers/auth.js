let model = require('../models/User')
let base64 = require('base-64')
let util = require('../../lib/util')

function signup(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return next(new Error('username and password required'))
  }
  let user = model.create(req.body)
  model.save(user)
    .then(user => {
      res.json({user})
    })
    .catch(err => next(err))
}

function login(req, res, next) {
  debugger
  try {
    var [username, password] = util.parseAuthString(req)
  }
  catch (e) {
    debugger
    return next(e)
  }
  let user = model.findUser(username)
  if (!user) return next(new Error('User not found'))
  model.comparePassword(user, password)
    .then(matches => {
      debugger
      if (!matches) return next(new Error('Invalid password'))
      let token = model.generateToken(user.username)
      res.json({token})
    })
    .catch(err => {
      debugger
      next(err)
    })
}

module.exports = {signup, login}
