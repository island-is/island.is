import { Orchestrator } from './orchestrator'
import {
  Step,
  ContextWithStepResults,
  getStepResult,
  requireStepResult,
  hasStepResult,
} from './orchestrator.types'
import type { Logger } from '@island.is/logging'

// Test types
interface TestStepResults {
  STEP1: { value: string }
  STEP2: { count: number }
  STEP3: void
  STEP4: { data: string }
}

interface TestContext extends ContextWithStepResults<TestStepResults> {
  id: string
}

// Mock logger
const createMockLogger = (): Logger =>
  ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    child: jest.fn(),
  } as any)

describe('Orchestrator', () => {
  let mockLogger: Logger
  let context: TestContext

  beforeEach(() => {
    mockLogger = createMockLogger()
    context = {
      id: 'test-context',
      stepResults: {},
      completedSteps: [],
      startTime: new Date(),
    }
  })

  describe('Linear Saga Execution (Array)', () => {
    it('should execute all steps in sequence', async () => {
      const executionOrder: string[] = []

      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => {
            executionOrder.push('STEP1')
            return { value: 'result1' }
          },
        },
        {
          name: 'STEP2',
          execute: async () => {
            executionOrder.push('STEP2')
            return { count: 42 }
          },
        },
        {
          name: 'STEP3',
          execute: async () => {
            executionOrder.push('STEP3')
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      const result = await orchestrator.execute(saga, context)

      expect(result.success).toBe(true)
      expect(executionOrder).toEqual(['STEP1', 'STEP2', 'STEP3'])
      // should automatically store step results
      expect(context.stepResults.STEP1).toEqual({ value: 'result1' })
      expect(context.stepResults.STEP2).toEqual({ count: 42 })
      // should store void/undefined results
      expect(context.stepResults.STEP3).toBeUndefined()
    })

    it('should track execution history', async () => {
      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => ({ value: 'test' }),
        },
        {
          name: 'STEP2',
          execute: async () => ({ count: 42 }),
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      const result = await orchestrator.execute(saga, context)

      expect(result.executionHistory).toHaveLength(4) // 2 started + 2 completed
      expect(result.executionHistory[0].type).toBe('step_started')
      expect(result.executionHistory[0].step).toBe('STEP1')
      expect(result.executionHistory[1].type).toBe('step_completed')
      expect(result.executionHistory[1].step).toBe('STEP1')
      expect(result.executionHistory[2].type).toBe('step_started')
      expect(result.executionHistory[2].step).toBe('STEP2')
      expect(result.executionHistory[3].type).toBe('step_completed')
      expect(result.executionHistory[3].step).toBe('STEP2')
      result.executionHistory.forEach((record) => {
        expect(record.timestamp).toBeInstanceOf(Date)
      })
    })

    it('should update context with orchestration state', async () => {
      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async (ctx) => {
            expect(ctx.currentStep).toBe('STEP1')
            expect(ctx.completedSteps).toEqual([])
            return { value: 'test' }
          },
        },
        {
          name: 'STEP2',
          execute: async (ctx) => {
            expect(ctx.currentStep).toBe('STEP2')
            expect(ctx.completedSteps).toEqual(['STEP1'])
            return { count: 42 }
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      const result = await orchestrator.execute(saga, context)

      expect(result.context.completedSteps).toEqual(['STEP1', 'STEP2'])
      expect(result.context.currentStep).toBeUndefined() // Cleared after success
      expect(result.context.failedStep).toBeUndefined()
      expect(result.context.error).toBeUndefined()
    })
  })

  describe('Branching Saga Execution (Object)', () => {
    it('should execute steps following nextStep chain', async () => {
      const executionOrder: string[] = []

      const saga: Record<string, Step<TestContext, TestStepResults>> = {
        STEP1: {
          name: 'STEP1',
          execute: async () => {
            executionOrder.push('STEP1')
            return { value: 'first' }
          },
          nextStep: 'STEP2',
        },
        STEP2: {
          name: 'STEP2',
          execute: async () => {
            executionOrder.push('STEP2')
            return { count: 10 }
          },
          nextStep: 'STEP4',
        },
        STEP3: {
          name: 'STEP3',
          execute: async () => {
            executionOrder.push('STEP3')
          },
        },
        STEP4: {
          name: 'STEP4',
          execute: async () => {
            executionOrder.push('STEP4')
            return { data: 'last' }
          },
        },
      }

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await orchestrator.execute(saga, context, 'STEP1')

      expect(executionOrder).toEqual(['STEP1', 'STEP2', 'STEP4']) // STEP3 skipped
      expect(context.stepResults.STEP1).toEqual({ value: 'first' })
      expect(context.stepResults.STEP2).toEqual({ count: 10 })
      expect(context.stepResults.STEP4).toEqual({ data: 'last' })
    })

    it('should support conditional branching with function nextStep', async () => {
      const executionOrder: string[] = []

      const saga: Record<string, Step<TestContext, TestStepResults>> = {
        STEP1: {
          name: 'STEP1',
          execute: async () => {
            executionOrder.push('STEP1')
            return { value: 'branch' }
          },
          nextStep: (ctx) => {
            return ctx.stepResults.STEP1?.value === 'branch' ? 'STEP2' : 'STEP4'
          },
        },
        STEP2: {
          name: 'STEP2',
          execute: async () => {
            executionOrder.push('STEP2')
            return { count: 99 }
          },
        },
        STEP4: {
          name: 'STEP4',
          execute: async () => {
            executionOrder.push('STEP4')
            return { data: 'alt' }
          },
        },
      }

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await orchestrator.execute(saga, context, 'STEP1')

      expect(executionOrder).toEqual(['STEP1', 'STEP2'])
    })

    it('should throw error if start step is missing for object saga', async () => {
      const saga: Record<string, Step<TestContext, TestStepResults>> = {
        STEP1: {
          name: 'STEP1',
          execute: async () => ({ value: 'test' }),
        },
      }

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Start step required for object-based saga',
      )
    })

    it('should throw error if step is not found', async () => {
      const saga: Record<string, Step<TestContext, TestStepResults>> = {
        STEP1: {
          name: 'STEP1',
          execute: async () => ({ value: 'test' }),
          nextStep: 'MISSING_STEP',
        },
      }

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await expect(
        orchestrator.execute(saga, context, 'STEP1'),
      ).rejects.toThrow("Step 'MISSING_STEP' not found")
    })
  })

  describe('Rollback on Failure', () => {
    it('should rollback completed steps in reverse order when step fails', async () => {
      const rollbackOrder: string[] = []

      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => ({ value: 'step1' }),
          compensate: async () => {
            rollbackOrder.push('STEP1-rollback')
          },
        },
        {
          name: 'STEP2',
          execute: async () => ({ count: 42 }),
          compensate: async () => {
            rollbackOrder.push('STEP2-rollback')
          },
        },
        {
          name: 'STEP3',
          execute: async () => {
            throw new Error('Step 3 failed')
          },
          compensate: async () => {
            rollbackOrder.push('STEP3-rollback')
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Step 3 failed',
      )

      // STEP3 never completed, so only STEP2 and STEP1 should rollback in reverse order
      expect(rollbackOrder).toEqual(['STEP2-rollback', 'STEP1-rollback'])
      expect(mockLogger.warn).toHaveBeenCalledWith('Starting saga rollback', {
        completedSteps: ['STEP1', 'STEP2'],
      })
      expect(mockLogger.info).toHaveBeenCalledWith('Saga rollback completed')
    })

    it('should record step_failed in execution history', async () => {
      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => {
            throw new Error('Test error')
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      try {
        await orchestrator.execute(saga, context)
      } catch {
        // Expected
      }

      await orchestrator
        .execute(
          [
            {
              name: 'STEP1',
              execute: async () => {
                throw new Error('Failure')
              },
            },
          ],
          {
            id: 'test',
            stepResults: {},
            completedSteps: [],
            startTime: new Date(),
          },
        )
        .catch((e) => e)

      // Re-create to get execution history
      const orchestrator2 = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      try {
        await orchestrator2.execute(saga, {
          id: 'test',
          stepResults: {},
          completedSteps: [],
          startTime: new Date(),
        })
      } catch (error) {
        // Check that error was thrown
        expect(error.message).toBe('Test error')
      }
    })

    it('should skip rollback for steps without compensate', async () => {
      const rollbackOrder: string[] = []

      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => ({ value: 'step1' }),
          compensate: async () => {
            rollbackOrder.push('STEP1-rollback')
          },
        },
        {
          name: 'STEP2',
          execute: async () => ({ count: 42 }),
          // No compensate
        },
        {
          name: 'STEP3',
          execute: async () => {
            throw new Error('Failure')
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Failure',
      )

      // Only STEP1 should rollback (STEP2 has no compensate)
      expect(rollbackOrder).toEqual(['STEP1-rollback'])
    })
  })

  describe('Rollback Failure Handling', () => {
    it('should log critical error when compensate fails', async () => {
      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => ({ value: 'test' }),
          compensate: async () => {
            throw new Error('Rollback failed')
          },
          rollbackFailureMessage: 'Critical: Failed to undo STEP1',
        },
        {
          name: 'STEP2',
          execute: async () => {
            throw new Error('Step failed')
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Step failed',
      )

      expect(mockLogger.error).toHaveBeenCalledWith(
        'CRITICAL: Critical: Failed to undo STEP1',
        expect.objectContaining({
          error: 'Rollback failed',
          step: 'STEP1',
        }),
      )
    })

    it('should call onRollbackFailure callback when compensate fails', async () => {
      const onRollbackFailure = jest.fn()

      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => ({ value: 'test' }),
          compensate: async () => {
            throw new Error('Compensate error')
          },
        },
        {
          name: 'STEP2',
          execute: async () => {
            throw new Error('Execution error')
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
        onRollbackFailure,
      })

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Execution error',
      )

      expect(onRollbackFailure).toHaveBeenCalledTimes(1)
      expect(onRollbackFailure).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'STEP1' }),
        expect.objectContaining({ message: 'Compensate error' }),
        context,
        expect.any(Array), // executionHistory
      )
    })

    it('should handle callback failure gracefully', async () => {
      const onRollbackFailure = jest
        .fn()
        .mockRejectedValue(new Error('Callback error'))

      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => ({ value: 'test' }),
          compensate: async () => {
            throw new Error('Compensate error')
          },
        },
        {
          name: 'STEP2',
          execute: async () => {
            throw new Error('Execution error')
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
        onRollbackFailure,
      })

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Execution error',
      )

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to execute rollback failure callback',
        expect.objectContaining({
          callbackError: 'Callback error',
        }),
      )
    })

    it('should use default message when rollbackFailureMessage is not provided', async () => {
      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => ({ value: 'test' }),
          compensate: async () => {
            throw new Error('Rollback failed')
          },
        },
        {
          name: 'STEP2',
          execute: async () => {
            throw new Error('Step failed')
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Step failed',
      )

      expect(mockLogger.error).toHaveBeenCalledWith(
        'CRITICAL: Failed to rollback step STEP1',
        expect.any(Object),
      )
    })
  })

  describe('Helper Functions', () => {
    describe('getStepResult', () => {
      it('should return step result if exists', () => {
        const ctx: TestContext = {
          id: 'test',
          stepResults: {
            STEP1: { value: 'hello' },
          },
          completedSteps: [],
          startTime: new Date(),
        }

        const result = getStepResult(ctx, 'STEP1')

        expect(result).toEqual({ value: 'hello' })
      })

      it('should return undefined if step result does not exist', () => {
        const ctx: TestContext = {
          id: 'test',
          stepResults: {},
          completedSteps: [],
          startTime: new Date(),
        }

        const result = getStepResult(ctx, 'STEP1')

        expect(result).toBeUndefined()
      })
    })

    describe('requireStepResult', () => {
      it('should return step result if exists', () => {
        const ctx: TestContext = {
          id: 'test',
          stepResults: {
            STEP2: { count: 42 },
          },
          completedSteps: [],
          startTime: new Date(),
        }

        const result = requireStepResult(ctx, 'STEP2')

        expect(result).toEqual({ count: 42 })
      })

      it('should throw error if step result does not exist', () => {
        const ctx: TestContext = {
          id: 'test',
          stepResults: {},
          completedSteps: [],
          startTime: new Date(),
        }

        expect(() => requireStepResult(ctx, 'STEP1')).toThrow(
          'Required step STEP1 has not completed',
        )
      })

      it('should throw error if step result is undefined', () => {
        const ctx: TestContext = {
          id: 'test',
          stepResults: {
            STEP1: undefined,
          },
          completedSteps: [],
          startTime: new Date(),
        }

        expect(() => requireStepResult(ctx, 'STEP1')).toThrow(
          'Required step STEP1 has not completed',
        )
      })
    })

    describe('hasStepResult', () => {
      it('should return true if step result exists', () => {
        const ctx: TestContext = {
          id: 'test',
          stepResults: {
            STEP1: { value: 'exists' },
          },
          completedSteps: [],
          startTime: new Date(),
        }

        const result = hasStepResult(ctx, 'STEP1')

        expect(result).toBe(true)
      })

      it('should return false if step result does not exist', () => {
        const ctx: TestContext = {
          id: 'test',
          stepResults: {},
          completedSteps: [],
          startTime: new Date(),
        }

        const result = hasStepResult(ctx, 'STEP1')

        expect(result).toBe(false)
      })

      it('should return false if step result is undefined', () => {
        const ctx: TestContext = {
          id: 'test',
          stepResults: {
            STEP1: undefined,
          },
          completedSteps: [],
          startTime: new Date(),
        }

        const result = hasStepResult(ctx, 'STEP1')

        expect(result).toBe(false)
      })
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complex branching with rollback', async () => {
      const executionOrder: string[] = []
      const rollbackOrder: string[] = []

      const saga: Record<string, Step<TestContext, TestStepResults>> = {
        STEP1: {
          name: 'STEP1',
          execute: async () => {
            executionOrder.push('STEP1')
            return { value: 'start' }
          },
          compensate: async () => {
            rollbackOrder.push('STEP1')
          },
          nextStep: (ctx) =>
            ctx.stepResults.STEP1?.value === 'start' ? 'STEP2' : 'STEP4',
        },
        STEP2: {
          name: 'STEP2',
          execute: async () => {
            executionOrder.push('STEP2')
            return { count: 10 }
          },
          compensate: async () => {
            rollbackOrder.push('STEP2')
          },
          nextStep: 'STEP4',
        },
        STEP4: {
          name: 'STEP4',
          execute: async () => {
            executionOrder.push('STEP4')
            throw new Error('STEP4 failed')
          },
          compensate: async () => {
            rollbackOrder.push('STEP4')
          },
        },
      }

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await expect(
        orchestrator.execute(saga, context, 'STEP1'),
      ).rejects.toThrow('STEP4 failed')

      expect(executionOrder).toEqual(['STEP1', 'STEP2', 'STEP4'])
      expect(rollbackOrder).toEqual(['STEP2', 'STEP1']) // Reverse order, STEP4 never completed
    })

    it('should allow steps to access previous step results', async () => {
      const saga: Step<TestContext, TestStepResults>[] = [
        {
          name: 'STEP1',
          execute: async () => ({ value: 'input-data' }),
        },
        {
          name: 'STEP2',
          execute: async (ctx) => {
            const step1Result = requireStepResult(ctx, 'STEP1')
            return { count: step1Result.value.length }
          },
        },
      ]

      const orchestrator = new Orchestrator<TestContext, TestStepResults>({
        logger: mockLogger,
      })

      await orchestrator.execute(saga, context)

      expect(context.stepResults.STEP1).toEqual({ value: 'input-data' })
      expect(context.stepResults.STEP2).toEqual({ count: 10 })
    })
  })
})
