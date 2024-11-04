import { Test } from '@nestjs/testing'

import { PaymentFlowService } from './app.service'

describe('PaymentFlowService', () => {
  let service: PaymentFlowService

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [PaymentFlowService],
    }).compile()

    service = app.get<PaymentFlowService>(PaymentFlowService)
  })

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' })
    })
  })
})
