import { ProblemType } from '@island.is/shared/problem'
import { ProblemError, ProblemOptions } from './ProblemError'

export class ApplicationTypeBlocked extends ProblemError {
  constructor(
    applicationType: string,
    blocked?: { blockedTitle?: string | null; blockedMessage?: string | null },
    options?: ProblemOptions,
  ) {
    super(
      {
        type: ProblemType.APPLICATION_TYPE_BLOCKED,
        title: 'Application Type Blocked',
        status: 403,
        detail:
          blocked?.blockedMessage ??
          `Applications of type ${applicationType} can not be continued at the moment`,
        applicationType,
        blockedTitle: blocked?.blockedTitle ?? undefined,
        blockedMessage: blocked?.blockedMessage ?? undefined,
      },
      options,
    )
  }
}
