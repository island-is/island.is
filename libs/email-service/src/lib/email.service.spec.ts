import { join } from 'path'

import { Message } from '../types'
import { createTestingEmailModule } from './test/createTestingEmailModule'
import { EmailService } from './email.service'

const testAccount = {
  smtp: {
    host: 'Test Host',
    port: 'Test Port',
    secure: 'Test Secure',
  },
  user: 'Test User',
  pass: 'Test Pass',
}

const testMessageId = 'Test Message Id'

const mockSendMail = jest.fn(() => ({
  messageId: testMessageId,
}))

const mockCreateTransport = jest.fn(
  (
    account, // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => ({
    sendMail: mockSendMail,
  }),
)

jest.mock('nodemailer', () => ({
  createTestAccount: () => {
    return testAccount
  },
  createTransport: jest.fn((account) => {
    return mockCreateTransport(account)
  }),
  getTestMessageUrl: () => {
    return 'Test Url'
  },
}))

describe('EmailService', () => {
  let emailService: EmailService

  beforeEach(async () => {
    const module = await createTestingEmailModule()
    emailService = module.get(EmailService)
  })

  it('it should send email', async () => {
    const testMessage = { to: 'Test To' }
    const messageId = await emailService.sendEmail(testMessage)

    expect(messageId).toBe(testMessageId)

    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    expect(mockSendMail).toHaveBeenCalledWith(testMessage)
  })

  it('should send an email with a design template', async () => {
    const title = 'Email main heading'

    const message = {
      to: 'recipient@island.is',
      template: {
        title,
        body: [
          {
            component: 'Image',
            context: {
              src: join(
                __dirname,
                '../../../application/template-api-modules/src/lib/modules/templates/parental-leave/emailGenerators/assets/logo.jpg',
              ),
            },
          },
          {
            component: 'Image',
            context: {
              src: join(
                __dirname,
                '../../../application/template-api-modules/src/lib/modules/templates/parental-leave/emailGenerators/assets/child.jpg',
              ),
            },
          },
          {
            component: 'Heading',
            context: {
              copy: title,
            },
          },
          {
            component: 'Copy',
            context: {
              copy: 'Hi ${user}',
            },
          },
          {
            component: 'Copy',
            context: {
              copy: 'Your application has been successfully approved.',
            },
          },
          { component: 'Copy', context: { copy: 'Best regards,' } },
          { component: 'Copy', context: { copy: 'Parental Leave Fund' } },
        ],
      },
    } as Message

    const messageId = await emailService.sendEmail(message)

    expect(messageId).toBe(testMessageId)

    expect(mockCreateTransport).toHaveBeenCalledWith({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })

    expect(mockSendMail).toHaveBeenCalledWith(message)
  })
})
