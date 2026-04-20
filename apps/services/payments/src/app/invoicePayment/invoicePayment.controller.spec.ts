import request from 'supertest'
import { v4 as uuid } from 'uuid'

import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'

import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import {
  InvoiceErrorCode,
  PaymentServiceCode,
} from '@island.is/shared/constants'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { PaymentMethod, PaymentStatus } from '../../types'
import { AppModule } from '../app.module'
import { CreatePaymentFlowInput } from '../paymentFlow/dtos/createPaymentFlow.input'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'

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
  let server: request.SuperTest<request.Test>
  let paymentFlowService: PaymentFlowService

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
    server = request(app.getHttpServer())

    paymentFlowService = app.get<PaymentFlowService>(PaymentFlowService)
    const chargeFjsService = app.get<ChargeFjsV2ClientService>(
      ChargeFjsV2ClientService,
    )

    jest
      .spyOn(PaymentFlowService.prototype as any, 'getPaymentFlowChargeDetails')
      .mockReturnValue(
        Promise.resolve({
          catalogItems: charges.map((charge) => ({
            ...charge,
            paymentOptions: ['CARD', 'CLAIM'],
          })),
          totalPrice: 1000,
          isAlreadyPaid: false,
          hasInvoice: false,
        }),
      )

    jest
      .spyOn(chargeFjsService, 'validateCharge')
      .mockReturnValue(Promise.resolve(true))

    jest.spyOn(chargeFjsService, 'getCatalogByPerformingOrg').mockReturnValue(
      Promise.resolve({
        item: charges.map((charge) => ({
          ...charge,
          priceAmount: charge.price,
          performingOrgID: 'TODO',
          chargeItemName: 'TODO',
          paymentOptions: ['CARD', 'CLAIM'],
        })),
      }),
    )
  })

  beforeEach(async () => {
    const createPayload = getCreatePaymentFlowPayload()
    const response = await server.post('/v1/payments').send(createPayload)

    expect(response.status).toBe(200)

    paymentFlowId = response?.body?.urls?.is?.split('/').pop()

    logPaymentFlowUpdateSpy = jest
      .spyOn(paymentFlowService, 'logPaymentFlowUpdate')
      .mockReturnValue(Promise.resolve())
  })

  afterEach(() => {
    logPaymentFlowUpdateSpy?.mockRestore()
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
      const getPaymentFlowDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
        .mockResolvedValue({
          charges,
        } as any)
      const getPaymentFlowChargeDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
        .mockResolvedValue({
          catalogItems: charges.map((charge) => ({
            ...charge,
            priceAmount: charge.price,
            performingOrgID: 'TODO',
            chargeItemName: 'TODO',
            paymentOptions: ['CARD', 'CLAIM'],
          })),
          totalPrice: 1000,
          firstProductTitle: 'TODO',
        })
      const getPaymentFlowStatusSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowStatus')
        .mockResolvedValue({
          paymentStatus: PaymentStatus.PAID,
          updatedAt: new Date(Date.now() - 30 * 1000),
        })

      const response = await server
        .post('/v1/payments/invoice/create')
        .send({ paymentFlowId: 'already_paid_id' })

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(PaymentServiceCode.PaymentFlowAlreadyPaid)

      getPaymentFlowDetailsSpy.mockRestore()
      getPaymentFlowChargeDetailsSpy.mockRestore()
      getPaymentFlowStatusSpy.mockRestore()
    })

    it('should not be possible to create an invoice for a payment flow that already has an invoice', async () => {
      const getPaymentFlowDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
        .mockResolvedValue({
          charges,
        } as any)
      const getPaymentFlowChargeDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
        .mockResolvedValue({
          catalogItems: charges.map((charge) => ({
            ...charge,
            priceAmount: charge.price,
            performingOrgID: 'TODO',
            chargeItemName: 'TODO',
            paymentOptions: ['CARD', 'CLAIM'],
          })),
          totalPrice: 1000,
          firstProductTitle: 'TODO',
        })
      const getPaymentFlowStatusSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowStatus')
        .mockResolvedValue({
          paymentStatus: PaymentStatus.INVOICE_PENDING,
          updatedAt: new Date(Date.now() - 30 * 1000),
        })

      const response = await server
        .post('/v1/payments/invoice/create')
        .send({ paymentFlowId: 'already_invoice_id' })

      expect(response.status).toBe(400)

      const errorCode = response.body.detail
      expect(errorCode).toBe(InvoiceErrorCode.InvoiceAlreadyExists)

      getPaymentFlowDetailsSpy.mockRestore()
      getPaymentFlowChargeDetailsSpy.mockRestore()
      getPaymentFlowStatusSpy.mockRestore()
    })

    it('should be possible to create an invoice for a payment flow that has not been paid', async () => {
      const getPaymentFlowDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowDetails')
        .mockResolvedValue({
          id: paymentFlowId,
          charges,
        } as any)
      const getPaymentFlowChargeDetailsSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowChargeDetails')
        .mockResolvedValue({
          catalogItems: charges.map((charge) => ({
            ...charge,
            priceAmount: charge.price,
            performingOrgID: 'TODO',
            chargeItemName: 'TODO',
            paymentOptions: ['CARD', 'CLAIM'],
          })),
          totalPrice: 1000,
          firstProductTitle: 'TODO',
        })
      const getPaymentFlowStatusSpy = jest
        .spyOn(PaymentFlowService.prototype, 'getPaymentFlowStatus')
        .mockResolvedValue({
          paymentStatus: PaymentStatus.UNPAID,
          updatedAt: new Date(Date.now() - 30 * 1000),
        })

      const createChargeSpy = jest
        .spyOn(paymentFlowService, 'createFjsCharge')
        .mockImplementation(() => Promise.resolve({} as any))

      const response = await server
        .post('/v1/payments/invoice/create')
        .send({ paymentFlowId })

      expect(response.status).toBe(201)

      expect(createChargeSpy).toHaveBeenCalledTimes(1)

      getPaymentFlowDetailsSpy.mockRestore()
      getPaymentFlowChargeDetailsSpy.mockRestore()
      getPaymentFlowStatusSpy.mockRestore()
      createChargeSpy.mockRestore()
    })

    // TODO
    // it('should not be possible to create an invoice if it is not one of available payment methods')
  })
})
