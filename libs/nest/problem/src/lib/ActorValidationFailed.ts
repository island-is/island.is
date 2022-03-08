import { ProblemType, ValidationFailedFields } from '@island.is/shared/problem'
import { ProblemError } from './ProblemError'

export class ActorValidationFailed extends ProblemError {
  constructor(fields: ValidationFailedFields) {
    super({
      type: ProblemType.ACTOR_VALIDATION_FAILED,
      title: 'Actor Validation Failed',
      status: 400,
      detail: `User has not delegated to correct user`,
      fields,
    })
  }
}
