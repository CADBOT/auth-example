let {expect} = require('chai')
let sinon = require('sinon')
let sinonStubPromise = require('sinon-stub-promise');
sinonStubPromise(sinon)
let proxyquire = require('proxyquire')
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
