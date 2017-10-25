let uuid = require('uuid')
let bluebird = require('bluebird')
let bcrypt = bluebird.promisifyAll(require('bcrypt'))
let jsonwebtoken = require('jsonwebtoken')
let db = require('../../db')

class User {
  constructor(username, password) {
    console.log(db)
    this.username = username
    this.password = password
    this.id = uuid.v4()
  }

  static findUser(userName) {
    return db.users.find(u => u.username == userName)
  }

  generateToken() {
    let token = jwt.sign(this.username, 'SECRET')
    return token
  }

  save() {
    return this.hashPassword()
      .then(() => db.users.push(this))
  }

  hashPassword(password) {
    return bcrypt.hash(this.password, 10).then(hash => {
        this.password = hash
    })
  }

  comparePassword(password) {
    bcrypt.hash(password, 10)
    .then((err, hash) => {
      return hash !== this.password
    })
  }
}

module.exports = User
