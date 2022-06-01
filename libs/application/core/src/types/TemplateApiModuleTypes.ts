import { ProblemType } from '@island.is/shared/problem'

export type PerformActionResult =
  | {
      success: true
      response: unknown
    }
  | {
      success: false
      error: string
      problemType?: ProblemType
    }
