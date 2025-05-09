import request from 'supertest'
import { v4 as uuid } from 'uuid'
import { Cache as CacheManager } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { VerifyCardInput } from './dtos/verifyCard.input'
import { FjsErrorCode, PaymentServiceCode } from '@island.is/shared/constants'
import { CreatePaymentFlowInput } from '../paymentFlow/dtos/createPaymentFlow.input'
import { PaymentMethod, PaymentStatus } from '../../types'
import { AppModule } from '../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import {
  ChargeResponse,
  SavedVerificationPendingData,
} from './cardPayment.types'
import { generateMd } from './cardPayment.utils'
import { VerificationCallbackInput } from './dtos/verificationCallback.input'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { ChargeCardInput } from './dtos/chargeCard.input'
import { PaymentFlowEvent } from '../paymentFlow/models/paymentFlowEvent.model'
import { getModelToken } from '@nestjs/sequelize'
import { BadRequestException } from '@nestjs/common'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { CardPaymentService } from './cardPayment.service'

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
  let chargeFjsService: ChargeFjsV2ClientService
  let paymentFlowEventModel: typeof PaymentFlowEvent

  let previousPaymentGatewayApiUrl = ''
  let previousTokenSigningSecret = ''
  let previousTokenSigningAlgorithm = ''

  let paymentFlowId: string

  let logPaymentFlowUpdateSpy: jest.SpyInstance

  beforeAll(async () => {
    previousPaymentGatewayApiUrl = process.env.PAYMENTS_GATEWAY_API_URL!
    previousTokenSigningSecret = process.env.PAYMENTS_TOKEN_SIGNING_SECRET!
    previousTokenSigningAlgorithm =
      process.env.PAYMENTS_TOKEN_SIGNING_ALGORITHM!

    process.env.PAYMENTS_GATEWAY_API_URL = ''
    process.env.PAYMENTS_TOKEN_SIGNING_SECRET = TOKEN_SIGNING_SECRET
    process.env.PAYMENTS_TOKEN_SIGNING_ALGORITHM = TOKEN_SIGNING_ALGORITHM

    app = await testServer({
      appModule: AppModule,
      enableVersioning: true,
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })
    server = request(app.getHttpServer())

    cacheManager = app.get<CacheManager>(CACHE_MANAGER)
    paymentFlowService = app.get<PaymentFlowService>(PaymentFlowService)
    chargeFjsService = app.get(ChargeFjsV2ClientService)
    paymentFlowEventModel = app.get(getModelToken(PaymentFlowEvent))

    jest
      .spyOn(PaymentFlowService.prototype as any, 'getPaymentFlowChargeDetails')
      .mockReturnValue(
        Promise.resolve({
          catalogItems: charges,
          totalPrice: 1000,
          isAlreadyPaid: false,
          paymentStatus: 'unpaid',
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

  beforeEach(() => {
    logPaymentFlowUpdateSpy = jest
      .spyOn(paymentFlowService, 'logPaymentFlowUpdate')
      .mockReturnValue(Promise.resolve())
  })

  afterEach(() => {
    logPaymentFlowUpdateSpy.mockRestore()
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
        amount: 1000,
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
        amount: 1000,
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        paymentFlowId,
      }

      const paymentFlowServiceAlreadyPaidCheckSpy = jest
        .spyOn(PaymentFlowService.prototype, 'isEligibleToBePaid')
        .mockReturnValue(Promise.resolve(false))

      const response = await server
        .post('/v1/payments/card/verify')
        .send(verifyPayload)

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(PaymentServiceCode.PaymentFlowAlreadyPaid)

      paymentFlowServiceAlreadyPaidCheckSpy.mockRestore()
    })

    it('it should generate the correct cache payloads (cache and fetch) when verify is called with a valid card', async () => {
      const verificationUrl = '/CardVerification'

      const cacheSpy = jest.spyOn(cacheManager, 'set')
      const fetchSpy = jest
        .spyOn(global, 'fetch')
        .mockImplementation(async (url, options) => {
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
        amount: 1000,
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        paymentFlowId,
      }

      const expectedCacheValue: SavedVerificationPendingData = {
        paymentFlowId,
      }

      const expectedVerifiedAmount = verifyPayload.amount * 100

      await server.post('/v1/payments/card/verify').send(verifyPayload)

      expect(cacheSpy).toHaveBeenCalled()

      const [correlationId, value] = cacheSpy.mock.calls[0]
      expect(typeof correlationId).toBe('string')
      expect(value).toEqual(expectedCacheValue)

      const [url, options] = fetchSpy.mock.calls[0]

      expect(url).toBe(verificationUrl)
      expect(typeof options).toBe('object')

      const body = JSON.parse(options!.body as string)

      expect(body.cardNumber).toBe(verifyPayload.cardNumber.toString())
      expect(body.expirationMonth).toBe(verifyPayload.expiryMonth)
      expect(body.expirationYear).toBe(verifyPayload.expiryYear + 2000)
      expect(body.amount).toBe(expectedVerifiedAmount)
      expect(body.currency).toBe('ISK')

      const expectedMd = generateMd({
        correlationId,
        paymentFlowId,
        amount: verifyPayload.amount,
        paymentsTokenSigningSecret: TOKEN_SIGNING_SECRET,
        paymentsTokenSigningAlgorithm: TOKEN_SIGNING_ALGORITHM,
      })

      expect(body.MD).toBe(expectedMd)

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
        .mockImplementation(async (url, options) => {
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
    it('should throw an error if trying to charge an invalid payment flow', async () => {
      const chargeInput: ChargeCardInput = {
        paymentFlowId,
        amount: 1000,
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        cvc: '123',
      }

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
    })

    it('should throw an error if trying to charge a payment flow that has already been paid', async () => {
      const chargeInput: ChargeCardInput = {
        paymentFlowId,
        amount: 1000,
        cardNumber: '4242424242424242',
        expiryMonth: 12,
        expiryYear: new Date().getFullYear() - 2000,
        cvc: '123',
      }

      const getPaymentFlowDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
        .mockResolvedValue({} as any)
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
    })
  })

  it('should refund the payment when fjs charge fails on being already paid', async () => {
    const cacheCorrelationId = uuid()

    const fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockImplementation(async (url, options) => {
        if (typeof url === 'string') {
          if (url.includes(ON_UPDATE_URL)) {
            return {
              json: async () => ({ isSuccess: true }),
              status: 200,
              ok: true,
            } as Response
          } else if (url.includes('/Payment/CardPayment')) {
            return {
              json: async () =>
                ({
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
                    outOfScaScope: 'string',
                    cardProductCategory: 'string',
                  },
                  authorizationIdentifier: 'string',
                  responseCode: 'string',
                  responseDescription: 'string',
                  responseTime: 'string',
                  correlationId: 'string',
                } as ChargeResponse),
              status: 200,
              ok: true,
            } as Response
          } else if (url.includes('http://localhost:8081')) {
            return {
              json: async () => ({
                errorCode: 'FjsErrorCode.PaymentAlreadyPaid',
                errorDescription: 'Payment already paid',
              }),
              status: 400,
              ok: false,
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
        if (key === cacheCorrelationId) {
          return Promise.resolve({
            mdStatus: 'mdStatus',
            cavv: 'cavv',
            xid: 'xid',
            dsTransId: 'dsTransId',
          })
        }
        return Promise.resolve({})
      })

    const chargeInput: ChargeCardInput = {
      paymentFlowId,
      amount: 1000,
      cardNumber: '4242424242424242',
      expiryMonth: 12,
      expiryYear: new Date().getFullYear() - 2000,
      cvc: '123',
    }

    const getVerificationStatusSpy = jest
      .spyOn(CardPaymentService.prototype, 'getFullVerificationStatus')
      .mockResolvedValue({
        isVerified: true,
        correlationId: cacheCorrelationId,
      })
    const refundPaymentSpy = jest.spyOn(CardPaymentService.prototype, 'refund')

    const getPaymentFlowDetailsSpy = jest
      .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
      .mockResolvedValue({
        id: 'test',
        chargeSubjectItemId: 'itemid',
      } as any)
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
        updatedAt: new Date(Date.now() - 30 * 1000),
      })
    const createPaymentChargeSpy = jest
      .spyOn(PaymentFlowService.prototype, 'createPaymentCharge')
      .mockRejectedValue({
        message: FjsErrorCode.AlreadyCreatedCharge,
      } as any)

    const response = await server
      .post('/v1/payments/card/charge')
      .send(chargeInput)

    expect(refundPaymentSpy).toHaveBeenCalled()
    expect(response.status).toBe(400)

    const errorCode = response.body.detail
    expect(errorCode).toBe(FjsErrorCode.AlreadyCreatedCharge)

    getVerificationStatusSpy.mockRestore()
    refundPaymentSpy.mockRestore()
    getPaymentFlowDetailsSpy.mockRestore()
    getPaymentFlowChargeDetailsSpy.mockRestore()
    getPaymentFlowStatusSpy.mockRestore()
    createPaymentChargeSpy.mockRestore()
    fetchSpy.mockRestore()
    cacheSpy.mockRestore()
  })
})

// describe('edge cases', () => {
//   it('should handle when payment is successful but .... ')
//   it('should not be possible pay with card if it is not one of available payment methods')
// })
