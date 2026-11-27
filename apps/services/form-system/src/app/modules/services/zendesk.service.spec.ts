import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test } from '@nestjs/testing'
import { environment } from '../../../environments'
import { FileService } from '../file/file.service'
import { ZendeskService } from './zendesk.service'
import { FieldTypesEnum, SectionTypes } from '@island.is/form-system/shared'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { FieldDto } from '../fields/models/dto/field.dto'
import { ScreenDto } from '../screens/models/dto/screen.dto'
import { SectionDto } from '../sections/models/dto/section.dto'

describe('ZendeskService', () => {
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
        {
          provide: FileService,
          useValue: {
            getFile: jest
              .fn()
              .mockResolvedValue(Buffer.from('attachment').toString('base64')),
          },
        },
      ],
    }).compile()
    const service = module.get(ZendeskService)
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ticket: { id: 1 } }),
    })
    service.enhancedFetch = fetch
    return { service, fetch, fileService: module.get(FileService) }
  }

  const applicationWithFields = (
    fields: FieldDto[],
    isMulti = true,
  ): ApplicationDto => ({
    id: 'application',
    sections: [
      Object.assign(new SectionDto(), {
        name: { is: 'Section' },
        sectionType: SectionTypes.INPUT,
        screens: [
          Object.assign(new ScreenDto(), {
            name: { is: 'Screen' },
            isMulti,
            fields,
          }),
        ],
      }),
    ],
  })

  it.each([
    { isMulti: true, itemCount: 1 },
    { isMulti: true, itemCount: 2 },
    { isMulti: false, itemCount: 2 },
  ])(
    'renders summary grouping for multiset=$isMulti with $itemCount rows',
    async ({ isMulti, itemCount }) => {
      process.env.name = 'local'
      const { service, fetch } = await setup()
      const field = (name: string, values: string[], repeated = false) =>
        Object.assign(new FieldDto(), {
          id: name,
          name: { is: name },
          fieldType: FieldTypesEnum.TEXTBOX,
          isPartOfMultiset: repeated,
          values: values.map((text) => ({ json: { text } })),
        })
      const firstAnswers = Array.from(
        { length: itemCount },
        (_, index) => `First answer ${index + 1}`,
      )
      const secondAnswers = Array.from(
        { length: itemCount },
        (_, index) => `Second answer ${index + 1}`,
      )
      await service.sendToZendesk(
        applicationWithFields(
          [
            field('Before', ['Before answer']),
            field('First field', firstAnswers, true),
            field('Standalone field', ['Only once']),
            field('Second field', secondAnswers, true),
            field('After', ['After answer']),
          ],
          isMulti,
        ),
      )

      const body: string = JSON.parse(fetch.mock.calls[0][1].body).ticket
        .comment.html_body
      const expected = [
        'Before',
        'Before answer',
        ...(isMulti
          ? firstAnswers.flatMap((answer, index) => [
              'First field',
              answer,
              'Second field',
              secondAnswers[index],
            ])
          : [
              'First field',
              ...firstAnswers,
              'Standalone field',
              'Only once',
              'Second field',
              ...secondAnswers,
            ]),
        ...(isMulti ? ['Standalone field', 'Only once'] : []),
        'After',
        'After answer',
      ]
      const relevant = new Set(expected)
      const content = Array.from(body.matchAll(/>([^<>]+)</g), ([, text]) =>
        text.trim(),
      ).filter((text) => relevant.has(text))
      expect(content).toEqual(expected)
      const groupNumbers = Array.from(
        body.matchAll(/<h5\b[^>]*>(\d+)\.<\/h5>/g),
        ([, number]) => number,
      )
      expect(groupNumbers).toEqual(isMulti && itemCount > 1 ? ['1', '2'] : [])
    },
  )

  it('omits hidden row answers and uploads standalone attachments only once', async () => {
    process.env.name = 'local'
    const { service, fetch, fileService } = await setup()
    fetch.mockImplementation(async (url: string) => ({
      ok: true,
      json: async () =>
        url.includes('/uploads.json')
          ? { upload: { token: 'attachment-token' } }
          : { ticket: { id: 1 } },
    }))
    const key = 'application/123_report.pdf'
    const application = applicationWithFields([
      Object.assign(new FieldDto(), {
        id: 'parent',
        name: { is: 'Parent' },
        fieldType: FieldTypesEnum.CHECKBOX,
        isPartOfMultiset: true,
        values: [
          { json: { checkboxValue: false } },
          { json: { checkboxValue: true } },
        ],
      }),
      Object.assign(new FieldDto(), {
        id: 'child',
        name: { is: 'Child' },
        fieldType: FieldTypesEnum.TEXTBOX,
        isPartOfMultiset: true,
        fieldSettings: {
          zendeskIsCustomField: true,
          zendeskCustomFieldId: '456',
        },
        values: [
          { json: { text: 'Hidden answer' } },
          { json: { text: 'Visible <answer>' } },
        ],
      }),
      Object.assign(new FieldDto(), {
        id: 'attachment',
        name: { is: 'Attachment' },
        fieldType: FieldTypesEnum.FILE,
        isPartOfMultiset: false,
        values: [{ json: { s3Key: [key] } }],
      }),
    ])
    application.dependencies = [
      { parentProp: 'parent', childProps: ['child'], isSelected: true },
    ]

    await expect(service.sendToZendesk(application)).resolves.toBe(true)

    const request = fetch.mock.calls.find(([url]) =>
      url.includes('/tickets.json'),
    )
    if (!request) throw new Error('Missing ticket request')
    const ticket = JSON.parse(request[1].body).ticket
    expect(ticket.comment.html_body).toContain('Visible &lt;answer&gt;')
    expect(ticket.comment.html_body).not.toContain('Hidden answer')
    expect(ticket.custom_fields).toContainEqual({
      id: 456,
      value: '2. Visible <answer>',
    })
    expect(ticket.comment.html_body.match(/report\.pdf/g)).toHaveLength(1)
    expect(ticket.comment.uploads).toEqual(['attachment-token'])
    expect(fileService.getFile).toHaveBeenCalledTimes(1)
    expect(fileService.getFile).toHaveBeenCalledWith(key)
  })

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
