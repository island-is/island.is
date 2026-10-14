import type { Logger } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'

import {
  ApplePayPaymentContext,
  ApplePayPaymentStepResults,
  CardPaymentContext,
  CardPaymentStepResults,
  PaymentOrchestrator,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { RefundService } from '../../refund/refund.service'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import {
  createApplePayPaymentContext,
  createApplePayPaymentSaga,
} from '../applePayPayment.saga'
import {
  createCardPaymentContext,
  createCardPaymentSaga,
} from '../cardPayment.saga'
import type { ApplePayChargeInput, ChargeCardInput } from '../dtos'
import {
  createMockCardPaymentService,
  createMockLogger,
  createMockPaymentFlowService,
  getApplePayChargeInput,
  getChargeCardInput,
  mockPaymentFlow,
  mockPaymentResult,
} from './sagaTestUtils'

type SagaConfig =
  | {
      name: 'CardPayment'
      createContext: (
        paymentFlowId: string,
        input: ChargeCardInput,
      ) => CardPaymentContext
      createSaga: (
        cardService: CardPaymentService,
        refundService: RefundService,
        flowService: PaymentFlowService,
        logger: Logger,
      ) => ReturnType<typeof createCardPaymentSaga>
      chargeStepName: 'CHARGE_CARD'
      getInput: () => ChargeCardInput
      expectedNotifyMessage: string
      chargeMock: keyof CardPaymentService
    }
  | {
      name: 'ApplePay'
      createContext: (
        paymentFlowId: string,
        input: ApplePayChargeInput,
      ) => ApplePayPaymentContext
      createSaga: (
        cardService: CardPaymentService,
        refundService: RefundService,
        flowService: PaymentFlowService,
        logger: Logger,
      ) => ReturnType<typeof createApplePayPaymentSaga>
      chargeStepName: 'CHARGE_APPLE_PAY'
      getInput: () => ApplePayChargeInput
      expectedNotifyMessage: string
      chargeMock: keyof CardPaymentService
    }

const sagaConfigs: SagaConfig[] = [
  {
    name: 'CardPayment',
    createContext: createCardPaymentContext,
    createSaga: (cardService, _refundService, flowService, logger) =>
      createCardPaymentSaga(cardService, flowService, logger),
    chargeStepName: 'CHARGE_CARD',
    getInput: getChargeCardInput,
    expectedNotifyMessage: 'Card payment completed successfully',
    chargeMock: 'charge',
  },
  {
    name: 'ApplePay',
    createContext: createApplePayPaymentContext,
    createSaga: createApplePayPaymentSaga,
    chargeStepName: 'CHARGE_APPLE_PAY',
    getInput: getApplePayChargeInput,
    expectedNotifyMessage: 'Apple Pay payment completed successfully',
    chargeMock: 'chargeApplePay',
  },
]

const getSagaSteps = (
  saga: { name: string }[] | Record<string, { name: string }>,
): { name: string }[] => (Array.isArray(saga) ? saga : Object.values(saga))

/**
 * CardPayment Saga and ApplePay Saga share the same steps except for the charge step.
 * These tests verify that the steps are the same in both sagas and should ensure that changes made to the steps are reflected in both sagas.
 */
describe('Card Payment Saga - Shared Steps', () => {
  describe('structural parity', () => {
    it('both sagas have same step structure (VALIDATE, charge, PERSIST, SETTLE_DEBT, NOTIFY)', () => {
      const mockLogger = createMockLogger()
      const mockCard = {} as CardPaymentService
      const mockRefund = {} as RefundService
      const mockFlow = {} as PaymentFlowService

      const cardSaga = createCardPaymentSaga(mockCard, mockFlow, mockLogger)
      const appleSaga = createApplePayPaymentSaga(
        mockCard,
        mockRefund,
        mockFlow,
        mockLogger,
      )

      const cardSteps = getSagaSteps(cardSaga)
      const appleSteps = getSagaSteps(appleSaga)

      expect(cardSteps.map((s) => s.name)).toEqual([
        'VALIDATE',
        'CHARGE_CARD',
        'PERSIST_PAYMENT_CONFIRMATION',
        'SETTLE_DEBT',
        'NOTIFY_SUCCESSFUL_PAYMENT',
      ])
      expect(appleSteps.map((s) => s.name)).toEqual([
        'VALIDATE',
        'CHARGE_APPLE_PAY',
        'PERSIST_PAYMENT_CONFIRMATION',
        'SETTLE_DEBT',
        'NOTIFY_SUCCESSFUL_PAYMENT',
      ])

      expect(cardSteps[0].name).toBe(appleSteps[0].name)
      expect(cardSteps[2].name).toBe(appleSteps[2].name)
      expect(cardSteps[3].name).toBe(appleSteps[3].name)
      expect(cardSteps[4].name).toBe(appleSteps[4].name)
    })
  })

  describe.each(sagaConfigs)('$name - shared step behavior', (config) => {
    let mockLogger: Logger
    let mockCardPaymentService: jest.Mocked<CardPaymentService>
    let mockRefundService: jest.Mocked<RefundService>
    let mockPaymentFlowService: jest.Mocked<PaymentFlowService>

    beforeEach(() => {
      mockLogger = createMockLogger()
      mockCardPaymentService = createMockCardPaymentService()
      mockRefundService = {
        refundWithCorrelationId: jest.fn().mockResolvedValue({
          isSuccess: true,
          acquirerReferenceNumber: 'refund-arn',
        }),
      } as unknown as jest.Mocked<RefundService>
      mockPaymentFlowService = createMockPaymentFlowService()
    })

    const setupSaga = () => {
      const input = config.getInput()
      const context = config.createContext(input.paymentFlowId, input as never)
      const saga = config.createSaga(
        mockCardPaymentService,
        mockRefundService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator =
        config.name === 'CardPayment'
          ? new PaymentOrchestrator<CardPaymentContext, CardPaymentStepResults>(
              mockLogger,
              mockPaymentFlowService,
            )
          : new PaymentOrchestrator<
              ApplePayPaymentContext,
              ApplePayPaymentStepResults
            >(mockLogger, mockPaymentFlowService)

      return { input, context, saga, orchestrator }
    }

    it('VALIDATE calls validatePaymentFlow with paymentFlowId', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga as never, context as never)

      expect(mockCardPaymentService.validatePaymentFlow).toHaveBeenCalledWith(
        input.paymentFlowId,
      )
    })

    it('PERSIST_PAYMENT_CONFIRMATION execute calls persistPaymentConfirmation with correct params', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga as never, context as never)

      expect(
        mockCardPaymentService.persistPaymentConfirmation,
      ).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        paymentResult: mockPaymentResult,
        paymentTrackingData: context.trackingData,
        totalPrice: 1000,
      })
    })

    it('NOTIFY_SUCCESSFUL_PAYMENT calls logPaymentFlowUpdate with success', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga as never, context as never)

      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: input.paymentFlowId,
          type: 'success',
          reason: 'payment_completed',
          message: config.expectedNotifyMessage,
          metadata: { payment: mockPaymentResult },
        }),
        expect.objectContaining({ useRetry: true, throwOnError: true }),
      )
    })

    it('executes all steps in sequence', async () => {
      const { context, saga, orchestrator } = setupSaga()
      const result = await orchestrator.execute(saga as never, context as never)

      expect(result.success).toBe(true)
      expect(context.completedSteps).toContain('VALIDATE')
      expect(context.completedSteps).toContain(config.chargeStepName)
      expect(context.completedSteps).toContain('PERSIST_PAYMENT_CONFIRMATION')
      expect(context.completedSteps).toContain('SETTLE_DEBT')
      expect(context.completedSteps).toContain('NOTIFY_SUCCESSFUL_PAYMENT')
    })

    it('SETTLE_DEBT does nothing for charge flows', async () => {
      const { context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga as never, context as never)

      expect(mockCardPaymentService.settleDebt).not.toHaveBeenCalled()
      expect(context.stepResults.SETTLE_DEBT).toEqual({ type: 'skipped' })
      expect(
        mockPaymentFlowService.logPaymentFlowUpdate.mock.calls.filter(
          ([update]) => update.reason === 'payment_finalized',
        ),
      ).toHaveLength(0)
    })

    it('VALIDATE failure stops saga execution', async () => {
      mockCardPaymentService.validatePaymentFlow.mockRejectedValue(
        new Error('Payment flow not found'),
      )

      const { saga, orchestrator, context } = setupSaga()

      await expect(
        orchestrator.execute(saga as never, context as never),
      ).rejects.toThrow('Payment flow not found')

      expect(mockCardPaymentService[config.chargeMock]).not.toHaveBeenCalled()
    })

    describe('debt flows', () => {
      const debtFlow = {
        ...mockPaymentFlow,
        type: 'debt' as const,
        debts: [{ payId: 'pay-1', amount: 1000 }],
      }
      const problem = { title: 'Bad request', detail: 'Amount exceeds debt' }

      const refundMock = () =>
        config.name === 'CardPayment'
          ? mockCardPaymentService.refund
          : mockRefundService.refundWithCorrelationId

      const loggedReasons = () =>
        mockPaymentFlowService.logPaymentFlowUpdate.mock.calls
          .map(([update]) => update.reason)
          // Apple Pay also announces that the payment started
          .filter((reason) => reason !== 'payment_started')

      const callFor = (reason: string) =>
        mockPaymentFlowService.logPaymentFlowUpdate.mock.calls.find(
          ([update]) => update.reason === reason,
        ) as never as unknown[]

      beforeEach(() => {
        mockCardPaymentService.validatePaymentFlow.mockResolvedValue({
          paymentFlow: debtFlow,
          catalogItems: [],
          totalPrice: 1000,
          paymentStatus: 'unpaid',
        } as never)
      })

      it('registers the payment with the card details and the flow', async () => {
        const { context, saga, orchestrator } = setupSaga()
        await orchestrator.execute(saga as never, context as never)

        expect(mockCardPaymentService.settleDebt).toHaveBeenCalledWith({
          paymentFlow: debtFlow,
          paymentResult: mockPaymentResult,
          trackingData: context.trackingData,
          totalPrice: 1000,
        })
      })

      it('sends payment_completed, then payment_finalized with the FJS registration', async () => {
        const { context, saga, orchestrator } = setupSaga()
        await orchestrator.execute(saga as never, context as never)

        expect(loggedReasons()).toEqual([
          'payment_completed',
          'payment_finalized',
        ])
        expect(callFor('payment_finalized')).toEqual([
          expect.objectContaining({
            type: 'update',
            metadata: {
              dateCreated: '2026-10-12T10:00:00',
            },
          }),
          expect.objectContaining({ throwOnError: false }),
        ])
      })

      it('refunds the card, closes the flow and reports a rejection', async () => {
        mockCardPaymentService.settleDebt.mockResolvedValue({
          type: 'rejected',
          problem,
          alreadySettled: false,
        } as never)

        const { context, saga, orchestrator } = setupSaga()

        await expect(
          orchestrator.execute(saga as never, context as never),
        ).rejects.toThrow(PaymentServiceCode.DebtPaymentRejected)

        expect(refundMock()).toHaveBeenCalledTimes(1)
        expect(context.metadata?.refundSucceeded).toBe(true)
        expect(
          mockPaymentFlowService.deleteCardPaymentConfirmationAndFulfillment,
        ).toHaveBeenCalled()
        // No payment_completed, and the refund event tells the organisation it failed
        expect(loggedReasons()).toEqual(['payment_failed'])
        expect(
          mockPaymentFlowService.logPaymentFlowUpdate,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'error',
            reason: 'payment_failed',
            metadata: expect.objectContaining({
              originalError: PaymentServiceCode.DebtPaymentRejected,
              fjsProblem: problem,
            }),
          }),
        )
      })

      it.each([
        ['deferred', { type: 'deferred', reason: 'ambiguous' }],
        ['reconcile', { type: 'reconcile', alreadySettled: false }],
      ])(
        'completes the payment without finalizing it when %s',
        async (_name, outcome) => {
          mockCardPaymentService.settleDebt.mockResolvedValue(outcome as never)

          const { context, saga, orchestrator } = setupSaga()
          const result = await orchestrator.execute(
            saga as never,
            context as never,
          )

          expect(result.success).toBe(true)
          expect(refundMock()).not.toHaveBeenCalled()
          expect(loggedReasons()).toEqual(['payment_completed'])
        },
      )

      it('does not finalize again when the registration was made earlier', async () => {
        mockCardPaymentService.settleDebt.mockResolvedValue({
          type: 'registered',
          dateCreated: '2026-10-12T10:00:00',
          alreadySettled: true,
        } as never)

        const { context, saga, orchestrator } = setupSaga()
        await orchestrator.execute(saga as never, context as never)

        expect(loggedReasons()).toEqual(['payment_completed'])
      })

      it('does not refund a registered payment when the webhook fails', async () => {
        mockPaymentFlowService.logPaymentFlowUpdate.mockImplementation(
          async ({ reason }) => {
            if (reason !== 'payment_started') {
              throw new Error('Webhook failed')
            }
          },
        )

        const { context, saga, orchestrator } = setupSaga()
        const result = await orchestrator.execute(
          saga as never,
          context as never,
        )

        expect(result.success).toBe(true)
        expect(refundMock()).not.toHaveBeenCalled()
        expect(
          mockPaymentFlowService.deleteCardPaymentConfirmationAndFulfillment,
        ).not.toHaveBeenCalled()
      })

      it('sends the completed webhook without throwing on errors', async () => {
        const { context, saga, orchestrator } = setupSaga()
        await orchestrator.execute(saga as never, context as never)

        expect(callFor('payment_completed')[1]).toEqual(
          expect.objectContaining({ useRetry: true, throwOnError: false }),
        )
      })

      it('refunds when the settlement itself fails', async () => {
        mockCardPaymentService.settleDebt.mockRejectedValue(
          new Error('Database error'),
        )

        const { context, saga, orchestrator } = setupSaga()

        await expect(
          orchestrator.execute(saga as never, context as never),
        ).rejects.toThrow('Database error')

        expect(refundMock()).toHaveBeenCalledTimes(1)
      })
    })

    it('PERSIST compensate runs when NOTIFY fails', async () => {
      mockPaymentFlowService.logPaymentFlowUpdate.mockImplementation(
        async (update, logConfig) => {
          if (
            logConfig?.throwOnError &&
            update.reason === 'payment_completed'
          ) {
            throw new Error('Webhook failed')
          }
        },
      )

      const { saga, orchestrator, context, input } = setupSaga()

      await expect(
        orchestrator.execute(saga as never, context as never),
      ).rejects.toThrow('Webhook failed')

      expect(
        mockPaymentFlowService.deleteCardPaymentConfirmationAndFulfillment,
      ).toHaveBeenCalledWith(
        input.paymentFlowId,
        context.trackingData.correlationId,
      )
    })
  })
})
