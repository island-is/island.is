import { mock } from 'jest-mock-extended'
import { Base64 } from 'js-base64'
import { createHash } from 'crypto'

import { Test, TestingModule } from '@nestjs/testing'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { SigningService } from './signing.service'

const testOptions = {
  url: 'Test Url',
  accessToken: 'Test Access Token',
}
const testMobileNumber = '1111111'
const testMessage = 'Test Message'
const testContact = 'Test Contact'
const testLocation = 'Test Location'
const testDocumentName = 'Test Document Name'
const testDocumentContent = 'Test Document Content'

const testSignPath = `sign.json?access_token=${testOptions.accessToken}`
const testSignResponse = {
  status: 'ok',
  control_code: 'Test Control Code', // eslint-disable-line @typescript-eslint/camelcase
  token: 'Test Document Token',
}
const testStatusPath = `sign/status/${testSignResponse.token}.json?access_token=${testOptions.accessToken}`
const testSignedDocumentContent = 'Test Content'
const testStatusResponse = {
  status: 'ok',
  file: {
    name: testDocumentName,
    digest: createHash('sha256')
      .update(testSignedDocumentContent)
      .digest('hex'),
    content: testSignedDocumentContent,
  },
}
const postMock = jest.fn(function(
  path: string,
  body?: Body, // eslint-disable-line @typescript-eslint/no-unused-vars
  init?: RequestInit, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  switch (path) {
    case testSignPath:
      return testSignResponse
    case testStatusPath:
      return testStatusResponse
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

describe('SigningService', () => {
  let signingService: SigningService

  beforeEach(async () => {
    postMock.mockClear()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LOGGER_PROVIDER,
          useValue: mock<Logger>(),
        },
        {
          provide: 'SIGNING_OPTIONS',
          useValue: testOptions,
        },
        SigningService,
      ],
    }).compile()

    signingService = module.get<SigningService>(SigningService)
  })

  it('should sign a document', async () => {
    const res = await signingService.requestSignature(
      testMobileNumber,
      testMessage,
      testContact,
      testLocation,
      testDocumentName,
      testDocumentContent,
    )

    // Verify response
    expect(res.controlCode).toBe(testSignResponse.control_code)
    expect(res.documentToken).toBe(testSignResponse.token)

    // Verify sign
    const base64 = Base64.encode(testDocumentContent)
    const digest = createHash('sha256')
      .update(base64)
      .digest('hex')

    const body = new FormData()
    body.append('phone', testMobileNumber)
    body.append('message', `${testMessage} `)
    body.append('timestamp', 'true')
    body.append('language', 'IS')
    body.append('pdf[contact]', testContact)
    body.append('pdf[location]', testLocation)
    body.append('type', 'pdf')
    body.append('pdf[files][0][name]', testDocumentName)
    body.append('pdf[files][0][content]', base64)
    body.append('pdf[files][0][digest]', digest)

    expect(postMock).toHaveBeenCalledWith(testSignPath, body)
  })

  it('should get a signed document', async () => {
    const res = await signingService.getDocument(
      testDocumentName,
      testSignResponse.token,
    )

    // Verify response
    expect(res).toBe(Base64.atob(testStatusResponse.file.content))

    // Verify sign status
    expect(postMock).toHaveBeenCalledWith(testStatusPath)
  })
})
