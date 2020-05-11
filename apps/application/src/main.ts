import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send({ message: 'Hello!' })
})

const port = process.env.port || 4242
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
})
