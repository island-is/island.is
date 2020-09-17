import { mock } from 'jest-mock-extended'

import { Test, TestingModule } from '@nestjs/testing'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { SmsService } from './sms.service'

const testLogin = 'Login'
const testToken = 'Test Token'
const testSendSms = 'SendSms'
const testCode = '0'
const postMock = jest.fn(function(
  path: string,
  body?: Body,
  init?: RequestInit,
) {
  switch (path) {
    case testLogin:
      return { Token: testToken }
    case testSendSms:
      return { Code: testCode }
    default:
      throw new Error()
  }
})
jest.mock('apollo-datasource-rest', function() {
  return {
    RESTDataSource: function() {
      this.post = postMock
      return this
    },
  }
})

const testOptions = {
  url: 'Test Url',
  username: 'Test User',
  password: 'Test Password',
}
const testNumber = '1111111'
const testMessage = 'Test Message'

describe('SmsService', () => {
  let smsService: SmsService

  beforeEach(async () => {
    postMock.mockClear()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: mock<Logger>(),
        },
        {
          provide: 'SMS_OPTIONS',
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
})
