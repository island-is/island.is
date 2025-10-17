import { ProblemType, ValidationFailedFields } from '@island.is/shared/problem'
import { ProblemError, ProblemOptions } from './ProblemError'

export class ValidationFailed extends ProblemError {
  constructor(fields: ValidationFailedFields, options?: ProblemOptions) {
    super(
      {
        type: ProblemType.VALIDATION_FAILED,
        title: 'Validation Failed',
        status: 400,
        detail: `Found issues in these fields: ${Object.keys(fields).join(
          ', ',
        )}`,
        fields,
      },
      options,
    )
  }
}
