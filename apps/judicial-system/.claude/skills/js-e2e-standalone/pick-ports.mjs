// Picks free ports for the backend, api, message handler and web app of an e2e run and
// prints them as shell assignments, e.g. `eval "$(node pick-ports.mjs)"`.
//
// The backend and api also open a metrics server on PORT + 1, so each service
// gets a pair and both ports of the pair are checked. The check binds the same
// way the services do (all interfaces), so a port that passes here is one the
// service can actually take.
import { createServer } from 'node:net'

const isFree = (port) =>
  new Promise((resolve) => {
    const server = createServer()
    server.once('error', () => resolve(false))
    server.listen(port, () => server.close(() => resolve(true)))
  })

// Below the OS ephemeral range, so an outgoing connection cannot take the port
// between this check and the service starting.
const randomEvenPort = () => 20000 + 2 * Math.floor(Math.random() * 5000)

const pickPair = async (taken) => {
  for (let attempt = 0; attempt < 200; attempt++) {
    const port = randomEvenPort()
    if (taken.has(port)) continue
    if ((await isFree(port)) && (await isFree(port + 1))) {
      taken.add(port)
      return port
    }
  }
  throw new Error('No free port pair found')
}

const taken = new Set()
const backend = await pickPair(taken)
const api = await pickPair(taken)
const messageHandler = await pickPair(taken)
const web = await pickPair(taken)

console.log(`BACKEND_PORT=${backend}`)
console.log(`API_PORT=${api}`)
console.log(`MESSAGE_HANDLER_PORT=${messageHandler}`)
console.log(`WEB_PORT=${web}`)
