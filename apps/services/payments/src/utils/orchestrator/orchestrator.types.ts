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

// Orchestrator configuration
export interface OrchestratorConfig<
  TContext extends ContextWithStepResults<TStepResults>,
  TStepResults extends object = Record<string, unknown>,
> {
  logger: Logger
  onRollbackFailure?: RollbackFailureCallback<TContext, TStepResults>
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
