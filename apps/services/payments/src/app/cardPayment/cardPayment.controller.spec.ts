import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException } from '@nestjs/common'
import { getModelToken } from '@nestjs/sequelize'
import { Cache as CacheManager } from 'cache-manager'
import request from 'supertest'
import { v4 as uuid } from 'uuid'

import {
  ChargeFjsV2ClientService,
  ChargeResponse,
} from '@island.is/clients/charge-fjs-v2'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { CardErrorCode, PaymentServiceCode } from '@island.is/shared/constants'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import {
  CardPaymentResponse,
  PaymentMethod,
  PaymentStatus,
  RefundResponse,
} from '../../types'
import { AppModule } from '../app.module'
import { CreatePaymentFlowInput } from '../paymentFlow/dtos/createPaymentFlow.input'
import { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { CardPaymentService } from './cardPayment.service'
import {
  CachePaymentFlowStatus,
  SavedVerificationCompleteData,
  SavedVerificationPendingData,
} from '../../types/cardPayment'
import { generateMd, getPayloadFromMd } from './cardPayment.utils'
import { ChargeCardInput, VerificationCallbackInput } from './dtos'
import { RefundCardPaymentInput } from './dtos/refundCardPayment.input'
import { VerifyCardInput } from './dtos/verifyCard.input'

const charges = [
  {
    chargeItemCode: '123',
    chargeType: 'A',
    quantity: 1,
    price: 1000,
  },
]

const ON_UPDATE_URL = '/onUpdate'

const getCreatePaymentFlowPayload = (): CreatePaymentFlowInput => ({
  charges,
  payerNationalId: '1234567890',
  availablePaymentMethods: [PaymentMethod.CARD, PaymentMethod.INVOICE],
  onUpdateUrl: ON_UPDATE_URL,
  organisationId: '5534567890',
})

const TOKEN_SIGNING_SECRET = 'supersecret'
const TOKEN_SIGNING_ALGORITHM = 'HS256'

describe('CardPaymentController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let cacheManager: CacheManager
  let paymentFlowService: PaymentFlowService
  let cardPaymentDetailsModel: typeof CardPaymentDetails
  let paymentFulfillmentModel: typeof PaymentFulfillment

  let previousPaymentGatewayApiUrl = ''
  let previousTokenSigningSecret = ''
  let previousTokenSigningAlgorithm = ''

  let paymentFlowId: string

  let logPaymentFlowUpdateSpy: jest.SpyInstance

  beforeAll(async () => {
    previousPaymentGatewayApiUrl = process.env.PAYMENTS_GATEWAY_API_URL ?? ''
    previousTokenSigningSecret = process.env.PAYMENTS_TOKEN_SIGNING_SECRET ?? ''
    previousTokenSigningAlgorithm =
      process.env.PAYMENTS_TOKEN_SIGNING_ALGORITHM ?? ''

    process.env.PAYMENTS_GATEWAY_API_URL = ''
    process.env.PAYMENTS_TOKEN_SIGNING_SECRET = TOKEN_SIGNING_SECRET
    process.env.PAYMENTS_TOKEN_SIGNING_ALGORITHM = TOKEN_SIGNING_ALGORITHM
    process.env.PAYMENTS_APPLE_PAY_DOMAIN = 'island.is'
    process.env.PAYMENTS_APPLE_PAY_DISPLAY_NAME = 'island.is'

    app = await testServer({
      appModule: AppModule,
      enableVersioning: true,
      override: (builder) =>
        builder.overrideProvider(FeatureFlagService).useValue({
          getValue: jest.fn((feature: Features) =>
            Promise.resolve(
              feature === Features.isIslandisPaymentEnabled ||
                feature === Features.isIslandisApplePayPaymentEnabled,
            ),
          ),
        }),
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })
    server = request(app.getHttpServer())

    cacheManager = app.get<CacheManager>(CACHE_MANAGER)
    paymentFlowService = app.get<PaymentFlowService>(PaymentFlowService)
    cardPaymentDetailsModel = app.get(getModelToken(CardPaymentDetails))
    paymentFulfillmentModel = app.get(getModelToken(PaymentFulfillment))

    jest
      .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
      .mockReturnValue(
        Promise.resolve({
          catalogItems: charges.map((charge) => ({
            ...charge,
            priceAmount: charge.price,
            performingOrgID: 'TODO',
            chargeItemName: 'TODO',
          })),
          totalPrice: 1000,
          firstProductTitle: 'Test',
        }),
      )

    jest
      .spyOn(ChargeFjsV2ClientService.prototype, 'validateCharge')
      .mockReturnValue(Promise.resolve(true))

    // Create a payment flow
    const createPayload = getCreatePaymentFlowPayload()

    const response = await server.post('/v1/payments').send(createPayload)

    expect(response.status).toBe(200)

    const {
      urls: { is },
    } = response.body

    paymentFlowId = is.split('/').pop()
  })

  beforeEach(async () => {
    logPaymentFlowUpdateSpy = jest
      .spyOn(paymentFlowService, 'logPaymentFlowUpdate')
      .mockReturnValue(Promise.resolve())
  })

  afterEach(async () => {
    logPaymentFlowUpdateSpy.mockRestore()

    // Clean up payment fulfillments and card payment details to ensure tests are deterministic
    await cardPaymentDetailsModel.destroy({ where: {} })
    await paymentFulfillmentModel.destroy({ where: {} })
  })

  afterAll(async () => {
    await app?.cleanUp()

    process.env.PAYMENTS_GATEWAY_API_URL = previousPaymentGatewayApiUrl
    process.env.PAYMENTS_TOKEN_SIGNING_SECRET = previousTokenSigningSecret
    process.env.PAYMENTS_TOKEN_SIGNING_ALGORITHM = previousTokenSigningAlgorithm

    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('verify', () => {
    it('should throw an error if trying to verify invalid payment flow', async () => {
      const verifyPayload: VerifyCardInput = {
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        paymentFlowId: uuid(),
      }

      const response = await server
        .post('/v1/payments/card/verify')
        .send(verifyPayload)

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(PaymentServiceCode.PaymentFlowNotFound)
    })

    it('should throw an error if trying to verify a payment flow that has already been paid', async () => {
      const verifyPayload: VerifyCardInput = {
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        paymentFlowId,
      }

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (url) => {
          if (typeof url === 'string') {
            if (url === ON_UPDATE_URL) {
              return {
                json: async () => ({ isSuccess: true }),
                status: 200,
                ok: true,
              } as Response
            }
          }

          return {
            json: async () => ({ error: 'Missing handler' }),
            status: 500,
            ok: false,
          } as Response
        })

      const getPaymentFlowStatusSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowStatus')
        .mockResolvedValue({
          paymentStatus: PaymentStatus.PAID,
          updatedAt: new Date(),
        })

      const response = await server
        .post('/v1/payments/card/verify')
        .send(verifyPayload)

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(PaymentServiceCode.PaymentFlowAlreadyPaid)

      getPaymentFlowStatusSpy.mockRestore()
      fetchSpy.mockRestore()
    })

    it('should calculate amount server-side from charges', async () => {
      const verificationUrl = '/CardVerification'
      const serverSideTotalPrice = 2500

      const getPaymentFlowChargeDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
        .mockResolvedValue({
          catalogItems: charges.map((charge) => ({
            ...charge,
            priceAmount: charge.price,
            performingOrgID: 'TODO',
            chargeItemName: 'TODO',
          })),
          totalPrice: serverSideTotalPrice,
          firstProductTitle: 'Test',
        })

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (url) => {
          if (typeof url === 'string' && url.includes(verificationUrl)) {
            return {
              json: async () => ({ isSuccess: true }),
              status: 200,
              ok: true,
            } as Response
          }
          return {
            json: async () => ({ error: 'Missing handler' }),
            status: 500,
            ok: false,
          } as Response
        })

      const verifyPayload: VerifyCardInput = {
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        paymentFlowId,
      }

      await server.post('/v1/payments/card/verify').send(verifyPayload)

      const [, fetchOptions] = fetchSpy.mock.calls[0]
      const body = fetchOptions?.body
      if (typeof body !== 'string') {
        throw new Error('Expected fetch to be called with body')
      }
      const requestBody = JSON.parse(body)

      expect(requestBody.amount).toBe(serverSideTotalPrice * 100)
      expect(requestBody.currency).toBe('ISK')

      getPaymentFlowChargeDetailsSpy.mockResolvedValue({
        catalogItems: charges.map((charge) => ({
          ...charge,
          priceAmount: charge.price,
          performingOrgID: 'TODO',
          chargeItemName: 'TODO',
        })),
        totalPrice: 1000,
        firstProductTitle: 'Test',
      })
      fetchSpy.mockRestore()
    })

    it('it should generate the correct cache payloads (cache and fetch) when verify is called with a valid card', async () => {
      const verificationUrl = '/CardVerification'

      const cacheSpy = jest.spyOn(cacheManager, 'set')
      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (url) => {
          if (typeof url === 'string') {
            if (url.includes(verificationUrl)) {
              return {
                json: async () => ({ isSuccess: true }),
                status: 200,
                ok: true,
              } as Response
            }
          }

          return {
            json: async () => ({ error: 'Missing handler' }),
            status: 500,
            ok: false,
          } as Response
        })

      const verifyPayload: VerifyCardInput = {
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        paymentFlowId,
      }

      const expectedCacheValue: SavedVerificationPendingData = {
        paymentFlowId,
      }

      const expectedVerifiedAmount = 1000 * 100

      await server.post('/v1/payments/card/verify').send(verifyPayload)

      expect(cacheSpy).toHaveBeenCalled()

      const [correlationIdFromCacheKey, cachedValue] = cacheSpy.mock.calls[0]
      expect(typeof correlationIdFromCacheKey).toBe('string')
      expect(cachedValue).toEqual(expectedCacheValue)

      const [fetchUrl, fetchOptions] = fetchSpy.mock.calls[0]

      expect(fetchUrl).toBe(verificationUrl)
      expect(typeof fetchOptions).toBe('object')

      const body = fetchOptions?.body
      if (typeof body !== 'string') {
        throw new Error('Expected fetch to be called with body')
      }
      const requestBody = JSON.parse(body)

      expect(requestBody.cardNumber).toBe(verifyPayload.cardNumber.toString())
      expect(requestBody.expirationMonth).toBe(verifyPayload.expiryMonth)
      expect(requestBody.expirationYear).toBe(verifyPayload.expiryYear + 2000)
      expect(requestBody.amount).toBe(expectedVerifiedAmount)
      expect(requestBody.currency).toBe('ISK')

      const mdFromRequestBody = requestBody.MD
      const decodedMdPayload = getPayloadFromMd({
        md: mdFromRequestBody,
        paymentsTokenSigningSecret: TOKEN_SIGNING_SECRET,
      })

      expect(decodedMdPayload.correlationId).toBe(correlationIdFromCacheKey)

      cacheSpy.mockRestore()
      fetchSpy.mockRestore()
    })

    it('should throw an error in verification callback if correlation id is not found in cache', async () => {
      const cacheGetSpy = jest.spyOn(cacheManager, 'get') // not mocking return value ("nothing in cache")

      const someCorrelationId = uuid()

      // Valid md created with a valid secret
      const md = generateMd({
        correlationId: someCorrelationId,
        paymentFlowId,
        amount: 1000,
        paymentsTokenSigningSecret: TOKEN_SIGNING_SECRET,
        paymentsTokenSigningAlgorithm: TOKEN_SIGNING_ALGORITHM,
      })

      const verificationCallbackPayload: VerificationCallbackInput = {
        md,
        mdStatus: 'mdStatus',
        cavv: 'cavv',
        xid: 'xid',
        dsTransId: 'dsTransId',
      }

      const response = await server
        .post('/v1/payments/card/verify-callback')
        .send(verificationCallbackPayload)

      // Will check cache but not find the correlation id there
      expect(cacheGetSpy).toHaveBeenCalled()
      expect(response.status).toBe(400)

      cacheGetSpy.mockRestore()
    })

    it('should throw an error in verification callback if md is invalid', async () => {
      const cacheGetSpy = jest.spyOn(cacheManager, 'get')

      const someCorrelationId = uuid()

      // Invalid md
      const md = generateMd({
        correlationId: someCorrelationId,
        paymentFlowId,
        amount: 1000,
        paymentsTokenSigningSecret: 'some invalid secret',
        paymentsTokenSigningAlgorithm: TOKEN_SIGNING_ALGORITHM,
      })

      const verificationCallbackPayload: VerificationCallbackInput = {
        md,
        mdStatus: 'mdStatus',
        cavv: 'cavv',
        xid: 'xid',
        dsTransId: 'dsTransId',
      }

      const response = await server
        .post('/v1/payments/card/verify-callback')
        .send(verificationCallbackPayload)

      // Will throw an error before even looking into cache
      expect(cacheGetSpy).not.toHaveBeenCalled()
      expect(response.status).toBe(400)

      cacheGetSpy.mockRestore()
    })

    it('associates payment flow with callback during verification callback authentication', async () => {
      const pendingVerificationInCache: SavedVerificationPendingData = {
        paymentFlowId,
      }

      const cacheGetSpy = jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValue(pendingVerificationInCache)
      const cacheSetSpy = jest.spyOn(cacheManager, 'set')
      const cacheDelSpy = jest.spyOn(cacheManager, 'del')

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (url) => {
          if (typeof url === 'string') {
            return {
              json: async () => ({ isSuccess: true }),
              status: 200,
              ok: true,
            } as Response
          }

          return {
            json: async () => ({ error: 'Missing handler' }),
            status: 500,
            ok: false,
          } as Response
        })

      const originalCorrelationId = uuid()
      const md = generateMd({
        correlationId: originalCorrelationId,
        paymentFlowId,
        amount: 1000,
        paymentsTokenSigningSecret: TOKEN_SIGNING_SECRET,
        paymentsTokenSigningAlgorithm: TOKEN_SIGNING_ALGORITHM,
      })

      const verificationCallbackPayload: VerificationCallbackInput = {
        md,
        mdStatus: 'mdStatus',
        cavv: 'cavv',
        xid: 'xid',
        dsTransId: 'dsTransId',
      }

      await server
        .post('/v1/payments/card/verify-callback')
        .send(verificationCallbackPayload)

      expect(cacheGetSpy).toHaveBeenCalled()

      const [getKey] = cacheGetSpy.mock.calls[0]
      const [delKey] = cacheDelSpy.mock.calls[0]

      expect(getKey).toBe(originalCorrelationId)
      expect(delKey).toBe(originalCorrelationId)

      const [correlationId, verificationData] = cacheSetSpy.mock.calls[0]

      expect(correlationId).toBe(originalCorrelationId)
      expect(verificationData).toEqual({
        mdStatus: verificationCallbackPayload.mdStatus,
        cavv: verificationCallbackPayload.cavv,
        xid: verificationCallbackPayload.xid,
        dsTransId: verificationCallbackPayload.dsTransId,
      })

      cacheGetSpy.mockRestore()
      cacheDelSpy.mockRestore()
      cacheSetSpy.mockRestore()
      fetchSpy.mockRestore()
    })
  })

  describe('charge', () => {
    it('should return 400 when payment flow does not exist', async () => {
      const chargeInput: ChargeCardInput = {
        paymentFlowId: uuid(),
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        cvc: '123',
      }

      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
        json: async () => ({ isSuccess: true }),
        status: 200,
        ok: true,
      } as Response)

      const response = await server
        .post('/v1/payments/card/charge')
        .send(chargeInput)

      expect(response.status).toBe(400)
      expect(response.body.detail).toBe(PaymentServiceCode.PaymentFlowNotFound)

      fetchSpy.mockRestore()
    })

    it('should throw an error if trying to charge an invalid payment flow', async () => {
      const chargeInput: ChargeCardInput = {
        paymentFlowId,
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        cvc: '123',
      }

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (url) => {
          if (typeof url === 'string') {
            if (url === ON_UPDATE_URL) {
              return {
                json: async () => ({ isSuccess: true }),
                status: 200,
                ok: true,
              } as Response
            }
          }

          return {
            json: async () => ({ error: 'Missing handler' }),
            status: 500,
            ok: false,
          } as Response
        })

      const getPaymentFlowDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
        .mockRejectedValue(
          new BadRequestException(PaymentServiceCode.PaymentFlowNotFound),
        )

      const response = await server
        .post('/v1/payments/card/charge')
        .send(chargeInput)

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(PaymentServiceCode.PaymentFlowNotFound)

      getPaymentFlowDetailsSpy.mockRestore()
      fetchSpy.mockRestore()
    })

    it('should throw an error if trying to charge a payment flow that has already been paid', async () => {
      const chargeInput: ChargeCardInput = {
        paymentFlowId,
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        cvc: '123',
      }

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (url) => {
          if (typeof url === 'string') {
            if (url === ON_UPDATE_URL) {
              return {
                json: async () => ({ isSuccess: true }),
                status: 200,
                ok: true,
              } as Response
            }
          }

          return {
            json: async () => ({ error: 'Missing handler' }),
            status: 500,
            ok: false,
          } as Response
        })

      const getPaymentFlowDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
        .mockResolvedValue({
          id: paymentFlowId,
          payerNationalId: '1234567890',
          charges: [],
          availablePaymentMethods: [],
          onUpdateUrl: ON_UPDATE_URL,
          organisationId: '1234567890',
          created: new Date(),
          modified: new Date(),
        })
      const getPaymentFlowChargeDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
        .mockResolvedValue({
          catalogItems: [],
          totalPrice: 1000,
          firstProductTitle: 'TODO',
        })
      const getPaymentFlowStatusSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowStatus')
        .mockResolvedValue({
          paymentStatus: PaymentStatus.PAID,
          updatedAt: new Date(Date.now() - 30 * 1000),
        })

      const response = await server
        .post('/v1/payments/card/charge')
        .send(chargeInput)

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(PaymentServiceCode.PaymentFlowAlreadyPaid)

      getPaymentFlowDetailsSpy.mockRestore()
      getPaymentFlowChargeDetailsSpy.mockRestore()
      getPaymentFlowStatusSpy.mockRestore()
      fetchSpy.mockRestore()
    })
  })

  describe('refund', () => {
    it('should return 400 when payment flow is not eligible for refund', async () => {
      const refundInput: RefundCardPaymentInput = {
        paymentFlowId,
        reasonForRefund: 'fulfillment_failure',
      }

      const response = await server
        .post('/v1/payments/card/refund')
        .send(refundInput)

      expect(response.status).toBe(400)
      expect(response.body.detail).toBe(
        PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded,
      )
    })

    it('should successfully refund when payment has card confirmation (REFUND_PAYMENT path)', async () => {
      const confirmationId = uuid()
      await cardPaymentDetailsModel.create({
        id: confirmationId,
        paymentFlowId,
        maskedCardNumber: '****1234',
        acquirerReferenceNumber: 'arn-123',
        authorizationCode: 'auth-123',
        cardScheme: 'Visa',
        totalPrice: 1000,
        cardUsage: 'credit',
        merchantReferenceData: 'merchant-ref',
      })

      await paymentFulfillmentModel.create({
        paymentFlowId,
        paymentMethod: 'card',
        confirmationRefId: confirmationId,
      })

      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (url) => {
          if (
            typeof url === 'string' &&
            url.includes('/Payment/RefundWithCorrelationId')
          ) {
            return {
              json: async () =>
                ({
                  isSuccess: true,
                  responseCode: '00',
                  responseDescription: 'Refund successful',
                  responseTime: '12:00:00',
                  correlationID: uuid(),
                  acquirerReferenceNumber: 'refund-arn',
                  transactionID: 'tx-refund',
                  transactionLifecycleId: 'tlc-refund',
                  maskedCardNumber: '****1234',
                  cardInformation: {
                    cardScheme: 'Visa',
                    issuingCountry: 'IS',
                    cardUsage: 'credit',
                    cardCategory: 'consumer',
                    outOfScaScope: false,
                  },
                  authorizationIdentifier: uuid(),
                } as RefundResponse),
              status: 200,
              ok: true,
            } as Response
          }
          return {
            json: async () => ({ error: 'Missing handler' }),
            status: 500,
            ok: false,
          } as Response
        })

      const refundInput: RefundCardPaymentInput = {
        paymentFlowId,
        reasonForRefund: 'fulfillment_failure',
      }

      const response = await server
        .post('/v1/payments/card/refund')
        .send(refundInput)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.refundMethod).toBe('payment_gateway')
      expect(response.body.message).toBe('Payment successfully refunded')

      const confirmationAfter = await cardPaymentDetailsModel.findByPk(
        confirmationId,
      )
      expect(confirmationAfter?.isDeleted).toBe(true)

      fetchSpy.mockRestore()
    })
  })

  it('should throw an error if success event to upstream system fails', async () => {
    const cardPaymentUrl = '/CardPayment'

    const correlationId = uuid()
    const mockedStatus: CachePaymentFlowStatus = {
      isVerified: true,
      correlationId,
    }
    const mockedVerificationData: SavedVerificationCompleteData = {
      mdStatus: 'mdStatus',
      cavv: 'cavv',
      xid: 'xid',
      dsTransId: 'dsTransId',
    }

    const getVerificationStatusSpy = jest
      .spyOn(CardPaymentService.prototype, 'getFullVerificationStatus')
      .mockResolvedValue(mockedStatus)

    const mockedChargeResponse: CardPaymentResponse = {
      acquirerReferenceNumber: 'string',
      transactionID: 'string',
      authorizationCode: 'string',
      transactionLifecycleId: 'string',
      maskedCardNumber: 'string',
      isSuccess: true,
      cardInformation: {
        cardScheme: 'string',
        issuingCountry: 'string',
        cardUsage: 'string',
        cardCategory: 'string',
        outOfScaScope: false,
      },
      authorizationIdentifier: uuid(),
      responseCode: 'string',
      responseDescription: 'string',
      responseTime: 'string',
      correlationID: uuid(),
    }

    const getPaymentFlowChargeDetailsSpy = jest
      .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
      .mockResolvedValue({
        catalogItems: charges.map((charge) => ({
          ...charge,
          priceAmount: charge.price,
          performingOrgID: 'TODO',
          chargeItemName: 'TODO',
        })),
        totalPrice: 1000,
        firstProductTitle: 'TODO',
      })

    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockImplementation(async (url, init?: RequestInit) => {
        if (typeof url === 'string') {
          if (url === ON_UPDATE_URL) {
            const updateEventType = init?.body
              ? JSON.parse(init.body as string)?.type
              : null

            if (updateEventType === 'success') {
              return {
                json: async () => ({ isSuccess: false }),
                text: async () => 'Error response',
                status: 501,
                ok: false,
              } as Response
            }
            return {
              json: async () => ({ isSuccess: true }),
              text: async () => 'Success response',
              status: 200,
              ok: true,
            } as Response
          } else if (url.includes(cardPaymentUrl)) {
            const operation = init?.body
              ? JSON.parse(init.body as string)?.operation
              : null

            if (operation === 'Refund') {
              return {
                json: async () =>
                  ({
                    acquirerReferenceNumber: 'string',
                    transactionID: 'string',
                    transactionLifecycleId: 'string',
                    maskedCardNumber: 'string',
                    isSuccess: true,
                    cardInformation: {
                      cardScheme: 'string',
                      issuingCountry: 'string',
                      cardUsage: 'string',
                      cardCategory: 'string',
                      outOfScaScope: false,
                    },
                    authorizationIdentifier: uuid(),
                    responseCode: 'string',
                    responseDescription: 'string',
                    responseTime: 'string',
                    correlationID: uuid(),
                  } as RefundResponse),
                text: async () => 'Refund successful',
                status: 200,
                ok: true,
              } as Response
            }

            return {
              json: async () => mockedChargeResponse,
              text: async () => 'Charge successful',
              status: 200,
              ok: true,
            } as Response
          }
        }

        return {
          json: async () => ({ error: 'Missing handler' }),
          status: 500,
          ok: false,
        } as Response
      })

    const cacheSpy = jest
      .spyOn(cacheManager, 'get')
      .mockImplementation((key) => {
        if (key === paymentFlowId) {
          return Promise.resolve(mockedStatus)
        }
        if (key === correlationId) {
          return Promise.resolve(mockedVerificationData)
        }
        return Promise.resolve({})
      })

    const fjsSpy = jest
      .spyOn(ChargeFjsV2ClientService.prototype, 'createCharge')
      .mockReturnValue(
        Promise.resolve<ChargeResponse>({
          user4: 'string',
          receptionID: 'string',
        }),
      )

    const chargeInput: ChargeCardInput = {
      paymentFlowId,
      cardNumber: '4242424242424242',
      expiryMonth: 12,
      expiryYear: new Date().getFullYear() - 2000,
      cvc: '123',
    }

    const response = await server
      .post('/v1/payments/card/charge')
      .send(chargeInput)

    expect(response.status).toBe(400)
    expect(response.body.detail).toBe(
      CardErrorCode.RefundedBecauseOfSystemError,
    )

    getVerificationStatusSpy.mockRestore()
    getPaymentFlowChargeDetailsSpy.mockRestore()
    fetchSpy.mockRestore()
    cacheSpy.mockRestore()
    fjsSpy.mockRestore()
  })

  describe('Apple Pay', () => {
    describe('GET /apple-pay/session', () => {
      it('should successfully get an Apple Pay session', async () => {
        const mockSession = 'eyJlcG9jaFRpbWVzdGFtcCI6MTY3ODg5...' // Mock session token

        const fetchSpy = jest
          .spyOn(global, 'fetch')
          .mockImplementation(async (url) => {
            if (
              typeof url === 'string' &&
              url.includes('/ApplePay/GetSession')
            ) {
              return {
                json: async () => ({
                  isSuccess: true,
                  session: mockSession,
                  responseCode: 'W0',
                  responseDescription: 'Success',
                  responseTime: '00:00:03',
                  correlationID: 'eb5ce211-f834-4a89-bbff-b73ef2879f77',
                }),
                status: 200,
                ok: true,
              } as Response
            }

            return {
              json: async () => ({ error: 'Missing handler' }),
              status: 500,
              ok: false,
            } as Response
          })

        const response = await server.get('/v1/payments/card/apple-pay/session')

        expect(response.status).toBe(200)
        expect(response.body.session).toBe(mockSession)

        fetchSpy.mockRestore()
      })

      it('should throw an error if the gateway returns an error', async () => {
        const fetchSpy = jest
          .spyOn(global, 'fetch')
          .mockImplementation(async (url) => {
            if (
              typeof url === 'string' &&
              url.includes('/ApplePay/GetSession')
            ) {
              return {
                text: async () => 'Gateway error',
                json: async () => ({}),
                status: 500,
                ok: false,
                statusText: 'Internal Server Error',
              } as Response
            }

            return {
              json: async () => ({ error: 'Missing handler' }),
              status: 500,
              ok: false,
            } as Response
          })

        const response = await server.get('/v1/payments/card/apple-pay/session')

        expect(response.status).toBe(400)

        fetchSpy.mockRestore()
      })

      it('should throw an error if isSuccess is false', async () => {
        const fetchSpy = jest
          .spyOn(global, 'fetch')
          .mockImplementation(async (url) => {
            if (
              typeof url === 'string' &&
              url.includes('/ApplePay/GetSession')
            ) {
              return {
                json: async () => ({
                  isSuccess: false,
                  responseCode: 'W2',
                  responseDescription: 'Error getting Apple Pay session',
                  responseTime: '00:00:01',
                  correlationID: 'eb5ce211-f834-4a89-bbff-b73ef2879f77',
                }),
                status: 200,
                ok: true,
              } as Response
            }

            return {
              json: async () => ({ error: 'Missing handler' }),
              status: 500,
              ok: false,
            } as Response
          })

        const response = await server.get('/v1/payments/card/apple-pay/session')

        expect(response.status).toBe(400)
        expect(response.body.detail).toBe('ErrorGettingApplePaySession')

        fetchSpy.mockRestore()
      })
    })

    describe('POST /apple-pay/charge', () => {
      const getApplePayChargeInput = () => ({
        paymentFlowId,
        paymentData: {
          version: 'EC_v1',
          data: 'encrypted-data-string',
          signature: 'signature-string',
          header: {
            ephemeralPublicKey: 'ephemeral-public-key',
            publicKeyHash: 'public-key-hash',
            transactionId: 'transaction-id',
          },
        },
        paymentMethod: {
          displayName: 'Visa 1234',
          network: 'Visa',
        },
        transactionIdentifier: 'transaction-identifier',
      })

      it('should successfully charge with Apple Pay', async () => {
        const mockedChargeResponse: CardPaymentResponse = {
          acquirerReferenceNumber: 'string',
          transactionID: 'string',
          authorizationCode: 'string',
          transactionLifecycleId: 'string',
          maskedCardNumber: 'string',
          isSuccess: true,
          cardInformation: {
            cardScheme: 'Visa',
            issuingCountry: 'IS',
            cardUsage: 'string',
            cardCategory: 'string',
            outOfScaScope: false,
          },
          authorizationIdentifier: uuid(),
          responseCode: '00',
          responseDescription: 'Success',
          responseTime: '12:00:00',
          correlationID: uuid(),
        }

        const fetchSpy = jest
          .spyOn(global, 'fetch')
          .mockImplementation(async (url) => {
            if (typeof url === 'string') {
              if (url.includes(ON_UPDATE_URL)) {
                return {
                  json: async () => ({ isSuccess: true }),
                  status: 200,
                  ok: true,
                } as Response
              } else if (url.includes('/Payment/WalletPayment')) {
                return {
                  json: async () => mockedChargeResponse,
                  status: 200,
                  ok: true,
                } as Response
              }
            }

            return {
              json: async () => ({ error: 'Missing handler' }),
              status: 500,
              ok: false,
            } as Response
          })

        const getPaymentFlowDetailsSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
          .mockResolvedValue({
            id: paymentFlowId,
            organisationId: '5534567890',
            payerNationalId: '1234567890',
            charges: [],
            availablePaymentMethods: [],
            onUpdateUrl: ON_UPDATE_URL,
            created: new Date(),
            modified: new Date(),
          })

        const getPaymentFlowChargeDetailsSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
          .mockResolvedValue({
            catalogItems: charges.map((charge) => ({
              ...charge,
              priceAmount: charge.price,
              performingOrgID: 'TODO',
              chargeItemName: 'TODO',
            })),
            totalPrice: 1000,
            firstProductTitle: 'TODO',
          })

        const getPaymentFlowStatusSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowStatus')
          .mockResolvedValue({
            paymentStatus: PaymentStatus.UNPAID,
            updatedAt: new Date(),
          })

        const fjsSpy = jest
          .spyOn(ChargeFjsV2ClientService.prototype, 'createCharge')
          .mockReturnValue(
            Promise.resolve({
              user4: 'string',
              receptionID: 'string',
            } as ChargeResponse),
          )

        const applePayInput = getApplePayChargeInput()
        const response = await server
          .post('/v1/payments/card/apple-pay/charge')
          .send(applePayInput)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('correlationId')
        expect(response.body.isSuccess).toBe(true)

        getPaymentFlowDetailsSpy.mockRestore()
        getPaymentFlowChargeDetailsSpy.mockRestore()
        getPaymentFlowStatusSpy.mockRestore()
        fjsSpy.mockRestore()
        fetchSpy.mockRestore()
      })

      it('should throw an error if trying to charge an invalid payment flow', async () => {
        const fetchSpy = jest
          .spyOn(global, 'fetch')
          .mockImplementation(async (url) => {
            if (typeof url === 'string' && url.includes(ON_UPDATE_URL)) {
              return {
                json: async () => ({ isSuccess: true }),
                status: 200,
                ok: true,
              } as Response
            }

            return {
              json: async () => ({ error: 'Missing handler' }),
              status: 500,
              ok: false,
            } as Response
          })

        const getPaymentFlowDetailsSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
          .mockRejectedValue(
            new BadRequestException(PaymentServiceCode.PaymentFlowNotFound),
          )

        const applePayInput = getApplePayChargeInput()
        const response = await server
          .post('/v1/payments/card/apple-pay/charge')
          .send(applePayInput)

        expect(response.status).toBe(400)
        expect(response.body.detail).toBe(
          PaymentServiceCode.PaymentFlowNotFound,
        )

        getPaymentFlowDetailsSpy.mockRestore()
        fetchSpy.mockRestore()
      })

      it('should throw an error if trying to charge a payment flow that has already been paid', async () => {
        const fetchSpy = jest
          .spyOn(global, 'fetch')
          .mockImplementation(async (url) => {
            if (typeof url === 'string' && url.includes(ON_UPDATE_URL)) {
              return {
                json: async () => ({ isSuccess: true }),
                status: 200,
                ok: true,
              } as Response
            }

            return {
              json: async () => ({ error: 'Missing handler' }),
              status: 500,
              ok: false,
            } as Response
          })

        const getPaymentFlowDetailsSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
          .mockResolvedValue({
            id: paymentFlowId,
            payerNationalId: '1234567890',
            charges: [],
            availablePaymentMethods: [],
            onUpdateUrl: ON_UPDATE_URL,
            organisationId: '1234567890',
            created: new Date(),
            modified: new Date(),
          })

        const getPaymentFlowChargeDetailsSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
          .mockResolvedValue({
            catalogItems: [],
            totalPrice: 1000,
            firstProductTitle: 'TODO',
          })

        const getPaymentFlowStatusSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowStatus')
          .mockResolvedValue({
            paymentStatus: PaymentStatus.PAID,
            updatedAt: new Date(Date.now() - 30 * 1000),
          })

        const applePayInput = getApplePayChargeInput()
        const response = await server
          .post('/v1/payments/card/apple-pay/charge')
          .send(applePayInput)

        expect(response.status).toBe(400)
        expect(response.body.detail).toBe(
          PaymentServiceCode.PaymentFlowAlreadyPaid,
        )

        getPaymentFlowDetailsSpy.mockRestore()
        getPaymentFlowChargeDetailsSpy.mockRestore()
        getPaymentFlowStatusSpy.mockRestore()
        fetchSpy.mockRestore()
      })

      it('should throw an error if success event to upstream system fails', async () => {
        const mockedChargeResponse: CardPaymentResponse = {
          acquirerReferenceNumber: 'string',
          transactionID: 'string',
          authorizationCode: 'string',
          transactionLifecycleId: 'string',
          maskedCardNumber: 'string',
          isSuccess: true,
          cardInformation: {
            cardScheme: 'Visa',
            issuingCountry: 'IS',
            cardUsage: 'string',
            cardCategory: 'string',
            outOfScaScope: false,
          },
          authorizationIdentifier: uuid(),
          responseCode: '00',
          responseDescription: 'Success',
          responseTime: '12:00:00',
          correlationID: uuid(),
        }

        const fetchSpy = jest
          .spyOn(global, 'fetch')
          .mockImplementation(async (url, init) => {
            if (typeof url === 'string') {
              if (url === ON_UPDATE_URL) {
                const updateEventType = init?.body
                  ? JSON.parse(init.body as string)?.type
                  : null

                if (updateEventType === 'success') {
                  return {
                    json: async () => ({ isSuccess: false }),
                    text: async () => 'Error response',
                    status: 501,
                    ok: false,
                  } as Response
                }
                return {
                  json: async () => ({ isSuccess: true }),
                  text: async () => 'Success response',
                  status: 200,
                  ok: true,
                } as Response
              } else if (url.includes('/Payment/RefundWithCorrelationId')) {
                return {
                  json: async () =>
                    ({
                      acquirerReferenceNumber: 'string',
                      transactionID: 'string',
                      transactionLifecycleId: 'string',
                      maskedCardNumber: 'string',
                      isSuccess: true,
                      cardInformation: {
                        cardScheme: 'Visa',
                        issuingCountry: 'IS',
                        cardUsage: 'string',
                        cardCategory: 'string',
                        outOfScaScope: false,
                      },
                      authorizationIdentifier: uuid(),
                      responseCode: '00',
                      responseDescription: 'Refund successful',
                      responseTime: '12:00:00',
                      correlationID: uuid(),
                    } as RefundResponse),
                  text: async () => 'Refund successful',
                  status: 200,
                  ok: true,
                } as Response
              } else if (url.includes('/Payment/WalletPayment')) {
                return {
                  json: async () => mockedChargeResponse,
                  text: async () => 'Charge successful',
                  status: 200,
                  ok: true,
                } as Response
              }
            }

            return {
              json: async () => ({ error: 'Missing handler' }),
              status: 500,
              ok: false,
            } as Response
          })

        const getPaymentFlowDetailsSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
          .mockResolvedValue({
            id: paymentFlowId,
            organisationId: '5534567890',
            payerNationalId: '1234567890',
            charges: [],
            availablePaymentMethods: [],
            onUpdateUrl: ON_UPDATE_URL,
            created: new Date(),
            modified: new Date(),
          })

        const getPaymentFlowChargeDetailsSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
          .mockResolvedValue({
            catalogItems: charges.map((charge) => ({
              ...charge,
              priceAmount: charge.price,
              performingOrgID: 'TODO',
              chargeItemName: 'TODO',
            })),
            totalPrice: 1000,
            firstProductTitle: 'TODO',
          })

        const getPaymentFlowStatusSpy = jest
          .spyOn(PaymentFlowService.prototype, 'getPaymentFlowStatus')
          .mockResolvedValue({
            paymentStatus: PaymentStatus.UNPAID,
            updatedAt: new Date(),
          })

        const fjsSpy = jest
          .spyOn(ChargeFjsV2ClientService.prototype, 'createCharge')
          .mockReturnValue(
            Promise.resolve({
              user4: 'string',
              receptionID: 'string',
            } as ChargeResponse),
          )

        const applePayInput = getApplePayChargeInput()
        const response = await server
          .post('/v1/payments/card/apple-pay/charge')
          .send(applePayInput)

        expect(response.status).toBe(400)
        expect(response.body.detail).toBe(
          CardErrorCode.RefundedBecauseOfSystemError,
        )

        getPaymentFlowDetailsSpy.mockRestore()
        getPaymentFlowChargeDetailsSpy.mockRestore()
        getPaymentFlowStatusSpy.mockRestore()
        fjsSpy.mockRestore()
        fetchSpy.mockRestore()
      })
    })
  })
})
