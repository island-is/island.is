import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { environment } from '../../../environments'
import { FileService } from '../file/file.service'
import { ZendeskService } from './zendesk.service'

describe('ZendeskService environment routing', () => {
  const originalEnvironment = process.env.name
  const originalProduction = environment.production
  const config = {
    FORM_SYSTEM_ZENDESK_TENANT_ID_SANDBOX: 'digitaliceland1715002531',
    FORM_SYSTEM_ZENDESK_TENANT_ID_PROD: 'digitaliceland',
    FORM_SYSTEM_ZENDESK_API_KEY_SANDBOX: 'sandbox-test-key',
    FORM_SYSTEM_ZENDESK_API_KEY_PROD: 'production-test-key',
    HEILSA_API_KEY: 'heilsa-test-key',
    HASKOLI_ISLANDS_API_KEY: 'university-test-key',
  }
  const originalConfig = Object.fromEntries(
    Object.keys(config).map((key) => [key, process.env[key]]),
  )

  beforeEach(() => {
    Object.assign(process.env, config)
    environment.production = true
  })

  afterEach(() => {
    environment.production = originalProduction
    for (const [key, value] of Object.entries({
      ...originalConfig,
      name: originalEnvironment,
    })) {
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    }
  })

  const setup = async () => {
    const module = await Test.createTestingModule({
      providers: [
        ZendeskService,
        {
          provide: LOGGER_PROVIDER,
          useValue: { info: jest.fn(), error: jest.fn() },
        },
        { provide: FileService, useValue: {} },
      ],
    }).compile()
    const service = module.get(ZendeskService)
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ticket: { id: 1 } }),
    })
    service.enhancedFetch = fetch
    return { service, fetch }
  }

  it.each(
    [undefined, 'local', 'dev'].flatMap((deployment) =>
      [false, true].flatMap((isTest) =>
        ['digitaliceland', 'heilsa', 'haskoliislands'].map(
          (storedInstance) => ({
            deployment,
            isTest,
            storedInstance,
          }),
        ),
      ),
    ),
  )(
    'uses sandbox on $deployment with isTest=$isTest and tenant $storedInstance',
    async ({ deployment, isTest, storedInstance }) => {
      if (deployment === undefined) {
        delete process.env.name
      } else {
        process.env.name = deployment
      }
      const { service, fetch } = await setup()

      await expect(
        service.sendToZendesk({ isTest }, storedInstance, '123'),
      ).resolves.toBe(true)

      expect(fetch).toHaveBeenCalledWith(
        'https://digitaliceland1715002531.zendesk.com/api/v2/tickets.json',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization:
              'Basic ' +
              Buffer.from(
                'stafraentisland@gmail.com/token:sandbox-test-key',
              ).toString('base64'),
          }),
        }),
      )
      const body = JSON.parse(fetch.mock.calls[0][1].body)
      expect(body.ticket.brand_id).toBeUndefined()
      expect(body.ticket.custom_fields).toContainEqual({
        id: 123,
        value: 'No subject',
      })
    },
  )

  it.each([
    {
      isTest: false,
      storedInstance: undefined,
      tenant: 'digitaliceland',
      key: 'production-test-key',
      user: 'stafraentisland@gmail.com',
    },
    {
      isTest: false,
      storedInstance: 'heilsa',
      tenant: 'heilsa',
      key: 'heilsa-test-key',
      user: 'admin@stafraentisland.is',
    },
    {
      isTest: false,
      storedInstance: 'haskoliislands',
      tenant: 'haskoliislands',
      key: 'university-test-key',
      user: 'stafraentisland@hi.is',
    },
    {
      isTest: true,
      storedInstance: 'heilsa',
      tenant: 'digitaliceland1715002531',
      key: 'sandbox-test-key',
      user: 'stafraentisland@gmail.com',
    },
  ])(
    'preserves production routing to $tenant for isTest=$isTest',
    async ({ isTest, storedInstance, tenant, key, user }) => {
      process.env.name = 'prod'
      const { service, fetch } = await setup()

      await service.sendToZendesk({ isTest }, storedInstance, '123')

      expect(fetch).toHaveBeenCalledWith(
        `https://${tenant}.zendesk.com/api/v2/tickets.json`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization:
              'Basic ' + Buffer.from(`${user}/token:${key}`).toString('base64'),
          }),
        }),
      )
      expect(JSON.parse(fetch.mock.calls[0][1].body).ticket.brand_id).toBe(
        isTest ? undefined : 123,
      )
    },
  )
})
