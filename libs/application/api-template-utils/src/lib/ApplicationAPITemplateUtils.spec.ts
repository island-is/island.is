import {
  Application,
  ExternalData,
  FormValue,
  ApplicationTypes,
} from '@island.is/application/core'

const mockSignedToken = 'signed_token'

jest.mock('./utils/assign', () => ({
  __esModule: true,
  createAssignToken: jest.fn(() => mockSignedToken),
  createAssignTemplate: jest.fn((application, email, token) => ({
    application,
    email,
    token,
  })),
}))

import ApplicationAPITemplateUtils from './ApplicationAPITemplateUtils'
import { createAssignTemplate } from './utils'

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

describe('ApplicationAPITemplateUtils', () => {
  let apiTemplateUtils: ApplicationAPITemplateUtils
  let mockApplication: Application
  beforeEach(() => {
    mockApplication = createMockApplication()

    apiTemplateUtils = new ApplicationAPITemplateUtils(mockApplication, {
      jwtSecret: testToken,
      emailService: mockEmailService,
    })
  })

  describe('attempts to', () => {
    it('send an email when called with email action', () => {
      const sendEmailSpy = jest.spyOn(mockEmailService, 'sendEmail')

      expect(sendEmailSpy).toHaveBeenCalledTimes(0)

      apiTemplateUtils.performAction({
        type: 'email',
        template: {},
      })

      expect(sendEmailSpy).toHaveBeenCalledTimes(1)
      sendEmailSpy.mockRestore()
    })

    it('send an email with assignment template when called with assignThroughEmail action', () => {
      const testEmail = 'test@test.test'
      const emailKey = 'email'

      mockApplication = createMockApplication({
        answers: {
          [emailKey]: testEmail,
        },
      })

      apiTemplateUtils = new ApplicationAPITemplateUtils(mockApplication, {
        jwtSecret: testToken,
        emailService: mockEmailService,
      })

      const sendEmailSpy = jest.spyOn(mockEmailService, 'sendEmail')

      expect(sendEmailSpy).toHaveBeenCalledTimes(0)

      const expectedTemplate = createAssignTemplate(
        mockApplication,
        testEmail,
        mockSignedToken,
      )

      apiTemplateUtils.performAction({
        type: 'assignThroughEmail',
        emailAnswerKey: emailKey,
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
