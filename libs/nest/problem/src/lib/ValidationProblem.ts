import { ProblemType, ValidationProblemFields } from '@island.is/shared/problem'
import { ProblemError } from './ProblemError'

export class ValidationProblem extends ProblemError {
  constructor(fields: ValidationProblemFields) {
    super({
      type: ProblemType.VALIDATION_PROBLEM,
      title: 'Validation failed',
      status: 400,
      detail: `Found issues in these fields: ${Object.keys(fields).join(', ')}`,
      fields,
    })
  }
}
