import express from 'express'

import { applicationRoutes, issuerRoutes } from './api'

const app = express()

app.use(express.json())
app.use('/applications', applicationRoutes)
app.use('/issuers', issuerRoutes)

app.get('/status', (req, res) => {
  res.json({ ok: true })
})

const port = process.env.port || 4242
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
server.on('error', console.error)
