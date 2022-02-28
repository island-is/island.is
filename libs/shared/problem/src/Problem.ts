import {
  HttpInternalServerErrorProblem,
  HttpProblem,
  ValidationFailedProblem,
  ActorValidationFailedProblem,
} from './problems'

export type Problem =
  | HttpProblem
  | HttpInternalServerErrorProblem
  | ValidationFailedProblem
  | ActorValidationFailedProblem
