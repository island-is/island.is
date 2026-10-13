import { getModelToken } from '@nestjs/sequelize'

import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import { CardPaymentDetails } from './models/cardPaymentDetails.model'
import { FjsDebtPayment } from './models/fjsDebtPayment.model'
import { PaymentFlow } from './models/paymentFlow.model'
import { PaymentFulfillment } from './models/paymentFulfillment.model'
import { PaymentFlowService } from './paymentFlow.service'

const MINUTE = 60 * 1000

describe('PaymentFlowService — debt flows for the worker', () => {
  let app: TestApp
  let service: PaymentFlowService
  let paymentFlowModel: typeof PaymentFlow
  let paymentFulfillmentModel: typeof PaymentFulfillment
  let fjsDebtPaymentModel: typeof FjsDebtPayment
  let cardPaymentDetailsModel: typeof CardPaymentDetails

  beforeAll(async () => {
    app = await setupTestApp()
    service = app.get(PaymentFlowService)
    paymentFlowModel = app.get(getModelToken(PaymentFlow))
    paymentFulfillmentModel = app.get(getModelToken(PaymentFulfillment))
    fjsDebtPaymentModel = app.get(getModelToken(FjsDebtPayment))
    cardPaymentDetailsModel = app.get(getModelToken(CardPaymentDetails))
  })

  afterAll(() => {
    app?.cleanUp()
  })

  const cutoffTime = () => new Date(Date.now() - MINUTE)

  type Options = {
    type?: 'charge' | 'debt'
    paymentMethod?: 'card' | 'bank_transfer'
    /** Status of the fjs_debt_payment row, no row when left out */
    status?: 'pending' | 'registered' | 'rejected' | 'needs_reconciliation'
    lastAttemptMinutesAgo?: number
    fulfillmentMinutesAgo?: number
    fulfillmentDeleted?: boolean
    withCardDetails?: boolean
  }

  const createFlow = async ({
    type = 'debt',
    paymentMethod = 'card',
    status,
    lastAttemptMinutesAgo,
    fulfillmentMinutesAgo = 10,
    fulfillmentDeleted = false,
    withCardDetails = false,
  }: Options = {}) => {
    const flow = await paymentFlowModel.create({
      payerNationalId: '0101302989',
      availablePaymentMethods: [paymentMethod],
      onUpdateUrl: 'https://www.island.is/greida/update',
      // eslint-disable-next-line local-rules/disallow-kennitalas
      organisationId: '5402697509',
      type,
    } as never)

    const fulfillment = await paymentFulfillmentModel.create({
      paymentFlowId: flow.id,
      paymentMethod,
      confirmationRefId: flow.id,
      isDeleted: fulfillmentDeleted,
    })
    await paymentFulfillmentModel.update(
      {
        created: new Date(Date.now() - fulfillmentMinutesAgo * MINUTE),
      } as never,
      { where: { id: fulfillment.id }, silent: true },
    )

    if (withCardDetails) {
      await cardPaymentDetailsModel.create({
        id: flow.id,
        paymentFlowId: flow.id,
        acquirerReferenceNumber: 'arn',
        authorizationCode: 'auth',
        cardScheme: 'Visa',
        maskedCardNumber: '****1234',
        cardUsage: 'credit',
        totalPrice: 1000,
        merchantReferenceData: 'rrn',
      })
    }

    if (status) {
      await fjsDebtPaymentModel.create({
        paymentFlowId: flow.id,
        payFlowId: flow.id,
        amount: 1000,
        status,
        lastAttemptAt:
          lastAttemptMinutesAgo === undefined
            ? null
            : new Date(Date.now() - lastAttemptMinutesAgo * MINUTE),
      })
    }

    return flow.id
  }

  const findDebtFlowIds = async () =>
    (await service.findDebtFlowsToSettle(cutoffTime())).map(({ id }) => id)

  describe('findDebtFlowsToSettle', () => {
    it('finds a paid debt flow that has not been attempted', async () => {
      const id = await createFlow()

      expect(await findDebtFlowIds()).toContain(id)
    })

    it('finds a pending flow without a recent attempt', async () => {
      const never = await createFlow({ status: 'pending' })
      const old = await createFlow({
        status: 'pending',
        lastAttemptMinutesAgo: 5,
      })

      const ids = await findDebtFlowIds()

      expect(ids).toContain(never)
      expect(ids).toContain(old)
    })

    it('leaves a pending flow with a recent attempt', async () => {
      const id = await createFlow({
        status: 'pending',
        lastAttemptMinutesAgo: 0,
      })

      expect(await findDebtFlowIds()).not.toContain(id)
    })

    it.each(['registered', 'needs_reconciliation'] as const)(
      'leaves a flow that is %s',
      async (status) => {
        const id = await createFlow({ status, lastAttemptMinutesAgo: 5 })

        expect(await findDebtFlowIds()).not.toContain(id)
      },
    )

    it('finds a rejected card payment, its refund may be due', async () => {
      const id = await createFlow({
        status: 'rejected',
        lastAttemptMinutesAgo: 5,
      })

      expect(await findDebtFlowIds()).toContain(id)
    })

    it('leaves a rejected bank transfer, it is refunded by hand', async () => {
      const id = await createFlow({
        status: 'rejected',
        paymentMethod: 'bank_transfer',
        lastAttemptMinutesAgo: 5,
      })

      expect(await findDebtFlowIds()).not.toContain(id)
    })

    it('finds bank transfers that are not settled', async () => {
      const id = await createFlow({ paymentMethod: 'bank_transfer' })

      expect(await findDebtFlowIds()).toContain(id)
    })

    it('leaves flows whose fulfillment is new, the payment flow is still at it', async () => {
      const id = await createFlow({ fulfillmentMinutesAgo: 0 })

      expect(await findDebtFlowIds()).not.toContain(id)
    })

    it('leaves flows without an active fulfillment', async () => {
      const id = await createFlow({ fulfillmentDeleted: true })

      expect(await findDebtFlowIds()).not.toContain(id)
    })

    it('leaves charge flows', async () => {
      const id = await createFlow({ type: 'charge' })

      expect(await findDebtFlowIds()).not.toContain(id)
    })
  })

  describe('findPaidFlowsWithoutFjsCharge', () => {
    it('does not return debt flows, they have no FJS charge to create', async () => {
      const debtFlow = await createFlow({ type: 'debt', withCardDetails: true })
      const chargeFlow = await createFlow({
        type: 'charge',
        withCardDetails: true,
      })

      const ids = (
        await service.findPaidFlowsWithoutFjsCharge(cutoffTime(), 'card')
      ).map(({ id }) => id)

      expect(ids).toContain(chargeFlow)
      expect(ids).not.toContain(debtFlow)
    })
  })
})
