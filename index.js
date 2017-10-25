let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let authRouter = require('./app/routes')
let auth = require('./lib/authenticate')
let errorHandler = require('./lib/error-handling')
const PORT = process.env.PORT || 3000

app.use(bodyParser.json({
  extended: true
}))
app.use('/auth', authRouter)
app.use(auth)
app.get('/', (req, res) => {
  res.json({msg: 'welcome authenticated user'})
})
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
