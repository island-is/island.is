import { getModelToken } from '@nestjs/sequelize'

import { TestApp } from '@island.is/testing/nest'

import { setupTestApp } from '../../../test/setup'
import {
  CardPaymentDetails,
  DebtSettlement,
  PaymentFlow,
  PaymentFlowEvent,
  PaymentFulfillment,
} from './models'
import { PaymentFlowService } from './paymentFlow.service'

const MINUTE = 60 * 1000

describe('PaymentFlowService — debt flows for the worker', () => {
  let app: TestApp
  let service: PaymentFlowService
  let paymentFlowModel: typeof PaymentFlow
  let paymentFulfillmentModel: typeof PaymentFulfillment
  let debtSettlementModel: typeof DebtSettlement
  let cardPaymentDetailsModel: typeof CardPaymentDetails
  let paymentFlowEventModel: typeof PaymentFlowEvent

  beforeAll(async () => {
    app = await setupTestApp()
    service = app.get(PaymentFlowService)
    paymentFlowModel = app.get(getModelToken(PaymentFlow))
    paymentFulfillmentModel = app.get(getModelToken(PaymentFulfillment))
    debtSettlementModel = app.get(getModelToken(DebtSettlement))
    cardPaymentDetailsModel = app.get(getModelToken(CardPaymentDetails))
    paymentFlowEventModel = app.get(getModelToken(PaymentFlowEvent))
  })

  afterAll(() => {
    app?.cleanUp()
  })

  const cutoffTime = () => new Date(Date.now() - MINUTE)

  type Options = {
    type?: 'charge' | 'debt'
    paymentMethod?: 'card' | 'bank_transfer'
    /** Status of the debt_settlement row, no row when left out */
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
      await debtSettlementModel.create({
        paymentFlowId: flow.id,
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

  describe('isCardPaymentRefunded', () => {
    const addEvent = (
      paymentFlowId: string,
      reason: 'payment_failed' | 'refund_completed',
      metadata: object,
    ) =>
      paymentFlowEventModel.create({
        paymentFlowId,
        type: reason === 'refund_completed' ? 'success' : 'error',
        reason,
        paymentMethod: 'card',
        occurredAt: new Date(),
        message: reason,
        metadata,
      })

    const refund = { acquirerReferenceNumber: 'arn' }

    it('is false without a refund', async () => {
      const flowId = await createFlow({ status: 'rejected' })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-1')).toBe(
        false,
      )
    })

    it('is false for the rejection the worker reports before refunding', async () => {
      const flowId = await createFlow({ status: 'rejected' })
      await addEvent(flowId, 'payment_failed', { fjsProblem: { type: '5' } })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-1')).toBe(
        false,
      )
    })

    it('is true when the payment saga refunded the payment while rolling back', async () => {
      const flowId = await createFlow({ status: 'rejected' })
      await addEvent(flowId, 'payment_failed', {
        refund,
        correlationId: 'payment-1',
      })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-1')).toBe(
        true,
      )
    })

    it('matches older rollback events on the correlationID the gateway echoed', async () => {
      const flowId = await createFlow({ status: 'rejected' })
      await addEvent(flowId, 'payment_failed', {
        refund,
        payment: { correlationID: 'payment-1' },
      })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-1')).toBe(
        true,
      )
    })

    it('is false for a refund of an earlier payment on the same flow', async () => {
      // A refunded charge flow can be paid again
      const flowId = await createFlow({ type: 'charge' })
      await addEvent(flowId, 'payment_failed', {
        refund,
        correlationId: 'payment-1',
      })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-2')).toBe(
        false,
      )
    })

    it('is true for a refund saga, whose rollback may have restored the fulfillment', async () => {
      const flowId = await createFlow({ status: 'rejected' })
      await addEvent(flowId, 'refund_completed', {
        action: 'refunded',
        refund,
        correlationId: 'payment-1',
      })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-1')).toBe(
        true,
      )
    })

    it('is true when the refund saga could not log its success and rolled back', async () => {
      const flowId = await createFlow({ status: 'rejected' })
      await addEvent(flowId, 'refund_completed', {
        cleanupFailed: true,
        correlationId: 'payment-1',
      })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-1')).toBe(
        true,
      )
    })

    it('is false for an older refund saga event, without a correlation id', async () => {
      const flowId = await createFlow({ type: 'charge' })
      await addEvent(flowId, 'refund_completed', { action: 'refunded', refund })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-1')).toBe(
        false,
      )
    })

    it('is false for a deleted FJS charge, no card was refunded', async () => {
      const flowId = await createFlow({ type: 'charge' })
      await addEvent(flowId, 'refund_completed', { action: 'deleted_fjs' })

      expect(await service.isCardPaymentRefunded(flowId, 'payment-1')).toBe(
        false,
      )
    })
  })

  describe('hasPaymentCompletedEvent', () => {
    const addCompleted = (paymentFlowId: string, correlationID: string) =>
      paymentFlowEventModel.create({
        paymentFlowId,
        type: 'success',
        reason: 'payment_completed',
        paymentMethod: 'card',
        occurredAt: new Date(),
        message: 'Card payment completed successfully',
        metadata: { payment: { correlationID } },
        deliveredToUpstream: false,
      })

    it('is false before the payment was announced', async () => {
      const flowId = await createFlow()

      expect(await service.hasPaymentCompletedEvent(flowId, 'payment-1')).toBe(
        false,
      )
    })

    it('is true once recorded, whether delivered or not', async () => {
      const flowId = await createFlow()
      await addCompleted(flowId, 'payment-1')

      expect(await service.hasPaymentCompletedEvent(flowId, 'payment-1')).toBe(
        true,
      )
    })

    it('matches a bank transfer by its own correlation id', async () => {
      const flowId = await createFlow()
      await paymentFlowEventModel.create({
        paymentFlowId: flowId,
        type: 'success',
        reason: 'payment_completed',
        paymentMethod: 'bank_transfer',
        occurredAt: new Date(),
        message: 'Bank transfer payment completed',
        metadata: { providerPaymentId: 'prov-1', correlationId: 'btp-1' },
        deliveredToUpstream: false,
      })

      expect(await service.hasPaymentCompletedEvent(flowId, 'btp-1')).toBe(true)
      expect(await service.hasPaymentCompletedEvent(flowId, 'prov-1')).toBe(
        false,
      )
    })

    it('is false for an earlier payment on the same flow', async () => {
      const flowId = await createFlow({ type: 'charge' })
      await addCompleted(flowId, 'payment-1')

      expect(await service.hasPaymentCompletedEvent(flowId, 'payment-2')).toBe(
        false,
      )
    })
  })

  describe('deleteCardPaymentConfirmationAndFulfillment', () => {
    // In createFlow the confirmation id and the fulfillment's confirmationRefId are the flow id
    const isActive = async (flowId: string) => ({
      confirmation: !!(await cardPaymentDetailsModel.count({
        where: { id: flowId, isDeleted: false },
      })),
      fulfillment: !!(await paymentFulfillmentModel.count({
        where: { paymentFlowId: flowId, isDeleted: false },
      })),
    })

    it('deletes both, and the rejected flow is no longer picked up', async () => {
      const flowId = await createFlow({
        status: 'rejected',
        withCardDetails: true,
      })
      expect(await findDebtFlowIds()).toContain(flowId)

      await service.deleteCardPaymentConfirmationAndFulfillment(flowId, flowId)

      expect(await isActive(flowId)).toEqual({
        confirmation: false,
        fulfillment: false,
      })
      expect(await findDebtFlowIds()).not.toContain(flowId)
    })

    it('deletes the fulfillment when the confirmation is deleted already', async () => {
      const flowId = await createFlow({
        status: 'rejected',
        withCardDetails: true,
      })
      await cardPaymentDetailsModel.update(
        { isDeleted: true },
        { where: { id: flowId } },
      )

      await service.deleteCardPaymentConfirmationAndFulfillment(flowId, flowId)

      expect(await isActive(flowId)).toEqual({
        confirmation: false,
        fulfillment: false,
      })
    })

    it('is done when both are deleted already', async () => {
      const flowId = await createFlow({
        status: 'rejected',
        withCardDetails: true,
      })
      await service.deleteCardPaymentConfirmationAndFulfillment(flowId, flowId)

      await expect(
        service.deleteCardPaymentConfirmationAndFulfillment(flowId, flowId),
      ).resolves.toBeUndefined()
    })

    it('still deletes the confirmation, and throws, when the fulfillment stays active', async () => {
      const flowId = await createFlow({
        status: 'rejected',
        withCardDetails: true,
      })
      const deleteFulfillment = jest
        .spyOn(service, 'deletePaymentFulfillment')
        .mockResolvedValue(null)

      await expect(
        service.deleteCardPaymentConfirmationAndFulfillment(flowId, flowId),
      ).rejects.toThrow('Failed to delete payment fulfillment')

      // Retried before giving up
      expect(deleteFulfillment).toHaveBeenCalledTimes(3)
      expect(await isActive(flowId)).toEqual({
        confirmation: false,
        fulfillment: true,
      })
      deleteFulfillment.mockRestore()
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
