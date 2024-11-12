import request from 'supertest'

import { PaymentFlowController } from './paymentFlow.controller'

import { PaymentMethod } from '../../types'
import { TestApp } from '@island.is/testing/nest'

import { CreatePaymentFlowDTO } from './dtos/createPaymentFlow.dto'

import { setupTestApp } from '../../../test/setup'

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
      const payload = {
        productId: 'product-id',
        availablePaymentMethods: [PaymentMethod.CARD, PaymentMethod.INVOICE],
        onSuccessUrl: 'https://www.island.is/greida/success',
        onUpdateUrl: 'https://www.island.is/greida/update',
        onErrorUrl: 'https://www.island.is/greida/error',
        organisationId: 'organization-id',
        invoiceId: 'todo',
      }

      // prump

      const response = await server.post('/v1/payments').send(payload)

      expect(response.status).toBe(200)
      expect(response.body.url).toBeDefined()
    })
  })
})
