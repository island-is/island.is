import {
  Application,
  ExternalData,
  FormValue,
  ApplicationTypes,
} from '@island.is/application/core'

import { AssignApplicationThroughEmail } from './types'

const mockSignedToken = 'signed_token'

jest.mock('./utils/assign', () => ({
  __esModule: true,
  createAssignToken: jest.fn(() => mockSignedToken),
}))

import ApplicationAPITemplateUtils from './ApplicationAPITemplateUtils'

const createMockApplication = (
  data: {
    answers?: FormValue
    externalData?: ExternalData
    state?: string
    typeId?: ApplicationTypes
  } = {},
): Application => ({
  id: '123',
  assignees: [],
  state: data.state || 'draft',
  applicant: '111111-3000',
  typeId: data.typeId || ApplicationTypes.EXAMPLE,
  modified: new Date(),
  created: new Date(),
  attachments: {},
  answers: data.answers || {},
  externalData: data.externalData || {},
})

const mockEmailService = {
  sendEmail: () => Promise.resolve('success'),
}

const testToken = 'verysecrettoken'
const clientLocationOrigin = 'http://localhost:test'

describe('ApplicationAPITemplateUtils', () => {
  let apiTemplateUtils: ApplicationAPITemplateUtils
  let mockApplication: Application
  beforeEach(() => {
    mockApplication = createMockApplication()

    apiTemplateUtils = new ApplicationAPITemplateUtils(mockApplication, {
      jwtSecret: testToken,
      emailService: mockEmailService,
      clientLocationOrigin,
    })
  })

  describe('attempts to', () => {
    it('send an email when called with email action', () => {
      const sendEmailSpy = jest.spyOn(mockEmailService, 'sendEmail')

      expect(sendEmailSpy).toHaveBeenCalledTimes(0)

      apiTemplateUtils.performAction({
        type: 'sendEmail',
        template: {},
      })

      expect(sendEmailSpy).toHaveBeenCalledTimes(1)
      sendEmailSpy.mockRestore()
    })

    it('send an email with assignment template when called with assignThroughEmail action', () => {
      const testEmail = 'test@test.test'

      mockApplication = createMockApplication({
        answers: {
          email: testEmail,
        },
      })

      apiTemplateUtils = new ApplicationAPITemplateUtils(mockApplication, {
        jwtSecret: testToken,
        emailService: mockEmailService,
        clientLocationOrigin,
      })

      const sendEmailSpy = jest.spyOn(mockEmailService, 'sendEmail')

      expect(sendEmailSpy).toHaveBeenCalledTimes(0)

      const generateTemplate: AssignApplicationThroughEmail['generateTemplate'] = (
        props,
        token,
      ) => ({
        text: `Test ${props.application.answers.email} ${props.application.id} ${props.clientLocationOrigin}/tengjast-umsokn?token=${token}`,
      })

      const expectedTemplate = generateTemplate(
        apiTemplateUtils.createEmailTemplateGeneratorProps(),
        mockSignedToken,
      )

      apiTemplateUtils.performAction({
        type: 'assignThroughEmail',
        generateTemplate,
      })

      expect(sendEmailSpy).toHaveBeenCalledTimes(1)
      expect(sendEmailSpy).toHaveBeenCalledWith(expectedTemplate)
      sendEmailSpy.mockRestore()
    })
  })

  describe('throws an invalid action error', () => {
    it('when called with an invalid action', () => {
      expect(
        apiTemplateUtils.performAction({
          // @ts-ignore
          type: 'invalid',
        }),
      ).rejects.toEqual(new Error('Invalid action'))
    })
  })
})
