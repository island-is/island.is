import request from 'supertest'
import { getModelToken } from '@nestjs/sequelize'

import { FinanceClientV3Service } from '@island.is/clients/finance-v3'
import { FetchError } from '@island.is/clients/middlewares'
import { ChargeFjsV2ClientService } from '@island.is/clients/charge-fjs-v2'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import { PaymentMethod, PaymentStatus } from '../../types'
import {
  DEBT_PAYMENT_PRODUCT_TITLE,
  FJS_DEBT_ORGANISATION_ID,
} from '../../utils/fjsDebtPayment'
import { CreateDebtPaymentFlowInput } from './dtos/createDebtPaymentFlow.input'
import { PaymentFlow } from './models/paymentFlow.model'
import { FjsDebtPayment } from './models/fjsDebtPayment.model'
import { PaymentFlowDebt } from './models/paymentFlowDebt.model'
import { PaymentFlowService } from './paymentFlow.service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpiedService = any

// Builds the error the FJS client throws for a non-2xx response
const fjsFetchError = (status: number, body: object) =>
  FetchError.build(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    }) as never,
    true,
  )

const payload: CreateDebtPaymentFlowInput = {
  payerNationalId: '0101302989',
  onUpdateUrl: 'https://www.island.is/greida/update',
  metadata: { applicationId: 'abc123' },
  debts: [
    { payId: 'pay-1', amount: 10000, label: 'Skattur' },
    { payId: 'pay-2', amount: 2500 },
  ],
}

describe('DebtPaymentFlowController', () => {
  let app: TestApp
  let server: request.SuperTest<request.Test>
  let validatePayment: jest.SpyInstance
  let featureFlagService: FeatureFlagService

  beforeAll(async () => {
    app = await setupTestApp()
    server = request(app.getHttpServer())

    featureFlagService = app.get(FeatureFlagService)

    jest
      .spyOn(PaymentFlowService.prototype as SpiedService, 'getPayerName')
      .mockResolvedValue('Tester Testsson')

    validatePayment = jest.spyOn(
      app.get(FinanceClientV3Service),
      'validatePayment',
    )
  })

  beforeEach(() => {
    // Every flag on, tests turn single flags off
    jest.spyOn(featureFlagService, 'getValue').mockResolvedValue(true as never)
    validatePayment.mockReset()
    validatePayment.mockResolvedValue({ paymentOptions: 'CARD;TRANSFER' })
  })

  afterAll(() => {
    app?.cleanUp()

    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  const getFlowId = (urls: { is: string }) =>
    new URL(urls.is).pathname.split('/').pop() as string

  describe('POST /v1/payments/debts', () => {
    it('creates a debt flow with its debts and returns the urls', async () => {
      const response = await server.post('/v1/payments/debts').send(payload)

      expect(response.status).toBe(200)
      expect(response.body.urls.is).toBeDefined()
      expect(response.body.urls.en).toBeDefined()

      const flowId = getFlowId(response.body.urls)
      expect(response.body.id).toBe(flowId)

      // The flow id doubles as FJS's payFlowId
      expect(validatePayment).toHaveBeenCalledWith(
        expect.objectContaining({
          payFlowId: flowId,
          nationalId: payload.payerNationalId,
          totalAmount: 12500,
          payDebts: [
            { payid: 'pay-1', payAmount: 10000 },
            { payid: 'pay-2', payAmount: 2500 },
          ],
        }),
      )

      const flow = await app.get(getModelToken(PaymentFlow)).findByPk(flowId)
      expect(flow).toMatchObject({
        type: 'debt',
        organisationId: FJS_DEBT_ORGANISATION_ID,
        productTitle: DEBT_PAYMENT_PRODUCT_TITLE,
        payerNationalId: payload.payerNationalId,
        availablePaymentMethods: [
          PaymentMethod.CARD,
          PaymentMethod.BANK_TRANSFER,
        ],
      })

      const debts = await app.get(getModelToken(PaymentFlowDebt)).findAll({
        where: { paymentFlowId: flowId },
        order: [['payId', 'ASC']],
      })
      expect(debts.map((d: PaymentFlowDebt) => d.toJSON())).toMatchObject([
        { payId: 'pay-1', amount: 10000, label: 'Skattur' },
        { payId: 'pay-2', amount: 2500 },
      ])
      expect(typeof debts[0].amount).toBe('number')
    })

    it('only offers card when FJS only lists CARD', async () => {
      validatePayment.mockResolvedValue({ paymentOptions: 'CARD' })

      const response = await server.post('/v1/payments/debts').send(payload)

      expect(response.status).toBe(200)
      const flow = await app
        .get(getModelToken(PaymentFlow))
        .findByPk(getFlowId(response.body.urls))
      expect(flow.availablePaymentMethods).toEqual([PaymentMethod.CARD])
    })

    it('does not offer bank transfer when the bank transfer flag is off', async () => {
      jest
        .spyOn(featureFlagService, 'getValue')
        .mockImplementation(
          (feature: Features) =>
            Promise.resolve(
              feature !== Features.isIslandisBankTransferPaymentEnabled,
            ) as never,
        )

      const response = await server.post('/v1/payments/debts').send(payload)

      expect(response.status).toBe(200)
      const flow = await app
        .get(getModelToken(PaymentFlow))
        .findByPk(getFlowId(response.body.urls))
      expect(flow.availablePaymentMethods).toEqual([PaymentMethod.CARD])
    })

    it('rejects when FJS offers no usable payment method', async () => {
      validatePayment.mockResolvedValue({ paymentOptions: '' })

      const response = await server.post('/v1/payments/debts').send(payload)

      expect(response.status).toBe(400)
      expect(response.body.detail).toBe(
        PaymentServiceCode.DebtPaymentMethodNotAllowed,
      )
    })

    it('rejects when only bank transfer is offered but it is not allowed for the payer', async () => {
      validatePayment.mockResolvedValue({ paymentOptions: 'TRANSFER' })

      jest
        .spyOn(featureFlagService, 'getValue')
        .mockImplementation(
          (feature: Features) =>
            Promise.resolve(
              feature !== Features.isIslandisBankTransferPaymentEnabled,
            ) as never,
        )

      const response = await server.post('/v1/payments/debts').send(payload)

      expect(response.status).toBe(400)
      expect(response.body.detail).toBe(
        PaymentServiceCode.DebtPaymentMethodNotAllowed,
      )
    })

    it('maps an FJS 400 to DebtPaymentInvalid', async () => {
      validatePayment.mockRejectedValue(
        await fjsFetchError(400, {
          error: { title: 'Bad request', status: '400', detail: 'Invalid' },
        }),
      )

      const response = await server.post('/v1/payments/debts').send(payload)

      expect(response.status).toBe(400)
      expect(response.body.detail).toBe(PaymentServiceCode.DebtPaymentInvalid)
    })

    it('answers 503 when FJS cannot be reached, and creates nothing', async () => {
      validatePayment.mockRejectedValue(
        new Error('Timeout of 20000ms exceeded'),
      )
      const model = app.get(getModelToken(PaymentFlow))
      const countBefore = await model.count({ where: { type: 'debt' } })

      const response = await server.post('/v1/payments/debts').send(payload)

      expect(response.status).toBe(503)
      expect(await model.count({ where: { type: 'debt' } })).toBe(countBefore)
    })

    it('answers 403 when the debt feature flag is off', async () => {
      jest
        .spyOn(featureFlagService, 'getValue')
        .mockResolvedValue(false as never)

      const response = await server.post('/v1/payments/debts').send(payload)

      expect(response.status).toBe(403)
      expect(validatePayment).not.toHaveBeenCalled()
    })

    describe('validation', () => {
      const expectBadRequest = async (body: object) => {
        const response = await server.post('/v1/payments/debts').send(body)

        expect(response.status).toBe(400)
        expect(validatePayment).not.toHaveBeenCalled()
        return response
      }

      it('rejects empty debts', async () => {
        await expectBadRequest({ ...payload, debts: [] })
      })

      it('rejects missing debts', async () => {
        const { debts, ...withoutDebts } = payload
        await expectBadRequest(withoutDebts)
      })

      it('rejects more than 50 debts', async () => {
        await expectBadRequest({
          ...payload,
          debts: Array.from({ length: 51 }, (_, i) => ({
            payId: `pay-${i}`,
            amount: 100,
          })),
        })
      })

      it('rejects duplicate payIds', async () => {
        await expectBadRequest({
          ...payload,
          debts: [
            { payId: 'pay-1', amount: 100 },
            { payId: 'pay-1', amount: 200 },
          ],
        })
      })

      it('rejects a non-integer amount', async () => {
        await expectBadRequest({
          ...payload,
          debts: [{ payId: 'pay-1', amount: 100.5 }],
        })
      })

      it.each([0, -100])('rejects an amount of %s', async (amount) => {
        await expectBadRequest({
          ...payload,
          debts: [{ payId: 'pay-1', amount }],
        })
      })

      it('rejects an empty payId', async () => {
        await expectBadRequest({
          ...payload,
          debts: [{ payId: '', amount: 100 }],
        })
      })

      it('rejects a label longer than 255 characters', async () => {
        await expectBadRequest({
          ...payload,
          debts: [{ payId: 'pay-1', amount: 100, label: 'a'.repeat(256) }],
        })
      })

      it('rejects an invalid payer national id', async () => {
        await expectBadRequest({ ...payload, payerNationalId: '123' })
      })

      it('rejects redirectToReturnUrlOnSuccess without a returnUrl', async () => {
        await expectBadRequest({
          ...payload,
          redirectToReturnUrlOnSuccess: true,
        })
      })
    })
  })

  describe('GET /v1/payments/:id', () => {
    it('returns the product title and the sum of the debts', async () => {
      const create = await server.post('/v1/payments/debts').send(payload)
      const flowId = getFlowId(create.body.urls)

      const response = await server.get(`/v1/payments/${flowId}`)

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject({
        id: flowId,
        productTitle: DEBT_PAYMENT_PRODUCT_TITLE,
        productPrice: 12500,
        paymentStatus: PaymentStatus.UNPAID,
        availablePaymentMethods: [
          PaymentMethod.CARD,
          PaymentMethod.BANK_TRANSFER,
        ],
      })
    })

    it('does not call the charge catalog for debt flows', async () => {
      const catalogSpy = jest.spyOn(
        app.get(ChargeFjsV2ClientService),
        'getCatalogByPerformingOrg',
      )
      const create = await server.post('/v1/payments/debts').send(payload)

      await server.get(`/v1/payments/${getFlowId(create.body.urls)}`)

      expect(catalogSpy).not.toHaveBeenCalled()
    })
  })

  describe('payment method restrictions on debt flows', () => {
    const createFlow = async () => {
      const create = await server.post('/v1/payments/debts').send(payload)
      return getFlowId(create.body.urls)
    }

    it('rejects paying by invoice', async () => {
      const flowId = await createFlow()

      const response = await server
        .post('/v1/payments/invoice/create')
        .send({ paymentFlowId: flowId })

      expect(response.status).toBe(400)
      expect(response.body.detail).toBe(
        PaymentServiceCode.InvalidPaymentMethods,
      )
    })

    describe('validateDebtPaymentFlow', () => {
      let service: PaymentFlowService

      beforeAll(() => {
        service = app.get(PaymentFlowService)
      })

      const getFlow = async (flowId: string) =>
        service.getPaymentFlowDetails(flowId)

      it('passes when FJS allows the method', async () => {
        const flow = await getFlow(await createFlow())

        await expect(
          service.validateDebtPaymentFlow(flow, PaymentMethod.CARD),
        ).resolves.toBeUndefined()
        await expect(
          service.validateDebtPaymentFlow(flow, PaymentMethod.BANK_TRANSFER),
        ).resolves.toBeUndefined()
      })

      it('revalidates the debts with FJS every time', async () => {
        const flow = await getFlow(await createFlow())
        validatePayment.mockClear()

        await service.validateDebtPaymentFlow(flow, PaymentMethod.CARD)

        expect(validatePayment).toHaveBeenCalledTimes(1)
        expect(validatePayment).toHaveBeenCalledWith(
          expect.objectContaining({
            payFlowId: flow.id,
            totalAmount: 12500,
          }),
        )
      })

      it('requires the method to be in the FJS payment options', async () => {
        const flow = await getFlow(await createFlow())
        validatePayment.mockResolvedValue({ paymentOptions: 'TRANSFER' })

        await expect(
          service.validateDebtPaymentFlow(flow, PaymentMethod.CARD),
        ).rejects.toMatchObject({
          message: PaymentServiceCode.DebtPaymentMethodNotAllowed,
        })
      })

      it('rejects when the debts have changed', async () => {
        const flow = await getFlow(await createFlow())
        validatePayment.mockRejectedValue(
          await fjsFetchError(400, { error: { title: 'x' } }),
        )

        await expect(
          service.validateDebtPaymentFlow(flow, PaymentMethod.CARD),
        ).rejects.toMatchObject({
          message: PaymentServiceCode.DebtPaymentInvalid,
        })
      })

      it('rejects a flow whose settlement was rejected as closed, without asking FJS', async () => {
        const flow = await getFlow(await createFlow())
        validatePayment.mockClear()

        await expect(
          service.validateDebtPaymentFlow(
            {
              ...flow,
              fjsDebtPayment: { status: 'rejected' } as never,
            },
            PaymentMethod.CARD,
          ),
        ).rejects.toMatchObject({
          message: PaymentServiceCode.DebtPaymentFlowClosed,
        })
        expect(validatePayment).not.toHaveBeenCalled()
      })
    })
  })
})
