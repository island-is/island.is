import { v4 as uuid } from 'uuid'

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
import { ApplePayChargeInput, ChargeCardInput } from '../dtos'
const createMockLogger = (): Logger =>
  ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    child: jest.fn(),
  } as unknown as Logger)

const mockPaymentFlow = {
  id: 'payment-flow-id',
  organisationId: 'org-id',
  payerNationalId: '1234567890',
  charges: [],
  availablePaymentMethods: ['card'],
  onUpdateUrl: 'https://example.com/callback',
}

const mockCatalogItems = [
  {
    chargeItemCode: '123',
    chargeItemName: 'Test charge',
    priceAmount: 1000,
    quantity: 1,
  },
]

const mockPaymentResult = {
  isSuccess: true,
  acquirerReferenceNumber: 'arn-123',
  authorizationCode: 'auth-123',
  maskedCardNumber: '****1234',
  cardInformation: { cardScheme: 'Visa', cardUsage: 'credit' },
  transactionID: 'tx-123',
  transactionLifecycleId: 'tlc-123',
  authorizationIdentifier: 'auth-id',
  responseCode: '00',
  responseDescription: 'Success',
  responseTime: '12:00:00',
  correlationID: 'corr-123',
}

const getChargeCardInput = (): ChargeCardInput => ({
  paymentFlowId: 'payment-flow-id',
  cardNumber: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 25,
  cvc: '123',
})

const getApplePayChargeInput = (): ApplePayChargeInput => ({
  paymentFlowId: 'payment-flow-id',
  paymentData: {
    version: 'EC_v1',
    data: 'payment-data',
    signature: 'signature',
    header: {
      ephemeralPublicKey: 'key',
      publicKeyHash: 'hash',
      transactionId: 'tx-id',
    },
  },
  paymentMethod: { displayName: 'Visa 1234', network: 'Visa' },
  transactionIdentifier: 'tx-identifier',
})

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
      mockCardPaymentService = {
        validatePaymentFlow: jest.fn().mockResolvedValue({
          paymentFlow: mockPaymentFlow,
          catalogItems: mockCatalogItems,
          totalPrice: 1000,
          paymentStatus: 'unpaid',
        }),
        charge: jest.fn().mockResolvedValue(mockPaymentResult),
        chargeApplePay: jest.fn().mockResolvedValue(mockPaymentResult),
        persistPaymentConfirmation: jest.fn().mockResolvedValue(undefined),
        refund: jest.fn().mockResolvedValue({ isSuccess: true }),
        refundWithCorrelationId: jest
          .fn()
          .mockResolvedValue({ isSuccess: true }),
      } as unknown as jest.Mocked<CardPaymentService>

      mockPaymentFlowService = {
        logPaymentFlowUpdate: jest.fn().mockResolvedValue(undefined),
        deleteCardPaymentConfirmation: jest.fn().mockResolvedValue({
          id: uuid(),
          paymentFlowId: 'payment-flow-id',
        }),
        deletePaymentFulfillment: jest.fn().mockResolvedValue({}),
      } as unknown as jest.Mocked<PaymentFlowService>
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
