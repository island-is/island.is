import { jest } from '@jest/globals'
import { BadRequestException } from '@nestjs/common'

import { DebtPaymentErrorCode } from '@island.is/shared/constants'

import { RefundService } from '../refund/refund.service'
import { CardPaymentController } from './cardPayment.controller'
import {
  createMockCardPaymentService,
  createMockLogger,
  createMockPaymentFlowService,
  getApplePayChargeInput,
  getChargeCardInput,
  getGooglePayChargeInput,
  mockPaymentFlow,
} from './test/sagaTestUtils'

// The saga specs cover the steps, these check what the endpoints answer for a debt payment.
describe('CardPaymentController — debt payments', () => {
  const debtFlow = {
    ...mockPaymentFlow,
    type: 'debt' as const,
    debts: [{ payId: 'pay-1', amount: 1000 }],
  }

  // The flow service of the controller created last
  let paymentFlowService: ReturnType<typeof createMockPaymentFlowService>

  const createController = (
    settleDebt: unknown,
    refundFails = false,
    overrides: Parameters<typeof createMockCardPaymentService>[0] = {},
  ) => {
    const cardPaymentService = createMockCardPaymentService({
      validatePaymentFlow: jest.fn().mockResolvedValue({
        paymentFlow: debtFlow,
        catalogItems: [],
        totalPrice: 1000,
        paymentStatus: 'unpaid',
      } as never),
      settleDebt: jest.fn().mockResolvedValue(settleDebt as never),
      ...(refundFails
        ? {
            refund: jest
              .fn()
              .mockRejectedValue(new Error('gateway down') as never),
          }
        : {}),
      ...overrides,
    })
    const refundService = {
      refundWithCorrelationId: jest
        .fn()
        .mockResolvedValue({ isSuccess: true } as never),
    } as unknown as RefundService
    paymentFlowService = createMockPaymentFlowService()

    return new CardPaymentController(
      cardPaymentService,
      paymentFlowService,
      refundService,
      createMockLogger(),
    )
  }

  const kept = {
    settleDebt: jest.fn().mockRejectedValue(new Error('Step timeout') as never),
    findPossibleDebtRegistration: jest.fn().mockResolvedValue({
      status: 'pending',
      hadAmbiguousAttempt: true,
      isAttemptRunning: true,
    } as never),
  }

  const rejected = { type: 'rejected', alreadySettled: false }

  it('answers DebtPaymentRejected when FJS rejects and the card is refunded', async () => {
    const controller = createController(rejected)

    await expect(controller.charge(getChargeCardInput())).rejects.toEqual(
      new BadRequestException(DebtPaymentErrorCode.DebtPaymentRejected),
    )
  })

  it.each([
    [
      'Apple Pay',
      (c: CardPaymentController) => c.chargeApplePay(getApplePayChargeInput()),
    ],
    [
      'Google Pay',
      (c: CardPaymentController) =>
        c.chargeGooglePayVerified(getGooglePayChargeInput()),
    ],
  ])('answers DebtPaymentRejected for %s too', async (_name, charge) => {
    const controller = createController(rejected)

    await expect(charge(controller)).rejects.toEqual(
      new BadRequestException(DebtPaymentErrorCode.DebtPaymentRejected),
    )
  })

  it('does not claim a refund that failed', async () => {
    const controller = createController(rejected, true)

    await expect(controller.charge(getChargeCardInput())).rejects.toMatchObject(
      { message: expect.not.stringContaining('DebtPaymentRejected') },
    )
  })

  it.each([
    ['card', (c: CardPaymentController) => c.charge(getChargeCardInput())],
    [
      'Apple Pay',
      (c: CardPaymentController) => c.chargeApplePay(getApplePayChargeInput()),
    ],
    [
      'Google Pay',
      (c: CardPaymentController) =>
        c.chargeGooglePayVerified(getGooglePayChargeInput()),
    ],
  ])(
    'answers the %s payment when the saga failed but the payment may be registered, and tells the organisation',
    async (_name, charge) => {
      const controller = createController(undefined, false, kept)

      await expect(charge(controller)).resolves.toMatchObject({
        isSuccess: true,
      })

      expect(paymentFlowService.hasPaymentCompletedEvent).toHaveBeenCalledWith(
        debtFlow.id,
        expect.any(String),
      )
      const reasons = paymentFlowService.logPaymentFlowUpdate.mock.calls
        .map(([update]) => update.reason)
        .filter((reason) => reason !== 'payment_started')
      expect(reasons).toEqual(['payment_completed'])
      expect(paymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          reason: 'payment_completed',
          metadata: { payment: expect.objectContaining({ isSuccess: true }) },
        }),
        expect.objectContaining({ throwOnError: false }),
      )
    },
  )

  it('does not tell the organisation again when the notification step recorded the payment', async () => {
    const controller = createController(undefined, false, kept)
    paymentFlowService.hasPaymentCompletedEvent.mockResolvedValue(true as never)

    await expect(
      controller.charge(getChargeCardInput()),
    ).resolves.toMatchObject({ isSuccess: true })

    const reasons = paymentFlowService.logPaymentFlowUpdate.mock.calls
      .map(([update]) => update.reason)
      .filter((reason) => reason !== 'payment_started')
    expect(reasons).toEqual([])
  })

  it('answers the kept payment even when the organisation can not be told', async () => {
    const controller = createController(undefined, false, kept)
    paymentFlowService.hasPaymentCompletedEvent.mockRejectedValue(
      new Error('Database error') as never,
    )

    await expect(
      controller.charge(getChargeCardInput()),
    ).resolves.toMatchObject({ isSuccess: true })
  })

  it('succeeds when the registration is deferred to the worker', async () => {
    const controller = createController({
      type: 'deferred',
      reason: 'ambiguous',
    })

    await expect(
      controller.charge(getChargeCardInput()),
    ).resolves.toMatchObject({ isSuccess: true })
  })
})
