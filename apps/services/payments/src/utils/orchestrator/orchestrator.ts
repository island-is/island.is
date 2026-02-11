import { Logger } from '@island.is/logging'
import {
  Step,
  SagaDefinition,
  OrchestratorConfig,
  ContextWithStepResults,
  ExecutionRecord,
  StepTimeoutError,
  isStepTimeoutError,
} from './orchestrator.types'

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  stepName: string,
  phase: 'execute' | 'compensate',
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new StepTimeoutError(
          `Step ${stepName} (${phase}) exceeded timeout of ${timeoutMs}ms`,
          stepName,
          timeoutMs,
          phase,
        ),
      )
    }, timeoutMs)
    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

export class Orchestrator<
  TContext extends ContextWithStepResults<TStepResults>,
  TStepResults extends object = Record<string, unknown>,
> {
  private completedSteps: Step<TContext, TStepResults>[] = []
  private executionHistory: ExecutionRecord[] = []
  private logger: Logger
  private onRollbackFailure?: (
    step: Step<TContext, TStepResults>,
    error: Error,
    context: TContext,
    executionHistory: ExecutionRecord[],
  ) => Promise<void>
  private stepTimeoutMs?: number
  private rollbackStepTimeoutMs?: number

  constructor(config: OrchestratorConfig<TContext, TStepResults>) {
    this.logger = config.logger
    this.onRollbackFailure = config.onRollbackFailure
    this.stepTimeoutMs = config.stepTimeoutMs
    this.rollbackStepTimeoutMs =
      config.rollbackStepTimeoutMs ?? config.stepTimeoutMs
  }

  getExecutionHistory(): ExecutionRecord[] {
    return [...this.executionHistory]
  }

  private recordEvent(event: Omit<ExecutionRecord, 'timestamp'>): void {
    this.executionHistory.push({
      ...event,
      timestamp: new Date(),
    })
  }

  async execute(
    saga: SagaDefinition<TContext, TStepResults>,
    context: TContext,
    startStep?: string,
  ): Promise<{
    success: true
    context: TContext
    executionHistory: ExecutionRecord[]
  }> {
    let currentStep: Step<TContext, TStepResults> | undefined

    context.completedSteps = []
    context.currentStep = undefined
    context.failedStep = undefined
    context.error = undefined

    this.completedSteps = []
    this.executionHistory = []

    try {
      if (Array.isArray(saga)) {
        // Linear flow
        for (const step of saga) {
          currentStep = step
          context.currentStep = step.name

          this.recordEvent({
            type: 'step_started',
            step: step.name,
          })

          // Execute and capture result (with optional timeout)
          const executePromise = step.execute(context)
          const result =
            this.stepTimeoutMs != null && this.stepTimeoutMs > 0
              ? await withTimeout(
                  executePromise,
                  this.stepTimeoutMs,
                  step.name,
                  'execute',
                )
              : await executePromise

          // Auto-store result if returned (not void/undefined)
          if (result !== undefined) {
            ;(context.stepResults as Record<string, unknown>)[step.name] =
              result
          }

          this.completedSteps.push(step)
          context.completedSteps.push(step.name)

          this.recordEvent({
            type: 'step_completed',
            step: step.name,
          })
        }
      } else {
        // Branching flow
        if (!startStep) {
          throw new Error('Start step required for object-based saga')
        }

        let currentStepName = startStep
        while (currentStepName) {
          currentStep = saga[currentStepName]
          if (!currentStep) {
            throw new Error(`Step '${currentStepName}' not found`)
          }

          context.currentStep = currentStep.name

          this.recordEvent({
            type: 'step_started',
            step: currentStep.name,
          })

          // Execute and capture result (with optional timeout)
          const executePromise = currentStep.execute(context)
          const result =
            this.stepTimeoutMs != null && this.stepTimeoutMs > 0
              ? await withTimeout(
                  executePromise,
                  this.stepTimeoutMs,
                  currentStep.name,
                  'execute',
                )
              : await executePromise

          // Auto-store result if returned (not void/undefined)
          if (result !== undefined) {
            ;(context.stepResults as Record<string, unknown>)[
              currentStep.name
            ] = result
          }

          this.completedSteps.push(currentStep)
          context.completedSteps.push(currentStep.name)

          this.recordEvent({
            type: 'step_completed',
            step: currentStep.name,
          })

          // Determine next step
          const nextStep =
            typeof currentStep.nextStep === 'function'
              ? currentStep.nextStep(context)
              : currentStep.nextStep ?? null

          if (nextStep) {
            currentStepName = nextStep
          } else {
            break
          }
        }
      }

      context.currentStep = undefined
      return { success: true, context, executionHistory: this.executionHistory }
    } catch (error) {
      context.failedStep = currentStep ? currentStep.name : 'unknown'
      context.error = error

      this.recordEvent({
        type: 'step_failed',
        step: currentStep ? currentStep.name : 'unknown',
        metadata: {
          error: (error as Error).message,
          ...(isStepTimeoutError(error) && { timeout: true }),
        },
      })

      await this.rollback(context)
      throw error
    }
  }

  private async rollback(context: TContext) {
    for (const step of [...this.completedSteps].reverse()) {
      if (step.compensate) {
        try {
          const compensatePromise = step.compensate(context)
          const timeoutMs = this.rollbackStepTimeoutMs
          if (timeoutMs != null && timeoutMs > 0) {
            await withTimeout(
              compensatePromise,
              timeoutMs,
              step.name,
              'compensate',
            )
          } else {
            await compensatePromise
          }
        } catch (compensateError) {
          const message =
            step.rollbackFailureMessage ||
            `Failed to rollback step ${String(step.name)}`

          this.logger.error(`CRITICAL: ${message}`, {
            error: compensateError.message,
            stack: compensateError.stack,
            step: step.name,
          })

          // Call rollback failure callback if provided
          if (this.onRollbackFailure) {
            try {
              await this.onRollbackFailure(
                step,
                compensateError,
                context,
                this.executionHistory,
              )
            } catch (callbackError) {
              this.logger.error('Failed to execute rollback failure callback', {
                callbackError: callbackError.message,
              })
            }
          }
        }
      }
    }
  }
}
