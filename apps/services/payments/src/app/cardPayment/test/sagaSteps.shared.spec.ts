import type { Logger } from '@island.is/logging'

import {
  ApplePayPaymentContext,
  ApplePayPaymentStepResults,
  CardPaymentContext,
  CardPaymentStepResults,
  PaymentOrchestrator,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
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
    createSaga: createCardPaymentSaga,
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
    it('both sagas have same step structure (VALIDATE, charge, PERSIST, NOTIFY)', () => {
      const mockLogger = createMockLogger()
      const mockCard = {} as CardPaymentService
      const mockFlow = {} as PaymentFlowService

      const cardSaga = createCardPaymentSaga(mockCard, mockFlow, mockLogger)
      const appleSaga = createApplePayPaymentSaga(
        mockCard,
        mockFlow,
        mockLogger,
      )

      const cardSteps = getSagaSteps(cardSaga)
      const appleSteps = getSagaSteps(appleSaga)

      expect(cardSteps.map((s) => s.name)).toEqual([
        'VALIDATE',
        'CHARGE_CARD',
        'PERSIST_PAYMENT_CONFIRMATION',
        'NOTIFY_SUCCESSFUL_PAYMENT',
      ])
      expect(appleSteps.map((s) => s.name)).toEqual([
        'VALIDATE',
        'CHARGE_APPLE_PAY',
        'PERSIST_PAYMENT_CONFIRMATION',
        'NOTIFY_SUCCESSFUL_PAYMENT',
      ])

      expect(cardSteps[0].name).toBe(appleSteps[0].name)
      expect(cardSteps[2].name).toBe(appleSteps[2].name)
      expect(cardSteps[3].name).toBe(appleSteps[3].name)
    })
  })

  describe.each(sagaConfigs)('$name - shared step behavior', (config) => {
    let mockLogger: Logger
    let mockCardPaymentService: jest.Mocked<CardPaymentService>
    let mockPaymentFlowService: jest.Mocked<PaymentFlowService>

    beforeEach(() => {
      mockLogger = createMockLogger()
      mockCardPaymentService = createMockCardPaymentService()
      mockPaymentFlowService = createMockPaymentFlowService()
    })

    const setupSaga = () => {
      const input = config.getInput()
      const context = config.createContext(input.paymentFlowId, input as never)
      const saga = config.createSaga(
        mockCardPaymentService,
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
      expect(context.completedSteps).toContain('NOTIFY_SUCCESSFUL_PAYMENT')
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
        mockPaymentFlowService.deleteCardPaymentConfirmation,
      ).toHaveBeenCalledWith(
        input.paymentFlowId,
        context.trackingData.correlationId,
      )
      expect(
        mockPaymentFlowService.deletePaymentFulfillment,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: input.paymentFlowId,
          confirmationRefId: expect.any(String),
          correlationId: context.trackingData.correlationId,
        }),
      )
    })
  })
})
