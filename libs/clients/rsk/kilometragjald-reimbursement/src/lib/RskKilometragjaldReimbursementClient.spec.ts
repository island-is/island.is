import type { Auth } from '@island.is/auth-nest-tools'
import { Configuration } from '../../gen/fetch'
import { RskKilometragjaldReimbursementClient } from './RskKilometragjaldReimbursementClient'

const auth = { authorization: 'Bearer token' } as Auth

const input = {
  fastnr: 'AB123',
  departureDate: '2026-06-01',
  departureMileage: 12000,
  arrivalDate: '2026-06-20',
  arrivalMileage: 14500,
  files: [
    { fileName: 'booking.pdf', content: Buffer.from('pdf') },
    { fileName: 'manifest.png', content: Buffer.from('png') },
  ],
}

const createClient = (response: {
  ok: boolean
  status: number
  body: unknown
}) => {
  const fetchApi = jest.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status,
    json: () => Promise.resolve(response.body),
    text: () => Promise.resolve(JSON.stringify(response.body)),
  })
  const client = new RskKilometragjaldReimbursementClient(
    new Configuration({
      basePath: 'http://xroad/r1/service',
      headers: { 'X-Road-Client': 'client' },
      fetchApi,
    }),
  )
  return { client, fetchApi }
}

describe('RskKilometragjaldReimbursementClient', () => {
  it('submits the trip and files as multipart form data', async () => {
    const { client, fetchApi } = createClient({
      ok: true,
      status: 200,
      body: {
        id: 42,
        fastnr: 'AB123',
        requestedBy: '0000000000',
        status: 'Open',
        departureDate: '2026-06-01T00:00:00',
        departureMileage: 12000,
      },
    })

    const result = await client.submitApplication(auth, input)

    const [url, init] = fetchApi.mock.calls[0]
    expect(url).toBe('http://xroad/r1/service/reimbursement/submit')
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      'X-Road-Client': 'client',
      Authorization: 'Bearer token',
    })
    expect(init.headers['content-type']).toMatch(
      /^multipart\/form-data; boundary=/,
    )

    const body = init.body.toString()
    expect(body).toContain('name="Fastnr"\r\n\r\nAB123')
    expect(body).toContain('name="DepartureDate"\r\n\r\n2026-06-01')
    expect(body).toContain('name="ArrivalMileage"\r\n\r\n14500')
    expect(body).toContain('name="Files"; filename="booking.pdf"')
    expect(body).toContain('Content-Type: application/pdf')
    expect(body).toContain('name="Files"; filename="manifest.png"')

    expect(result).toMatchObject({ id: 42, status: 'Open' })
  })

  it('throws when Skatturinn rejects the submission', async () => {
    const { client } = createClient({
      ok: false,
      status: 400,
      body: { title: 'Bad Request' },
    })

    await expect(client.submitApplication(auth, input)).rejects.toThrow(
      /status 400/,
    )
  })
})
