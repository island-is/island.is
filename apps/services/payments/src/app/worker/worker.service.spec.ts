import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { FjsErrorCode } from '@island.is/shared/constants'

import { FJS_NETWORK_ERROR } from '../../utils/fjsCharge'
import { PaymentWorkerEvent } from '../paymentFlow/models/paymentWorkerEvent.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { DebtSettlementService } from '../debtPayment/debtSettlement.service'
import { RefundOrchestrationService } from '../refund/refundOrchestration.service'
import { WorkerModuleConfig } from './worker.config'
import { WorkerService } from './worker.service'
import { WorkerTaskType } from './workerTaskTypes'

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  startTimer: jest.fn(() => ({ done: jest.fn() })),
}

const mockWorkerConfig = {
  workerMaxFailureEventsPerFlow: 5,
  workerMinutesToWaitBeforeCreatingFjsCharge: 5,
  workerMinutesToWaitBeforeSettlingDebt: 1,
  workerRetryDelayMinutesAfterFailure: 60,
}

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60 * 1000)

const failureEvent = (createdMinutesAgo: number) => ({
  status: 'failure',
  created: minutesAgo(createdMinutesAgo),
})

const createMockFlow = (
  overrides: {
    id?: string
    workerEvents?: Array<{ status: string; created: Date }>
    cardPaymentDetails?: unknown[]
    paymentFulfillments?: unknown[]
    bankTransferPayments?: unknown[]
  } = {},
) => ({
  id: 'flow-1',
  organisationId: 'org-1',
  charges: [],
  paymentFulfillments: [
    {
      paymentMethod: 'card',
      confirmationRefId: 'card-details-correlation-id',
      fjsChargeId: null,
      created: new Date(),
    },
  ],
  cardPaymentDetails: [
    {
      id: 'card-details-correlation-id',
      authorizationCode: 'auth',
      cardScheme: 'Visa',
      maskedCardNumber: '****',
      cardUsage: 'single',
      totalPrice: 1000,
      merchantReferenceData: {},
      created: new Date(),
    },
  ],
  workerEvents: [],
  ...overrides,
})

const createBankTransferFlow = (
  overrides: {
    id?: string
    workerEvents?: Array<{ status: string; created: Date }>
    bankTransferPayments?: unknown[]
  } = {},
) =>
  createMockFlow({
    id: 'bt-flow',
    cardPaymentDetails: [],
    paymentFulfillments: [
      {
        paymentMethod: 'bank_transfer',
        confirmationRefId: 'bt-correlation-id',
        fjsChargeId: null,
        created: new Date(),
      },
    ],
    bankTransferPayments: [
      {
        id: 'bt-correlation-id',
        providerPaymentId: 'provider-payment-id',
        amount: 900,
      },
    ],
    ...overrides,
  })

describe('WorkerService', () => {
  let service: WorkerService
  let paymentFlowService: jest.Mocked<PaymentFlowService>
  let paymentWorkerEventModel: { create: jest.Mock }
  let debtSettlementService: { attempt: jest.Mock }
  let refundOrchestrationService: { refund: jest.Mock }

  beforeEach(async () => {
    paymentWorkerEventModel = { create: jest.fn().mockResolvedValue({}) }
    debtSettlementService = { attempt: jest.fn() }
    refundOrchestrationService = { refund: jest.fn().mockResolvedValue({}) }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkerService,
        {
          provide: LOGGER_PROVIDER,
          useValue: mockLogger,
        },
        {
          provide: PaymentFlowService,
          useValue: {
            findPaidFlowsWithoutFjsCharge: jest.fn(),
            findDebtFlowsToSettle: jest.fn().mockResolvedValue([]),
            logDebtPaymentFinalized: jest.fn().mockResolvedValue(undefined),
            logDebtPaymentRejected: jest.fn().mockResolvedValue(undefined),
            getPaymentFlowChargeDetails: jest.fn().mockResolvedValue({
              catalogItems: [
                {
                  chargeItemCode: 'A',
                  chargeType: 'A',
                  quantity: 1,
                  priceAmount: 1000,
                },
              ],
              totalPrice: 1000,
            }),
            createFjsCharge: jest.fn(),
          },
        },
        {
          provide: getModelToken(PaymentWorkerEvent),
          useValue: paymentWorkerEventModel,
        },
        {
          provide: WorkerModuleConfig.KEY,
          useValue: mockWorkerConfig,
        },
        { provide: DebtSettlementService, useValue: debtSettlementService },
        {
          provide: RefundOrchestrationService,
          useValue: refundOrchestrationService,
        },
      ],
    }).compile()

    service = module.get<WorkerService>(WorkerService)
    paymentFlowService = module.get(
      PaymentFlowService,
    ) as jest.Mocked<PaymentFlowService>

    jest.clearAllMocks()
  })

  /** The worker sweeps each payment method separately — mock the per-method results. */
  const mockFlowSweep = (flows: {
    card?: unknown[]
    bankTransfer?: unknown[]
  }) => {
    paymentFlowService.findPaidFlowsWithoutFjsCharge.mockImplementation(((
      _cutoffTime: Date,
      paymentMethod: 'card' | 'bank_transfer',
    ) =>
      Promise.resolve(
        paymentMethod === 'card' ? flows.card ?? [] : flows.bankTransfer ?? [],
      )) as never)
  }

  describe('run', () => {
    it('should log summary with created: 0, failed: 0 when no flows to process', async () => {
      mockFlowSweep({})

      await service.run()

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
    })

    it('should create FJS charge, record success event, and log created: 1 when one flow succeeds', async () => {
      const flow = createMockFlow({ id: 'flow-success' })
      mockFlowSweep({ card: [flow] })
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-123',
        id: 'charge-id',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      // The card FJS charge carries the per-attempt correlationId (= cardPaymentDetails.id).
      const [, cardChargePayload] =
        paymentFlowService.createFjsCharge.mock.calls[0]
      expect(cardChargePayload.payInfo?.correlationId).toBe(
        'card-details-correlation-id',
      )
      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'flow-success',
          taskType: WorkerTaskType.CreateFjsCharge,
          status: 'success',
          metadata: { receptionId: 'rec-123' },
        }),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should record failure event and log failed: 1 when createFjsCharge throws FJS error', async () => {
      const flow = createMockFlow({ id: 'flow-fail' })
      mockFlowSweep({ card: [flow] })
      paymentFlowService.createFjsCharge.mockRejectedValue(
        new Error(FjsErrorCode.FailedToCreateCharge),
      )

      await service.run()

      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'flow-fail',
          taskType: WorkerTaskType.CreateFjsCharge,
          status: 'failure',
          errorCode: FjsErrorCode.FailedToCreateCharge,
        }),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should not record event but still count failure when createFjsCharge throws FJS_NETWORK_ERROR', async () => {
      const flow = createMockFlow({ id: 'flow-network' })
      mockFlowSweep({ card: [flow] })
      paymentFlowService.createFjsCharge.mockRejectedValue(
        new Error(FJS_NETWORK_ERROR),
      )

      await service.run()

      expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[flow-network] FJS request failed (network/transient), will retry',
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should record failure event when createFjsCharge throws AlreadyCreatedCharge', async () => {
      const flow = createMockFlow({ id: 'flow-already' })
      mockFlowSweep({ card: [flow] })
      paymentFlowService.createFjsCharge.mockRejectedValue(
        new Error(FjsErrorCode.AlreadyCreatedCharge),
      )

      await service.run()

      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'flow-already',
          taskType: WorkerTaskType.CreateFjsCharge,
          status: 'failure',
          errorCode: FjsErrorCode.AlreadyCreatedCharge,
          message: FjsErrorCode.AlreadyCreatedCharge,
        }),
      )
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[flow-already] FJS charge already exists, flow/fulfillment not updated — manual reconciliation required',
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should skip flows with failure count >= workerMaxFailureEventsPerFlow', async () => {
      const flowWithFiveFailures = createMockFlow({
        id: 'flow-skipped',
        workerEvents: Array.from({ length: 5 }, () => failureEvent(120)),
      })
      mockFlowSweep({ card: [flowWithFiveFailures] })

      await service.run()

      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
      // One aggregate info line per run instead of a per-flow warn on every tick.
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Skipping 1 payment flow(s) that exceeded the failure limit (5) and require manual intervention: flow-skipped',
      )
      expect(mockLogger.warn).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 0, skipped (manual intervention): 1, deferred (retry delay): 0',
      )
    })

    it('should process flow with fewer than limit failure events', async () => {
      const flowWithTwoFailures = createMockFlow({
        id: 'flow-retry',
        workerEvents: [failureEvent(180), failureEvent(120)],
      })
      mockFlowSweep({ card: [flowWithTwoFailures] })
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-456',
        id: 'charge-id',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'flow-retry',
          status: 'success',
        }),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should process eligible flows and skip ineligible ones in the same run', async () => {
      const flowEligible = createMockFlow({ id: 'flow-a', workerEvents: [] })
      const flowSkipped = createMockFlow({
        id: 'flow-b',
        workerEvents: Array.from({ length: 5 }, () => failureEvent(120)),
      })
      mockFlowSweep({ card: [flowEligible, flowSkipped] })
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-a',
        id: 'charge-a',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      expect(paymentWorkerEventModel.create).toHaveBeenCalledTimes(1)

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 1, deferred (retry delay): 0',
      )
    })

    it('should defer a flow whose latest failure is more recent than the retry delay', async () => {
      const recentlyFailed = createMockFlow({
        id: 'flow-deferred',
        workerEvents: [failureEvent(180), failureEvent(10)],
      })
      mockFlowSweep({ card: [recentlyFailed] })

      await service.run()

      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Deferring 1 payment flow(s) that failed less than 60 minute(s) ago: flow-deferred',
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 1',
      )
    })

    it('should retry a flow once the retry delay since its latest failure has passed', async () => {
      const retryable = createMockFlow({
        id: 'flow-retry-after-delay',
        workerEvents: [failureEvent(61)],
      })
      mockFlowSweep({ card: [retryable] })
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-789',
        id: 'charge-id',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should not defer a flow that only has success events', async () => {
      const flow = createMockFlow({
        id: 'flow-success-only',
        workerEvents: [{ status: 'success', created: minutesAgo(1) }],
      })
      mockFlowSweep({ card: [flow] })
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-s',
        id: 'charge-s',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
    })

    it('should park a flow at the failure limit even when its latest failure is recent', async () => {
      const flow = createMockFlow({
        id: 'flow-capped',
        workerEvents: Array.from({ length: 5 }, () => failureEvent(1)),
      })
      mockFlowSweep({ card: [flow] })

      await service.run()

      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 0, skipped (manual intervention): 1, deferred (retry delay): 0',
      )
    })

    it('should build a PAID bank-transfer FJS charge from the fulfillment and bank transfer row', async () => {
      const flow = createBankTransferFlow({ id: 'bt-success' })
      mockFlowSweep({ bankTransfer: [flow] })
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-bt',
        id: 'charge-bt',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      const [, btChargePayload] =
        paymentFlowService.createFjsCharge.mock.calls[0]
      // PAID payload: RRN carries the provider id, correlationId is the fulfillment ref.
      expect(btChargePayload.payInfo?.RRN).toBe('provider-payment-id')
      expect(btChargePayload.payInfo?.correlationId).toBe('bt-correlation-id')
      // payableAmount is the settled bank transfer amount, not the catalog total (1000)
      // recomputed at worker-run time.
      expect(btChargePayload.payInfo?.payableAmount).toBe(900)
      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'bt-success',
          taskType: WorkerTaskType.CreateFjsCharge,
          status: 'success',
          metadata: { receptionId: 'rec-bt' },
        }),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should record a failure for a card flow with no active card payment details (e.g. interrupted refund)', async () => {
      // The card sweep inner-joins card details so such flows are normally excluded;
      // if one slips through anyway it must surface as a failure — not crash the run.
      const flow = createMockFlow({
        id: 'card-orphan',
        cardPaymentDetails: [],
      })
      mockFlowSweep({ card: [flow] })

      await service.run()

      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'card-orphan',
          taskType: WorkerTaskType.CreateFjsCharge,
          status: 'failure',
          errorCode: expect.stringContaining('No card payment details found'),
        }),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should record a failure when the bank transfer row for the fulfillment is missing', async () => {
      const flow = createBankTransferFlow({
        id: 'bt-orphan',
        bankTransferPayments: [],
      })
      mockFlowSweep({ bankTransfer: [flow] })

      await service.run()

      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'bt-orphan',
          taskType: WorkerTaskType.CreateFjsCharge,
          status: 'failure',
        }),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('should process card and bank-transfer flows with their own builders in the same run', async () => {
      const cardFlow = createMockFlow({ id: 'card-flow' })
      const bankFlow = createBankTransferFlow({ id: 'bank-flow' })
      mockFlowSweep({ card: [cardFlow], bankTransfer: [bankFlow] })
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-both',
        id: 'charge-both',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(2)
      const payloads = paymentFlowService.createFjsCharge.mock.calls.map(
        ([, payload]) => payload,
      )
      // Card payload carries card payInfo, bank payload carries the provider id in RRN.
      expect(payloads[0].payInfo?.correlationId).toBe(
        'card-details-correlation-id',
      )
      expect(payloads[1].payInfo?.RRN).toBe('provider-payment-id')
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete — created: 2, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })
  })

  describe('debt flows', () => {
    const problem = { title: 'Bad request', detail: 'Amount exceeds debt' }
    const debts = [{ payId: 'pay-1', amount: 900 }]

    const createDebtCardFlow = (
      overrides: Parameters<typeof createMockFlow>[0] & {
        fjsDebtPayment?: { status: string }
      } = {},
    ) => ({
      ...createMockFlow({ id: 'debt-card', ...overrides }),
      type: 'debt',
      payerNationalId: '0101302989',
      debts,
      ...overrides,
    })

    const createDebtBankFlow = (overrides: { id?: string } = {}) => ({
      ...createBankTransferFlow({ id: 'debt-bank', ...overrides }),
      type: 'debt',
      payerNationalId: '0101302989',
      debts,
    })

    const mockDebtSweep = (flows: unknown[]) => {
      paymentFlowService.findDebtFlowsToSettle.mockResolvedValue(flows as never)
    }

    const registered = {
      type: 'registered',
      dateCreated: '2026-10-12T10:00:00',
      alreadySettled: false,
    }

    beforeEach(() => {
      mockFlowSweep({})
    })

    it('looks for flows whose last attempt is older than the wait', async () => {
      const before = Date.now()

      await service.run()

      const [cutoffTime] =
        paymentFlowService.findDebtFlowsToSettle.mock.calls[0]
      // One minute
      expect(before - cutoffTime.getTime()).toBeGreaterThanOrEqual(59_000)
      expect(before - cutoffTime.getTime()).toBeLessThan(65_000)
    })

    it('registers a card payment from the card details and sends payment_finalized', async () => {
      mockDebtSweep([createDebtCardFlow()])
      debtSettlementService.attempt.mockResolvedValue(registered)

      await service.run()

      expect(debtSettlementService.attempt).toHaveBeenCalledWith(
        { id: 'debt-card', payerNationalId: '0101302989', debts },
        {
          kind: 'credit',
          PAN: '****',
          RRN: expect.anything(),
          authCode: 'auth',
          cardType: 'Visa',
          payableAmount: 1000,
          correlationId: 'card-details-correlation-id',
        },
      )
      expect(paymentFlowService.logDebtPaymentFinalized).toHaveBeenCalledWith(
        'debt-card',
        'card',
        registered,
      )
      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'debt-card',
          taskType: WorkerTaskType.PayFjsDebt,
          status: 'success',
        }),
      )
      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Debt payment run complete — settled: 1, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('registers a bank transfer with the provider payment id', async () => {
      mockDebtSweep([createDebtBankFlow()])
      debtSettlementService.attempt.mockResolvedValue(registered)

      await service.run()

      expect(debtSettlementService.attempt).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'debt-bank' }),
        {
          kind: 'transfer',
          RRN: 'provider-payment-id',
          payableAmount: 900,
          correlationId: 'bt-correlation-id',
        },
      )
      expect(paymentFlowService.logDebtPaymentFinalized).toHaveBeenCalledWith(
        'debt-bank',
        'bank_transfer',
        registered,
      )
    })

    it('does not announce a registration an earlier attempt made', async () => {
      mockDebtSweep([createDebtCardFlow()])
      debtSettlementService.attempt.mockResolvedValue({
        ...registered,
        alreadySettled: true,
      })

      await service.run()

      expect(paymentFlowService.logDebtPaymentFinalized).not.toHaveBeenCalled()
    })

    it('tells the organisation and refunds the card when FJS rejects a card payment', async () => {
      mockDebtSweep([createDebtCardFlow()])
      debtSettlementService.attempt.mockResolvedValue({
        type: 'rejected',
        problem,
        alreadySettled: false,
      })

      await service.run()

      expect(paymentFlowService.logDebtPaymentRejected).toHaveBeenCalledWith(
        'debt-card',
        'card',
        problem,
        { needsManualRefund: false },
      )
      expect(refundOrchestrationService.refund).toHaveBeenCalledWith(
        expect.objectContaining({ paymentFlowId: 'debt-card' }),
        { system: true },
      )
    })

    it('leaves a rejected bank transfer for a manual refund', async () => {
      mockDebtSweep([createDebtBankFlow()])
      debtSettlementService.attempt.mockResolvedValue({
        type: 'rejected',
        problem,
        alreadySettled: false,
      })

      await service.run()

      expect(paymentFlowService.logDebtPaymentRejected).toHaveBeenCalledWith(
        'debt-bank',
        'bank_transfer',
        problem,
        { needsManualRefund: true },
      )
      expect(refundOrchestrationService.refund).not.toHaveBeenCalled()
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('refund it manually'),
        expect.objectContaining({ needsManualRefund: true }),
      )
    })

    it('only retries the refund of a card payment that was rejected before', async () => {
      mockDebtSweep([
        createDebtCardFlow({ fjsDebtPayment: { status: 'rejected' } }),
      ])

      await service.run()

      expect(debtSettlementService.attempt).not.toHaveBeenCalled()
      expect(paymentFlowService.logDebtPaymentRejected).not.toHaveBeenCalled()
      expect(refundOrchestrationService.refund).toHaveBeenCalledWith(
        expect.objectContaining({ paymentFlowId: 'debt-card' }),
        { system: true },
      )
    })

    it('records a failure and tries again next run when the refund fails', async () => {
      mockDebtSweep([createDebtCardFlow()])
      debtSettlementService.attempt.mockResolvedValue({
        type: 'rejected',
        problem,
        alreadySettled: false,
      })
      refundOrchestrationService.refund.mockRejectedValue(
        new Error('gateway down'),
      )

      await service.run()

      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'debt-card',
          taskType: WorkerTaskType.PayFjsDebt,
          status: 'failure',
          errorCode: 'gateway down',
        }),
      )
    })

    it('neither refunds nor notifies when the payment needs reconciliation', async () => {
      mockDebtSweep([createDebtCardFlow()])
      debtSettlementService.attempt.mockResolvedValue({
        type: 'reconcile',
        problem,
        alreadySettled: false,
      })

      await service.run()

      expect(refundOrchestrationService.refund).not.toHaveBeenCalled()
      expect(paymentFlowService.logDebtPaymentRejected).not.toHaveBeenCalled()
      expect(paymentFlowService.logDebtPaymentFinalized).not.toHaveBeenCalled()
      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          taskType: WorkerTaskType.PayFjsDebt,
          status: 'failure',
          errorCode: 'needs_reconciliation',
        }),
      )
    })

    it.each(['ambiguous', 'validation_unavailable', 'in_progress'])(
      'retries next run without counting a failure when %s',
      async (reason) => {
        mockDebtSweep([createDebtCardFlow()])
        debtSettlementService.attempt.mockResolvedValue({
          type: 'deferred',
          reason,
        })

        await service.run()

        expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
        expect(
          paymentFlowService.logDebtPaymentFinalized,
        ).not.toHaveBeenCalled()
      },
    )

    it('counts a failure when FJS did not accept our call', async () => {
      mockDebtSweep([createDebtCardFlow()])
      debtSettlementService.attempt.mockResolvedValue({
        type: 'deferred',
        reason: 'transient',
      })

      await service.run()

      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'debt-card',
          taskType: WorkerTaskType.PayFjsDebt,
          status: 'failure',
          errorCode: 'transient',
        }),
      )
    })

    it('records a failure when the settlement throws', async () => {
      mockDebtSweep([createDebtCardFlow()])
      debtSettlementService.attempt.mockRejectedValue(new Error('db down'))

      await service.run()

      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'failure',
          errorCode: 'db down',
          taskType: WorkerTaskType.PayFjsDebt,
        }),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Debt payment run complete — settled: 0, failed: 1, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('skips flows that reached the failure limit', async () => {
      mockDebtSweep([
        createDebtCardFlow({
          workerEvents: Array.from({ length: 5 }, () => ({
            status: 'failure',
          })),
        }),
      ])

      await service.run()

      expect(debtSettlementService.attempt).not.toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Skipping 1 debt payment flow(s)'),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Debt payment run complete — settled: 0, failed: 0, skipped (manual intervention): 1, deferred (retry delay): 0',
      )
    })

    it('defers a flow whose latest failure is more recent than the retry delay', async () => {
      mockDebtSweep([
        createDebtCardFlow({
          workerEvents: [failureEvent(180), failureEvent(10)],
        }),
      ])

      await service.run()

      expect(debtSettlementService.attempt).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining('Deferring 1 debt payment flow(s)'),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Debt payment run complete — settled: 0, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 1',
      )
    })

    it('retries a flow once the retry delay since its latest failure has passed', async () => {
      mockDebtSweep([createDebtCardFlow({ workerEvents: [failureEvent(61)] })])
      debtSettlementService.attempt.mockResolvedValue(registered)

      await service.run()

      expect(debtSettlementService.attempt).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Debt payment run complete — settled: 1, failed: 0, skipped (manual intervention): 0, deferred (retry delay): 0',
      )
    })

    it('parks a flow at the failure limit even when its latest failure is recent', async () => {
      mockDebtSweep([
        createDebtCardFlow({
          workerEvents: Array.from({ length: 5 }, () => failureEvent(1)),
        }),
      ])

      await service.run()

      expect(debtSettlementService.attempt).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Debt payment run complete — settled: 0, failed: 0, skipped (manual intervention): 1, deferred (retry delay): 0',
      )
    })
  })
})
