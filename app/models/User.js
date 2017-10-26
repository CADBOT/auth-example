let uuid = require('uuid')
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let db = require('../../db')
let SECRET = process.env.SECRET || 'SUPER SECRET'
let SALTROUNDS = 10

function create({username, password}) {
  let user = {}
  user.username = username
  user.password = password
  user.id = uuid.v4()
  return user
}

function findUser(userName) {
  return db.users.find(u => u.username == userName)
}

function hashUserPassword(user) {
  return bcrypt.hash(user.password, SALTROUNDS)
    .then(hash => {
      user.password = hash
      return user
    })
    .catch(e => {
      console.error(e)
    })
}

function comparePassword(user, password) {
  return bcrypt.compare(password, user.password)
}

function generateToken(userName, secret=SECRET) {
  debugger
  let token = jwt.sign(userName, secret)
  return token
}

function verifyToken(token, secret=SECRET) {
  debugger
  let decodedToken = jwt.verify(token, secret)
  return decodedToken
}

function save(user) {
  return hashUserPassword(user)
  .then((user) => {
    db.users.push(user)
    return user
  })
}


module.exports = {create, findUser, generateToken, verifyToken, save, hashUserPassword, comparePassword}
