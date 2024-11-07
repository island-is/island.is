import { mock } from 'jest-mock-extended'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { Logger } from '@island.is/logging'
import { ZendeskService } from './zendesk.service'

const testOptions = {
  formToken: 'token',
  formEmail: 'email',
  subdomain: 'subdomain',
  isConfigured: true,
}

const testUser = {
  name: 'John Smith',
  email: 'john@smith.com',
  id: 1234,
}

const api = `https://${testOptions.subdomain}.zendesk.com/api/v2`

const server = setupServer(
  rest.get(`${api}/search.json`, (req, res, ctx) => {
    const query = req.url.searchParams.get('query')

    switch (query) {
      case 'email:"nonexisting@email.com"':
        return res(
          ctx.status(200),
          ctx.json({
            results: [],
          }),
        )
      case 'email:"existing@email.com"':
        return res(
          ctx.status(200),
          ctx.json({
            results: [testUser],
          }),
        )
      default:
        break
    }
  }),
  rest.post(`${api}/users.json`, (req, res, ctx) => {
    const {
      user: { email },
    } = req.body as Record<string, any>

    if (email === 'existing@email.com') {
      return res(ctx.status(422), ctx.json({ description: 'error' }))
    }

    return res(ctx.status(201), ctx.json({ user: testUser }))
  }),
  rest.post(`${api}/tickets.json`, (req, res, ctx) => {
    return res(ctx.status(201, 'Created'))
  }),
)

describe('zendeskService', () => {
  let zendeskService: ZendeskService

  beforeEach(async () => {
    server.listen()
    zendeskService = new ZendeskService(testOptions, mock<Logger>())
  })

  afterAll(() => server.close())

  it('should create instance', () => {
    expect(zendeskService).toBeInstanceOf(ZendeskService)
  })

  it('should return null when no user found by email', async () => {
    const results = await zendeskService.getUserByEmail('nonexisting@email.com')

    expect(results).toEqual(null)
  })

  it('should return object when email is found', async () => {
    const results = await zendeskService.getUserByEmail('existing@email.com')

    expect(results).toMatchObject(testUser)
  })

  it('should create a user', async () => {
    const results = await zendeskService.createUser(
      testUser.name,
      testUser.email,
    )

    expect(results).toMatchObject(testUser)
  })

  it('should fail to create a user', async () => {
    await zendeskService
      .createUser(testUser.name, 'existing@email.com')
      .catch((e) => {
        expect(e).toStrictEqual(
          new Error('Failed to create Zendesk user: error'),
        )
      })
  })

  it('should submit a ticket', async () => {
    const results = await zendeskService.submitTicket({
      message: 'Here is a message',
      subject: 'Here is a subject',
      requesterId: testUser.id,
      tags: ['web'],
    })

    expect(results).toEqual(true)
  })
})
