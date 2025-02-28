import request from 'supertest'

import { PaymentMethod } from '../../types'
import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { PaymentFlowService } from './paymentFlow.service'

const charges = [
  {
    chargeItemCode: '123',
    chargeType: 'A',
    quantity: 1,
    price: 1000,
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
      .spyOn(PaymentFlowService.prototype as any, 'getPaymentFlowChargeDetails')
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
  })
})
