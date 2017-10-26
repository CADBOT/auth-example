let model = require('../../app/models/User')
let {expect} = require('chai')
let proxyquire = require('proxyquire')
let bcrypt = require('bcrypt')

describe('creating a user', function() {
  it('can create a user with the correct properties', function() {
    let userProps = ['username', 'password', 'id']
    let user = model.create('bob', 'password')
    userProps.forEach(prop => expect(user.hasOwnProperty(prop)).to.equal(true))
  })
  it('will create a uuid id for each user', function() {
    let user = model.create('bob', 'password')
    expect(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(user.id)
    ).to.equal(true)
  })
})

describe('find user', function() {
  beforeEach(function() {
    this.proxyModel = proxyquire('../../app/models/User', 
                               {'../../db' : {users: [{username: 'bob', password: 'password', id: 1}]}})
  })
  it('can find a user by username in the db', function() {
    expect(this.proxyModel.findUser('bob')).to.not.equal(undefined)
  })
  it('will return undefined for nonexistant users', function() {
    expect(this.proxyModel.findUser('sarah')).to.equal(undefined)
  })
})

describe('user password hashing', function() {
  beforeEach(function() {
    this.model = proxyquire('../../app/models/User', 
                               {'../../db' : {users: []}})
    this.password = 'password1234'
    this.user = this.model.create({username: 'bob', password: this.password})
    this.SALTROUNDS = 10
  })
  it('can hash a users password', function(done) {
	model.hashUserPassword(this.user)
    .then(user => {
      return bcrypt.compare(this.password, user.password)
    })
    .then(result => {
      expect(result).to.equal(true)
      done()
    })
    .catch(err => {
      console.error(err)
      done()
    })
  })
  it('can validate a password against the stored hashed password', function(done) {
    this.model.save(this.user)
      .then(user =>  model.comparePassword(user, this.password))
      .then(matches => {
        expect(matches).to.equal(true)
        done()
      })
      .catch(err => {
        console.error(err)
        done()
      }) 
  })
})
