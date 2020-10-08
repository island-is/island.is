import { logger } from '@island.is/logging'

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
const mockSendMail = jest.fn(function () {
  return {
    messageId: testMessageId,
  }
})

const mockCreateTransport = jest.fn(function (
  account, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  return {
    sendMail: mockSendMail,
  }
})
jest.mock('nodemailer', () => {
  return {
    default: {
      createTestAccount: function () {
        return testAccount
      },
      createTransport: jest.fn(function (account) {
        return mockCreateTransport(account)
      }),
      getTestMessageUrl: function () {
        return 'Test Url'
      },
    },
  }
})

describe('EmailService', () => {
  it('it should send email', async () => {
    const emailService = new EmailService(
      {
        useTestAccount: true,
      },
      logger,
    )
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
})
