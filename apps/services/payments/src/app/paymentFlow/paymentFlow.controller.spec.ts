import { Test, TestingModule } from '@nestjs/testing'

import { PaymentFlowController } from './paymentFlow.controller'
import { PaymentFlowService } from './paymentFlow.service'

describe('AppController', () => {
  let app: TestingModule

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PaymentFlowController],
      providers: [PaymentFlowService],
    }).compile()
  })

  describe('createPaymentUrl', () => {
    it('should create a string url with correct initialisation', async () => {
      const appController = app.get<PaymentFlowController>(
        PaymentFlowController,
      )

      const response = await appController.createPaymentUrl({
        productId: 'product-id',
        availablePaymentMethods: ['card', 'invoice'],
        callbacks: {
          onSuccess: 'https://www.island.is/borga/success',
          onError: 'https://www.island.is/borga/error',
        },
        organizationId: 'organization-id',
        invoiceId: 'todo',
      })

      expect(response.url).toBeInstanceOf(String)
    })
  })
})
