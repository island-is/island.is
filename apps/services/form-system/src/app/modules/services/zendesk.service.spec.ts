import { Logger } from '@island.is/logging'
import { FieldTypesEnum } from '@island.is/form-system/shared'
import { environment } from '../../../environments'
import { ApplicationDto } from '../applications/models/dto/application.dto'
import { FileService } from '../file/file.service'
import { ZendeskService } from './zendesk.service'

describe('ZendeskService custom fields', () => {
  const originalEnvironment = process.env
  const originalProduction = environment.production

  beforeEach(() => {
    process.env = {
      ...originalEnvironment,
      HEILSA_API_KEY: 'heilsa-test-key',
    }
    environment.production = true
  })

  afterEach(() => {
    process.env = originalEnvironment
    environment.production = originalProduction
  })

  describe.each([FieldTypesEnum.DROPDOWN_LIST, FieldTypesEnum.RADIO_BUTTONS])(
    '%s custom fields',
    (fieldType) => {
      it.each([
        { value: 'health_service', expected: 'health_service' },
        { value: '0', expected: '0' },
        { value: undefined, expected: 'Health service' },
        { value: '', expected: 'Health service' },
      ])(
        'sends $expected for option value $value',
        async ({ value, expected }) => {
          const service = new ZendeskService(
            { info: jest.fn(), error: jest.fn() } as unknown as Logger,
            {} as FileService,
          )
          const enhancedFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ ticket: { id: 1 } }),
          })
          service.enhancedFetch = enhancedFetch
          const application = {
            id: 'application-id',
            isTest: false,
            formName: { is: 'Test form', en: 'Test form' },
            sections: [
              {
                name: { is: 'Details', en: 'Details' },
                screens: [
                  {
                    name: { is: 'Details', en: 'Details' },
                    fields: [
                      {
                        name: { is: 'Service', en: 'Service' },
                        fieldType,
                        fieldSettings: {
                          zendeskIsCustomField: true,
                          zendeskCustomFieldId: '51216236329372',
                        },
                        values: [
                          {
                            json: {
                              label: { is: 'Health service', en: 'Healthcare' },
                              value,
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          } as ApplicationDto

          await expect(
            service.sendToZendesk(application, 'heilsa', '12345'),
          ).resolves.toBe(true)

          const payload = JSON.parse(enhancedFetch.mock.calls[0][1].body)
          expect(payload.ticket.brand_id).toBe(12345)
          expect(payload.ticket.custom_fields).toEqual([
            { id: 51469962354843, value: 'Test form' },
            { id: 51216236329372, value: expected },
          ])
          expect(payload.ticket.comment.html_body).toContain('Health service')
          expect(payload.ticket.comment.html_body).not.toContain(
            'health_service',
          )
        },
      )
    },
  )
})
