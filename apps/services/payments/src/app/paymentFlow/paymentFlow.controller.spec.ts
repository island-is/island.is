import request from 'supertest'

import { PaymentMethod } from '../../types'
import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import { CreatePaymentFlowInput } from './dtos/createPaymentFlow.input'

describe('PaymentFlowController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>

  beforeAll(async () => {
    app = await setupTestApp()
    server = request(app.getHttpServer())
  })

  afterAll(() => {
    app?.cleanUp()
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
        organisationId: 'organization-id',
        // existingInvoiceId: 'todo',
      }

      const response = await server.post('/v1/payments').send(payload)

      expect(response.status).toBe(200)
      expect(response.body.urls).toBeDefined()
    })
  })
})
