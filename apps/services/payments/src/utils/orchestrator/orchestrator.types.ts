import { Logger } from '@island.is/logging'

// Execution history record - generic, no domain assumptions
export type ExecutionRecord = {
  type: string
  step: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

// Generic context with step results registry
export interface ContextWithStepResults<
  TStepResults extends object = Record<string, unknown>,
> {
  stepResults: {
    [K in keyof TStepResults]?: TStepResults[K]
  }

  currentStep?: string
  completedSteps: string[]
  failedStep?: string
  error?: Error

  metadata?: Record<string, unknown>
  startTime: Date
}

// Generic step - typed to return specific result based on step name
export type Step<
  TContext extends ContextWithStepResults<TStepResults>,
  TStepResults extends object = Record<string, unknown>,
  K extends keyof TStepResults = keyof TStepResults,
> = {
  name: K & string
  description?: string
  // Execute can return the result (auto-stored) or void (side effects only)
  execute: (context: TContext) => Promise<TStepResults[K] | void>
  compensate?: (context: TContext) => Promise<void>
  // Flow control for branching
  nextStep?: string | ((context: TContext) => string | null)
  // Rollback failure metadata
  rollbackFailureMessage?: string
}

// Saga is array or map of steps
export type SagaDefinition<
  TContext extends ContextWithStepResults<TStepResults>,
  TStepResults extends object = Record<string, unknown>,
> =
  | Step<TContext, TStepResults>[]
  | Record<string, Step<TContext, TStepResults>>

// Rollback failure callback
export type RollbackFailureCallback<
  TContext extends ContextWithStepResults<TStepResults>,
  TStepResults extends object = Record<string, unknown>,
> = (
  step: Step<TContext, TStepResults>,
  error: Error,
  context: TContext,
  executionHistory: ExecutionRecord[],
) => Promise<void>

// Thrown when a step execute or compensate exceeds the configured timeout.
export class StepTimeoutError extends Error {
  constructor(
    message: string,
    public readonly stepName: string,
    public readonly timeoutMs: number,
    public readonly phase: 'execute' | 'compensate',
  ) {
    super(message)
    this.name = 'StepTimeoutError'
    Object.setPrototypeOf(this, StepTimeoutError.prototype)
  }
}

export const isStepTimeoutError = (error: unknown): error is StepTimeoutError =>
  error instanceof StepTimeoutError

// Orchestrator configuration
export interface OrchestratorConfig<
  TContext extends ContextWithStepResults<TStepResults>,
  TStepResults extends object = Record<string, unknown>,
> {
  logger: Logger
  onRollbackFailure?: RollbackFailureCallback<TContext, TStepResults>
  /**
   * Per-step execution timeout in milliseconds. If set, each step.execute()
   * will be raced against this timeout; exceeding it throws StepTimeoutError
   * and triggers rollback. Omit to disable (no timeout).
   */
  stepTimeoutMs?: number
  /**
   * Per-step rollback timeout in milliseconds. If set, each step.compensate()
   * will be raced against this timeout. Defaults to stepTimeoutMs when omitted.
   */
  rollbackStepTimeoutMs?: number
}

// Helper functions

// Generic helper to get step result (returns undefined if missing)
export const getStepResult = <
  TStepResults extends Record<string, unknown>,
  K extends keyof TStepResults,
>(
  context: ContextWithStepResults<TStepResults>,
  step: K,
): TStepResults[K] | undefined => {
  return context.stepResults[step]
}

// Generic helper to require step result (throws if missing)
export const requireStepResult = <
  TStepResults extends object,
  K extends keyof TStepResults,
>(
  context: ContextWithStepResults<TStepResults>,
  step: K,
): NonNullable<TStepResults[K]> => {
  const result = context.stepResults[step]
  if (result === undefined) {
    throw new Error(`Required step ${String(step)} has not completed`)
  }
  return result as NonNullable<TStepResults[K]>
}

// Generic type guard
export const hasStepResult = <
  TStepResults extends object,
  K extends keyof TStepResults,
>(
  context: ContextWithStepResults<TStepResults>,
  step: K,
): context is ContextWithStepResults<TStepResults> & {
  stepResults: Required<Pick<TStepResults, K>>
} => {
  return step in context.stepResults && context.stepResults[step] !== undefined
}
