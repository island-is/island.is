import fs from 'fs'
import {
  createServer as createHttpServer,
  IncomingMessage,
  RequestListener,
  Server,
} from 'http'
import { createServer as createHttpsServer } from 'https'
import { AddressInfo } from 'net'
import { join } from 'path'

import { createEnhancedFetch } from '../createEnhancedFetch'
import { TLSSocket } from 'tls'

type Protocol = 'http' | 'https'

interface TestServer {
  url: string
  requestSpy: jest.SpyInstance<Promise<void>, [IncomingMessage]>
  close(): void
}

const selfSignedPfx = fs.readFileSync(join(__dirname, 'test-cert.pfx'))

const startServer = (protocol: Protocol = 'http'): Promise<TestServer> =>
  new Promise((resolve, reject) => {
    const requestSpy = jest.fn()
    let server: Server

    const requestHandler: RequestListener = async (req, res) => {
      await requestSpy(req)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ result: 'success' }))
    }

    if (protocol === 'https') {
      server = createHttpsServer(
        { pfx: selfSignedPfx, rejectUnauthorized: false, requestCert: true },
        requestHandler,
      )
    } else {
      server = createHttpServer(requestHandler)
    }

    server.on('listening', () => {
      const address = server.address() as AddressInfo
      address.family
      resolve({
        url: `${protocol}://localhost:${address.port}`,
        requestSpy,
        close() {
          server.close()
        },
      })
    })
    server.on('error', (err) => {
      reject(err)
    })
    server.listen()
  })

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

describe('Enhanced Fetch against http server', () => {
  let server: TestServer

  beforeAll(async () => {
    server = await startServer()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  it('should work', async () => {
    // Arrange
    const fetch = createEnhancedFetch({ name: 'test' })

    // Act
    const response = await fetch(server.url)

    // Assert
    expect(response.status).toBe(200)
    expect(response.text()).resolves.toBe('{"result":"success"}')
  })

  describe('with timeout', () => {
    it('should return 200 if server responds fast', async () => {
      // Arrange
      const fetch = createEnhancedFetch({ name: 'test', timeout: 100 })

      // Act
      const response = await fetch(server.url)

      // Assert
      expect(response.status).toBe(200)
    })

    it('should throw error if server is slow', async () => {
      // Arrange
      const timeout = 100
      const fetch = createEnhancedFetch({ name: 'test', timeout })
      server.requestSpy.mockImplementation(() => sleep(timeout))

      // Act
      const fetchPromise = fetch(server.url)

      // Assert
      await expect(fetchPromise).rejects.toThrow('network timeout')
    })

    // Behind the scenes, agentkeepalive configures a socket timeout which is 2x the keepAlive value. This test
    // is to make sure it doesn't override the actual Enhanced Fetch timeout.
    it('should not throw if keepAlive is too low', async () => {
      // Arrange
      const keepAlive = 50
      const fetch = createEnhancedFetch({ name: 'test', keepAlive })
      server.requestSpy.mockImplementation(() => sleep(keepAlive * 4))

      // Act
      const response = await fetch(server.url)

      // Assert
      expect(response.status).toBe(200)
    })
  })

  describe('with keepAlive=true', () => {
    it('should reuse socket', async () => {
      // Arrange
      const timeout = 200
      const fetch = createEnhancedFetch({ name: 'test', keepAlive: timeout })

      // Act
      const response = await fetch(server.url)
      await fetch(server.url)

      // Assert
      expect(response.headers.get('connection')).toBe('keep-alive')
      expect(server.requestSpy.mock.calls[0][0].socket).toBe(
        server.requestSpy.mock.calls[1][0].socket,
      )
    })

    it('should not reuse socket after keepAlive timeout', async () => {
      // Arrange
      const timeout = 200
      const fetch = createEnhancedFetch({ name: 'test', keepAlive: timeout })

      // Act
      const response = await fetch(server.url)
      await sleep(timeout)
      await fetch(server.url)

      // Assert
      expect(response.headers.get('connection')).toBe('keep-alive')
      expect(server.requestSpy.mock.calls[0][0].socket).not.toBe(
        server.requestSpy.mock.calls[1][0].socket,
      )
    })
  })

  describe('with keepAlive=false', () => {
    it('should not reuse socket', async () => {
      // Arrange
      const fetch = createEnhancedFetch({ name: 'test', keepAlive: false })

      // Act
      const response = await fetch(server.url)
      await fetch(server.url)

      // Assert
      expect(response.headers.get('connection')).toBe('close')
      expect(server.requestSpy.mock.calls[0][0].socket).not.toBe(
        server.requestSpy.mock.calls[1][0].socket,
      )
    })
  })
})

describe('Enhanced Fetch against https server', () => {
  let server: TestServer

  beforeAll(async () => {
    server = await startServer('https')
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterAll(() => {
    server.close()
  })

  it('should work', async () => {
    // Arrange
    const fetch = createEnhancedFetch({
      name: 'test',
      agentOptions: { rejectUnauthorized: false },
    })

    // Act
    const response = await fetch(server.url)

    // Assert
    expect(response.status).toBe(200)
    expect(response.text()).resolves.toBe('{"result":"success"}')
  })

  it('should support client certificate', async () => {
    // Arrange
    const fetch = createEnhancedFetch({
      name: 'test',
      clientCertificate: {
        pfx: selfSignedPfx,
      },
      agentOptions: { rejectUnauthorized: false },
    })

    // Act
    await fetch(server.url)

    // Assert
    expect(server.requestSpy).toHaveBeenCalled()
    const socket = server.requestSpy.mock.calls[0][0].socket as TLSSocket
    const cert = socket.getPeerCertificate()
    expect(cert.subject.CN).toBe('test')
  })
})
