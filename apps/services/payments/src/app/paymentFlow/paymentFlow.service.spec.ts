import { PaymentFlowService } from './paymentFlow.service'
import { PaymentInformation, PaymentMethod } from '../../types'

import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'

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
      const paymentInfo: Omit<PaymentInformation, 'id'> = {
        availablePaymentMethods: [PaymentMethod.CARD],
        productId: 'test',
        onSuccessUrl: 'http://localhost:3333/success',
        onUpdateUrl: 'http://localhost:3333/update',
        onErrorUrl: 'http://localhost:3333/error',
        organisationId: 'test',
      }

      const result = await service.createPaymentUrl(paymentInfo)

      expect(result.url).toBeDefined()
    })
  })
})
