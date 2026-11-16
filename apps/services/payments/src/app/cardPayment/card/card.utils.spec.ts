import {
  buildVerificationBrowserData,
  buildVerificationCardholderData,
  generateVerificationRequestOptions,
} from './card.utils'
import { CardPaymentModuleConfigType } from '../cardPayment.config'
import { VerifyCardInput } from './dtos'

describe('buildVerificationBrowserData', () => {
  const validBrowserInfo = {
    ipAddress: '203.0.113.7',
    screenHeight: 1080,
    screenWidth: 1920,
  }

  it('returns undefined without browser info', () => {
    expect(buildVerificationBrowserData(undefined)).toBeUndefined()
  })

  it('returns undefined when a gateway-required member is missing or invalid', () => {
    expect(
      buildVerificationBrowserData({ ...validBrowserInfo, ipAddress: '' }),
    ).toBeUndefined()
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        screenHeight: 1080.5,
      }),
    ).toBeUndefined()
    expect(
      buildVerificationBrowserData({ ...validBrowserInfo, screenWidth: -1 }),
    ).toBeUndefined()
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        screenHeight: 1_000_000,
      }),
    ).toBeUndefined()
  })

  it('returns undefined for values that do not parse as an IP address', () => {
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        ipAddress: 'not-an-ip',
      }),
    ).toBeUndefined()
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        ipAddress: '999.999.1.1',
      }),
    ).toBeUndefined()
  })

  it('accepts IPv6 addresses', () => {
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        ipAddress: '2001:db8::1',
      }),
    ).toMatchObject({ ip: '2001:db8::1' })
  })

  it('builds the minimal gateway object from the required members', () => {
    expect(buildVerificationBrowserData(validBrowserInfo)).toEqual({
      ip: '203.0.113.7',
      screenHeight: 1080,
      screenWidth: 1920,
      javascriptEnabled: true,
      javaEnabled: false,
    })
  })

  it('passes through valid optional members', () => {
    expect(
      buildVerificationBrowserData({
        ...validBrowserInfo,
        colorDepth: 24,
        timeZoneOffset: -60,
        language: 'en-GB',
        userAgent: 'Mozilla/5.0',
        acceptHeader: 'application/json',
        javaEnabled: true,
      }),
    ).toEqual({
      ip: '203.0.113.7',
      screenHeight: 1080,
      screenWidth: 1920,
      javascriptEnabled: true,
      javaEnabled: true,
      colorDepth: 24,
      timeZoneOffset: -60,
      language: 'en-GB',
      userAgent: 'Mozilla/5.0',
      acceptHeader: 'application/json',
    })
  })

  it('omits optional members the gateway would reject instead of remapping them', () => {
    const result = buildVerificationBrowserData({
      ...validBrowserInfo,
      // 30 bits per pixel (e.g. HDR displays) is not an accepted gateway value.
      colorDepth: 30,
      timeZoneOffset: 100_000,
      language: 'not/a/valid/language/tag',
    })

    expect(result).toEqual({
      ip: '203.0.113.7',
      screenHeight: 1080,
      screenWidth: 1920,
      javascriptEnabled: true,
      javaEnabled: false,
    })
  })
})

describe('buildVerificationCardholderData', () => {
  it('returns undefined for missing or out-of-range names', () => {
    expect(buildVerificationCardholderData(undefined)).toBeUndefined()
    expect(buildVerificationCardholderData('')).toBeUndefined()
    expect(buildVerificationCardholderData('  J  ')).toBeUndefined()
    // 46 characters: omitted, never truncated into a different name.
    expect(buildVerificationCardholderData('J'.repeat(46))).toBeUndefined()
  })

  it('trims and passes through a valid name', () => {
    expect(buildVerificationCardholderData(' Jón Jónsson ')).toEqual({
      cardholderName: 'Jón Jónsson',
    })
    expect(buildVerificationCardholderData('J'.repeat(45))).toEqual({
      cardholderName: 'J'.repeat(45),
    })
  })
})

describe('generateVerificationRequestOptions', () => {
  const paymentApiConfig = {
    paymentsApiSecret: 'secret',
    paymentsApiHeaderKey: 'valitorpay-api-version',
    paymentsApiHeaderValue: '2.0',
    systemCalling: 'island-is',
  } as CardPaymentModuleConfigType['paymentGateway']

  const baseInput = {
    paymentFlowId: 'flow-1',
    cardNumber: '4111111111111111',
    expiryMonth: 12,
    expiryYear: 30,
  }

  const generate = (verifyCardInput: VerifyCardInput) =>
    JSON.parse(
      generateVerificationRequestOptions({
        verifyCardInput,
        md: 'test-md',
        paymentApiConfig,
        webOrigin: 'https://island.is/greida',
        amount: 100,
      }).body as string,
    )

  it('sends the request without 3DS objects when the client did not supply them', () => {
    const body = generate(baseInput)

    expect(body).toEqual({
      cardNumber: '4111111111111111',
      expirationMonth: 12,
      expirationYear: 2030,
      cardholderDeviceType: 'WWW',
      amount: 10000,
      currency: 'ISK',
      authenticationUrl: 'https://island.is/greida/api/card/callback',
      MD: 'test-md',
      systemCalling: 'island-is',
    })
    expect(body).not.toHaveProperty('browserData')
    expect(body).not.toHaveProperty('cardHolderData')
  })

  it('includes browserData and cardHolderData when the client supplied valid 3DS data', () => {
    const body = generate({
      ...baseInput,
      cardholderName: 'Jón Jónsson',
      browserInfo: {
        ipAddress: '203.0.113.7',
        screenHeight: 1080,
        screenWidth: 1920,
        language: 'is',
      },
    })

    expect(body.browserData).toEqual({
      ip: '203.0.113.7',
      screenHeight: 1080,
      screenWidth: 1920,
      javascriptEnabled: true,
      javaEnabled: false,
      language: 'is',
    })
    expect(body.cardHolderData).toEqual({ cardholderName: 'Jón Jónsson' })
  })

  it('omits invalid 3DS data rather than failing or altering the request base', () => {
    const body = generate({
      ...baseInput,
      cardholderName: 'J',
      browserInfo: {
        ipAddress: '',
        screenHeight: 1080,
        screenWidth: 1920,
      },
    })

    expect(body).not.toHaveProperty('browserData')
    expect(body).not.toHaveProperty('cardHolderData')
    expect(body.cardNumber).toBe('4111111111111111')
  })
})
