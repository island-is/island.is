import { freshdeskApi as freshdesk, FreshdeskConfig } from './freshdesk.api'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { CategoryResponse } from './freshdesk.type'

const testConfig: FreshdeskConfig = {
  domain: 'https://subdomain.domain.com',
  key: 'key',
}

const testApi = `https://${testConfig.domain}/api/v2`

const categoriesResponse: CategoryResponse[] = [
  {
    id: 1,
    name: 'category name 1',
  },
  {
    id: 2,
    name: 'category name 1',
    description: 'category description 2',
  },
]

const server = setupServer(
  rest.get(`${testApi}/solutions/categories`, (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(categoriesResponse))
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
