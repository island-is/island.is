import { freshdeskApi as freshdesk, FreshdeskConfig } from './freshdesk.api'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { TicketResponse } from './freshdesk.type'

const testConfig: FreshdeskConfig = {
  domain: 'https://subdomain.domain.com',
  key: 'key',
}

const testApi = `https://${testConfig.domain}/api/v2`

const tickets: TicketResponse[] = [
  {
    id: 1,
    subject: 'ticket subject 1',
  },
  {
    id: 2,
    subject: 'ticket subject 2',
  },
]

const server = setupServer(
  rest.get(`${testApi}/tickets`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(tickets))
  }),
)

describe('freshdesk', () => {
  let freshdeskApi: freshdesk

  beforeEach(async () => {
    server.listen()
    freshdeskApi = new freshdesk(testConfig)
  })

  afterAll(() => server.close())

  it('should create instance', () => {
    expect(freshdeskApi).toBeInstanceOf(freshdesk)
  })
})
