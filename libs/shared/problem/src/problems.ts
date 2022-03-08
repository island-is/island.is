import { BaseProblem } from './BaseProblem'
import { ProblemType } from './ProblemType'
import {DelegationDTO} from '@island.is/clients/auth-public-api'

export interface HttpProblem extends BaseProblem {
  type:
    | ProblemType.HTTP_BAD_REQUEST
    | ProblemType.HTTP_UNAUTHORIZED
    | ProblemType.HTTP_FORBIDDEN
    | ProblemType.HTTP_NOT_FOUND
}

export interface HttpInternalServerErrorProblem extends BaseProblem {
  type: ProblemType.HTTP_INTERNAL_SERVER_ERROR
  stack?: string
}

export type ValidationFailedFields = {
  [key: string]: string | ValidationFailedFields
}
export interface ValidationFailedProblem extends BaseProblem {
  type: ProblemType.VALIDATION_FAILED
  fields: ValidationFailedFields
}

export type ActorValidationFailedFields = {
  delegatedUser: string
  delegations: DelegationDTO[]
  actor?:{name: string, nationalId: string}
}

export interface ActorValidationFailedProblem extends BaseProblem {
  type: ProblemType.ACTOR_VALIDATION_FAILED
  fields: ActorValidationFailedFields
}

// Should be avoided whenever possible in favour of typed problems.
export interface UnknownProblem extends BaseProblem {
  [key: string]: unknown
}
