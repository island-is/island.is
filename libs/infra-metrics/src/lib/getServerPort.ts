import { Server } from 'http'

export const getServerPort = (server: Server, fallbackPort: number) => {
  const address = server.address()
  if (address && typeof address !== 'string') {
    return address.port
  }
  return fallbackPort
}
