import { createServer } from 'http'
import type { IncomingHttpHeaders, Server } from 'http'
import type { AddressInfo } from 'net'
import { inspect } from 'util'
import { ConfigModule } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import type { User } from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'
import { XRoadConfig } from '@island.is/nest/config'
import { EmploymentCertificateClientConfig } from './employment-certificate.config'
import {
  getEmploymentCertificateClientProblem,
  isPreviewChanged,
} from './employment-certificate.errors'
import { EmploymentCertificateClientModule } from './employment-certificate.module'
import { EmploymentCertificateClientService } from './employment-certificate.service'

interface ReceivedRequest {
  method?: string
  url?: string
  headers: IncomingHttpHeaders
  body: string
}

const user = {
  nationalId: '0101302399',
  authorization: 'Bearer test-token',
  scope: [],
  client: 'test-client',
} as unknown as User

const DIRECT_URL = 'FJS_EMPLOYMENT_CERTIFICATE_DIRECT_URL'

// The real module, generated client and Enhanced Fetch against a local stub
// of the API: checks what goes over the wire and into the logs.
describe('EmploymentCertificateClientModule', () => {
  const received: ReceivedRequest[] = []
  const originalDirectUrl = process.env[DIRECT_URL]
  let server: Server
  let service: EmploymentCertificateClientService
  let log: jest.SpyInstance

  beforeAll(async () => {
    server = createServer((req, res) => {
      let body = ''
      req.on('data', (chunk) => (body += chunk))
      req.on('end', () => {
        received.push({
          method: req.method,
          url: req.url,
          headers: req.headers,
          body,
        })

        if (req.url === '/employment-history/eligibility') {
          res.writeHead(200, { 'content-type': 'application/json' })
          res.end(JSON.stringify({ hasEmploymentHistory: true }))
          return
        }

        if (req.method === 'GET') {
          res.writeHead(200, { 'content-type': 'application/json' })
          res.end(
            JSON.stringify({
              previewVersion: 'v2:preview-1',
              institutions: [{ id: 'inst-b', name: 'Prófunarstofnun B' }],
            }),
          )
          return
        }

        res.writeHead(409, {
          'content-type': 'application/json',
          'x-request-id': 'request-1',
        })
        res.end(
          JSON.stringify({
            code: 'preview_changed',
            error: 'free text from the API',
            requestId: 'request-1',
          }),
        )
      })
    })
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))

    const { port } = server.address() as AddressInfo
    process.env[DIRECT_URL] = `http://127.0.0.1:${port}`

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [EmploymentCertificateClientConfig, XRoadConfig],
        }),
        EmploymentCertificateClientModule,
      ],
    }).compile()
    service = moduleRef.get(EmploymentCertificateClientService)

    log = jest.spyOn(logger, 'log').mockImplementation(() => logger)
  })

  afterAll(async () => {
    if (originalDirectUrl === undefined) {
      delete process.env[DIRECT_URL]
    } else {
      process.env[DIRECT_URL] = originalDirectUrl
    }
    log.mockRestore()
    server.closeAllConnections()
    await new Promise((resolve) => server.close(resolve))
  })

  beforeEach(() => {
    received.length = 0
    log.mockClear()
  })

  it("sends the user's own token to the API", async () => {
    await expect(service.getPreview(user)).resolves.toMatchObject({
      previewVersion: 'v2:preview-1',
    })

    expect(received).toHaveLength(1)
    expect(received[0].method).toBe('GET')
    expect(received[0].url).toBe('/employment-history/preview')
    expect(received[0].headers.authorization).toBe('Bearer test-token')
    expect(received[0].headers.accept).toBe('application/json')
    // A direct call doesn't go through X-Road.
    expect(received[0].headers['x-road-client']).toBeUndefined()
  })

  it('asks for eligibility with the same token', async () => {
    await expect(service.getEligibility(user)).resolves.toEqual({
      hasEmploymentHistory: true,
    })

    expect(received).toHaveLength(1)
    expect(received[0].method).toBe('GET')
    expect(received[0].url).toBe('/employment-history/eligibility')
    expect(received[0].headers.authorization).toBe('Bearer test-token')
  })

  it('sends the idempotency key and the choices', async () => {
    await service
      .submitRequest(user, {
        idempotencyKey: 'key-1',
        previewVersion: 'v2:preview-1',
        institutionIds: ['inst-b'],
        includeUnion: true,
        comment: ' Athugasemd ',
      })
      .catch(() => undefined)

    expect(received).toHaveLength(1)
    expect(received[0].method).toBe('POST')
    expect(received[0].url).toBe('/employment-history/requests')
    expect(received[0].headers.authorization).toBe('Bearer test-token')
    expect(received[0].headers['idempotency-key']).toBe('key-1')
    expect(JSON.parse(received[0].body)).toEqual({
      previewVersion: 'v2:preview-1',
      institutionIds: ['inst-b'],
      includeUnion: true,
      comment: 'Athugasemd',
    })
  })

  it('reports a failed call without logging its body, the comment or the token', async () => {
    const error = await service
      .submitRequest(user, {
        idempotencyKey: 'key-1',
        previewVersion: 'v2:preview-1',
        institutionIds: ['inst-b'],
        includeUnion: false,
        comment: 'secret comment text',
      })
      .catch((e: unknown) => e)

    const problem = await getEmploymentCertificateClientProblem(error)
    expect(problem).toEqual({
      status: 409,
      code: 'preview_changed',
      requestId: 'request-1',
    })
    expect(isPreviewChanged(problem)).toBe(true)

    // Enhanced Fetch logs the failure once, without the error body.
    expect(log).toHaveBeenCalledTimes(1)
    const logged = inspect(log.mock.calls, { depth: 8 })
    expect(logged).toContain('clients-fjs-employment-certificate')
    expect(logged).not.toContain('free text')
    expect(logged).not.toContain('test-token')
    expect(logged).not.toContain('secret comment text')
  })
})
