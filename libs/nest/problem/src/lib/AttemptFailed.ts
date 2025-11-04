import { ProblemType, ValidationFailedFields } from '@island.is/shared/problem'

import { ProblemError, ProblemOptions } from './ProblemError'

export class AttemptFailed extends ProblemError {
  constructor(
    remainingAttempts: number,
    fields?: ValidationFailedFields,
    options?: ProblemOptions,
  ) {
    const fieldProblems = Object.keys(fields ?? {})
    const fieldValidationText = ` Validation issues found in field${
      fieldProblems.length === 1 ? '' : 's'
    }: ${fieldProblems.join(', ')}`

    super(
      {
        type: ProblemType.ATTEMPT_FAILED,
        title: 'Attempt Failed',
        status: 400,
        detail: `${remainingAttempts} attempt${
          remainingAttempts !== 1 ? 's' : ''
        } remaining.${fields ? fieldValidationText : ''}`,
        remainingAttempts,
        fields,
      },
      options,
    )
  }
}
