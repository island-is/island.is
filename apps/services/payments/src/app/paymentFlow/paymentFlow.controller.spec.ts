import request from 'supertest'

import { PaymentMethod, PaymentStatus } from '../../types'
import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { BankTransferService } from '../bankTransferPayment/bankTransfer.service'
import {
  BankTransferFailureReason,
  BankTransferStatusOverlay,
} from '../bankTransferPayment/bankTransfer.types'
import { PaymentFlowService } from './paymentFlow.service'

// A helper type to satisfy the linter for spying on private methods.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpiedService = any

const charges = [
  {
    chargeItemCode: '123',
    chargeType: 'A',
    quantity: 1,
    price: 1000,
    paymentOptions: ['CARD', 'CLAIM'],
  },
]

describe('PaymentFlowController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    app = await setupTestApp()
    server = request(app.getHttpServer())

    const chargeFjsService = app.get<ChargeFjsV2ClientService>(
      ChargeFjsV2ClientService,
    )

    jest
      .spyOn(
        PaymentFlowService.prototype as SpiedService,
        'getPaymentFlowChargeDetails',
      )
      .mockReturnValue(
        Promise.resolve({
          catalogItems: charges,
          totalPrice: 1000,
          isAlreadyPaid: false,
          hasInvoice: false,
        }),
      )

    jest
      .spyOn(chargeFjsService, 'validateCharge')
      .mockReturnValue(Promise.resolve(true))

    jest
      .spyOn(PaymentFlowService.prototype as SpiedService, 'getPayerName')
      .mockReturnValue(Promise.resolve('Tester Testsson'))
  })

  afterAll(() => {
    app?.cleanUp()

    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('createPaymentUrl', () => {
    it('should create a string url with correct initialisation', async () => {
      const payload: CreatePaymentFlowInput = {
        charges: [
          {
            chargeItemCode: '123',
            chargeType: 'A',
            quantity: 1,
          },
        ],
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD, PaymentMethod.INVOICE],
        onUpdateUrl: 'https://www.island.is/greida/update',
        organisationId: '5534567890',
        // existingInvoiceId: 'todo',
      }

      const response = await server.post('/v1/payments').send(payload)

      expect(response.status).toBe(200)
      expect(response.body.urls).toBeDefined()
    })

    it('should store and retrieve the cancelUrl', async () => {
      const cancelUrl = 'https://some.url/cancel'
      const payload: CreatePaymentFlowInput = {
        charges: [
          {
            chargeItemCode: '456',
            chargeType: 'B',
            quantity: 2,
          },
        ],
        payerNationalId: '0101302129',
        availablePaymentMethods: [PaymentMethod.CARD],
        onUpdateUrl: 'https://www.island.is/greida/update',
        organisationId: '5534567890',
        cancelUrl,
      }

      const createResponse = await server.post('/v1/payments').send(payload)
      expect(createResponse.status).toBe(200)
      expect(createResponse.body.urls.is).toBeDefined()

      const paymentFlowId = new URL(createResponse.body.urls.is).pathname
        .split('/')
        .pop()

      const getResponse = await server.get(`/v1/payments/${paymentFlowId}`)
      expect(getResponse.status).toBe(200)
      expect(getResponse.body.cancelUrl).toBe(cancelUrl)
    })
  })

  describe('getPaymentFlow — bank transfer overlay composition', () => {
    let overlaySpy: jest.SpyInstance

    const createFreshFlow = async () => {
      const payload: CreatePaymentFlowInput = {
        charges: [
          {
            chargeItemCode: '123',
            chargeType: 'A',
            quantity: 1,
          },
        ],
        payerNationalId: '1234567890',
        availablePaymentMethods: [PaymentMethod.CARD],
        onUpdateUrl: 'https://www.island.is/greida/update',
        organisationId: '5534567890',
      }
      const create = await server.post('/v1/payments').send(payload)
      return new URL(create.body.urls.is).pathname.split('/').pop() as string
    }

    afterEach(() => {
      // Restore only this describe's spy — the top-level mocks set in beforeAll must persist for
      // sibling tests.
      overlaySpy?.mockRestore()
    })

    it('returns the bare UNPAID base when no overlay applies', async () => {
      overlaySpy = jest
        .spyOn(
          BankTransferService.prototype as SpiedService,
          'getBankTransferStatus',
        )
        .mockResolvedValue(null)

      const paymentFlowId = await createFreshFlow()
      const response = await server.get(`/v1/payments/${paymentFlowId}`)

      expect(response.status).toBe(200)
      expect(overlaySpy).toHaveBeenCalledWith(paymentFlowId)
      expect(response.body.paymentStatus).toBe(PaymentStatus.UNPAID)
      expect(response.body.lastBankTransferFailure).toBeUndefined()
      expect(response.body.bankTransferScaRedirectUrl).toBeUndefined()
    })

    it('overlays BANK_TRANSFER_PENDING with the SCA URL when getBankTransferStatus returns a pending overlay', async () => {
      const overlay: BankTransferStatusOverlay = {
        paymentStatus: PaymentStatus.BANK_TRANSFER_PENDING,
        updatedAt: new Date(),
        bankTransferScaRedirectUrl: 'https://stage.blikk.tech/sca/abc',
      }
      overlaySpy = jest
        .spyOn(
          BankTransferService.prototype as SpiedService,
          'getBankTransferStatus',
        )
        .mockResolvedValue(overlay)

      const paymentFlowId = await createFreshFlow()
      const response = await server.get(`/v1/payments/${paymentFlowId}`)

      expect(response.status).toBe(200)
      expect(response.body.paymentStatus).toBe(
        PaymentStatus.BANK_TRANSFER_PENDING,
      )
      expect(response.body.bankTransferScaRedirectUrl).toBe(
        'https://stage.blikk.tech/sca/abc',
      )
    })

    it('overlays BANK_TRANSFER_FAILED with the failure reason when getBankTransferStatus returns a failed overlay', async () => {
      const overlay: BankTransferStatusOverlay = {
        paymentStatus: PaymentStatus.BANK_TRANSFER_FAILED,
        updatedAt: new Date(),
        lastBankTransferFailure: BankTransferFailureReason.REJECTED,
      }
      overlaySpy = jest
        .spyOn(
          BankTransferService.prototype as SpiedService,
          'getBankTransferStatus',
        )
        .mockResolvedValue(overlay)

      const paymentFlowId = await createFreshFlow()
      const response = await server.get(`/v1/payments/${paymentFlowId}`)

      expect(response.status).toBe(200)
      expect(response.body.paymentStatus).toBe(
        PaymentStatus.BANK_TRANSFER_FAILED,
      )
      expect(response.body.lastBankTransferFailure).toBe(
        BankTransferFailureReason.REJECTED,
      )
    })
  })
})
