import { PaymentFlowService } from './paymentFlow.service'
import { PaymentMethod } from '../../types'

import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'

describe('PaymentFlowService', () => {
  let app: TestApp
  let service: PaymentFlowService

  beforeAll(async () => {
    app = await setupTestApp()

    service = app.get<PaymentFlowService>(PaymentFlowService)

    const chargeFjsService = app.get<ChargeFjsV2ClientService>(
      ChargeFjsV2ClientService,
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

  describe('createPaymentFlow', () => {
    it('should create flow', async () => {
      const charges = [
        {
          chargeItemCode: '123',
          chargeType: 'A',
          quantity: 1,
          price: 100,
        },
      ]

      jest.spyOn(service as any, 'getPaymentFlowChargeDetails').mockReturnValue(
        Promise.resolve({
          catalogItems: charges,
          totalPrice: 0,
          isAlreadyPaid: false,
          hasInvoice: false,
        }),
      )

      const paymentInfo: CreatePaymentFlowInput = {
        availablePaymentMethods: [PaymentMethod.CARD],
        charges,
        payerNationalId: '1234567890',
        onUpdateUrl: 'http://localhost:3333/update',
        organisationId: '5534567890',
      }

      const result = await service.createPaymentUrl(paymentInfo)

      expect(result.urls).toBeDefined()
    })
  })
})
