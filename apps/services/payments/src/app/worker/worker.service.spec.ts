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
  } = {},
) => ({
  id: 'flow-1',
  organisationId: 'org-1',
  charges: [],
  cardPaymentDetails: [
    {
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

  describe('run', () => {
    it('should log summary with created: 0, failed: 0 when no flows to process', async () => {
      paymentFlowService.findPaidFlowsWithoutFjsCharge.mockResolvedValue([])

      await service.run()

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete',
        {
          created: 0,
          failed: 0,
          manualInterventionNeeded: 0,
        },
      )
      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
    })

    it('should create FJS charge, record success event, and log created: 1 when one flow succeeds', async () => {
      const flow = createMockFlow({ id: 'flow-success' })
      paymentFlowService.findPaidFlowsWithoutFjsCharge.mockResolvedValue([
        flow,
      ] as never)
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-123',
        id: 'charge-id',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      expect(paymentWorkerEventModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: 'flow-success',
          taskType: WorkerTaskType.CreateFjsCharge,
          status: 'success',
          metadata: { receptionId: 'rec-123' },
        }),
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete',
        {
          created: 1,
          failed: 0,
          manualInterventionNeeded: 0,
        },
      )
    })

    it('should record failure event and log failed: 1 when createFjsCharge throws FJS error', async () => {
      const flow = createMockFlow({ id: 'flow-fail' })
      paymentFlowService.findPaidFlowsWithoutFjsCharge.mockResolvedValue([
        flow,
      ] as never)
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
        'Payment worker run complete',
        {
          created: 0,
          failed: 1,
          manualInterventionNeeded: 0,
        },
      )
    })

    it('should not record event when createFjsCharge throws FJS_NETWORK_ERROR', async () => {
      const flow = createMockFlow({ id: 'flow-network' })
      paymentFlowService.findPaidFlowsWithoutFjsCharge.mockResolvedValue([
        flow,
      ] as never)
      paymentFlowService.createFjsCharge.mockRejectedValue(
        new Error(FJS_NETWORK_ERROR),
      )

      await service.run()

      expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[flow-network] FJS request failed (network/transient), will retry',
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete',
        {
          created: 0,
          failed: 0,
          manualInterventionNeeded: 0,
        },
      )
    })

    it('should not record event when createFjsCharge throws AlreadyCreatedCharge', async () => {
      const flow = createMockFlow({ id: 'flow-already' })
      paymentFlowService.findPaidFlowsWithoutFjsCharge.mockResolvedValue([
        flow,
      ] as never)
      paymentFlowService.createFjsCharge.mockRejectedValue(
        new Error(FjsErrorCode.AlreadyCreatedCharge),
      )

      await service.run()

      expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
      expect(mockLogger.warn).toHaveBeenCalledWith(
        '[flow-already] FJS charge already exists, flow/fulfillment not updated — manual reconciliation required',
      )
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete',
        {
          created: 0,
          failed: 0,
          manualInterventionNeeded: 0,
        },
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
      paymentFlowService.findPaidFlowsWithoutFjsCharge.mockResolvedValue([
        flowWithFiveFailures,
      ] as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(paymentWorkerEventModel.create).not.toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete',
        {
          created: 0,
          failed: 0,
          manualInterventionNeeded: 1,
        },
      )
    })

    it('should process flow with fewer than limit failure events', async () => {
      const flowWithTwoFailures = createMockFlow({
        id: 'flow-retry',
        workerEvents: [{ status: 'failure' }, { status: 'failure' }],
      })
      paymentFlowService.findPaidFlowsWithoutFjsCharge.mockResolvedValue([
        flowWithTwoFailures,
      ] as never)
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
        'Payment worker run complete',
        {
          created: 1,
          failed: 0,
          manualInterventionNeeded: 0,
        },
      )
    })

    it('should process eligible flows and skip ineligible ones in the same run', async () => {
      const flowEligible = createMockFlow({ id: 'flow-a', workerEvents: [] })
      const flowSkipped = createMockFlow({
        id: 'flow-b',
        workerEvents: Array.from({ length: 5 }, () => ({ status: 'failure' })),
      })
      paymentFlowService.findPaidFlowsWithoutFjsCharge.mockResolvedValue([
        flowEligible,
        flowSkipped,
      ] as never)
      paymentFlowService.createFjsCharge.mockResolvedValue({
        receptionId: 'rec-a',
        id: 'charge-a',
      } as never)

      await service.run()

      expect(paymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      expect(paymentWorkerEventModel.create).toHaveBeenCalledTimes(1)

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Payment worker run complete',
        {
          created: 1,
          failed: 0,
          manualInterventionNeeded: 1,
        },
      )
    })
  })
})
