import express from 'express'
import { startConsumers } from './consumers'

startConsumers().then(() => {
  console.log('All consumers have been started')
})

const app = express()
app.get('/', (req, res) => {
  res.send({ message: 'Hello, I am a liveness probe' })
})

const port = process.env.port || 7777
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
server.on('error', console.error)
