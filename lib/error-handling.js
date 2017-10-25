module.exports = (err, req, res, next) => {
  console.log('IN ERROR HANDLING MIDDLEWEAR')
  console.error(err.stack)
  res.json({msg: err.message})
}
