import { Test, TestingModule } from '@nestjs/testing'

import { LoggingModule } from '@island.is/logging'

import { NovaError, SmsService, SMS_OPTIONS } from './sms.service'

const testLogin = 'Login'
const testToken = 'Test Token'
const testSendSms = 'SendSms'
const testNumber = '1111111'
const failureTestNumber = '3333333'
const failOnceTestNumber = '4444444'
const testCode = '0'
const a = jest
  .fn(() => {
    return { Code: testCode }
  })
  .mockImplementationOnce(() => {
    throw { extensions: { response: { status: 401 } } }
  })
const postMock = jest.fn(function (
  path: string,
  body: { request?: { Recipients?: string[] } },
  // The init argument is needed for the mock to work
  init?: RequestInit, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  switch (path) {
    case testLogin:
      return { Token: testToken }
    case testSendSms: {
      if (body?.request?.Recipients?.includes(testNumber)) {
        return { Code: testCode }
      }

      if (body?.request?.Recipients?.includes(failOnceTestNumber)) {
        return a()
      }

      throw new Error()
    }
    default:
      throw new Error()
  }
})
jest.mock('apollo-datasource-rest', () => {
  class MockRESTDataSource {
    post = postMock
    initialize = () => undefined
  }

  return { RESTDataSource: MockRESTDataSource }
})

const testOptions = {
  url: 'Test Url',
  username: 'Test User',
  password: 'Test Password',
}
const testMessage = 'Test Message'

describe('SmsService', () => {
  let smsService: SmsService

  beforeEach(async () => {
    postMock.mockClear()

    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggingModule],
      providers: [
        {
          provide: SMS_OPTIONS,
          useValue: testOptions,
        },
        SmsService,
      ],
    }).compile()

    smsService = module.get<SmsService>(SmsService)
  })

  it('should send sms', async () => {
    const res = await smsService.sendSms(testNumber, testMessage)

    // Verify response
    expect(res.Code).toBe('0')

    // Verify login
    expect(postMock).toHaveBeenCalledWith(testLogin, undefined, {
      headers: {
        username: testOptions.username,
        password: testOptions.password,
      },
    })

    // Verfy send sms
    expect(postMock).toHaveBeenCalledWith(
      testSendSms,
      {
        request: {
          Recipients: [testNumber],
          SenderName: 'Island.is',
          SmsText: testMessage,
          IsFlash: false,
        },
      },
      {
        headers: {
          token: testToken,
        },
      },
    )
  })

  it('should throw on failure to send sms', async () => {
    // Verify throw
    expect(smsService.sendSms(failureTestNumber, testMessage)).rejects.toThrow(
      NovaError,
    )
  })

  it('should attempt reconnect on unauthorized', async () => {
    const res = await smsService.sendSms(failOnceTestNumber, testMessage)

    // Verify response
    expect(res.Code).toBe('0')

    // Verify login
    expect(postMock).toHaveBeenCalledWith(testLogin, undefined, {
      headers: {
        username: testOptions.username,
        password: testOptions.password,
      },
    })

    // Verfy send sms
    expect(postMock).toHaveBeenCalledWith(
      testSendSms,
      {
        request: {
          Recipients: [failOnceTestNumber],
          SenderName: 'Island.is',
          SmsText: testMessage,
          IsFlash: false,
        },
      },
      {
        headers: {
          token: testToken,
        },
      },
    )
  })
})
