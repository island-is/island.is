import express from 'express'

const app = express()

app.use(express.json())

// open areas
app.get('/status', (req, res) => {
  res.json({ ok: true })
})

// security middleware
app.use((req, res, next) => {
  // we need to secure all routes by default. OAuth?
  next()
})

// secured
app.use('/resourceA', (req, res) => {
  res.status(200).send({ a: 5 })
})

app.use('/resourceB', (req, res) => {
  res.status(200).send({ b: 10 })
})

const port = process.env.port || 3000
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
server.on('error', console.error)
