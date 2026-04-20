import request from 'supertest'

import { PaymentMethod } from '../../types'
import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
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
})
