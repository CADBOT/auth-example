module.exports = (req, res, next) => {
  console.log('headers', req.headers)
  console.log('in auth')
  if (!req.headers.authorization) return next(new Error('Authorization header missing')) 
  res.json({msg: 'welcome authenticated user'})
}
