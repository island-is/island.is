import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import { FjsErrorCode } from '@island.is/shared/constants'

import { FJS_NETWORK_ERROR } from '../../utils/fjsCharge'
import { PaymentWorkerEvent } from '../paymentFlow/models/paymentWorkerEvent.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
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
}

const createMockFlow = (
  overrides: {
    id?: string
    workerEvents?: Array<{ status: string }>
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
    workerEvents?: Array<{ status: string }>
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

  beforeEach(async () => {
    paymentWorkerEventModel = { create: jest.fn().mockResolvedValue({}) }

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
        'Payment worker run complete — created: 0, failed: 0, skipped (manual intervention): 0',
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
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 0',
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
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0',
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
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0',
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
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0',
      )
    })

    it('should skip flows with failure count >= workerMaxFailureEventsPerFlow', async () => {
      const flowWithFiveFailures = createMockFlow({
        id: 'flow-skipped',
        workerEvents: [
          { status: 'failure' },
          { status: 'failure' },
          { status: 'failure' },
          { status: 'failure' },
          { status: 'failure' },
        ],
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
        'Payment worker run complete — created: 0, failed: 0, skipped (manual intervention): 1',
      )
    })

    it('should process flow with fewer than limit failure events', async () => {
      const flowWithTwoFailures = createMockFlow({
        id: 'flow-retry',
        workerEvents: [{ status: 'failure' }, { status: 'failure' }],
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
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 0',
      )
    })

    it('should process eligible flows and skip ineligible ones in the same run', async () => {
      const flowEligible = createMockFlow({ id: 'flow-a', workerEvents: [] })
      const flowSkipped = createMockFlow({
        id: 'flow-b',
        workerEvents: Array.from({ length: 5 }, () => ({ status: 'failure' })),
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
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 1',
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
        'Payment worker run complete — created: 1, failed: 0, skipped (manual intervention): 0',
      )
    })

    it('should record a failure for a card flow with no active card payment details (e.g. interrupted refund)', async () => {
      // The query left-joins card details, so a card flow whose details are all
      // soft-deleted is returned and must surface as a failure — not be silently skipped.
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
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0',
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
        'Payment worker run complete — created: 0, failed: 1, skipped (manual intervention): 0',
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
        'Payment worker run complete — created: 2, failed: 0, skipped (manual intervention): 0',
      )
    })
  })
})
