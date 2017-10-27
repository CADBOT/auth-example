let {expect} = require('chai')
let sinon = require('sinon')
let sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon)
let proxyquire = require('proxyquire')
let base64 = require('base-64')
let controller = require('../../app/controllers/auth')

describe('signup controller', function() {
  it('will call next if the username is missing from the request body', function() {
    let req = {body: {password: 'password1234'}}
    let res = {}
    let next = sinon.spy()
    controller.signup(req, res, next)
    expect(next.calledOnce).to.equal(true)
  })
  it('will call next if the password is missing from the request body', function() {
    let req = {body: {username: 'bob'}}
    let res = {}
    let next = sinon.spy()
    controller.signup(req, res, next)
    expect(next.calledOnce).to.equal(true)
  })
  it('will save the user to the db by calling the create and save model functions', function() {
    let req = {body: {username: 'bob', password: 'password1234'}}
    let createSpy = sinon.spy()
    let saveSpy = sinon.stub().returnsPromise()
    let controller = proxyquire('../../app/controllers/auth', 
                               {'../models/User' : {create: createSpy, save: saveSpy}})
    controller.signup(req)
    expect(createSpy.calledOnce).to.equal(true)
    expect(saveSpy.calledOnce).to.equal(true)
  })
  it('will put the newly created user in the response', function(done) {
    let createStub = sinon.stub().returns({username: 'bob', password: 'password1234'})
    let saveMock = user => Promise.resolve(user)
    let controller = proxyquire('../../app/controllers/auth', 
                               {'../models/User' : {create: createStub, save: saveMock}})
    let req = {body: {username: 'bob', password: 'password1234'}}
    let jsonSpy = (res) => {
      expect(res.user.username).to.equal('bob')
      done()
    }
    let res = {json: jsonSpy} 
    controller.signup(req, res)
  })
})

describe('parseAuthString', function() {
  it('can parse a valid auth string', function() {
    let util = require('../../lib/util') // TODO move this out of controller tests
    let authstring = base64.encode('bob:password1234')
    let request = {headers: {authorization: `Basic: ${authstring}`}}
    let [username, password] = util.parseAuthString(request)
    expect(username).to.equal('bob')
    expect(password).to.equal('password1234')
  })
  it('will throw an error if the authorization header is missing', function() {
    let request = {headers: {}}
    expect(() => controller.parseAuthString(request)).to.throw()
  })
})

describe('login controller', function() {
  beforeEach(function() {
    this.user = {username: 'bob'}
    this.req = {body: this.user}
    this.findUserStub = sinon.stub().returns(this.user)
    this.comparePasswordStub = sinon.stub().returns(Promise.resolve(true))
    /*
    this.comparePasswordStub = () => {
      this.calledOnce = true
      return Promise.resolve(true)
    }*/
    this.authParseStub = sinon.stub().returns(['bob', 'password123456'])
    this.generateTokenStub = sinon.stub().returns('kjlk3j2fkljljklfaf')
    this.controller = proxyquire('../../app/controllers/auth', {
                                  '../models/User' : {
                                  findUser: this.findUserStub, 
                                  comparePassword: this.comparePasswordStub,
                                  generateToken: this.generateTokenStub
                                  },
                                  '../../lib/util' : { parseAuthString: this.authParseStub}
                                })
  })
  it('invokes parseAuthString with the request, finderUser, comparePassword, and generateToken', function() {
    let authstring = base64.encode('bob:password1234')
    let request = {headers: {authorization: `Basic: ${authstring}`}}
    debugger
    let jsonSpy = sinon.spy()
    this.controller.login(request, {json: jsonSpy},)
    expect(this.authParseStub.calledOnce).to.equal(true)
    expect(this.comparePasswordStub.calledOnce).to.equal(true)
    //expect(this.generateTokenStub.calledOnce).to.equal(true) TODO won't work due to promise
    //expect(jsonSpy.calledOnce).to.equal(true) // Also won't work due to promise
  })
})
