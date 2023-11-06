import { ProblemType, ValidationFailedFields } from '@island.is/shared/problem'
import { ProblemError } from './ProblemError'

export class AttemptFailed extends ProblemError {
  constructor(remainingAttempts?: number, fields?: ValidationFailedFields) {
    const fieldProblems = Object.keys(fields ?? {})

    super({
      type: ProblemType.ATTEMPT_FAILED,
      title: 'Attempt Failed',
      status: 400,
      detail: `${remainingAttempts} attempt${
        remainingAttempts !== 1 ? 's' : ''
      } remaining. ${
        fields
          ? 'Validation issues found in fields: ' + fieldProblems.join(', ')
          : ''
      }`,
      remainingAttempts,
      fields,
    })
  }
}
