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

  it('should create a ticket and return it', async () => {
    server.use(
      rest.post(`${api}/tickets.json`, (req, res, ctx) =>
        res.once(ctx.status(201), ctx.json({ ticket: { id: 123 } })),
      ),
    )

    const ticket = await zendeskService.createTicket({
      message: 'Here is a message',
      subject: 'Here is a subject',
      requesterId: testUser.id,
    })

    expect(ticket).toMatchObject({ id: 123 })
  })

  it('should return undefined when the created ticket has no id', async () => {
    server.use(
      rest.post(`${api}/tickets.json`, (req, res, ctx) =>
        res.once(ctx.status(201), ctx.json({ ticket: {} })),
      ),
    )

    const ticket = await zendeskService.createTicket({
      message: 'Here is a message',
      subject: 'Here is a subject',
      requesterId: testUser.id,
    })

    expect(ticket).toBeUndefined()
  })

  it('should return undefined when the response has no ticket', async () => {
    server.use(
      rest.post(`${api}/tickets.json`, (req, res, ctx) =>
        res.once(ctx.status(201), ctx.json({})),
      ),
    )

    const ticket = await zendeskService.createTicket({
      message: 'Here is a message',
      subject: 'Here is a subject',
      requesterId: testUser.id,
    })

    expect(ticket).toBeUndefined()
  })

  describe('bulk jobs', () => {
    const jobStatus = (results: unknown[], status = 'completed') => ({
      job_status: {
        id: 'job-1',
        url: `${api}/job_statuses/job-1.json`,
        status,
        results,
      },
    })

    it('should resolve when every upserted item succeeds', async () => {
      server.use(
        rest.post(`${api}/custom_objects/participant/jobs`, (req, res, ctx) =>
          res.once(ctx.status(200), ctx.json(jobStatus([], 'queued'))),
        ),
        rest.get(`${api}/job_statuses/job-1.json`, (req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json(
              jobStatus([
                { external_id: 'a', index: 0, status: 'CreateOrUpdate' },
              ]),
            ),
          ),
        ),
      )

      await expect(
        zendeskService.upsertCustomObjectRecordsByExternalId('participant', [
          { name: 'A', external_id: 'a' },
        ]),
      ).resolves.toBeUndefined()
    })

    it('should throw when some upserted items fail although the job completes', async () => {
      server.use(
        rest.post(`${api}/custom_objects/participant/jobs`, (req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json(
              jobStatus([
                { external_id: 'a', index: 0, status: 'CreateOrUpdate' },
                {
                  external_id: 'b',
                  index: 1,
                  status: 'Failed',
                  errors: [{ title: 'Record validation errors' }],
                },
              ]),
            ),
          ),
        ),
      )

      await expect(
        zendeskService.upsertCustomObjectRecordsByExternalId('participant', [
          { name: 'A', external_id: 'a' },
          { name: 'B', external_id: 'b' },
        ]),
      ).rejects.toThrow('1 Zendesk custom object job item(s) failed: b')
    })

    it('should treat records that do not exist as deleted', async () => {
      server.use(
        rest.post(`${api}/custom_objects/participant/jobs`, (req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json(
              jobStatus([
                { external_id: 'a', index: 0, status: 'Deleted' },
                {
                  external_id: 'b',
                  index: 1,
                  status: 'Failed',
                  errors: [
                    {
                      code: 'CustomObjectRecordDeleteFailed',
                      title: 'Record not found',
                    },
                  ],
                },
              ]),
            ),
          ),
        ),
      )

      await expect(
        zendeskService.deleteCustomObjectRecordsByExternalId('participant', [
          'a',
          'b',
        ]),
      ).resolves.toBeUndefined()
    })

    it('should throw when a delete fails for another reason', async () => {
      server.use(
        rest.post(`${api}/custom_objects/participant/jobs`, (req, res, ctx) =>
          res.once(
            ctx.status(200),
            ctx.json(
              jobStatus([
                {
                  external_id: 'a',
                  index: 0,
                  status: 'Failed',
                  errors: [{ title: 'Something else' }],
                },
              ]),
            ),
          ),
        ),
      )

      await expect(
        zendeskService.deleteCustomObjectRecordsByExternalId('participant', [
          'a',
        ]),
      ).rejects.toThrow('1 Zendesk custom object delete item(s) failed: a')
    })

    it('should throw when the job itself fails', async () => {
      server.use(
        rest.post(`${api}/custom_objects/participant/jobs`, (req, res, ctx) =>
          res.once(ctx.status(200), ctx.json(jobStatus([], 'failed'))),
        ),
      )

      await expect(
        zendeskService.upsertCustomObjectRecordsByExternalId('participant', [
          { name: 'A', external_id: 'a' },
        ]),
      ).rejects.toThrow('Zendesk custom object upsert job failed: job-1')
    })

    it('should return the created ticket ids by index', async () => {
      let body: Record<string, any> | undefined
      server.use(
        rest.post(`${api}/tickets/create_many.json`, (req, res, ctx) => {
          body = req.body as Record<string, any>
          return res.once(
            ctx.status(200),
            ctx.json(
              jobStatus([
                { index: 1, id: 456 },
                { index: 0, error: 'InvalidValue' },
              ]),
            ),
          )
        }),
      )

      const ticketIds = await zendeskService.createManyTickets([
        { message: 'first', externalId: 'first' },
        { message: 'second', externalId: 'second' },
      ])

      expect(ticketIds).toEqual([undefined, 456])
      expect(body?.tickets[0]).toMatchObject({
        external_id: 'first',
        comment: { body: 'first' },
      })
    })
  })

  it('should list custom object records by external ids across pages', async () => {
    server.use(
      rest.get(`${api}/custom_objects/participant/records`, (req, res, ctx) =>
        req.url.searchParams.get('page[after]')
          ? res(
              ctx.status(200),
              ctx.json({
                custom_object_records: [{ id: '2', external_id: 'b' }],
                meta: { has_more: false },
                // Zendesk returns a next link on the last page as well
                links: {
                  next: `${api}/custom_objects/participant/records?page[after]=end`,
                },
              }),
            )
          : res(
              ctx.status(200),
              ctx.json({
                custom_object_records: [{ id: '1', external_id: 'a' }],
                meta: { has_more: true },
                links: {
                  next: `${api}/custom_objects/participant/records?page[after]=cursor`,
                },
              }),
            ),
      ),
    )

    const records = await zendeskService.listCustomObjectRecordsByExternalIds(
      'participant',
      ['a', 'b'],
    )

    expect(records.map((r) => r.external_id)).toEqual(['a', 'b'])
  })

  it('should search custom object records across pages', async () => {
    const filters: unknown[] = []
    server.use(
      rest.post(
        `${api}/custom_objects/participant/records/search`,
        (req, res, ctx) => {
          filters.push((req.body as Record<string, unknown>).filter)
          return req.url.searchParams.get('page[after]') === 'cursor'
            ? res(
                ctx.status(200),
                ctx.json({
                  custom_object_records: [{ id: '2' }],
                  meta: { has_more: false, after_cursor: null },
                }),
              )
            : res(
                ctx.status(200),
                ctx.json({
                  custom_object_records: [{ id: '1' }],
                  meta: { has_more: true, after_cursor: 'cursor' },
                }),
              )
        },
      ),
    )

    const filter = { 'custom_object_fields.course_instance': { $eq: '123' } }
    const records = await zendeskService.searchCustomObjectRecords(
      'participant',
      filter,
    )

    expect(records.map((r) => r.id)).toEqual(['1', '2'])
    expect(filters).toEqual([filter, filter])
  })

  it('should get a ticket by external id', async () => {
    server.use(
      rest.get(`${api}/tickets.json`, (req, res, ctx) =>
        res.once(
          ctx.status(200),
          ctx.json({
            tickets:
              req.url.searchParams.get('external_id') === 'existing'
                ? [{ id: 789 }]
                : [],
          }),
        ),
      ),
    )

    await expect(
      zendeskService.getTicketByExternalId('existing'),
    ).resolves.toMatchObject({ id: 789 })
  })

  it('should return null when no ticket has the external id', async () => {
    server.use(
      rest.get(`${api}/tickets.json`, (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json({ tickets: [] })),
      ),
    )

    await expect(
      zendeskService.getTicketByExternalId('missing'),
    ).resolves.toBeNull()
  })
})
