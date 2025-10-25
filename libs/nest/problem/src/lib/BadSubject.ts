import { ProblemType, AlternativeSubject } from '@island.is/shared/problem'
import { ProblemError, ProblemOptions } from './ProblemError'

export class BadSubject extends ProblemError {
  constructor(
    alternativeSubjects?: AlternativeSubject[],
    options?: ProblemOptions,
  ) {
    super(
      {
        type: ProblemType.BAD_SUBJECT,
        title: 'Bad Subject',
        status: 403,
        detail: `User does not have access to resource`,
        alternativeSubjects,
      },
      options,
    )
  }
}
