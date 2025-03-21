import request from 'supertest'
import { Cache as CacheManager } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { v4 as uuid } from 'uuid'

import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { CreatePaymentFlowInput } from '../paymentFlow/dtos/createPaymentFlow.input'
import { PaymentMethod, PaymentStatus } from '../../types'
import { AppModule } from '../app.module'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentFlowEvent } from '../paymentFlow/models/paymentFlowEvent.model'
import { getConnectionToken, getModelToken } from '@nestjs/sequelize'
import {
  InvoiceErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'
import { Sequelize } from 'sequelize-typescript'
import { Type } from '@nestjs/common'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'

const charges = [
  {
    chargeItemCode: '123',
    chargeType: 'A',
    quantity: 1,
    price: 1000,
  },
]

const getCreatePaymentFlowPayload = (): CreatePaymentFlowInput => ({
  charges,
  payerNationalId: '1234567890',
  availablePaymentMethods: [PaymentMethod.CARD, PaymentMethod.INVOICE],
  onUpdateUrl: '/onUpdate',
  organisationId: '5534567890',
})

describe('InvoicePaymentController', () => {
  let app: TestApp
  let sequelize: Sequelize
  let server: request.SuperTest<request.Test>
  let cacheManager: CacheManager
  let paymentFlowService: PaymentFlowService
  let paymentFlowEventModel: typeof PaymentFlowEvent

  let paymentFlowId: string

  let logPaymentFlowUpdateSpy: jest.SpyInstance

  beforeAll(async () => {
    app = await testServer({
      appModule: AppModule,
      enableVersioning: true,
      hooks: [
        useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
      ],
    })
    sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)
    server = request(app.getHttpServer())

    cacheManager = app.get<CacheManager>(CACHE_MANAGER)
    paymentFlowService = app.get<PaymentFlowService>(PaymentFlowService)
    const chargeFjsService = app.get<ChargeFjsV2ClientService>(
      ChargeFjsV2ClientService,
    )
    paymentFlowEventModel = app.get(getModelToken(PaymentFlowEvent))

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

  beforeEach(async () => {
    const createPayload = getCreatePaymentFlowPayload()
    const response = await server.post('/v1/payments').send(createPayload)

    expect(response.status).toBe(200)
    paymentFlowId = response.body.urls.is.split('/').pop()

    logPaymentFlowUpdateSpy = jest
      .spyOn(paymentFlowService, 'logPaymentFlowUpdate')
      .mockReturnValue(Promise.resolve())
  })

  afterEach(() => {
    logPaymentFlowUpdateSpy.mockRestore()
  })

  afterAll(async () => {
    await app?.cleanUp()
  })

  describe('createInvoice', () => {
    it('should not be possible to create an invoice for an invalid payment flow id', async () => {
      const invalidPaymentFlowId = uuid()

      const response = await server
        .post('/v1/payments/invoice/create')
        .send({ paymentFlowId: invalidPaymentFlowId })

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(PaymentServiceCode.PaymentFlowNotFound)
    })

    it('should not be possible to create an invoice for a payment flow that has already been paid', async () => {
      const paymentFlowServiceAlreadyPaidCheckSpy = jest
        .spyOn(paymentFlowService, 'getPaymentFlowWithPaymentDetails')
        .mockReturnValue(
          Promise.resolve({
            paymentDetails: {} as any,
            paymentFlow: {} as any,
            paymentStatus: PaymentStatus.PAID,
            updatedAt: new Date(),
          }),
        )

      const response = await server
        .post('/v1/payments/invoice/create')
        .send({ paymentFlowId: 'already_paid_id' })

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(PaymentServiceCode.PaymentFlowAlreadyPaid)

      paymentFlowServiceAlreadyPaidCheckSpy.mockRestore()
    })

    it('should not be possible to create an invoice for a payment flow that already has an invoice', async () => {
      const paymentFlowServiceAlreadyPaidCheckSpy = jest
        .spyOn(paymentFlowService, 'getPaymentFlowWithPaymentDetails')
        .mockReturnValue(
          Promise.resolve({
            paymentDetails: {} as any,
            paymentFlow: {} as any,
            paymentStatus: PaymentStatus.INVOICE_PENDING,
            updatedAt: new Date(),
          }),
        )

      const response = await server
        .post('/v1/payments/invoice/create')
        .send({ paymentFlowId: 'already_invoice_id' })

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(InvoiceErrorCode.InvoiceAlreadyExists)

      paymentFlowServiceAlreadyPaidCheckSpy.mockRestore()
    })

    it('should be possible to create an invoice for a payment flow that has not been paid', async () => {
      const getPaymentFlowSpy = jest
        .spyOn(paymentFlowService, 'getPaymentFlowWithPaymentDetails')
        .mockReturnValue(
          Promise.resolve({
            paymentDetails: {
              catalogItems: [
                {
                  chargeType: 'A',
                },
              ],
              totalPrice: 1000,
            } as any,
            paymentFlow: {
              id: paymentFlowId,
            } as any,
            paymentStatus: PaymentStatus.UNPAID,
            updatedAt: new Date(),
          }),
        )

      const createChargeSpy = jest
        .spyOn(paymentFlowService, 'createPaymentCharge')
        .mockImplementation(() => Promise.resolve({} as any))

      const response = await server
        .post('/v1/payments/invoice/create')
        .send({ paymentFlowId })

      expect(response.status).toBe(201)

      expect(createChargeSpy).toHaveBeenCalledTimes(1)

      getPaymentFlowSpy.mockRestore()
      createChargeSpy.mockRestore()
    })

    // TODO
    // it('should not be possible to create an invoice if it is not one of available payment methods')
  })
})
