import { PaymentFlowService } from './paymentFlow.service'
import { PaymentMethod } from '../../types'

import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'

describe('PaymentFlowService', () => {
  let app: TestApp
  let service: PaymentFlowService

  beforeAll(async () => {
    app = await setupTestApp()

    service = app.get<PaymentFlowService>(PaymentFlowService)
  })

  afterAll(() => {
    app?.cleanUp()
  })

  describe('createPaymentFlow', () => {
    it('should create flow', async () => {
      const paymentInfo: CreatePaymentFlowInput = {
        availablePaymentMethods: [PaymentMethod.CARD],
        charges: [
          {
            chargeItemCode: '123',
            chargeType: 'A',
            quantity: 1,
          },
        ],
        payerNationalId: '1234567890',
        onUpdateUrl: 'http://localhost:3333/update',
        organisationId: 'test',
      }

      const result = await service.createPaymentUrl(paymentInfo)

      expect(result.urls).toBeDefined()
    })
  })
})
