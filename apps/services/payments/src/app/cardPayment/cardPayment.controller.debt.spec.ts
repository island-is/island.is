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
  mockPaymentFlow,
} from './test/sagaTestUtils'

// The saga specs cover the steps, these check what the endpoints answer for a debt payment.
describe('CardPaymentController — debt payments', () => {
  const debtFlow = {
    ...mockPaymentFlow,
    type: 'debt' as const,
    debts: [{ payId: 'pay-1', amount: 1000 }],
  }

  const createController = (settleDebt: unknown, refundFails = false) => {
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
    })
    const refundService = {
      refundWithCorrelationId: jest
        .fn()
        .mockResolvedValue({ isSuccess: true } as never),
    } as unknown as RefundService

    return new CardPaymentController(
      cardPaymentService,
      createMockPaymentFlowService(),
      refundService,
      createMockLogger(),
    )
  }

  const rejected = { type: 'rejected', alreadySettled: false }

  it('answers DebtPaymentRejected when FJS rejects and the card is refunded', async () => {
    const controller = createController(rejected)

    await expect(controller.charge(getChargeCardInput())).rejects.toEqual(
      new BadRequestException(DebtPaymentErrorCode.DebtPaymentRejected),
    )
  })

  it('answers DebtPaymentRejected for Apple Pay too', async () => {
    const controller = createController(rejected)

    await expect(
      controller.chargeApplePay(getApplePayChargeInput()),
    ).rejects.toEqual(
      new BadRequestException(DebtPaymentErrorCode.DebtPaymentRejected),
    )
  })

  it('does not claim a refund that failed', async () => {
    const controller = createController(rejected, true)

    await expect(controller.charge(getChargeCardInput())).rejects.toMatchObject(
      { message: expect.not.stringContaining('DebtPaymentRejected') },
    )
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
