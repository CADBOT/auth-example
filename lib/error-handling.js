module.exports = (err, req, res, next) => {
  console.error(err.stack)
  res.json({msg: err.message})
}
